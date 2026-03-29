/**
 * Theme color definitions.
 * Must stay in sync with /payload/src/config/themeColors.ts
 */
interface ThemeColorDef {
  cssVar: string
  hex: string
}

const THEME_COLORS: Record<string, ThemeColorDef> = {
  transparent: { cssVar: 'transparent', hex: 'transparent' },
  theme1: { cssVar: 'var(--color-theme1)', hex: '#5E6E83' },
  theme2: { cssVar: 'var(--color-theme2)', hex: '#5E6E83' },
  theme3: { cssVar: 'var(--color-theme3)', hex: '#B6C9BB' },
  theme4: { cssVar: 'var(--color-theme4)', hex: '#BFEDC1' },
  theme5: { cssVar: 'var(--color-theme5)', hex: '#EA8928' },
  theme6: { cssVar: 'var(--color-theme6)', hex: '#656565' },
  theme7: { cssVar: 'var(--color-theme7)', hex: '#2C3E50' },
  theme8: { cssVar: 'var(--color-theme8)', hex: '#E74C3C' },
}

/**
 * Resolve a color value from Payload to a CSS value.
 *
 * Handles:
 * - Theme color keys (e.g., 'theme1') → CSS variable
 * - Custom hex values (e.g., '#ff0000') → passed through
 * - 'transparent' → 'transparent'
 * - undefined/null/empty → 'transparent'
 *
 * @example
 * resolveColor('theme1') // 'var(--color-theme1)'
 * resolveColor('#ff0000')            // '#ff0000'
 * resolveColor('transparent')        // 'transparent'
 * resolveColor(undefined)            // 'transparent'
 */
export function resolveColor(value: string | undefined | null): string {
  if (!value) return 'transparent'

  // Check if it's a theme color key
  const themeColor = THEME_COLORS[value]
  if (themeColor) return themeColor.cssVar

  // Otherwise return as-is (custom hex value)
  return value
}

/**
 * Resolve a color value from Payload to a hex value.
 * Use this when you need the actual hex color (e.g., for JS calculations with rgba).
 *
 * Pass `cmsOverrides` (from siteSettings.themeColors) to use CMS-saved values
 * instead of hardcoded fallbacks.
 *
 * @example
 * resolveColorToHex('theme1') // '#5E6E83' (hardcoded fallback)
 * resolveColorToHex('theme1', { theme1: '#FF0000' }) // '#FF0000'
 * resolveColorToHex('#ff0000')            // '#ff0000'
 * resolveColorToHex('transparent')        // 'transparent'
 */
export function resolveColorToHex(
  value: string | undefined | null,
  cmsOverrides?: Record<string, string | undefined>,
): string {
  if (!value) return 'transparent'

  // Check CMS overrides first
  if (cmsOverrides && value in cmsOverrides) {
    const override = cmsOverrides[value]
    if (override) return override
  }

  // Check if it's a theme color key
  const themeColor = THEME_COLORS[value]
  if (themeColor) return themeColor.hex

  // Otherwise return as-is (custom hex value)
  return value
}

/**
 * Check if a value is a valid hex color (for rgba conversion).
 */
export function isHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}
