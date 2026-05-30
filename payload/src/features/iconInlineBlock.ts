import type { Block } from 'payload'

/**
 * Inline "icon" block usable inside any lexical richText field.
 * Stored inside the rich text JSON (no DB migration needed, same as
 * `buttonInlineBlock`). Inserted via the custom Icons toolbar dropdown
 * (see `features/icons/`) and rendered on the frontend by
 * RichTextRenderer.vue when it encounters an `inlineBlock` node with
 * `blockType === 'icon'`. All icons render at a uniform 1em size and
 * inherit the surrounding text colour.
 */
export const iconInlineBlock: Block = {
  slug: 'icon',
  labels: {
    singular: 'Icon',
    plural: 'Icons',
  },
  fields: [
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'at',
      options: [
        { label: 'At sign (@)', value: 'at' },
        { label: 'Telephone', value: 'phone' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' },
      ],
      admin: { description: 'Which icon to display' },
    },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Optional URL the icon links to' },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open in new tab',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.link),
      },
    },
  ],
}
