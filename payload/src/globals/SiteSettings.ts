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
import { createHexColorField } from '../fields/hexColorField'
import { ContactForm, ContentGrid, Hero, NewsletterSignup, RichText, Spacer, SplitTextImage, Table, Testimonials, Video } from '../blocks'

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
      type: 'tabs',
      tabs: [
        {
          label: 'General',
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
                  name: 'googleFontBody',
                  type: 'text',
                  label: 'Body Text Font',
                  admin: {
                    description: 'Google Font for body text (e.g., "Roboto", "Open Sans"). Leave empty for system default.',
                  },
                },
                {
                  name: 'googleFontH1',
                  type: 'text',
                  label: 'Main Header (H1) Font',
                  admin: {
                    description: 'Google Font for H1 headings (e.g., "Playfair Display", "Montserrat"). Leave empty to use body font.',
                  },
                },
                {
                  name: 'googleFontHeadings',
                  type: 'text',
                  label: 'Other Headers (H2-H6) Font',
                  admin: {
                    description: 'Google Font for H2-H6 headings (e.g., "Raleway", "Oswald"). Leave empty to use body font.',
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
        },
        {
          label: 'Splash Page',
          fields: [
            {
              name: 'splashPage',
              type: 'group',
              label: false,
              admin: {
                description: 'Configure a landing/entrance page that appears when visitors hit the root URL. It replaces the normal home page and hides the header/footer.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Splash Page',
                  defaultValue: false,
                  admin: {
                    description: 'When enabled, visitors will see the splash page instead of the normal home page',
                  },
                },
                {
                  name: 'centered',
                  type: 'checkbox',
                  label: 'Render Centered in Full Page',
                  defaultValue: false,
                  admin: {
                    description: 'Centers all content horizontally and vertically in a full-screen (100vw x 100vh) wrapper',
                    condition: (data) => data?.splashPage?.enabled,
                  },
                },
                {
                  name: 'content',
                  type: 'blocks',
                  blocks: [ContactForm, ContentGrid, Hero, NewsletterSignup, RichText, Spacer, { ...SplitTextImage, dbName: 'sti' }, Table, Testimonials, Video],
                  admin: {
                    description: 'Add and arrange content blocks for the splash page',
                    condition: (data) => data?.splashPage?.enabled,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Theme Colors',
          fields: [
            {
              name: 'themeColors',
              type: 'group',
              label: false,
              admin: {
                description: 'Customize your brand colors. These override the default theme colors across the entire site. Use the "Name" fields to give each color a meaningful label (e.g. "Brand Red").',
              },
              fields: [
                // Hidden label fields — stored in DB, edited inline via the hex color picker
                { name: 'color1Label', type: 'text', defaultValue: 'Color 1', admin: { hidden: true } },
                { name: 'color2Label', type: 'text', defaultValue: 'Color 2', admin: { hidden: true } },
                { name: 'color3Label', type: 'text', defaultValue: 'Color 3', admin: { hidden: true } },
                { name: 'color4Label', type: 'text', defaultValue: 'Color 4', admin: { hidden: true } },
                { name: 'color5Label', type: 'text', defaultValue: 'Color 5', admin: { hidden: true } },
                { name: 'color6Label', type: 'text', defaultValue: 'Color 6', admin: { hidden: true } },
                { name: 'fontLabel', type: 'text', defaultValue: 'Font Color', admin: { hidden: true } },
                { name: 'fontBrand1Label', type: 'text', defaultValue: 'Font Brand 1', admin: { hidden: true } },
                { name: 'fontBrand2Label', type: 'text', defaultValue: 'Font Brand 2', admin: { hidden: true } },
                { name: 'fontAccentLabel', type: 'text', defaultValue: 'Font Accent', admin: { hidden: true } },
                { name: 'fontHighlightLabel', type: 'text', defaultValue: 'Font Highlight', admin: { hidden: true } },
                { name: 'accentLabel', type: 'text', defaultValue: 'Accent', admin: { hidden: true } },
                { name: 'highlightLabel', type: 'text', defaultValue: 'Highlight', admin: { hidden: true } },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'color1',
                      label: 'Color 1',
                      defaultValue: '#5E6E83',
                      labelFieldName: 'color1Label',
                    }),
                    createHexColorField({
                      name: 'color2',
                      label: 'Color 2',
                      defaultValue: '#5E6E83',
                      labelFieldName: 'color2Label',
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'color3',
                      label: 'Color 3',
                      defaultValue: '#B6C9BB',
                      labelFieldName: 'color3Label',
                    }),
                    createHexColorField({
                      name: 'color4',
                      label: 'Color 4',
                      defaultValue: '#BFEDC1',
                      labelFieldName: 'color4Label',
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'color5',
                      label: 'Color 5',
                      defaultValue: '#EA8928',
                      labelFieldName: 'color5Label',
                    }),
                    createHexColorField({
                      name: 'color6',
                      label: 'Color 6',
                      defaultValue: '#656565',
                      labelFieldName: 'color6Label',
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'font',
                      label: 'Font Color',
                      defaultValue: '#373031',
                      labelFieldName: 'fontLabel',
                    }),
                    createHexColorField({
                      name: 'fontBrand1',
                      label: 'Font Brand 1',
                      defaultValue: '#6b081d',
                      labelFieldName: 'fontBrand1Label',
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'fontBrand2',
                      label: 'Font Brand 2',
                      defaultValue: '#f15b4e',
                      labelFieldName: 'fontBrand2Label',
                    }),
                    createHexColorField({
                      name: 'fontAccent',
                      label: 'Font Accent',
                      defaultValue: '#8B5A4A',
                      labelFieldName: 'fontAccentLabel',
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    createHexColorField({
                      name: 'fontHighlight',
                      label: 'Font Highlight',
                      defaultValue: '#f15b4e',
                      labelFieldName: 'fontHighlightLabel',
                    }),
                    createHexColorField({
                      name: 'accent',
                      label: 'Accent',
                      defaultValue: '#8B5A4A',
                      labelFieldName: 'accentLabel',
                    }),
                  ],
                },
                createHexColorField({
                  name: 'highlight',
                  label: 'Highlight',
                  defaultValue: '#f15b4e',
                  labelFieldName: 'highlightLabel',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
