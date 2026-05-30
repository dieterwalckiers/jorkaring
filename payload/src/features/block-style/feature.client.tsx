'use client'

import {
  createClientFeature,
  useEditorConfigContext,
} from '@payloadcms/richtext-lexical/client'
import { useEffect } from 'react'
import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $getNodeByKey,
  $getState,
  $setState,
  type LexicalEditor,
  type LexicalNode,
  type StateConfig,
} from 'lexical'
import {
  blockBgState,
  blockBorderState,
  blockPaddingState,
  blockMarginState,
  blockLinkState,
} from './state'
import { $createBlockGroupNode, $isBlockGroupNode, BlockGroupNode } from './node'

/**
 * Module-level caches populated from Site Settings → Theme Colors, so dropdowns
 * show the same names as the text-color feature and the in-editor preview can
 * render the actual brand colors.
 */
const customLabels: Record<string, string> = {}
const themeValues: Record<string, string> = {}
let settingsFetchInitiated = false

function initSettingsFetch() {
  if (settingsFetchInitiated) return
  settingsFetchInitiated = true
  fetch('/api/globals/site-settings?depth=0')
    .then((res) => res.json())
    .then((data) => {
      if (!data?.themeColors) return
      for (const [key, val] of Object.entries(data.themeColors)) {
        if (typeof val !== 'string' || !val) continue
        if (key.endsWith('Label')) {
          customLabels[key.replace(/Label$/, '')] = val
        } else {
          themeValues[key] = val
        }
      }
    })
    .catch(() => {
      // Silently fall back to default labels / no preview colors
    })
}

initSettingsFetch()

/** Curated palette — mirrors Site Settings → Theme Colors (and the text-color feature). */
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

const PADDING_OPTIONS = [
  { key: 'small', label: 'Small', cssValue: 'small' },
  { key: 'medium', label: 'Medium', cssValue: 'medium' },
  { key: 'large', label: 'Large', cssValue: 'large' },
] as const

const MARGIN_OPTIONS = [
  { key: 'none', label: 'None', cssValue: 'none' },
  { key: 'small', label: 'Small', cssValue: 'small' },
  { key: 'medium', label: 'Medium', cssValue: 'medium' },
  { key: 'large', label: 'Large', cssValue: 'large' },
] as const

/** Inset values must match the .block-pad-* rules in the frontend CSS. */
const PADDING_CSS: Record<string, string> = {
  small: '0.75rem 1rem',
  medium: '1.25rem 1.5rem',
  large: '2rem 2.25rem',
}

/** Outer gap values must match the .block-margin-* rules in the frontend CSS. */
const MARGIN_CSS: Record<string, string> = {
  none: '0',
  small: '0.75rem',
  medium: '1.5rem',
  large: '3rem',
}

/** Resolve a stored color key (theme1, accent, …) to a hex string for in-editor preview. */
function resolveColorHex(value: string | null): string | null {
  if (!value) return null
  if (value === 'black') return '#000000'
  if (value === 'white') return '#ffffff'
  if (value === 'base') return themeValues.font || '#373031'
  if (value === 'accent') return themeValues.fontAccent || '#8B5A4A'
  return themeValues[value] || null
}

const iconStyle = { width: '1em', height: '1em' } as const

const FILL_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle}>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.85" />
  </svg>
)

const BORDER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const PADDING_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.85" />
  </svg>
)

const MARGIN_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.85" />
  </svg>
)

const LINK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
    <path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
  </svg>
)

const BOX_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2M17 20h2a1 1 0 0 0 1-1v-2" />
  </svg>
)

/** Collect the distinct top-level block elements touched by the current selection. */
function getSelectedBlocks(): LexicalNode[] {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return []

  const blocks = new Map<string, LexicalNode>()
  const add = (node: LexicalNode | null) => {
    const top = node?.getTopLevelElement()
    if (top && $isElementNode(top)) blocks.set(top.getKey(), top)
  }

  for (const node of selection.getNodes()) add(node)
  add(selection.anchor.getNode())
  add(selection.focus.getNode())

  return [...blocks.values()]
}

function applyBlockState(
  editor: LexicalEditor,
  stateConfig: StateConfig<string, string | null>,
  value: string | null,
) {
  editor.update(() => {
    for (const block of getSelectedBlocks()) {
      $setState(block, stateConfig, value)
    }
  })
}

/** Wrap the selected top-level blocks in a single BlockGroup box. */
function wrapInBox(editor: LexicalEditor) {
  editor.update(() => {
    const targets = getSelectedBlocks().filter((b) => !$isBlockGroupNode(b))
    if (targets.length === 0) return
    const group = $createBlockGroupNode()
    targets[0].insertBefore(group)
    for (const block of targets) group.append(block)
    group.selectEnd()
  })
}

/** Unwrap any BlockGroup box(es) in the selection, lifting their content back out. */
function removeBox(editor: LexicalEditor) {
  editor.update(() => {
    for (const block of getSelectedBlocks()) {
      if (!$isBlockGroupNode(block)) continue
      for (const child of block.getChildren()) {
        block.insertBefore(child)
      }
      block.remove()
    }
  })
}

const NONE_ITEM = (stateConfig: StateConfig<string, string | null>) => ({
  key: 'none',
  label: () => 'None',
  onSelect: ({ editor }: { editor: LexicalEditor }) =>
    applyBlockState(editor, stateConfig, null),
})

