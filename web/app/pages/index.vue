<script setup lang="ts">
import type { Page, PagesResponse } from '~/types/page'
import type { Media } from '~/types/media'

const apiUrl = usePayloadApiUrl()
const isPreview = useIsPreviewMode()
const { data: siteSettings } = useSiteSettings()

const splashBlocks = computed(() =>
  siteSettings.value?.splashPage?.enabled ? siteSettings.value.splashPage.content ?? [] : []
)

const showSplash = computed(() => splashBlocks.value.length > 0)

const splashBackground = computed<Media | null>(() => {
  const bg = siteSettings.value?.splashPage?.backgroundImage
  if (!bg || typeof bg === 'string') return null
  return bg as Media
})

const splashOverlayStyle = computed(() => {
  const overlay = siteSettings.value?.splashPage?.backgroundOverlay
  if (!overlay || overlay === 'none') return null
  if (!splashBackground.value) return null
  const strength = (siteSettings.value?.splashPage?.backgroundOverlayStrength ?? 40) / 100
  const color = overlay === 'darken' ? '0, 0, 0' : '255, 255, 255'
  return { backgroundColor: `rgba(${color}, ${strength})` }
})

// Use native fetch to avoid $fetch caching issues during SSG
const { data: response } = await useAsyncData(
  'page-index-home',
  async () => {
    const url = new URL(`${apiUrl}/pages`)
    url.searchParams.set('where[slug][equals]', 'home')
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2')
    if (isPreview) url.searchParams.set('draft', 'true')
    const res = await fetch(url.toString())
    return res.json() as Promise<PagesResponse>
  }
)

const initialPage = computed<Page | null>(() => response.value?.docs?.[0] || null)

// Live preview: when rendered inside Payload admin iframe, data updates in real time
const { data: liveData } = usePayloadLivePreview<Page>(initialPage.value || {} as Page)
const page = computed<Page | null>(() => {
  const live = liveData.value
  const init = initialPage.value
  return live?.id && init?.id && live.id === init.id ? live : init
})

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
  <div v-if="showSplash" data-splash class="relative h-dvh w-dvw overflow-hidden">
    <ProgressiveImage
      v-if="splashBackground"
      :media="splashBackground"
      cover
      priority
      sizes="100vw"
      alt=""
      class="z-0"
    />
    <div
      v-if="splashOverlayStyle"
      class="absolute inset-0 z-[1]"
      :style="splashOverlayStyle"
    />
    <div
      class="relative z-10 h-full w-full"
      :class="siteSettings?.splashPage?.centered ? 'flex items-center justify-center' : ''"
    >
      <BlocksBlockRenderer :blocks="splashBlocks" />
    </div>
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
