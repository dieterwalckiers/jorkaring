<script setup lang="ts">
import type { PagesResponse } from '~/types/page'
import type { Media } from '~/types/media'
import type { HeaderMenuAlignment, HeaderHeight, LogoSize } from '~/types/siteSettings'
import MainMenuItem from '~/components/ui/MainMenuItem.vue'
import { resolveColorToHex, isHexColor } from '~/utils/resolveColor'

interface NavItem {
  label: string
  to: string
  active?: boolean
}

interface ToolbarItem {
  label: string
  to: string
}

const route = useRoute()
const { currentPage } = useCurrentPage()
const apiUrl = usePayloadApiUrl()
const payloadBaseUrl = usePayloadBaseUrl()

const { data: response } = await useFetch<PagesResponse>(`${apiUrl}/pages`, {
  query: {
    'where[showInMenu][equals]': 'true',
    sort: 'menuOrder',
    limit: 100
  },
  key: 'menuPages',
  dedupe: 'defer',
  timeout: 10000,
  retry: 1,
})

const { data: toolbarResponse } = await useFetch<PagesResponse>(`${apiUrl}/pages`, {
  query: {
    'where[showInToolbar][equals]': 'true',
    sort: 'toolbarOrder',
    limit: 100
  },
  key: 'toolbarPages',
  dedupe: 'defer',
  timeout: 10000,
  retry: 1,
})

const { data: siteSettings } = useSiteSettings()

const siteTitle = computed(() => siteSettings.value?.siteTitle ?? 'My Site')

