'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'

/**
 * Module-level cache for custom color labels fetched from Site Settings.
 * Populated once on first load; used by toolbar dropdown label functions.
 */
let customLabels: Record<string, string> = {}
let labelFetchInitiated = false

function initLabelFetch() {
  if (labelFetchInitiated) return
  labelFetchInitiated = true
  fetch('/api/globals/site-settings?depth=0')
    .then((res) => res.json())
    .then((data) => {
      if (data?.themeColors) {
        for (const [key, val] of Object.entries(data.themeColors)) {
          if (key.endsWith('Label') && typeof val === 'string' && val) {
            // Strip 'Label' suffix to get the color key (e.g. 'theme1Label' → 'theme1')
            customLabels[key.replace(/Label$/, '')] = val
          }
        }
      }
    })
    .catch(() => {
      // Silently fall back to default labels
    })
}

// Start fetching labels as soon as this module loads
initLabelFetch()

/**
 * Color options matching Site Settings → Theme Colors.
 * The cssValue is stored in Lexical nodes and mapped to CSS classes on the frontend.
 */
const COLOR_OPTIONS = [
  { key: 'theme1', label: 'Theme 1', cssValue: 'theme1' },
  { key: 'theme2', label: 'Theme 2', cssValue: 'theme2' },
  { key: 'theme3', label: 'Theme 3', cssValue: 'theme3' },
  { key: 'theme4', label: 'Theme 4', cssValue: 'theme4' },
  { key: 'theme5', label: 'Theme 5', cssValue: 'theme5' },
  { key: 'theme6', label: 'Theme 6', cssValue: 'theme6' },
  { key: 'theme7', label: 'Theme 7', cssValue: 'theme7' },
  { key: 'theme8', label: 'Theme 8', cssValue: 'theme8' },
  { key: 'font', label: 'Font Color', cssValue: 'base' },
  { key: 'fontAccent', label: 'Font Accent', cssValue: 'accent' },
  { key: 'black', label: 'Black', cssValue: 'black' },
  { key: 'white', label: 'White', cssValue: 'white' },
] as const

// Main dropdown icon - "A" with colorful underline
const TEXT_COLOR_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '1em', height: '1em' }}
  >
    <defs>
      <linearGradient id="textColorIcon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--color-theme1, #5E6E83)" />
        <stop offset="100%" stopColor="var(--color-theme2, #5E6E83)" />
      </linearGradient>
    </defs>
    <text
      x="4"
      y="17"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
    >
      A
    </text>
    <path d="M4 20h16" stroke="url(#textColorIcon)" strokeWidth="3" />
  </svg>
)

// Apply or toggle text color
function applyTextColor(editor: LexicalEditor, colorValue: string) {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes()
      let hasThisColor = false

      // Check if selection already has this color
      for (const node of nodes) {
        if ('getStyle' in node && typeof node.getStyle === 'function') {
          const style = node.getStyle() as string
          if (style) {
            const match = style.match(/--text-color:\\s*([^;]+)/)
            if (match && match[1].trim() === colorValue) {
              hasThisColor = true
              break
            }
            // Legacy gradient check
            if (colorValue === 'gradient' && style.includes('--gradient-text')) {
              hasThisColor = true
              break
            }
          }
        }
      }

      // Clear any existing text color first
      $patchStyleText(selection, { '--text-color': null, '--gradient-text': null })

      // Apply new color if not toggling off
      if (!hasThisColor) {
        $patchStyleText(selection, { '--text-color': colorValue })
      }
    }
  })
}

// Create dropdown items with dynamic labels from Site Settings
const dropdownItems = COLOR_OPTIONS.map((option) => ({
  key: option.key,
  label: () => customLabels[option.key] || option.label,
  onSelect: ({ editor }: { editor: LexicalEditor }) => {
    applyTextColor(editor, option.cssValue)
  },
}))

export const TextColorFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        key: 'textColor',
        type: 'dropdown',
        ChildComponent: () => TEXT_COLOR_ICON,
        items: dropdownItems,
      },
    ],
  },
  toolbarInline: {
    groups: [
      {
        key: 'textColor',
        type: 'dropdown',
        ChildComponent: () => TEXT_COLOR_ICON,
        items: dropdownItems,
      },
    ],
  },
})
