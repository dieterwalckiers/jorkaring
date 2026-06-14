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
    {
      // Optional text column shown alongside the embed. Inherits the default
      // lexical editor (same config as SplitTextImage's `text`), so inline
      // icon blocks, autolinks and font-size render identically.
      name: 'text',
      type: 'richText',
      admin: {
        description: 'Optional text column shown next to the embed (use headings for the title). Leave empty for an embed-only, full-width layout.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'textPosition',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Side the text column sits on (the embed takes the other side)',
            width: '50%',
          },
        },
        {
          name: 'textPercentage',
          type: 'number',
          defaultValue: 45,
          min: 20,
          max: 80,
          admin: {
            description: 'Width of the text column as a percentage (the embed takes the rest)',
            width: '50%',
          },
        },
      ],
    },
  ],
}
