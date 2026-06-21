import type { Block } from 'payload'

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  imageURL: '/blocks/logomarquee.png',
  labels: {
    singular: 'Logo Marquee',
    plural: 'Logo Marquees',
  },
  fields: [
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 3,
      admin: {
        description: 'Add logo images to scroll in the marquee (minimum 3)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Logo image (transparent PNG or SVG recommended)',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for the logo (overrides media alt text)',
          },
        },
      ],
    },
    {
      name: 'logoSize',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        description: 'Uniform height of the logos',
      },
    },
    {
      name: 'speed',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Slow', value: 'slow' },
        { label: 'Medium', value: 'medium' },
        { label: 'Fast', value: 'fast' },
      ],
      admin: {
        description: 'Scrolling speed of the marquee',
      },
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Pause the marquee when the user hovers over it',
      },
    },
    {
      name: 'colorizeOnHover',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show logos in muted grayscale, revealing full color on hover. Disable to show logos in full color always.',
      },
    },
  ],
}
