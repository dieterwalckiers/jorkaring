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
    key: 'color1',
    label: 'Color 1',
    hex: '#5E6E83',
    cssVar: 'color-1',
  },
  {
    key: 'color2',
    label: 'Color 2',
    hex: '#5E6E83',
    cssVar: 'color-2',
  },
  {
    key: 'color3',
    label: 'Color 3',
    hex: '#B6C9BB',
    cssVar: 'color-3',
  },
  {
    key: 'color4',
    label: 'Color 4',
    hex: '#BFEDC1',
    cssVar: 'color-4',
  },
  {
    key: 'color5',
    label: 'Color 5',
    hex: '#EA8928',
    cssVar: 'color-5',
  },
  {
    key: 'color6',
    label: 'Color 6',
    hex: '#656565',
    cssVar: 'color-6',
  },
  {
    key: 'black',
    label: 'Black',
    hex: '#000000',
    cssVar: 'black',
  },
  {
    key: 'white',
    label: 'White',
    hex: '#ffffff',
    cssVar: 'white',
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
