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

function useStaticMedia(): boolean {
  const config = useRuntimeConfig()
  return config.public.staticMedia === true || config.public.staticMedia === 'true'
}

function usePayloadOrigin(): string {
  const config = useRuntimeConfig()
  return config.public.payloadApiUrl.replace(/\/api$/, '')
}

// Returns the public payload base URL (for media URLs that need to work in the browser).
// When staticMedia is enabled, returns '' so relative media URLs (e.g. /api/media/file/foo.avif)
// pass through unchanged and are served from the same origin as the static site.
export function usePayloadBaseUrl() {
  return useStaticMedia() ? '' : usePayloadOrigin()
}

// Returns a resolver that normalizes a media URL into the form to embed in the rendered HTML.
// In staticMedia mode, absolute URLs pointing at the Payload origin are rewritten to same-origin
// relative paths — otherwise the static build still triggers cross-origin Railway fetches per request.
// The returned function is pure and safe to call inside computed/watch.
export function useMediaUrlResolver(): (url: string | undefined | null) => string | undefined {
  const isStatic = useStaticMedia()
  const origin = usePayloadOrigin()
  return (url) => {
    if (!url) return undefined
    if (isStatic) {
      return url.startsWith(origin) ? url.slice(origin.length) : url
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${origin}${url}`
  }
}

// Convert a media URL into its browser-facing form.
// WARNING: must be called at the top level of script setup, not inside computed() or other callbacks.
// For reactive use, call useMediaUrlResolver() at setup time and invoke the returned function.
export function useMediaUrl(url: string | undefined | null): string | undefined {
  return useMediaUrlResolver()(url)
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
