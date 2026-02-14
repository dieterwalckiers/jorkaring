'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'

// Color options with their CSS variable colors (matching Tailwind theme)
const COLOR_OPTIONS = [
  { key: 'gradient', label: 'Gradient', cssValue: 'gradient' },
  { key: 'base', label: 'Base', cssValue: 'base' },
  { key: 'brand1', label: 'Brand 1', cssValue: 'brand1' },
  { key: 'brand2', label: 'Brand 2', cssValue: 'brand2' },
  { key: 'accent', label: 'Accent', cssValue: 'accent' },
  { key: 'highlight', label: 'Highlight', cssValue: 'highlight' },
] as const

// CSS colors for rendering in the dropdown (matching main.css theme)
const DISPLAY_COLORS: Record<string, string> = {
  gradient: 'linear-gradient(to right, #6b081d, #f15b4e)',
  base: '#373031',
  brand1: '#6b081d',
  brand2: '#f15b4e',
  accent: '#8B5A4A',
  highlight: '#f15b4e',
}

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
        <stop offset="0%" stopColor="#6b081d" />
        <stop offset="100%" stopColor="#f15b4e" />
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

// Create dropdown items for both toolbar types
const dropdownItems = COLOR_OPTIONS.map((option) => ({
  key: option.key,
  label: option.label,
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
