/**
 * Theme colors shared between Payload CMS field options and frontend CSS.
 * These values must stay in sync with /web/app/assets/css/main.css
 */

export interface ThemeColor {
  /** Unique key used for storage and CSS variable reference */
  key: string
  /** Human-readable label shown in the admin UI */
  label: string
  /** Hex color value for display and fallback */
  hex: string
  /** CSS variable name (without --color- prefix) */
  cssVar: string
}

export const THEME_COLORS: ThemeColor[] = [
  {
    key: 'transparent',
    label: 'Transparent',
    hex: 'transparent',
    cssVar: 'transparent',
  },
  {
    key: 'brandprimarymedium',
    label: 'Brand Primary Medium',
    hex: '#f15b4e',
    cssVar: 'brandprimarymedium',
  },
  {
    key: 'brandprimarydark',
    label: 'Brand Primary Dark',
    hex: '#6b081d',
    cssVar: 'brandprimarydark',
  },
  {
    key: 'brandsecondarylight',
    label: 'Secondary Light',
    hex: '#efebe7',
    cssVar: 'brandsecondarylight',
  },
  {
    key: 'brandsecondarylight2',
    label: 'Secondary Light 2',
    hex: '#dedfde',
    cssVar: 'brandsecondarylight2',
  },
  {
    key: 'brandsecondarymedium',
    label: 'Secondary Medium',
    hex: '#e3cac0',
    cssVar: 'brandsecondarymedium',
  },
  {
    key: 'brandsecondarymedium2',
    label: 'Secondary Medium 2',
    hex: '#7c9198',
    cssVar: 'brandsecondarymedium2',
  },
]

/** Special option for custom hex input */
export const CUSTOM_COLOR_KEY = 'custom'

/**
 * Check if a color value is a theme color key
 */
export function isThemeColorKey(value: string): boolean {
  return THEME_COLORS.some((c) => c.key === value)
}

/**
 * Get theme color by key
 */
export function getThemeColor(key: string): ThemeColor | undefined {
  return THEME_COLORS.find((c) => c.key === key)
}

/**
 * Resolve a color value to its display hex (for admin UI)
 */
export function resolveColorToHex(value: string | undefined | null): string {
  if (!value) return 'transparent'
  const themeColor = getThemeColor(value)
  if (themeColor) return themeColor.hex
  return value // Assume it's already a hex/color value
}
