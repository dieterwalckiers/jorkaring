import type { Block } from 'payload'

export const HeroSubheadline: Block = {
  slug: 'heroSubheadline',
  labels: {
    singular: 'Subheadline',
    plural: 'Subheadlines',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Supporting text below the headline',
      },
    },
  ],
}
