import type { Block } from 'payload'
import { createColorField } from '../fields/colorField'

/**
 * Inline "button" block usable inside any lexical richText field.
 * The frontend renders this in RichTextRenderer.vue when it encounters
 * an `inlineBlock` node with `blockType === 'button'`.
 */
export const buttonInlineBlock: Block = {
  slug: 'button',
  labels: {
    singular: 'Button',
    plural: 'Buttons',
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      required: true,
      admin: { description: 'Button text' },
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      admin: { description: 'URL the button links to' },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: { description: 'Button alignment' },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open in new tab',
    },
    createColorField({
      name: 'backgroundColor',
      label: 'Background',
      defaultValue: 'transparent',
      description: 'Button background colour',
      width: '50%',
    }),
    createColorField({
      name: 'textColor',
      label: 'Text',
      defaultValue: '#373031',
      description: 'Button text & border colour',
      width: '50%',
    }),
    {
      name: 'backgroundColorHoverLighter',
      type: 'checkbox',
      defaultValue: false,
      label: 'Lighter background on hover',
      admin: {
        description: 'Use a lighter tint of the background colour on hover',
        width: '50%',
      },
    },
    createColorField({
      name: 'backgroundColorHover',
      label: 'Background (hover)',
      defaultValue: '#EA8928',
      description: 'Button background colour on hover',
      width: '50%',
      condition: (_, siblingData) => siblingData?.backgroundColorHoverLighter !== true,
    }),
    {
      name: 'textColorHoverLighter',
      type: 'checkbox',
      defaultValue: false,
      label: 'Lighter text on hover',
      admin: {
        description: 'Use a lighter tint of the text colour on hover',
        width: '50%',
      },
    },
    createColorField({
      name: 'textColorHover',
      label: 'Text (hover)',
      defaultValue: '#ffffff',
      description: 'Button text & border colour on hover',
      width: '50%',
      condition: (_, siblingData) => siblingData?.textColorHoverLighter !== true,
    }),
  ],
}
