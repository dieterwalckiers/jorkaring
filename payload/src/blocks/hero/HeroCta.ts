import type { Block } from 'payload'

export const HeroCta: Block = {
  slug: 'heroCta',
  labels: {
    singular: 'CTA Buttons',
    plural: 'CTA Buttons',
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      maxRows: 4,
      admin: {
        description: 'Call-to-action buttons (max 4)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'URL or path (e.g., /contact or https://example.com)',
          },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'solid',
          options: [
            { label: 'Solid (Primary)', value: 'solid' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
  ],
}
