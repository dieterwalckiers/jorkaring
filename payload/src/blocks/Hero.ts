import type { Block } from 'payload'
import { HeroHeadline, HeroSubheadline, HeroRichText, HeroCta, HeroRotatingHeadline, HeroSpacer } from './hero'

export const Hero: Block = {
  slug: 'hero',
  imageURL: '/blocks/hero.png',
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
      name: 'overlay',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Darken', value: 'darken' },
        { label: 'Lighten', value: 'lighten' },
      ],
      admin: {
        description: 'Apply a dark or light overlay on the background image to improve text readability',
        condition: (_, siblingData) => Boolean(siblingData?.backgroundImage),
      },
    },
    {
      name: 'overlayStrength',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 40,
      admin: {
        description: 'Overlay strength in % (0 = transparent, 100 = fully opaque)',
        placeholder: '40',
        condition: (_, siblingData) =>
          Boolean(siblingData?.backgroundImage) && siblingData?.overlay && siblingData.overlay !== 'none',
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
        { label: 'XXXL', value: 'xxxl' },
      ],
      admin: {
        description: 'Height of the hero section',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [HeroHeadline, HeroSubheadline, HeroRichText, HeroRotatingHeadline, HeroCta, HeroSpacer],
      admin: {
        description: 'Add and arrange content within the hero',
      },
    },
  ],
}
