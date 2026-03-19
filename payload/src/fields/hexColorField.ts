import type { TextField } from 'payload'

export interface HexColorFieldOptions {
  /** Field name */
  name: string
  /** Field label */
  label: string
  /** Default hex value */
  defaultValue: string
  /** Admin description */
  description?: string
}

/**
 * Creates a hex color picker field for defining theme color values.
 *
 * Unlike createColorField (which picks FROM theme colors), this creates
 * a field for DEFINING theme color values with a native color picker.
 *
 * Usage:
 * ```ts
 * import { createHexColorField } from '../fields/hexColorField'
 *
 * fields: [
 *   createHexColorField({
 *     name: 'color1',
 *     label: 'Color 1',
 *     defaultValue: '#5E6E83',
 *   }),
 * ]
 * ```
 */
export function createHexColorField(options: HexColorFieldOptions): TextField {
  const { name, label, defaultValue, description } = options

  return {
    name,
    type: 'text',
    defaultValue,
    admin: {
      description: description ?? `Default: ${defaultValue}`,
      components: {
        Field: {
          path: '/fields/HexColorField#HexColorField',
        },
      },
    },
    label,
  }
}
