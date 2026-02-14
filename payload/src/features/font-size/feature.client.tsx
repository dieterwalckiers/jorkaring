'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'

// Font size steps (in em units for scalability)
const FONT_SIZE_STEPS = [
  0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.75, 2, 2.5, 3, 4,
]

const DEFAULT_SIZE = 1 // 1em = base size

// Icons for increase/decrease
const INCREASE_ICON = (
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
    <text x="2" y="16" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">
      A
    </text>
    <text x="12" y="14" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">
      A
    </text>
    <path d="M20 8v8" />
    <path d="M16 12h8" />
  </svg>
)

const DECREASE_ICON = (
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
    <text x="2" y="14" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">
      A
    </text>
    <text x="10" y="16" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">
      A
    </text>
    <path d="M16 12h8" />
  </svg>
)

// Get current font size from selection
function getCurrentFontSize(editor: LexicalEditor): number {
  let currentSize = DEFAULT_SIZE

  editor.getEditorState().read(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes()
      for (const node of nodes) {
        if ('getStyle' in node && typeof node.getStyle === 'function') {
          const style = node.getStyle() as string
          if (style) {
            const match = style.match(/font-size:\\s*([\\d.]+)em/)
            if (match) {
              currentSize = parseFloat(match[1])
              break
            }
          }
        }
      }
    }
  })

  return currentSize
}

// Find the next size step
function getNextSize(currentSize: number, direction: 'increase' | 'decrease'): number | null {
  const currentIndex = FONT_SIZE_STEPS.findIndex((size) => Math.abs(size - currentSize) < 0.01)

  if (direction === 'increase') {
    if (currentIndex === -1) {
      // Find the next step larger than current
      const nextLarger = FONT_SIZE_STEPS.find((size) => size > currentSize)
      return nextLarger ?? null
    }
    if (currentIndex < FONT_SIZE_STEPS.length - 1) {
      return FONT_SIZE_STEPS[currentIndex + 1]
    }
    return null // Already at max
  } else {
    if (currentIndex === -1) {
      // Find the next step smaller than current
      const nextSmaller = [...FONT_SIZE_STEPS].reverse().find((size) => size < currentSize)
      return nextSmaller ?? null
    }
    if (currentIndex > 0) {
      return FONT_SIZE_STEPS[currentIndex - 1]
    }
    return null // Already at min
  }
}

// Apply font size change
function changeFontSize(editor: LexicalEditor, direction: 'increase' | 'decrease') {
  const currentSize = getCurrentFontSize(editor)
  const newSize = getNextSize(currentSize, direction)

  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      if (newSize === null || Math.abs(newSize - DEFAULT_SIZE) < 0.01) {
        // Reset to default by removing the style
        $patchStyleText(selection, { 'font-size': null })
      } else {
        $patchStyleText(selection, { 'font-size': `${newSize}em` })
      }
    }
  })
}

// Toolbar button groups
const toolbarGroups = [
  {
    key: 'fontSizeIncrease',
    type: 'buttons' as const,
    items: [
      {
        key: 'increase',
        label: 'Increase font size',
        ChildComponent: () => INCREASE_ICON,
        onSelect: ({ editor }: { editor: LexicalEditor }) => {
          changeFontSize(editor, 'increase')
        },
      },
      {
        key: 'decrease',
        label: 'Decrease font size',
        ChildComponent: () => DECREASE_ICON,
        onSelect: ({ editor }: { editor: LexicalEditor }) => {
          changeFontSize(editor, 'decrease')
        },
      },
    ],
  },
]

export const FontSizeFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
