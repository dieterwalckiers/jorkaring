import type { Block } from 'payload'

export const ContentGrid: Block = {
  slug: 'contentGrid',
  labels: {
    singular: 'Content Grid',
    plural: 'Content Grids',
  },
  fields: [
    {
      name: 'cells',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add content cells to the grid',
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          required: true,
          admin: {
            description: 'Cell content',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numberOfColumns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
            { label: '5 Columns', value: '5' },
          ],
          admin: {
            description: 'Number of columns on desktop',
            width: '50%',
          },
        },
        {
          name: 'horizontalAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal text alignment within cells',
            width: '50%',
          },
        },
        {
          name: 'verticalAlignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'Vertical alignment of cells',
            width: '50%',
          },
        },
      ],
    },
  ],
}
