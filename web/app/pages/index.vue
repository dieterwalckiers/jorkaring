<script setup lang="ts">
import type { Page, PagesResponse } from '~/types/page'

const apiUrl = usePayloadApiUrl()
const { data: siteSettings } = useSiteSettings()

const splashBlocks = computed(() =>
  siteSettings.value?.splashPage?.enabled ? siteSettings.value.splashPage.content ?? [] : []
)

const showSplash = computed(() => splashBlocks.value.length > 0)

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

const page = computed<Page | null>(() => response.value?.docs?.[0] || null)

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
  <div v-if="showSplash" class="h-dvh w-dvw" :class="siteSettings?.splashPage?.centered ? 'flex items-center justify-center' : ''">
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
