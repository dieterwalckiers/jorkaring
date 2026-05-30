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
  BlocksFeature,
} from '@payloadcms/richtext-lexical'
import { triggerDeploy } from '../hooks/triggerDeploy'
import { createColorField } from '../fields/colorField'
import { createHexColorField } from '../fields/hexColorField'
import { buttonInlineBlock } from '../features/buttonInlineBlock'
import { ContactForm, ContentGrid, Hero, NewsletterSignup, RichText, Spacer, SplitTextImage, Table, Testimonials, Video } from '../blocks'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ global, doc }) => {
        // Only trigger deploy when content is published, not on draft saves
        if (doc._status === 'published') {
          await triggerDeploy(global.slug)
        }
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
            createColorField({
              name: 'titleColor',
              label: 'Title Color',
              defaultValue: 'theme1',
              description: 'Color used for the site title in the header when no logo is set',
            }),
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
                {
                  name: 'blockSpacing',
                  type: 'select',
                  label: 'Block Spacing',
                  defaultValue: 'default',
                  options: [
                    { label: 'Tight', value: 'tight' },
                    { label: 'Narrower', value: 'narrower' },
                    { label: 'Default', value: 'default' },
                    { label: 'Wider', value: 'wider' },
                    { label: 'Spacious', value: 'spacious' },
                  ],
                  admin: {
                    description: 'Vertical spacing between content blocks on a page',
                  },
                },

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
          label: 'Toast',
          fields: [
            {
              name: 'toast',
              type: 'group',
              label: false,
              admin: {
                description:
                  'A floating flash message that pops into a corner of the screen. Use for time-bounded notices: announcements, promotions, transient updates.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: false,
                  admin: {
                    description: 'Master switch — turn the toast on or off without losing its configuration.',
                  },
                },
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
                      BlocksFeature({ inlineBlocks: [buttonInlineBlock] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ],
                  }),
                  admin: {
                    description: 'Toast text. Keep it short — one line reads best. You can insert inline buttons via the toolbar.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                createColorField({
                  name: 'backgroundColor',
                  label: 'Background color',
                  defaultValue: 'theme1',
                  description: 'Background color of the toast.',
                  condition: (data) => Boolean((data as { toast?: { enabled?: boolean } })?.toast?.enabled),
                }),
                {
                  name: 'position',
                  type: 'select',
                  label: 'Position',
                  defaultValue: 'bottomRight',
                  options: [
                    { label: 'Bottom right', value: 'bottomRight' },
                    { label: 'Bottom left', value: 'bottomLeft' },
                    { label: 'Top right', value: 'topRight' },
                    { label: 'Top left', value: 'topLeft' },
                  ],
                  admin: {
                    description: 'Where the toast appears on screen.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'displayDelaySeconds',
                  type: 'number',
                  label: 'Show after (seconds)',
                  defaultValue: 0,
                  min: 0,
                  max: 600,
                  admin: {
                    description: 'How long to wait after page load before the toast appears. Set to 0 to show immediately.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'dismissible',
                  type: 'checkbox',
                  label: 'Dismissible',
                  defaultValue: true,
                  admin: {
                    description: 'Show a close button so visitors can dismiss the toast.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'autoDismissSeconds',
                  type: 'number',
                  label: 'Auto-dismiss after (seconds)',
                  defaultValue: 0,
                  min: 0,
                  max: 600,
                  admin: {
                    description: 'Automatically hide the toast after this many seconds. Set to 0 to keep it open until dismissed.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'rememberDismissal',
                  type: 'checkbox',
                  label: 'Remember dismissal',
                  defaultValue: true,
                  admin: {
                    description: 'When checked, visitors who dismiss the toast will not see it again (stored in their browser).',
                    condition: (data) => data?.toast?.enabled && data?.toast?.dismissible,
                  },
                },
                {
                  name: 'dismissalKey',
                  type: 'text',
                  label: 'Dismissal key',
                  defaultValue: 'toast-1',
                  admin: {
                    description: 'A short identifier for this toast. Change it (e.g. "toast-2") to re-show the toast to visitors who already dismissed the previous one.',
                    condition: (data) => data?.toast?.enabled && data?.toast?.dismissible && data?.toast?.rememberDismissal,
                  },
                },
                {
                  name: 'pageVisibility',
                  type: 'radio',
                  label: 'Show on',
                  defaultValue: 'all',
                  options: [
                    { label: 'All pages', value: 'all' },
                    { label: 'Specific pages', value: 'specific' },
                  ],
                  admin: {
                    description: 'Choose whether the toast is shown site-wide or only on selected pages.',
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'pages',
                  type: 'relationship',
                  relationTo: 'pages',
                  hasMany: true,
                  admin: {
                    description: 'Pick the pages where the toast should appear.',
                    condition: (data) => data?.toast?.enabled && data?.toast?.pageVisibility === 'specific',
                  },
                },
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Start date',
                  admin: {
                    description: 'Optional. The toast will only appear from this date onward. Leave empty to start immediately.',
                    date: { pickerAppearance: 'dayAndTime' },
                    condition: (data) => data?.toast?.enabled,
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'End date',
                  admin: {
                    description: 'Optional. The toast will stop appearing after this date. Leave empty to keep it active indefinitely.',
                    date: { pickerAppearance: 'dayAndTime' },
                    condition: (data) => data?.toast?.enabled,
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
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Full-screen background image for the splash page. Use a high-resolution image for best results.',
                    condition: (data) => data?.splashPage?.enabled,
                  },
                },
                {
                  name: 'backgroundOverlay',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Darken', value: 'darken' },
                    { label: 'Lighten', value: 'lighten' },
                  ],
                  admin: {
                    description: 'Apply a dark or light overlay on the background image to improve text readability',
                    condition: (data) => data?.splashPage?.enabled && Boolean(data?.splashPage?.backgroundImage),
                  },
                },
                {
                  name: 'backgroundOverlayStrength',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 40,
                  admin: {
                    description: 'Overlay strength in % (0 = transparent, 100 = fully opaque)',
                    placeholder: '40',
                    condition: (data) =>
                      data?.splashPage?.enabled
                      && Boolean(data?.splashPage?.backgroundImage)
                      && data?.splashPage?.backgroundOverlay
                      && data.splashPage.backgroundOverlay !== 'none',
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
          label: 'Colors',
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
                { name: 'theme1Label', type: 'text', defaultValue: 'Theme 1', admin: { hidden: true } },
                { name: 'theme2Label', type: 'text', defaultValue: 'Theme 2', admin: { hidden: true } },
                { name: 'theme3Label', type: 'text', defaultValue: 'Theme 3', admin: { hidden: true } },
                { name: 'theme4Label', type: 'text', defaultValue: 'Theme 4', admin: { hidden: true } },
                { name: 'theme5Label', type: 'text', defaultValue: 'Theme 5', admin: { hidden: true } },
                { name: 'theme6Label', type: 'text', defaultValue: 'Theme 6', admin: { hidden: true } },
                { name: 'theme7Label', type: 'text', defaultValue: 'Theme 7', admin: { hidden: true } },
                { name: 'theme8Label', type: 'text', defaultValue: 'Theme 8', admin: { hidden: true } },
                {
                  type: 'collapsible',
                  label: 'System',
                  admin: {
                    initCollapsed: false,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'mainBg',
                          label: 'Main Background',
                          defaultValue: '#ffffff',
                        }),
                        createHexColorField({
                          name: 'font',
                          label: 'Font Color',
                          defaultValue: '#373031',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'fontAccent',
                          label: 'Font Accent',
                          defaultValue: '#8B5A4A',
                        }),
                        createHexColorField({
                          name: 'headings',
                          label: 'Headings',
                          defaultValue: '#5E6E83',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'buttonFont',
                          label: 'Button Font',
                          defaultValue: '#373031',
                        }),
                        createHexColorField({
                          name: 'buttonBg',
                          label: 'Button Background',
                          defaultValue: 'transparent',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'buttonFontHover',
                          label: 'Button Font Hover',
                          defaultValue: '#ffffff',
                        }),
                        createHexColorField({
                          name: 'buttonBgHover',
                          label: 'Button Background Hover',
                          defaultValue: '#EA8928',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'tableBorders',
                          label: 'Table Borders',
                          defaultValue: '#EA8928',
                        }),
                        createHexColorField({
                          name: 'bulletPoints',
                          label: 'Bullet Points',
                          defaultValue: '#373031',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'stickyMessageTxt',
                          label: 'Sticky Message Text',
                          defaultValue: '#B6C9BB',
                        }),
                        createHexColorField({
                          name: 'stickyMessageBg',
                          label: 'Sticky Message Background',
                          defaultValue: '#5E6E83',
                        }),
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Theme',
                  admin: {
                    initCollapsed: false,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'theme1',
                          label: 'Theme 1',
                          defaultValue: '#5E6E83',
                          labelFieldName: 'theme1Label',
                        }),
                        createHexColorField({
                          name: 'theme2',
                          label: 'Theme 2',
                          defaultValue: '#5E6E83',
                          labelFieldName: 'theme2Label',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'theme3',
                          label: 'Theme 3',
                          defaultValue: '#B6C9BB',
                          labelFieldName: 'theme3Label',
                        }),
                        createHexColorField({
                          name: 'theme4',
                          label: 'Theme 4',
                          defaultValue: '#BFEDC1',
                          labelFieldName: 'theme4Label',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'theme5',
                          label: 'Theme 5',
                          defaultValue: '#EA8928',
                          labelFieldName: 'theme5Label',
                        }),
                        createHexColorField({
                          name: 'theme6',
                          label: 'Theme 6',
                          defaultValue: '#656565',
                          labelFieldName: 'theme6Label',
                        }),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        createHexColorField({
                          name: 'theme7',
                          label: 'Theme 7',
                          defaultValue: '#2C3E50',
                          labelFieldName: 'theme7Label',
                        }),
                        createHexColorField({
                          name: 'theme8',
                          label: 'Theme 8',
                          defaultValue: '#E74C3C',
                          labelFieldName: 'theme8Label',
                        }),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
