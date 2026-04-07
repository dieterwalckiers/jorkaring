<script setup lang="ts">
import type { Page, PagesResponse } from '~/types/page'

const route = useRoute()
const apiUrl = usePayloadApiUrl()
const { data: siteSettings } = useSiteSettings()

// Get slug from route params - handle array (catch-all) or string
// Filter out empty strings to handle trailing slashes (e.g., /visie/ -> ['visie', ''] -> 'visie')
const slugParam = route.params.slug
const slugParts = Array.isArray(slugParam) ? slugParam.filter(Boolean) : slugParam ? [slugParam] : []
const slug = slugParts.join('/')

// If slug is empty, this route shouldn't handle it (index.vue handles /)
// But during SSG this can happen, so redirect to home
if (!slug) {
  await navigateTo('/', { replace: true })
}

// Use native fetch to avoid $fetch caching issues during SSG
const { data: response, error } = await useAsyncData(
  `page-${slug}`,
  async () => {
    const url = new URL(`${apiUrl}/pages`)
    url.searchParams.set('where[slug][equals]', slug)
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2')
    const res = await fetch(url.toString())
    return res.json() as Promise<PagesResponse>
  }
)

const initialPage = computed<Page | null>(() => response.value?.docs?.[0] || null)

// Live preview: when rendered inside Payload admin iframe, data updates in real time
const { data: liveData } = usePayloadLivePreview<Page>(initialPage.value || {} as Page)
const page = computed<Page | null>(() => liveData.value?.id ? liveData.value : initialPage.value)

const { setCurrentPage } = useCurrentPage()
watch(page, (p) => setCurrentPage(p), { immediate: true })

const siteTitle = computed(() => siteSettings.value?.siteTitle ?? '')

useHead(() => ({
  title: page.value?.title && siteTitle.value
    ? `${page.value.title} | ${siteTitle.value}`
    : page.value?.title || siteTitle.value || '',
}))

useSeoMeta({
  description: () => page.value?.seo?.description,
})

// Show 404 error if page not found
if (!page.value && !error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    message: `The page "${slug}" could not be found.`,
  })
}
</script>

<template>
  <UContainer>
    <article v-if="page">
      <BlocksBlockRenderer v-if="page.content?.length" :blocks="page.content" />

      <!-- Empty state -->
      <div v-else class="py-12 text-center text-neutral-500">
        <h1 class="text-4xl font-bold mb-6">{{ page.title }}</h1>
        <p>No content yet. Add blocks in the CMS.</p>
      </div>
    </article>
  </UContainer>
</template>
