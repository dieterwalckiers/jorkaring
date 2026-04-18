import type { Page, PagesResponse } from '~/types/page'
import type { SiteSettings } from '~/types/siteSettings'

// Returns the correct API URL based on context (server uses Docker internal, client uses public)
export function usePayloadApiUrl() {
  const config = useRuntimeConfig()
  return import.meta.server ? config.payloadApiUrl : config.public.payloadApiUrl
}

// Returns true when running as the preview SSR server (shows draft content)
export function useIsPreviewMode() {
  const config = useRuntimeConfig()
  // Nuxt runtime env override delivers strings, build-time value is boolean
  return config.public.previewMode === true || config.public.previewMode === 'true'
}

// Returns draft query param when in preview mode, for spreading into query objects
export function useDraftQuery(): Record<string, string> {
  return useIsPreviewMode() ? { draft: 'true' } : {}
}

// Returns the public payload base URL (for media URLs that need to work in the browser).
// When staticMedia is enabled, returns '' so relative media URLs (e.g. /api/media/file/foo.avif)
// pass through unchanged and are served from the same origin as the static site.
export function usePayloadBaseUrl() {
  const config = useRuntimeConfig()
  if (config.public.staticMedia === true || config.public.staticMedia === 'true') return ''
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
  const draftQuery = useDraftQuery()
  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: { limit: 100, ...draftQuery },
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
  const draftQuery = useDraftQuery()
  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: {
      'where[showInMenu][equals]': 'true',
      sort: 'menuOrder',
      limit: 100,
      ...draftQuery,
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
  const draftQuery = useDraftQuery()
  const slugValue = toValue(slug)

  const result = useFetch<PagesResponse>(`${apiUrl}/pages`, {
    query: {
      where: {
        slug: {
          equals: slugValue
        }
      },
      limit: 1,
      ...draftQuery,
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
  const draftQuery = useDraftQuery()

  const result = useFetch<SiteSettings>(`${apiUrl}/globals/site-settings`, {
    query: {
      depth: 2, // Include media relations and nested block media
      ...draftQuery,
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
