<script setup lang="ts">
import type { Media } from '~/types/media'
import type { ContainerWidth, SiteThemeColors } from '~/types/siteSettings'
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

const googleFontBody = computed(() => siteSettings.value?.styling?.googleFontBody)
const googleFontH1 = computed(() => siteSettings.value?.styling?.googleFontH1)
const googleFontHeadings = computed(() => siteSettings.value?.styling?.googleFontHeadings)

const googleFontUrls = computed(() => {
  const fonts = new Set<string>()
  if (googleFontBody.value) fonts.add(googleFontBody.value)
  if (googleFontH1.value) fonts.add(googleFontH1.value)
  if (googleFontHeadings.value) fonts.add(googleFontHeadings.value)

  if (fonts.size === 0) return []

  // Build a single URL with all font families for efficient loading
  const families = Array.from(fonts)
    .map(font => `family=${font.replace(/\s+/g, '+')}:wght@400;600;700`)
    .join('&')
  return [`https://fonts.googleapis.com/css2?${families}&display=swap`]
})

const fontStyles = computed(() => {
  const styles: string[] = []

  if (googleFontBody.value) {
    styles.push(`body { font-family: '${googleFontBody.value}', sans-serif; }`)
  }

  if (googleFontH1.value) {
    styles.push(`h1 { font-family: '${googleFontH1.value}', sans-serif; }`)
  } else if (googleFontBody.value) {
    styles.push(`h1 { font-family: '${googleFontBody.value}', sans-serif; }`)
  }

  if (googleFontHeadings.value) {
    styles.push(`h2, h3, h4, h5, h6 { font-family: '${googleFontHeadings.value}', sans-serif; }`)
  } else if (googleFontBody.value) {
    styles.push(`h2, h3, h4, h5, h6 { font-family: '${googleFontBody.value}', sans-serif; }`)
  }

  return styles.join('\n')
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

/** Map from SiteThemeColors keys to CSS variable names */
const themeColorCssVarMap: Record<keyof SiteThemeColors, string> = {
  color1: '--color-1',
  color2: '--color-2',
  color3: '--color-3',
  color4: '--color-4',
  color5: '--color-5',
  color6: '--color-6',
  font: '--color-font',
  fontBrand1: '--color-font-brand1',
  fontBrand2: '--color-font-brand2',
  fontAccent: '--color-font-accent',
  fontHighlight: '--color-font-highlight',
  accent: '--color-accent',
  highlight: '--color-highlight',
}

const themeColorOverrides = computed(() => {
  const colors = siteSettings.value?.themeColors
  if (!colors) return ''

  const overrides: string[] = []
  for (const [key, cssVar] of Object.entries(themeColorCssVarMap)) {
    const value = colors[key as keyof SiteThemeColors]
    if (value) {
      overrides.push(`  ${cssVar}: ${value};`)
    }
  }

  if (overrides.length === 0) return ''
  return `:root {\n${overrides.join('\n')}\n}`
})

useHead(() => ({
  link: [
    ...(faviconUrl.value ? [{ rel: 'icon', href: faviconUrl.value }] : []),
    ...googleFontUrls.value.map(href => ({ rel: 'stylesheet', href })),
  ],
  style: [
    { innerHTML: `:root { --ui-container: ${containerWidth.value}; }` },
    ...(backgroundColor.value
      ? [{ innerHTML: `body { background-color: ${backgroundColor.value}; }` }]
      : []),
    ...(fontStyles.value
      ? [{ innerHTML: fontStyles.value }]
      : []),
    ...(themeColorOverrides.value
      ? [{ innerHTML: themeColorOverrides.value }]
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