const colorItems = (stateConfig: StateConfig<string, string | null>) => [
  ...COLOR_OPTIONS.map((option) => ({
    key: option.key,
    label: () => customLabels[option.key] || option.label,
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      applyBlockState(editor, stateConfig, option.cssValue),
  })),
  NONE_ITEM(stateConfig),
]

const paddingItems = [
  ...PADDING_OPTIONS.map((option) => ({
    key: option.key,
    label: () => option.label,
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      applyBlockState(editor, blockPaddingState, option.cssValue),
  })),
  NONE_ITEM(blockPaddingState),
]

const marginItems = MARGIN_OPTIONS.map((option) => ({
  key: option.key,
  label: () => option.label,
  onSelect: ({ editor }: { editor: LexicalEditor }) =>
    applyBlockState(editor, blockMarginState, option.cssValue),
}))

/** Prompt for a URL and store it on the selected block(s) / box, making them clickable. */
function setBlockLink(editor: LexicalEditor) {
  const existing =
    typeof window !== 'undefined' ? window.prompt('Link URL (leave empty to remove):', '') : null
  if (existing === null) return // cancelled
  applyBlockState(editor, blockLinkState, existing.trim() || null)
}

const linkItems = [
  {
    key: 'set',
    label: () => 'Set link…',
    onSelect: ({ editor }: { editor: LexicalEditor }) => setBlockLink(editor),
  },
  {
    key: 'remove',
    label: () => 'Remove link',
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      applyBlockState(editor, blockLinkState, null),
  },
]

const boxItems = [
  {
    key: 'wrap',
    label: () => 'Wrap selection in box',
    onSelect: ({ editor }: { editor: LexicalEditor }) => wrapInBox(editor),
  },
  {
    key: 'unwrap',
    label: () => 'Remove box',
    onSelect: ({ editor }: { editor: LexicalEditor }) => removeBox(editor),
  },
]

// Gate: the styling groups are only live when the selection sits inside a box.
// (Payload greys disabled groups out rather than removing them.) The Box group
// itself stays always enabled — it's how you create/remove the box.
const selectionInBox = (): boolean => getSelectedBlocks().some($isBlockGroupNode)

const toolbarGroups = [
  { key: 'blockBox', type: 'dropdown' as const, ChildComponent: () => BOX_ICON, items: boxItems },
  { key: 'blockFill', type: 'dropdown' as const, ChildComponent: () => FILL_ICON, items: colorItems(blockBgState), isEnabled: selectionInBox },
  { key: 'blockBorder', type: 'dropdown' as const, ChildComponent: () => BORDER_ICON, items: colorItems(blockBorderState), isEnabled: selectionInBox },
  { key: 'blockPadding', type: 'dropdown' as const, ChildComponent: () => PADDING_ICON, items: paddingItems, isEnabled: selectionInBox },
  { key: 'blockMargin', type: 'dropdown' as const, ChildComponent: () => MARGIN_ICON, items: marginItems, isEnabled: selectionInBox },
  { key: 'blockLink', type: 'dropdown' as const, ChildComponent: () => LINK_ICON, items: linkItems, isEnabled: selectionInBox },
]

/**
 * Reflects each BlockGroup's stored styling onto its editor DOM so editors see
 * the box (tint / border / padding / text color) live, using the real brand
 * colors fetched from Site Settings. Mirrors Payload's own textState plugin.
 */
function BlockGroupStylePlugin(): null {
  const { editor } = useEditorConfigContext()

  useEffect(() => {
    const applyStyles = (node: BlockGroupNode, dom: HTMLElement) => {
      const bg = resolveColorHex($getState(node, blockBgState))
      dom.style.backgroundColor = bg || ''

      const border = resolveColorHex($getState(node, blockBorderState))
      dom.style.border = border ? `1px solid ${border}` : ''

      const pad = $getState(node, blockPaddingState)
      dom.style.padding = pad && PADDING_CSS[pad] ? PADDING_CSS[pad] : ''

      const margin = $getState(node, blockMarginState)
      dom.style.marginBlock = margin && margin in MARGIN_CSS ? MARGIN_CSS[margin] : ''

      // Hint the clickable box in-editor (the actual <a> only exists on the frontend).
      const link = $getState(node, blockLinkState)
      dom.style.cursor = link ? 'pointer' : ''
      if (link) dom.title = link
      else dom.removeAttribute('title')
    }

    return editor.registerMutationListener(
      BlockGroupNode,
      (mutatedNodes) => {
        editor.getEditorState().read(() => {
          for (const [key, mutation] of mutatedNodes) {
            if (mutation === 'destroyed') continue
            const node = $getNodeByKey(key)
            const dom = editor.getElementByKey(key)
            if (dom && $isBlockGroupNode(node)) applyStyles(node, dom)
          }
        })
      },
      { skipInitialization: false },
    )
  }, [editor])

  return null
}

export const BlockStyleFeatureClient = createClientFeature({
  nodes: [BlockGroupNode],
  plugins: [{ Component: BlockGroupStylePlugin, position: 'normal' }],
  toolbarFixed: { groups: toolbarGroups },
  toolbarInline: { groups: toolbarGroups },
})
