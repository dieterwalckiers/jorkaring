import type { TextField } from 'payload'

export interface ColorFieldOptions {
  /** Field name */
  name: string
  /** Field label (defaults to name with spaces) */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Default value (theme color key or hex) */
  defaultValue?: string
  /** Admin description */
  description?: string
  /** Admin width */
  width?: string
}

/**
 * Creates a color picker field with theme color presets and custom hex option.
 *
 * The field stores either:
 * - A theme color key (e.g., 'color1')
 * - A custom hex value (e.g., '#ff0000')
 * - 'transparent'
 *
 * Usage:
 * ```ts
 * import { createColorField } from '../fields/colorField'
 *
 * fields: [
 *   createColorField({
 *     name: 'backgroundColor',
 *     label: 'Background Color',
 *     defaultValue: 'transparent',
 *   }),
 * ]
 * ```
 */
export function createColorField(options: ColorFieldOptions): TextField {
  const {
    name,
    label,
    required = false,
    defaultValue = 'transparent',
    description,
    width,
  } = options

  return {
    name,
    type: 'text',
    required,
    defaultValue,
    admin: {
      description,
      width,
      components: {
        Field: {
          path: '/fields/ColorField#ColorField',
        },
      },
    },
    label: label || name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
  }
}
