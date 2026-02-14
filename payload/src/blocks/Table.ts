import type { Block } from 'payload'

export const Table: Block = {
  slug: 'table',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'csvData',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Enter table data in CSV format. Each line is a row, columns separated by commas.',
        rows: 6,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showBorders',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show borders between cells',
            width: '33%',
          },
        },
        {
          name: 'firstRowAreTitles',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'First row are column titles (styled differently)',
            width: '33%',
          },
        },
        {
          name: 'lastRowAreButtons',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Last row cells are clickable buttons',
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'buttonLinksCsv',
      type: 'text',
      admin: {
        description: 'Button links in CSV format (one link per column, e.g., "/page1,/page2,/page3")',
        condition: (data, siblingData) => siblingData?.lastRowAreButtons,
      },
    },
  ],
}
