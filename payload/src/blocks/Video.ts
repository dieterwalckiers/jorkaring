import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'vimeoId',
      type: 'text',
      required: true,
      admin: {
        description: 'Vimeo video ID (e.g., "123456789" from vimeo.com/123456789)',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Poster image shown before the video plays',
      },
    },
    {
      name: 'ctaCaption',
      type: 'text',
      admin: {
        description: 'Call-to-action button text that appears over the poster image',
      },
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Half', value: 'half' },
        { label: '2/3', value: '2/3' },
        { label: '3/4', value: '3/4' },
        { label: 'Full', value: 'full' },
      ],
      admin: {
        description: 'Width of the video player',
      },
    },
  ],
}
