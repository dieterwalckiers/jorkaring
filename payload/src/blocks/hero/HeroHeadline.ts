import type { Block } from 'payload'

export const HeroHeadline: Block = {
  slug: 'heroHeadline',
  labels: {
    singular: 'Headline',
    plural: 'Headlines',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: {
        description: 'The main headline text',
      },
    },
  ],
}
