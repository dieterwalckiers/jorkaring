import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: {
    singular: 'Contact Form',
    plural: 'Contact Forms',
  },
  fields: [
    {
      name: 'tallyFormId',
      type: 'text',
      required: true,
      defaultValue: '81x1GP',
      admin: {
        description: 'Tally form ID (from the Tally embed URL, e.g. "81x1GP")',
      },
    },
  ],
}
