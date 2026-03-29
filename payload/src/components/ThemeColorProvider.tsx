'use client'

import { useEffect } from 'react'
import { useConfig } from '@payloadcms/ui'

/** Map from site settings themeColors field names to CSS variable names */
const THEME_COLOR_CSS_VAR_MAP: Record<string, string> = {
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
