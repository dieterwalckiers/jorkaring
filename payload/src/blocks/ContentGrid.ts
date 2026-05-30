import type { Block } from 'payload'
import { createColorField } from '../fields/colorField'

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
          name: 'elementType',
          type: 'select',
          defaultValue: 'richText',
          options: [
            { label: 'Rich text', value: 'richText' },
            { label: 'Stat counter', value: 'counter' },
          ],
          admin: {
            description:
              'What this cell holds. A stat counter shows a large number that counts up from zero when it scrolls into view.',
          },
        },
        {
          name: 'content',
          type: 'richText',
          admin: {
            description: 'Cell content',
            condition: (_, siblingData) => siblingData?.elementType !== 'counter',
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
            condition: (_, siblingData) => siblingData?.elementType !== 'counter',
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
            condition: (_, siblingData) =>
              siblingData?.elementType !== 'counter' && siblingData?.collapsedByDefault === true,
          },
        },
        {
          name: 'counterValue',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'The target number to count up to.',
            condition: (_, siblingData) =>
              siblingData?.elementType === 'counter' && siblingData?.counterInfinite !== true,
          },
        },
        {
          name: 'counterInfinite',
          type: 'checkbox',
          label: 'Infinite',
          defaultValue: false,
          admin: {
            description:
              'Show the infinity symbol (∞) instead of a number. The counter still animates up, then cross-fades to ∞.',
            condition: (_, siblingData) => siblingData?.elementType === 'counter',
          },
        },
        {
          name: 'counterShowPlus',
          type: 'checkbox',
          label: 'Show "+" suffix',
          defaultValue: false,
          admin: {
            description: 'Append a "+" after the number (e.g. "8+").',
            condition: (_, siblingData) =>
              siblingData?.elementType === 'counter' && siblingData?.counterInfinite !== true,
          },
        },
        {
          name: 'counterLabel',
          type: 'text',
          admin: {
            description: 'Caption shown beneath the number (e.g. "Jaren ervaring").',
            condition: (_, siblingData) => siblingData?.elementType === 'counter',
          },
        },
        createColorField({
          name: 'counterColor',
          label: 'Number color',
          defaultValue: 'theme1',
          description: 'Color of the number (the label stays in the muted body color).',
          condition: (_, siblingData) => siblingData?.elementType === 'counter',
        }),
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
    createColorField({
      name: 'backgroundColor',
      label: 'Background Color',
      defaultValue: 'transparent',
      description: 'Background color for the whole grid (adds padding around the cells).',
    }),
    {
      name: 'fullBleed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Background color stretches horizontally across the full page width (cells stay within the container).',
        condition: (_, siblingData) =>
          Boolean(siblingData?.backgroundColor) && siblingData?.backgroundColor !== 'transparent',
      },
    },
    {
      name: 'cellDividers',
      type: 'checkbox',
      label: 'Dividers between cells',
      defaultValue: false,
      admin: {
        description:
          'Draw subtle hairline rules between cells, like the columns of a magazine spread.',
      },
    },
    createColorField({
      name: 'cellDividerColor',
      label: 'Divider color',
      defaultValue: 'theme1',
      description: 'Color of the dividing lines (rendered at low opacity).',
      condition: (_, siblingData) => siblingData?.cellDividers === true,
    }),
  ],
}
