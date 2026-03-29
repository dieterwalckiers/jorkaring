import type { Block } from 'payload'
import { createColorField } from '../fields/colorField'

export const RichText: Block = {
  slug: 'richText',
  imageURL: '/blocks/richtext.png',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'width',
      type: 'select',
      label: 'Width',
      defaultValue: 'full',
      options: [
        { label: '1/4', value: '1/4' },
        { label: '1/3', value: '1/3' },
        { label: 'Half', value: 'half' },
        { label: '2/3', value: '2/3' },
        { label: '3/4', value: '3/4' },
        { label: 'Full', value: 'full' },
      ],
    },
    {
      name: 'renderFloating',
      type: 'checkbox',
      label: 'Render floating',
      defaultValue: false,
      admin: {
        description:
          'When enabled, the block will be rendered with absolute positioning inside a relative wrapper.',
      },
    },
    {
      name: 'floatingOffset',
      type: 'text',
      label: 'Floating offset (top)',
      admin: {
        description: 'CSS value for vertical offset, e.g. "20px", "3em", "-10px"',
        condition: (_, siblingData) => siblingData?.renderFloating === true,
      },
    },
    {
      name: 'margin',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        description: 'Vertical margin above and below the block',
      },
    },
    createColorField({
      name: 'backgroundColor',
      label: 'Background Color',
      defaultValue: 'transparent',
      description: 'Background color for this block',
    }),
    {
      name: 'roundedCorners',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Apply rounded corners to the block',
      },
    },
  ],
}
