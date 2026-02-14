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
  brandprimarymedium: { cssVar: 'var(--color-brandprimarymedium)', hex: '#f15b4e' },
  brandprimarydark: { cssVar: 'var(--color-brandprimarydark)', hex: '#6b081d' },
  brandsecondarylight: { cssVar: 'var(--color-brandsecondarylight)', hex: '#efebe7' },
  brandsecondarylight2: { cssVar: 'var(--color-brandsecondarylight2)', hex: '#dedfde' },
  brandsecondarymedium: { cssVar: 'var(--color-brandsecondarymedium)', hex: '#e3cac0' },
  brandsecondarymedium2: { cssVar: 'var(--color-brandsecondarymedium2)', hex: '#7c9198' },
}

/**
 * Resolve a color value from Payload to a CSS value.
 *
 * Handles:
 * - Theme color keys (e.g., 'brandprimarymedium') → CSS variable
 * - Custom hex values (e.g., '#ff0000') → passed through
 * - 'transparent' → 'transparent'
 * - undefined/null/empty → 'transparent'
 *
 * @example
 * resolveColor('brandprimarymedium') // 'var(--color-brandprimarymedium)'
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
 * @example
 * resolveColorToHex('brandprimarymedium') // '#f15b4e'
 * resolveColorToHex('#ff0000')            // '#ff0000'
 * resolveColorToHex('transparent')        // 'transparent'
 */
export function resolveColorToHex(value: string | undefined | null): string {
  if (!value) return 'transparent'

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
