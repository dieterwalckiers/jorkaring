import type { Block } from 'payload'

export const HeroRichText: Block = {
  slug: 'heroRichText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Left (50%)', value: 'left' },
        { label: 'Right (50%)', value: 'right' },
      ],
      admin: {
        description: 'Content width and alignment within the hero',
      },
    },
  ],
}
