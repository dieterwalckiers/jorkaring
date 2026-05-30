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
      async ({ collection, doc, context }) => {
        // Only trigger deploy when content is published, not on draft saves.
        // `skipDeploy` lets data migrations rewrite docs without firing deploys.
        if (doc._status === 'published' && !context?.skipDeploy) {
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
      name: 'menuLabel',
      type: 'text',
      admin: {
        description: 'Custom label for the main menu link (uses page title if blank)',
        condition: (data) => data?.showInMenu,
      },
    },
    {
      name: 'menuItemStyle',
      type: 'textarea',
      admin: {
        description: 'Optional inline CSS rules applied to this menu item (e.g. "color: #fff; background-color: #ccc;"). Plain CSS declarations only — no selectors or classes.',
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
      name: 'overrideMainMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Override the main menu for this page. When enabled, only the menu items configured below are shown (in this order), instead of the default menu. If none are added, no page menu items appear.',
      },
    },
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu items',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: {
        description: 'The main menu links shown on this page. Drag to reorder — items appear in this order. Each link can point to any page and use its own label.',
        condition: (data) => data?.overrideMainMenu,
        components: {
          RowLabel: '@/fields/MenuItemRowLabel#MenuItemRowLabel',
        },
      },
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            description: 'The page this menu link points to.',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: "Custom label for this link (uses the page's menu label or title if blank).",
          },
        },
        {
          name: 'anchor',
          type: 'text',
          admin: {
            description:
              'Optional anchor on the target page to jump to — the id of an Anchor block there (e.g. "about"). Leave blank to link to the top of the page.',
          },
        },
      ],
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
