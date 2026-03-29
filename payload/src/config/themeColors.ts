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
    key: 'theme1',
    label: 'Theme 1',
    hex: '#5E6E83',
    cssVar: 'theme1',
  },
  {
    key: 'theme2',
    label: 'Theme 2',
    hex: '#5E6E83',
    cssVar: 'theme2',
  },
  {
    key: 'theme3',
    label: 'Theme 3',
    hex: '#B6C9BB',
    cssVar: 'theme3',
  },
  {
    key: 'theme4',
    label: 'Theme 4',
    hex: '#BFEDC1',
    cssVar: 'theme4',
  },
  {
    key: 'theme5',
    label: 'Theme 5',
    hex: '#EA8928',
    cssVar: 'theme5',
  },
  {
    key: 'theme6',
    label: 'Theme 6',
    hex: '#656565',
    cssVar: 'theme6',
  },
  {
    key: 'theme7',
    label: 'Theme 7',
    hex: '#2C3E50',
    cssVar: 'theme7',
  },
  {
    key: 'theme8',
    label: 'Theme 8',
    hex: '#E74C3C',
    cssVar: 'theme8',
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
