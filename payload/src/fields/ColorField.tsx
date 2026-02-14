'use client'

import { useCallback, useState, useEffect } from 'react'
import { useField, FieldLabel, TextInput } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import {
  THEME_COLORS,
  CUSTOM_COLOR_KEY,
  isThemeColorKey,
  resolveColorToHex,
} from '../config/themeColors'

/**
 * Color swatch component for displaying a single color option
 */
function ColorSwatch({
  color,
  hex,
  isSelected,
  onClick,
}: {
  color: string
  hex: string
  isSelected: boolean
  onClick: () => void
}) {
  const isTransparent = hex === 'transparent'

  return (
    <button
      type="button"
      onClick={onClick}
      title={color}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '4px',
        border: isSelected ? '2px solid #0070f3' : '1px solid #ccc',
        background: isTransparent
          ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 10px 10px'
          : hex,
        cursor: 'pointer',
        padding: 0,
        outline: isSelected ? '2px solid #0070f3' : 'none',
        outlineOffset: '2px',
        boxShadow: isSelected ? '0 0 0 1px white' : 'none',
        flexShrink: 0,
      }}
      aria-label={`Select ${color}`}
    />
  )
}

/**
 * Custom color field component with theme color swatches and custom hex input
 */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })

  // Determine if current value is a theme color or custom
  const isCustomValue = value ? !isThemeColorKey(value) && value !== '' : false
  const [showCustomInput, setShowCustomInput] = useState(isCustomValue)
  const [customHex, setCustomHex] = useState(isCustomValue ? value || '' : '')

  // Update custom input visibility when value changes externally
  useEffect(() => {
    const isCustom = value ? !isThemeColorKey(value) && value !== '' : false
    setShowCustomInput(isCustom)
    if (isCustom && value) {
      setCustomHex(value)
    }
  }, [value])

  const handleThemeColorClick = useCallback(
    (colorKey: string) => {
      setValue(colorKey)
      setShowCustomInput(false)
    },
    [setValue]
  )

  const handleCustomClick = useCallback(() => {
    setShowCustomInput(true)
    // Keep the current custom value or default to empty
    if (!isThemeColorKey(value || '')) {
      setValue(value || '')
    } else {
      setValue('')
      setCustomHex('')
    }
  }, [setValue, value])

  const handleCustomHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setCustomHex(newValue)
      setValue(newValue)
    },
    [setValue]
  )

  // Get current preview color
  const previewHex = resolveColorToHex(value)

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

      {/* Theme color swatches */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px',
          alignItems: 'center',
        }}
      >
        {THEME_COLORS.map((color) => (
          <div
            key={color.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ColorSwatch
              color={color.label}
              hex={color.hex}
              isSelected={value === color.key && !showCustomInput}
              onClick={() => handleThemeColorClick(color.key)}
            />
            <span
              style={{
                fontSize: '9px',
                color: '#666',
                textAlign: 'center',
                maxWidth: '50px',
                lineHeight: '1.1',
              }}
            >
              {color.label.replace('Brand ', '').replace('Secondary ', '')}
            </span>
          </div>
        ))}

        {/* Custom color option */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={handleCustomClick}
            title="Custom color"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              border: showCustomInput ? '2px solid #0070f3' : '1px solid #ccc',
              background: showCustomInput && customHex ? customHex : 'white',
              cursor: 'pointer',
              padding: 0,
              outline: showCustomInput ? '2px solid #0070f3' : 'none',
              outlineOffset: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#666',
            }}
            aria-label="Select custom color"
          >
            {!showCustomInput || !customHex ? '#' : ''}
          </button>
          <span
            style={{
              fontSize: '9px',
              color: '#666',
              textAlign: 'center',
            }}
          >
            Custom
          </span>
        </div>
      </div>

      {/* Custom hex input */}
      {showCustomInput && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <TextInput
              path={path}
              value={customHex}
              onChange={handleCustomHexChange}
              placeholder="#ffffff"
            />
          </div>
          {customHex && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: customHex,
                flexShrink: 0,
              }}
              title={`Preview: ${customHex}`}
            />
          )}
        </div>
      )}

      {/* Current value display */}
      {value && !showCustomInput && (
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Selected:</span>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '2px',
              border: '1px solid #ccc',
              background:
                previewHex === 'transparent'
                  ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 6px 6px'
                  : previewHex,
            }}
          />
          <span>
            {THEME_COLORS.find((c) => c.key === value)?.label || value}
          </span>
        </div>
      )}
    </div>
  )
}
