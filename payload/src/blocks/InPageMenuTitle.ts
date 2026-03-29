import type { Block } from 'payload'

export const InPageMenuTitle: Block = {
  slug: 'inPageMenuTitle',
  imageURL: '/blocks/inpagemenutitle.png',
  labels: {
    singular: 'In-page Menu Title',
    plural: 'In-page Menu Titles',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'This title will appear as a menu item in the main navigation, scrolling to this position on click',
      },
    },
  ],
}
