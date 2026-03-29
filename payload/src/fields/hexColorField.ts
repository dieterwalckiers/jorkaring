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
  /** Admin width (e.g. '25%', '50%') */
  width?: string
  /**
   * Name of a sibling text field that stores the user-defined label for this color.
   * When set, the HexColorField component renders an inline name input.
   */
  labelFieldName?: string
}

/**
 * Creates a hex color picker field for defining theme color values.
 *
 * Unlike createColorField (which picks FROM theme colors), this creates
 * a field for DEFINING theme color values with a native color picker.
 */
export function createHexColorField(options: HexColorFieldOptions): TextField {
  const { name, label, defaultValue, description, width, labelFieldName } = options

  return {
    name,
    type: 'text',
    defaultValue,
    admin: {
      description: description ?? `Default: ${defaultValue}`,
      ...(width ? { width } : {}),
      components: {
        Field: {
          path: '/fields/HexColorField#HexColorField',
          clientProps: labelFieldName ? { labelFieldName } : undefined,
        },
      },
    },
    label,
  }
}
