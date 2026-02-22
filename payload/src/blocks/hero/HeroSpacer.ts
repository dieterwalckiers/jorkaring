import type { Block } from 'payload'

export const HeroSpacer: Block = {
  slug: 'heroSpacer',
  labels: {
    singular: 'Spacer',
    plural: 'Spacers',
  },
  fields: [
    {
      name: 'height',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'XL', value: 'xl' },
      ],
      admin: {
        description: 'Height of the spacer within the hero',
      },
    },
  ],
}
