'use client'

import { useEffect } from 'react'
import { useConfig } from '@payloadcms/ui'

/** Map from site settings themeColors field names to CSS variable names */
const THEME_COLOR_CSS_VAR_MAP: Record<string, string> = {
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

const STYLE_ID = 'theme-color-vars'

function injectThemeColorVars(themeColors: Record<string, string>) {
  let styleEl = document.getElementById(STYLE_ID)
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ID
    document.head.appendChild(styleEl)
  }

  const overrides: string[] = []
  for (const [field, cssVar] of Object.entries(THEME_COLOR_CSS_VAR_MAP)) {
    const value = themeColors[field]
    if (value) {
      overrides.push(`  ${cssVar}: ${value};`)
    }
  }

  styleEl.textContent = overrides.length > 0
    ? `:root {\n${overrides.join('\n')}\n}`
    : ''
}

/**
 * Admin provider that injects Site Settings theme colors as CSS variables
 * so the Lexical editor previews match the frontend.
 */
export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const { config } = useConfig()

  useEffect(() => {
    const apiPath = config.routes?.api || '/api'
    fetch(`${config.serverURL || ''}${apiPath}/globals/site-settings?depth=0`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.themeColors) {
          const colors: Record<string, string> = {}
          for (const [key, val] of Object.entries(data.themeColors)) {
            if (typeof val === 'string' && val) {
              colors[key] = val
            }
          }
          injectThemeColorVars(colors)
        }
      })
      .catch(() => {
        // Silently fall back to CSS defaults
      })
  }, [config.routes?.api, config.serverURL])

  return <>{children}</>
}
