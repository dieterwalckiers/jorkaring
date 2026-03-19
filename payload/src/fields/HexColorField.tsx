'use client'

import { useCallback, useState, useEffect } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/**
 * Hex color picker field for defining theme color values.
 * Uses native <input type="color"> plus a text input for direct hex entry.
 *
 * Unlike ColorField (which picks FROM theme colors), this field is for
 * DEFINING theme color values in Site Settings.
 */
export const HexColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const [localHex, setLocalHex] = useState(value || '#000000')

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
      // Reset to last valid value
      setLocalHex(value || '#000000')
    }
  }, [localHex, value, setValue])

  return (
    <div className="field-type text" style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label} required={field.required} path={path} />

      {field.admin?.description && (
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '8px',
          }}
        >
          {field.admin.description as string}
        </div>
      )}

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
            width: '120px',
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
      </div>
    </div>
  )
}
