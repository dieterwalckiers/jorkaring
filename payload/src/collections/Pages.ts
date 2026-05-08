import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../hooks/triggerDeploy'
import { pageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'showInMenu', 'menuOrder', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ collection, doc }) => {
        // Only trigger deploy when content is published, not on draft saves
        if (doc._status === 'published') {
          await triggerDeploy(collection.slug)
        }
      },
    ],
    afterDelete: [
      async ({ collection }) => {
        await triggerDeploy(collection.slug)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the page (e.g., "about-us")',
        components: {
          Field: '@/fields/SlugField#SlugField',
        },
      },
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Show this page in the main navigation menu',
      },
    },
    {
      name: 'menuOrder',
      type: 'number',
      admin: {
        description: 'Order in the menu (lower numbers appear first)',
        condition: (data) => data?.showInMenu,
      },
    },
    {
      name: 'showInToolbar',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Show this page as a call-to-action in the header toolbar (above main menu)',
      },
    },
    {
      name: 'toolbarLabel',
      type: 'text',
      admin: {
        description: 'Custom label for toolbar (uses page title if blank)',
        condition: (data) => data?.showInToolbar,
      },
    },
    {
      name: 'toolbarOrder',
      type: 'number',
      admin: {
        description: 'Order in the toolbar (lower numbers appear first)',
        condition: (data) => data?.showInToolbar,
      },
    },
    {
      name: 'filterMainMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, only the pages selected below will appear in the main menu when viewing this page. If none are selected, no page menu items will be shown (in-page menu titles are always shown).',
      },
    },
    {
      name: 'menuFilter',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      admin: {
        description: 'Select which pages appear in the main menu when viewing this page. Leave empty to hide all page menu items.',
        condition: (data) => data?.filterMainMenu,
      },
      filterOptions: {
        showInMenu: { equals: true },
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: pageBlocks,
      admin: {
        description: 'Add and arrange content blocks for this page',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Search engine optimization settings',
      },
      fields: [
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines (recommended: 150-160 characters)',
          },
        },
      ],
    },
  ],
}
