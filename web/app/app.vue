<script setup lang="ts">
import type { Media } from '~/types/media'
import type { BlockSpacing, ContainerWidth, SiteSettings, SiteThemeColors } from '~/types/siteSettings'

const { data: initialSettings } = useSiteSettings()
const payloadBaseUrl = usePayloadBaseUrl()
const route = useRoute()

// Live preview for site settings: updates in real time when editing in Payload admin
const { data: liveSettings } = usePayloadLivePreview<SiteSettings>(
  initialSettings.value || {} as SiteSettings,
)
const siteSettings = computed(() => {
  const live = liveSettings.value
  const init = initialSettings.value
  return live?.id && init?.id && live.id === init.id ? live : init
})

const splashActive = computed(() =>
  route.path === '/'
  && !!siteSettings.value?.splashPage?.enabled
  && !!siteSettings.value.splashPage.content?.length
)

const { currentPage } = useCurrentPage()

const toastShouldShow = computed(() => {
  const toast = siteSettings.value?.toast
  if (!toast?.enabled) return false
  if (!toast.content) return false
  if (splashActive.value) return false

  const now = Date.now()
  if (toast.startDate && now < new Date(toast.startDate).getTime()) return false
  if (toast.endDate && now > new Date(toast.endDate).getTime()) return false

  if (toast.pageVisibility === 'specific') {
    const pageId = currentPage.value?.id
    if (!pageId) return false
    const allowedIds = (toast.pages ?? []).map((p) => {
      if (p && typeof p === 'object' && 'id' in p) return String(p.id)
      return String(p)
    })
    if (!allowedIds.includes(String(pageId))) return false
  }

  return true
})

const faviconUrl = computed(() => {
  const favicon = siteSettings.value?.favicon
  if (!favicon) return undefined
  if (typeof favicon === 'string') return undefined
  const url = (favicon as Media).url
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${payloadBaseUrl}${url}`
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

  // Expose heading fonts as CSS variables so non-heading components can reference
  // them without coupling to h1-h6 rules.
  const headingsFont = googleFontHeadings.value || googleFontBody.value
  const h1Font = googleFontH1.value || googleFontBody.value
  const rootVars: string[] = []
  if (headingsFont) rootVars.push(`  --font-headings: '${headingsFont}', sans-serif;`)
  if (h1Font) rootVars.push(`  --font-h1: '${h1Font}', sans-serif;`)
  if (rootVars.length) styles.push(`:root {\n${rootVars.join('\n')}\n}`)

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

const blockSpacingScaleMap: Record<BlockSpacing, string> = {
  tight: '0.5',
  narrower: '0.75',
  default: '1',
  wider: '1.35',
  spacious: '1.75',
}

const blockSpacingScale = computed(() => {
  const spacing = siteSettings.value?.styling?.blockSpacing ?? 'default'
  return blockSpacingScaleMap[spacing]
})

/** Map from SiteThemeColors keys to CSS variable names */
const themeColorCssVarMap: Record<keyof SiteThemeColors, string> = {
  // System
  mainBg: '--color-main-bg',
  font: '--color-font',
  fontAccent: '--color-font-accent',
  headings: '--color-headings',
  buttonFont: '--color-button-font',
  buttonBg: '--color-button-bg',
  buttonFontHover: '--color-button-font-hover',
  buttonBgHover: '--color-button-bg-hover',
  tableBorders: '--color-table-borders',
  bulletPoints: '--color-bullet-points',
  stickyMessageTxt: '--color-sticky-message-txt',
  stickyMessageBg: '--color-sticky-message-bg',
  // Theme
  theme1: '--color-theme1',
  theme2: '--color-theme2',
  theme3: '--color-theme3',
  theme4: '--color-theme4',
  theme5: '--color-theme5',
  theme6: '--color-theme6',
  theme7: '--color-theme7',
  theme8: '--color-theme8',
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
    { innerHTML: `:root { --ui-container: ${containerWidth.value}; --block-spacing-scale: ${blockSpacingScale.value}; }` },
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

    <Toast
      v-if="toastShouldShow && siteSettings?.toast?.content"
      :key="siteSettings.toast.dismissalKey ?? 'toast'"
      :content="siteSettings.toast.content"
      :background-color="siteSettings.toast.backgroundColor ?? 'theme1'"
      :position="siteSettings.toast.position ?? 'bottomRight'"
      :display-delay-seconds="siteSettings.toast.displayDelaySeconds ?? 0"
      :dismissible="siteSettings.toast.dismissible ?? true"
      :auto-dismiss-seconds="siteSettings.toast.autoDismissSeconds ?? 0"
      :remember-dismissal="siteSettings.toast.rememberDismissal ?? true"
      :dismissal-key="siteSettings.toast.dismissalKey ?? 'toast-1'"
    />

    <EbookPopup v-if="siteSettings?.ebook?.enabled" />

    <CookieConsent
      v-if="siteSettings?.cookieConsent?.enabled && siteSettings?.cookieConsent?.message"
      :message="siteSettings.cookieConsent.message"
      :accept-label="siteSettings.cookieConsent.acceptLabel ?? 'Accept'"
      :policy-url="siteSettings.cookieConsent.policyUrl ?? '/cookie-policy'"
      :policy-link-text="siteSettings.cookieConsent.policyLinkText ?? 'Read more'"
    />
  </UApp>
</template>
