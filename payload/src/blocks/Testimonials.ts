import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add testimonials to display in the carousel',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The testimonial quote text',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Name of the person giving the testimonial (e.g. "John Doe (Company)")',
          },
        },
      ],
    },
  ],
}
