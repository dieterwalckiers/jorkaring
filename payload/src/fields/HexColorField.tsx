'use client'

import { useCallback, useState, useEffect } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent, TextFieldClientProps } from 'payload'

interface HexColorFieldProps extends TextFieldClientProps {
  labelFieldName?: string
}

/**
 * Hex color picker field for defining theme color values.
 * Uses native <input type="color"> plus a text input for direct hex entry.
 *
 * When a `labelFieldName` is provided via clientProps, also renders an
 * editable name input so CMS users can give each color a meaningful label.
 */
export const HexColorField: React.FC<HexColorFieldProps> = ({ field, path, labelFieldName }) => {
  const { value, setValue } = useField<string>({ path })
  const [localHex, setLocalHex] = useState(value || '#000000')

  // Derive the sibling label field path (e.g. 'themeColors.color1' → 'themeColors.color1Label')
  const labelPath = labelFieldName && path
    ? path.replace(/[^.]+$/, labelFieldName)
    : undefined
  const labelField = useField<string>({ path: labelPath || '' })
  const hasLabelField = Boolean(labelFieldName && labelPath)

  useEffect(() => {
    if (value && value !== localHex) {
      setLocalHex(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value
      setLocalHex(hex)
      setValue(hex)
    },
    [setValue],
  )

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value
      setLocalHex(hex)
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        setValue(hex)
      }
    },
    [setValue],
  )

  const handleTextBlur = useCallback(() => {
    if (/^#[0-9A-Fa-f]{6}$/.test(localHex)) {
      setValue(localHex)
    } else {
      setLocalHex(value || '#000000')
    }
  }, [localHex, value, setValue])

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      labelField.setValue(e.target.value)
    },
    [labelField],
  )

  return (
    <div className="field-type text" style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label} required={field.required} path={path} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Native color picker */}
        <input
          type="color"
          value={localHex}
          onChange={handleColorPickerChange}
          style={{
            width: '40px',
            height: '40px',
            padding: '2px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'white',
          }}
        />

        {/* Hex text input */}
        <input
          type="text"
          value={localHex}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="#000000"
          style={{
            width: '100px',
            padding: '6px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />

        {/* Preview swatch */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: value || '#000000',
            flexShrink: 0,
          }}
          title={`Preview: ${value}`}
        />

        {/* Inline label/name input */}
        {hasLabelField && (
          <input
            type="text"
            value={(labelField.value as string) || ''}
            onChange={handleLabelChange}
            placeholder="Name"
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        )}
      </div>
    </div>
  )
}
