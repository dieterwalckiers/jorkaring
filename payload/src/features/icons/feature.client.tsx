'use client'

import { createClientFeature, $createInlineBlockNode } from '@payloadcms/richtext-lexical/client'
import { $insertNodes, type LexicalEditor } from 'lexical'
import { AtIcon, PhoneIcon, InstagramIcon, LinkedInIcon } from './icons'

/**
 * The four icons offered by the toolbar dropdown. Each inserts an `icon`
 * inline block (see `features/iconInlineBlock.ts`) with the chosen value.
 * The frontend renders these uniformly in RichTextRenderer.vue.
 */
const ICON_ITEMS = [
  { key: 'at', label: 'At sign', Icon: AtIcon },
  { key: 'phone', label: 'Telephone', Icon: PhoneIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
] as const

function insertIcon(editor: LexicalEditor, icon: string) {
  editor.update(() => {
    // `$createInlineBlockNode` is typed `Exclude<InlineBlockFields, 'id'>`, but
    // Exclude on an object type is a no-op so `id` is still required. Generate
    // one explicitly (same shape Payload's runtime would otherwise create).
    $insertNodes([$createInlineBlockNode({ blockType: 'icon', id: crypto.randomUUID(), icon })])
  })
}

// Dropdown trigger glyph — a small grid of dots suggesting "insert an icon".
const ICONS_TRIGGER = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: '1em', height: '1em' }}
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="12" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
)

const items = ICON_ITEMS.map(({ key, label, Icon }) => ({
  key,
  label,
  ChildComponent: () => <Icon />,
  onSelect: ({ editor }: { editor: LexicalEditor }) => {
    insertIcon(editor, key)
  },
}))

const toolbarGroups = [
  {
    key: 'icons',
    type: 'dropdown' as const,
    ChildComponent: () => ICONS_TRIGGER,
    items,
  },
]

export const IconsFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
