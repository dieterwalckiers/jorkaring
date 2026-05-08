import type { Block } from 'payload'

export const ContentGrid: Block = {
  slug: 'contentGrid',
  imageURL: '/blocks/contentgrid.png',
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
        {
          name: 'collapsedByDefault',
          type: 'checkbox',
          label: 'Read more',
          defaultValue: false,
          admin: {
            description:
              'Truncate this cell with a fade-out and a "Lees meer" button that expands the full content.',
          },
        },
        {
          name: 'collapsedLines',
          type: 'select',
          defaultValue: '5',
          options: [
            { label: '5 lines', value: '5' },
            { label: '8 lines', value: '8' },
            { label: '12 lines', value: '12' },
            { label: '16 lines', value: '16' },
            { label: '20 lines', value: '20' },
          ],
          admin: {
            description: 'How many lines to show before fading out.',
            condition: (_, siblingData) => siblingData?.collapsedByDefault === true,
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
    {
      name: 'editorialNumbers',
      type: 'checkbox',
      label: 'Editorial column numbers',
      defaultValue: false,
      admin: {
        description:
          'Show a small 01/02/… index and hairline rule above each cell — reads like a magazine spread. Best on 2–4 column left-aligned grids.',
      },
    },
    {
      name: 'renderAsCards',
      type: 'checkbox',
      label: 'Render cells as cards',
      defaultValue: false,
      admin: {
        description: 'Wrap each cell in a translucent card with padding.',
      },
    },
    {
      name: 'cardBackground',
      type: 'select',
      defaultValue: 'lighten',
      options: [
        { label: 'Lighten (white translucent)', value: 'lighten' },
        { label: 'Darken (black translucent)', value: 'darken' },
      ],
      admin: {
        description: 'Card background tone.',
        condition: (_, siblingData) => siblingData?.renderAsCards === true,
      },
    },
    {
      name: 'cardRoundedCorners',
      type: 'checkbox',
      label: 'Rounded corners',
      defaultValue: false,
      admin: {
        description: 'Apply rounded corners to each card.',
        condition: (_, siblingData) => siblingData?.renderAsCards === true,
      },
    },
    {
      name: 'equalRowHeights',
      type: 'checkbox',
      label: 'Equal row heights',
      defaultValue: false,
      admin: {
        description:
          'Stretch every cell in a row to match the tallest one. Most visible when cells render as cards.',
      },
    },
  ],
}
