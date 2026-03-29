import type { Block } from 'payload'

export const CalendlyEmbed: Block = {
  slug: 'calendlyEmbed',
  imageURL: '/blocks/calendly.png',
  labels: {
    singular: 'Calendly Embed',
    plural: 'Calendly Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Calendly URL (e.g. "https://calendly.com/<username>/<event>?hide_event_type_details=1&hide_gdpr_banner=1")',
        placeholder: 'https://calendly.com/<username>/<event>?...',
      },
    },
    {
      name: 'style',
      type: 'text',
      defaultValue: 'min-width:320px;height:700px;',
      admin: {
        description: 'Inline CSS style for the Calendly widget container',
      },
    },
  ],
}
