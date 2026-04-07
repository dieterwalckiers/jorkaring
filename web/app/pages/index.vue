<script setup lang="ts">
import type { Page, PagesResponse } from '~/types/page'
import type { Media } from '~/types/media'

const apiUrl = usePayloadApiUrl()
const payloadBaseUrl = usePayloadBaseUrl()
const { data: siteSettings } = useSiteSettings()

const splashBlocks = computed(() =>
  siteSettings.value?.splashPage?.enabled ? siteSettings.value.splashPage.content ?? [] : []
)

const showSplash = computed(() => splashBlocks.value.length > 0)

const splashBgStyle = computed(() => {
  const bg = siteSettings.value?.splashPage?.backgroundImage
  if (!bg || typeof bg === 'string') return undefined
  const url = (bg as Media).url
  if (!url) return undefined
  const fullUrl = url.startsWith('http') ? url : `${payloadBaseUrl}${url}`
  return { backgroundImage: `url(${fullUrl})` }
})

// Use native fetch to avoid $fetch caching issues during SSG
const { data: response } = await useAsyncData(
  'page-index-home',
  async () => {
    const url = new URL(`${apiUrl}/pages`)
    url.searchParams.set('where[slug][equals]', 'home')
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
</script>

<template>
  <!-- Splash page: full viewport, no container -->
  <div v-if="showSplash" class="h-dvh w-dvw bg-cover bg-center bg-no-repeat" :class="siteSettings?.splashPage?.centered ? 'flex items-center justify-center' : ''" :style="splashBgStyle">
    <BlocksBlockRenderer :blocks="splashBlocks" />
  </div>

  <!-- Normal home page -->
  <UContainer v-else>
    <!-- Default welcome when no home page exists -->
    <UPageHero
      v-if="!page"
      title="Welcome to jorkaring"
      description="Your CMS-powered website is ready. Create a page with slug 'home' to customize this."
      align="center"
      :links="[{ label: 'Open CMS', to: 'http://localhost:3202/admin', variant: 'solid', size: 'lg' }]"
    />

    <!-- Render page content -->
    <article v-else>
      <BlocksBlockRenderer v-if="page.content?.length" :blocks="page.content" />

      <!-- Empty state -->
      <div v-else class="py-12 text-center text-neutral-500">
        <h1 class="text-4xl font-bold mb-6">{{ page.title }}</h1>
        <p>No content yet. Add blocks in the CMS.</p>
      </div>
    </article>
  </UContainer>
</template>
