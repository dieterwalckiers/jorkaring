'use client'

import { useCallback, useState, useEffect, useMemo } from 'react'
import { useField, useConfig, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import {
  THEME_COLORS,
} from '../config/themeColors'
import type { ThemeColor } from '../config/themeColors'

/** Map from THEME_COLORS key to themeColors hex field name in site-settings */
const THEME_COLOR_FIELD_MAP: Record<string, string> = {
  theme1: 'theme1',
  theme2: 'theme2',
  theme3: 'theme3',
  theme4: 'theme4',
  theme5: 'theme5',
  theme6: 'theme6',
  theme7: 'theme7',
  theme8: 'theme8',
}

/** Map from THEME_COLORS key to themeColors label field name in site-settings */
const THEME_COLOR_LABEL_MAP: Record<string, string> = {
  theme1: 'theme1Label',
  theme2: 'theme2Label',
  theme3: 'theme3Label',
  theme4: 'theme4Label',
  theme5: 'theme5Label',
  theme6: 'theme6Label',
  theme7: 'theme7Label',
  theme8: 'theme8Label',
}

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
  const { config } = useConfig()

  // Fetch CMS theme colors from site-settings
  const [cmsColors, setCmsColors] = useState<Record<string, string>>({})
  useEffect(() => {
    const apiPath = config.routes?.api || '/api'
    fetch(`${config.serverURL || ''}${apiPath}/globals/site-settings?depth=0`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.themeColors) {
          const colors: Record<string, string> = {}
          for (const [key, val] of Object.entries(data.themeColors)) {
            if (typeof val === 'string' && val) {
              colors[key] = val
            }
          }
          setCmsColors(colors)
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded defaults
      })
  }, [config.routes?.api, config.serverURL])

  // Merge CMS theme colors (hex values and custom labels) into the static THEME_COLORS for display
  const displayColors: ThemeColor[] = useMemo(() => {
    return THEME_COLORS.map((color) => {
      let updated = color
      const hexField = THEME_COLOR_FIELD_MAP[color.key]
      if (hexField && cmsColors[hexField]) {
        updated = { ...updated, hex: cmsColors[hexField] }
      }
      const labelField = THEME_COLOR_LABEL_MAP[color.key]
      if (labelField && cmsColors[labelField]) {
        updated = { ...updated, label: cmsColors[labelField] }
      }
      return updated
    })
  }, [cmsColors])

  const handleThemeColorClick = useCallback(
    (colorKey: string) => {
      setValue(colorKey)
    },
    [setValue]
  )

  // Get current preview color using CMS-aware colors
  const previewHex = useMemo(() => {
    if (!value) return 'transparent'
    const match = displayColors.find((c) => c.key === value)
    if (match) return match.hex
    return value
  }, [value, displayColors])

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
        {displayColors.map((color) => (
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
              isSelected={value === color.key}
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
              {color.label}
            </span>
          </div>
        ))}

      </div>

      {/* Current value display */}
      {value && (
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
            {displayColors.find((c) => c.key === value)?.label || value}
          </span>
        </div>
      )}
    </div>
  )
}
