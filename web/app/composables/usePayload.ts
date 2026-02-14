import type { Page, PagesResponse } from '~/types/page'
import type { SiteSettings } from '~/types/siteSettings'

// Returns the correct API URL based on context (server uses Docker internal, client uses public)
export function usePayloadApiUrl() {
  const config = useRuntimeConfig()
  return import.meta.server ? config.payloadApiUrl : config.public.payloadApiUrl
}

// Returns the public payload base URL (for media URLs that need to work in the browser)
export function usePayloadBaseUrl() {
  const config = useRuntimeConfig()
  // Always use public URL since media URLs are used in <img> tags rendered in the browser
  // Remove '/api' suffix to get base URL
  return config.public.payloadApiUrl.replace(/\/api$/, '')
}

// Convert a relative media URL to an absolute URL
// WARNING: This composable must be called at the top level of script setup,
// not inside computed() or other callbacks. If you need to use it in a computed,
// call usePayloadBaseUrl() at setup time and construct the URL manually.
export function useMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  // If already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Prepend payload base URL
  const baseUrl = usePayloadBaseUrl()
  return `${baseUrl}${url}`
}

export function usePages() {
  const apiUrl = usePayloadApiUrl()
  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: { limit: 100 },
    key: 'pages',
    timeout: 10000,
    retry: 1,
  })

  return {
    ...result,
    data: computed(() => result.data.value?.docs ?? [])
  }
}

export function useMenuPages() {
  const apiUrl = usePayloadApiUrl()
  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: {
      'where[showInMenu][equals]': 'true',
      sort: 'menuOrder',
      limit: 100
    },
    key: 'menuPages',
    timeout: 10000,
    retry: 1,
  })

  return {
    ...result,
    data: computed(() => result.data.value?.docs ?? [])
  }
}

export function usePage(slug: MaybeRefOrGetter<string>) {
  const apiUrl = usePayloadApiUrl()
  const slugValue = toValue(slug)

  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: {
      where: {
        slug: {
          equals: slugValue
        }
      },
      limit: 1
    },
    key: `page-${slugValue}`,
    timeout: 10000,
    retry: 1,
  })

  return {
    ...result,
    data: computed<Page | null>(() => result.data.value?.docs?.[0] ?? null)
  }
}

export function useSiteSettings() {
  const apiUrl = usePayloadApiUrl()

  const result = useFetch<SiteSettings>(`${apiUrl}/globals/site-settings`, {
    query: {
      depth: 1, // Include media relation
    },
    key: 'siteSettings',
    dedupe: 'defer',
    timeout: 10000,
    retry: 1,
  })

  return {
    ...result,
    data: computed<SiteSettings | null>(() => result.data.value ?? null)
  }
}
