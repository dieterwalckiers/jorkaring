import type { Block } from 'payload'
import { HeroHeadline, HeroSubheadline, HeroRichText, HeroCta, HeroSpacer } from './hero'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the hero section',
      },
    },
    {
      name: 'focalPointY',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description: 'Vertical focal point in % (0 = top, 50 = center, 100 = bottom)',
        placeholder: '50',
        condition: (_, siblingData) => Boolean(siblingData?.backgroundImage),
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
        description: 'Text alignment within the hero',
      },
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'XL', value: 'xl' },
        { label: 'XXL', value: 'xxl' },
      ],
      admin: {
        description: 'Height of the hero section',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [HeroHeadline, HeroSubheadline, HeroRichText, HeroCta, HeroSpacer],
      admin: {
        description: 'Add and arrange content within the hero',
      },
    },
  ],
}