const logoUrl = computed(() => {
  const logo = siteSettings.value?.logo
  if (!logo) return null
  if (typeof logo === 'string') return null
  const media = logo as Media
  const url = media.sizes?.small?.url || media.sizes?.thumbnail?.url || media.url
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${payloadBaseUrl}${url}`
})

const menuAlignment = computed<HeaderMenuAlignment>(() => {
  return siteSettings.value?.styling?.headerMenuAlignment ?? 'right'
})

const headerHeight = computed<HeaderHeight>(() => {
  return siteSettings.value?.styling?.headerHeight ?? 'medium'
})

const logoSize = computed<LogoSize>(() => {
  return siteSettings.value?.styling?.logoSize ?? 'medium'
})

const showBorder = computed(() => {
  return siteSettings.value?.styling?.headerBorder ?? true
})

const headerBackgroundColor = computed(() => {
  const raw = siteSettings.value?.styling?.headerBackgroundColor
  return resolveColorToHex(raw)
})

// Height values in rem (numeric for calculations)
const headerHeightNumeric: Record<HeaderHeight, number> = {
  small: 3,
  medium: 4,
  large: 5,
  xl: 6,
  '2xl': 8,
}

const logoWidthClasses: Record<LogoSize, string> = {
  small: 'w-36',
  medium: 'w-48',
  large: 'w-60',
  xl: 'w-72',
}

// Scroll-based header compacting (no hiding)
const scrollY = ref(0)
const CONDENSE_THRESHOLD = 50

function onScroll() {
  scrollY.value = window.scrollY
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', onScroll, { passive: true })
    scrollY.value = window.scrollY
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})

// Condensed state calculation (0 = full, 1 = fully condensed)
const condenseProgress = computed(() => {
  if (scrollY.value <= CONDENSE_THRESHOLD) return 0
  const progress = (scrollY.value - CONDENSE_THRESHOLD) / 150
  return Math.min(1, Math.max(0, progress))
})

// Dynamic header height based on scroll
const dynamicHeaderHeight = computed(() => {
  const baseHeight = headerHeightNumeric[headerHeight.value]
  const minHeight = Math.max(baseHeight * 0.7, 2.5)
  const currentHeight = baseHeight - (baseHeight - minHeight) * condenseProgress.value
  return `${currentHeight}rem`
})

// Logo scale based on scroll
const logoScale = computed(() => {
  const minScale = 0.85
  return 1 - (1 - minScale) * condenseProgress.value
})

const logoClass = computed(() => {
  return `${logoWidthClasses[logoSize.value]} h-auto header-logo`
})

const headerClass = computed(() => {
  const classes = ['backdrop-blur', 'header-animate']
  if (!showBorder.value) {
    classes.push('border-b-0')
  } else {
    classes.push('border-header-border')
  }
  if (condenseProgress.value > 0) {
    classes.push('header-condensed')
  }
  return classes.join(' ')
})

// Convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Dynamic background opacity based on scroll
const backgroundOpacity = computed(() => {
  const baseOpacity = 0.85
  const maxOpacity = 0.95
  return baseOpacity + (maxOpacity - baseOpacity) * condenseProgress.value
})

const headerStyle = computed(() => {
  const style: Record<string, string> = {
    '--ui-header-height': dynamicHeaderHeight.value,
    '--header-logo-scale': String(logoScale.value),
  }
  const bgColor = headerBackgroundColor.value
  if (bgColor && bgColor !== 'transparent') {
    if (isHexColor(bgColor)) {
      style.backgroundColor = hexToRgba(bgColor, backgroundOpacity.value)
    } else {
      // For non-hex colors, apply directly (won't have scroll-based opacity)
      style.backgroundColor = bgColor
    }
  }
  return style
})

const navItems = computed<NavItem[]>(() => {
  const pages = response.value?.docs ?? []
  const menuFilter = currentPage.value?.menuFilter

  const filteredPages = (menuFilter && menuFilter.length > 0)
    ? (() => {
        const allowedIds = new Set(menuFilter.map((ref) =>
          typeof ref === 'object' && ref !== null ? ref.id : ref
        ))
        return pages.filter((page) => allowedIds.has(page.id))
      })()
    : pages

  return filteredPages.map((page) => {
    const isHome = page.slug === 'home'
    const pagePath = isHome ? '/' : `/${page.slug}`
    return {
      label: page.title,
      to: pagePath,
      active: route.path === pagePath,
    }
  })
})

const toolbarItems = computed<ToolbarItem[]>(() => {
  const pages = toolbarResponse.value?.docs ?? []
  return pages.map((page) => {
    const isHome = page.slug === 'home'
    const pagePath = isHome ? '/' : `/${page.slug}`
    return {
      label: page.toolbarLabel || page.title,
      to: pagePath,
    }
  })
})

const hasToolbarItems = computed(() => toolbarItems.value.length > 0)
</script>

<template>
  <UHeader :class="headerClass" :style="headerStyle">
    <template #title>
      <div class="flex items-center gap-6 logo-container">
        <NuxtLink to="/" class="flex items-center">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="siteTitle"
            :class="logoClass"
          />
          <span v-else class="text-xl font-bold font-display header-title">
            {{ siteTitle }}
          </span>
        </NuxtLink>
        <nav v-if="menuAlignment === 'left'" class="hidden md:flex items-center gap-6 nav-items">
          <MainMenuItem
            v-for="item in navItems"
            :key="item.to"
            :label="item.label"
            :to="item.to"
            :active="item.active"
          />
        </nav>
      </div>
    </template>

    <nav v-if="menuAlignment === 'center'" class="hidden md:flex items-center gap-6 nav-items">
      <MainMenuItem
        v-for="item in navItems"
        :key="item.to"
        :label="item.label"
        :to="item.to"
        :active="item.active"
      />
    </nav>

    <template #right>
      <div class="relative">
        <!-- Toolbar (Call-to-Actions) - positioned above nav, hidden on mobile -->
        <div v-if="hasToolbarItems" class="header-toolbar hidden md:flex">
          <template v-for="(item, index) in toolbarItems" :key="item.to">
            <span v-if="index > 0" class="header-toolbar-separator">|</span>
            <NuxtLink :to="item.to" class="header-toolbar-link">
              {{ item.label }}
            </NuxtLink>
          </template>
        </div>
        <nav v-if="menuAlignment === 'right'" class="hidden md:flex items-center gap-6 nav-items">
          <MainMenuItem
            v-for="item in navItems"
            :key="item.to"
            :label="item.label"
            :to="item.to"
            :active="item.active"
          />
        </nav>
      </div>
    </template>

    <template #body>
      <nav class="flex flex-col gap-4">
        <MainMenuItem
          v-for="item in navItems"
          :key="item.to"
          :label="item.label"
          :to="item.to"
          :active="item.active"
        />
        <MainMenuItem
          v-for="item in toolbarItems"
          :key="`mobile-${item.to}`"
          :label="item.label"
          :to="item.to"
        />
      </nav>
    </template>
  </UHeader>
</template>

<style scoped>
/* Toolbar styles - positioned above nav, aligned right */
.header-toolbar {
  position: absolute;
  bottom: 100%;
  right: 0;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 0.8125rem;
  white-space: nowrap;
}

.header-toolbar-separator {
  color: var(--ui-text-dimmed, #9ca3af);
}

.header-toolbar-link {
  position: relative;
  color: var(--color-font);
  text-decoration: none;
  transition: color 0.2s ease;
}

.header-toolbar-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, var(--color-brandprimarydark), var(--color-brandprimarymedium));
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.header-toolbar-link:hover::after,
.header-toolbar-link.router-link-active::after {
  transform: scaleX(1);
}

.header-toolbar-link:hover,
.header-toolbar-link.router-link-active {
  color: var(--color-font-highlight);
}

/* Premium easing curves for smooth compacting */
.header-animate {
  transition:
    height 0.35s cubic-bezier(0.33, 1, 0.68, 1),
    background-color 0.3s ease-out,
    box-shadow 0.3s ease-out;
  will-change: height;
}

/* Condensed state - subtle shadow for depth */
.header-condensed {
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.05),
              0 2px 8px -2px rgba(0, 0, 0, 0.04);
}

/* Logo smooth scaling */
.header-logo {
  transform: scale(var(--header-logo-scale, 1));
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
}

/* Title text scaling for non-logo headers */
.header-title {
  transform: scale(var(--header-logo-scale, 1));
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
}

/* Nav items subtle fade during condense */
.nav-items {
  transition: opacity 0.25s ease-out;
}

.header-condensed .nav-items {
  opacity: 0.95;
}

/* Logo container alignment adjustment during scale */
.logo-container {
  transition: gap 0.35s cubic-bezier(0.33, 1, 0.68, 1);
}

.header-condensed .logo-container {
  gap: 1.25rem;
}
</style>
