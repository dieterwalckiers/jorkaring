import type { Block } from 'payload'

export const HeroRotatingHeadline: Block = {
  slug: 'heroRotatingHeadline',
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
      name: 'intervalMs',
      type: 'number',
      defaultValue: 2400,
      min: 800,
      admin: {
        description: 'How long each word stays on screen, in milliseconds',
        step: 100,
      },
    },
    {
      name: 'fontSize',
      type: 'select',
      required: true,
      defaultValue: 'h1',
      options: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' },
      ],
      admin: {
        description: 'Heading level — matches the WYSIWYG heading sizes.',
      },
    },
  ],
}
