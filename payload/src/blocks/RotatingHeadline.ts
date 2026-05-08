import type { Block } from 'payload'

export const RotatingHeadline: Block = {
  slug: 'rotatingHeadline',
  labels: {
    singular: 'Rotating Headline',
    plural: 'Rotating Headlines',
  },
  fields: [
    {
      name: 'prefix',
      type: 'text',
      admin: {
        description: 'Static text shown before the rotating words (e.g. "We help you")',
      },
    },
    {
      name: 'rotatingWords',
      type: 'array',
      required: true,
      minRows: 2,
      labels: {
        singular: 'Word',
        plural: 'Words',
      },
      admin: {
        description: 'Words that cycle one after the other (minimum 2)',
      },
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'suffix',
      type: 'text',
      admin: {
        description: 'Optional static text shown after the rotating words',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Text alignment',
      },
    },
    {
      name: 'intervalMs',
      type: 'number',
      defaultValue: 2400,
      min: 800,
      admin: {
        description: 'How long each word stays on screen, in milliseconds',
        step: 100,
      },
    },
  ],
}
