<script setup lang="ts">
import type { Media } from '~/types/media'
import type { ContainerWidth } from '~/types/siteSettings'
import { resolveColor } from '~/utils/resolveColor'

const { data: siteSettings } = useSiteSettings()
const payloadBaseUrl = usePayloadBaseUrl()
const route = useRoute()

const splashActive = computed(() =>
  route.path === '/'
  && !!siteSettings.value?.splashPage?.enabled
  && !!siteSettings.value.splashPage.content?.length
)

const faviconUrl = computed(() => {
  const favicon = siteSettings.value?.favicon
  if (!favicon) return undefined
  if (typeof favicon === 'string') return undefined
  const url = (favicon as Media).url
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${payloadBaseUrl}${url}`
})

const backgroundColor = computed(() => {
  const raw = siteSettings.value?.styling?.backgroundColor
  const resolved = resolveColor(raw)
  return resolved !== 'transparent' ? resolved : undefined
})

const googleFont = computed(() => {
  return siteSettings.value?.styling?.googleFont
})

const googleFontUrl = computed(() => {
  if (!googleFont.value) return undefined
  const fontName = googleFont.value.replace(/\s+/g, '+')
  // Only load essential weights (400, 600, 700) with display=swap for fast rendering
  return `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;600;700&display=swap`
})

const containerWidthMap: Record<ContainerWidth, string> = {
  narrower: '1200px',
  default: '1536px',
  wider: '1843px',
}

const containerWidth = computed(() => {
  const width = siteSettings.value?.styling?.containerWidth ?? 'default'
  return containerWidthMap[width]
})

useHead(() => ({
  link: [
    ...(faviconUrl.value ? [{ rel: 'icon', href: faviconUrl.value }] : []),
    ...(googleFontUrl.value ? [{ rel: 'stylesheet', href: googleFontUrl.value }] : []),
  ],
  style: [
    { innerHTML: `:root { --ui-container: ${containerWidth.value}; }` },
    ...(backgroundColor.value
      ? [{ innerHTML: `body { background-color: ${backgroundColor.value}; }` }]
      : []),
    ...(googleFont.value
      ? [{ innerHTML: `body { font-family: '${googleFont.value}', sans-serif; }` }]
      : []),
  ],
}))
</script>

<template>
  <UApp>
    <TheHeader v-if="!splashActive" />

    <UMain>
      <NuxtLayout>
        <NuxtPage :key="$route.fullPath" />
      </NuxtLayout>
    </UMain>

    <TheFooter v-if="!splashActive" />

    <StickyMessage
      v-if="siteSettings?.stickyMessage?.content"
      :content="siteSettings.stickyMessage.content"
      :closeable="siteSettings.stickyMessage.closeable ?? true"
    />

    <CookieConsent
      v-if="siteSettings?.cookieConsent?.enabled && siteSettings?.cookieConsent?.message"
      :message="siteSettings.cookieConsent.message"
      :accept-label="siteSettings.cookieConsent.acceptLabel ?? 'Accept'"
      :policy-url="siteSettings.cookieConsent.policyUrl ?? '/cookie-policy'"
      :policy-link-text="siteSettings.cookieConsent.policyLinkText ?? 'Read more'"
    />
  </UApp>
</template>
