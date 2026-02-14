import type { GlobalConfig } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  ParagraphFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { triggerDeploy } from '../hooks/triggerDeploy'
import { createColorField } from '../fields/colorField'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ global }) => {
        await triggerDeploy(global.slug)
      },
    ],
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      defaultValue: 'My Site',
      admin: {
        description: 'The name of your website, displayed in the header when no logo is set',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site logo image. If set, this will be displayed in the header instead of the site title',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Favicon for the site. Recommended size: 32x32 or 64x64 pixels. Supported formats: ICO, PNG, SVG',
      },
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Styling',
      admin: {
        description: 'Visual styling options for your website',
      },
      fields: [
        {
          name: 'containerWidth',
          type: 'select',
          label: 'Container Width',
          defaultValue: 'default',
          options: [
            { label: 'Narrower (1200px)', value: 'narrower' },
            { label: 'Default (1536px)', value: 'default' },
            { label: 'Wider (1843px)', value: 'wider' },
          ],
          admin: {
            description: 'Maximum width of the main content container',
          },
        },
        {
          name: 'headerMenuAlignment',
          type: 'select',
          label: 'Header Menu Alignment',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of the navigation menu in the header',
          },
        },
        {
          name: 'headerHeight',
          type: 'select',
          label: 'Header Height',
          defaultValue: 'medium',
          options: [
            { label: 'Small (58px)', value: 'small' },
            { label: 'Medium (77px)', value: 'medium' },
            { label: 'Large (96px)', value: 'large' },
            { label: 'Extra Large (115px)', value: 'xl' },
            { label: '2X Large (154px)', value: '2xl' },
          ],
          admin: {
            description: 'Height of the site header',
          },
        },
        {
          name: 'headerBorder',
          type: 'checkbox',
          label: 'Header Border',
          defaultValue: true,
          admin: {
            description: 'Show a bottom border on the header',
          },
        },
        {
          name: 'logoSize',
          type: 'select',
          label: 'Logo Size',
          defaultValue: 'medium',
          options: [
            { label: 'Small (173px)', value: 'small' },
            { label: 'Medium (230px)', value: 'medium' },
            { label: 'Large (288px)', value: 'large' },
            { label: 'Extra Large (346px)', value: 'xl' },
          ],
          admin: {
            description: 'Width of the logo in the header. Height adjusts automatically to maintain aspect ratio.',
          },
        },
        createColorField({
          name: 'headerBackgroundColor',
          label: 'Header Background Color',
          description: 'Background color for the header',
        }),
        createColorField({
          name: 'backgroundColor',
          label: 'Background Color',
          description: 'Background color for the website',
        }),
        {
          name: 'googleFont',
          type: 'text',
          label: 'Google Font',
          admin: {
            description: 'Google Font name to use for all text (e.g., "Roboto", "Open Sans", "Lato"). Leave empty for system default.',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      admin: {
        description: 'Footer configuration options',
      },
      fields: [
        {
          name: 'links',
          type: 'array',
          label: 'Footer Links',
          admin: {
            description: 'Links displayed in the bottom right of the footer',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Display text for the link',
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                description: 'URL the link points to (can be internal like /about or external like https://example.com)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'headContent',
      type: 'group',
      label: 'Head Content',
      admin: {
        description: 'Custom HTML content to inject into the <head> element',
      },
      fields: [
        {
          name: 'leading',
          type: 'code',
          label: 'Leading Head Content',
          admin: {
            language: 'html',
            description:
              'HTML content inserted at the beginning of <head>. Use for meta tags, early scripts, or preload hints.',
          },
        },
        {
          name: 'tailing',
          type: 'code',
          label: 'Tailing Head Content',
          admin: {
            language: 'html',
            description:
              'HTML content inserted at the end of <head>. Use for analytics scripts, tracking pixels, or custom styles.',
          },
        },
      ],
    },
    {
      name: 'cookieConsent',
      type: 'group',
      label: 'Cookie Consent',
      admin: {
        description:
          'A cookie consent banner displayed at the bottom of the screen. Users can accept or reject cookies.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
          admin: {
            description: 'Toggle the cookie consent banner on or off',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          admin: {
            description:
              'The banner text (e.g. "We use cookies to improve your experience.")',
          },
        },
        {
          name: 'acceptLabel',
          type: 'text',
          label: 'Accept Button Label',
          defaultValue: 'Accept',
          admin: {
            description: 'Text for the accept button',
          },
        },
        {
          name: 'policyUrl',
          type: 'text',
          label: 'Policy Page URL',
          defaultValue: '/cookie-policy',
          admin: {
            description: 'Link to the cookie policy page',
          },
        },
        {
          name: 'policyLinkText',
          type: 'text',
          label: 'Policy Link Text',
          defaultValue: 'Read more',
          admin: {
            description: 'Anchor text for the policy page link',
          },
        },
      ],
    },
    {
      name: 'stickyMessage',
      type: 'group',
      label: 'Sticky Message',
      admin: {
        description:
          'A floating message pinned to the bottom-right of the screen. Leave content empty to hide it.',
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
          editor: lexicalEditor({
            features: () => [
              ParagraphFeature(),
              BoldFeature(),
              ItalicFeature(),
              UnderlineFeature(),
              StrikethroughFeature(),
              LinkFeature(),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          admin: {
            description:
              'Message content. Only basic formatting (bold, italic, underline, strikethrough) and links are available.',
          },
        },
        {
          name: 'closeable',
          type: 'checkbox',
          label: 'Closeable',
          defaultValue: true,
          admin: {
            description:
              'Whether users can dismiss the message. If unchecked, the message is always visible.',
          },
        },
      ],
    },
  ],
}
