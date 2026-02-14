import type { SiteSettings } from '~/types/siteSettings'

let cachedSettings: SiteSettings | null = null

async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (cachedSettings) return cachedSettings

  const config = useRuntimeConfig()
  const apiUrl = config.payloadApiUrl || 'http://localhost:3202/api'

  try {
    const response = await fetch(`${apiUrl}/globals/site-settings`)
    if (!response.ok) return null
    cachedSettings = await response.json()
    return cachedSettings
  } catch {
    return null
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', async (html) => {
    const settings = await fetchSiteSettings()
    if (!settings?.headContent) return

    const { leading, tailing } = settings.headContent

    // Insert leading content at the beginning of head (after opening elements)
    if (leading) {
      html.head.unshift(leading)
    }

    // Insert tailing content at the end of head
    if (tailing) {
      html.head.push(tailing)
    }
  })
})
