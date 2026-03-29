import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  imageURL: '/blocks/spacer.png',
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
        { label: 'XXXS', value: 'xxxs' },
        { label: 'XXS', value: 'xxs' },
        { label: 'XS', value: 'xs' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'XL', value: 'xl' },
        { label: 'XXL', value: 'xxl' },
        { label: 'XXXL', value: 'xxxl' },
      ],
      admin: {
        description: 'The height of the spacer',
      },
    },
  ],
}
