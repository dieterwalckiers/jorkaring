// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
    storage: 'localStorage',
    disableTransition: true,
  },

  fonts: {
    families: [
      // Reduced weights for faster loading - only load what's actually used
      { name: 'Inter', provider: 'google', weights: [400, 600] },
      { name: 'Playfair Display', provider: 'google', weights: [400, 700] },
    ],
  },

  app: {
    // Use root path for Storybook, custom path for production
    baseURL: '/',
    head: {
      link: [
        // Preconnect to Google Fonts for faster font loading
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  // Disable app manifest for Storybook (not supported)
  // Disable shared prerender data to prevent page content from being cached incorrectly during SSG
  experimental: {
    appManifest: process.env.STORYBOOK !== 'true',
    sharedPrerenderData: false,
  },

  ssr: true,

  hooks: {
    // Fetch all pages from Payload CMS and add them to prerender routes
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.prerender?.routes === undefined) {
        return
      }

      const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3202/api'

      try {
        const response = await fetch(`${apiUrl}/pages?limit=500`)
        if (!response.ok) {
          console.warn(`[prerender] Failed to fetch pages: ${response.status}`)
          return
        }

        const data = await response.json() as { docs: Array<{ slug: string }> }
        const routes = data.docs.map((page) =>
          page.slug === 'home' ? '/' : `/${page.slug}`
        )

        nitroConfig.prerender.routes = [...new Set([...nitroConfig.prerender.routes, ...routes])]
        console.log(`[prerender] Added ${routes.length} page routes:`, routes)
      }
      catch (error) {
        console.warn('[prerender] Could not fetch pages from Payload:', error)
      }
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      failOnError: false
    },
    routeRules: {
      '/api/**': {
        proxy: (process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3202/api') + '/**'
      }
    }
  },

  runtimeConfig: {
    // Server-side only — override at runtime with NUXT_PAYLOAD_API_URL
    payloadApiUrl: 'http://localhost:3202/api',
    public: {
      // Client-side — override at runtime with NUXT_PUBLIC_PAYLOAD_API_URL
      payloadApiUrl: 'http://localhost:3202/api',
      // Payload server URL for live preview — override with NUXT_PUBLIC_PAYLOAD_SERVER_URL
      payloadServerUrl: 'http://localhost:3202',
      // When true, API calls include draft=true — override with NUXT_PUBLIC_PREVIEW_MODE
      previewMode: false,
      // When true, media URLs are served from the same origin as the static site
      // (files are bundled into public/api/media/file/). Override with NUXT_PUBLIC_STATIC_MEDIA.
      staticMedia: false,
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
})
