import type { Block } from 'payload'
import { createColorField } from '../fields/colorField'

export const SplitTextImage: Block = {
  slug: 'splitTextImage',
  imageURL: '/blocks/splittextimage.png',
  labels: {
    singular: 'Split Text + Media',
    plural: 'Split Text + Media',
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      admin: {
        description: 'Title and description text (use headings for the title)',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      admin: {
        description: 'Call-to-action buttons',
      },
      fields: [
        {
          name: 'caption',
          type: 'text',
          required: true,
          admin: {
            description: 'Button text',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: {
            description: 'URL or path (e.g., /contact or https://example.com)',
          },
        },
      ],
    },
    {
      name: 'mediaType',
      type: 'radio',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Choose between image or video for the visual element',
      },
    },
    // Image fields (shown when mediaType is 'image')
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The image to display',
        condition: (_, siblingData) => siblingData?.mediaType !== 'video',
      },
    },
    {
      type: 'row',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType !== 'video',
      },
      fields: [
        {
          name: 'focalPointX',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
          admin: {
            description: 'Horizontal focal point in % (0 = left, 50 = center, 100 = right)',
            placeholder: '50',
            width: '50%',
          },
        },
        {
          name: 'focalPointY',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
          admin: {
            description: 'Vertical focal point in % (0 = top, 50 = center, 100 = bottom)',
            placeholder: '50',
            width: '50%',
          },
        },
      ],
    },
    // Video fields (shown when mediaType is 'video')
    {
      name: 'vimeoId',
      type: 'text',
      admin: {
        description: 'Vimeo video ID (e.g., "123456789" from vimeo.com/123456789)',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'videoPoster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Poster image shown before the video plays',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'videoCtaCaption',
      type: 'text',
      admin: {
        description: 'Call-to-action text displayed over the video poster',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          label: 'Media Position',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Position of the media relative to the text',
            width: '50%',
          },
        },
        {
          name: 'imagePercentage',
          label: 'Media Width (%)',
          type: 'number',
          defaultValue: 45,
          min: 20,
          max: 80,
          admin: {
            description: 'Width percentage of the media section (20-80%)',
            width: '50%',
          },
        },
      ],
    },
    // Image sizing options (only shown when mediaType is 'image')
    {
      name: 'imageSizingMode',
      type: 'radio',
      defaultValue: 'ratio',
      options: [
        { label: 'Ratio-based size', value: 'ratio' },
        { label: 'Natural size', value: 'natural' },
      ],
      admin: {
        description: 'How to size the image: fixed aspect ratio or natural dimensions',
        layout: 'horizontal',
        condition: (_, siblingData) => siblingData?.mediaType !== 'video',
      },
    },
    {
      type: 'row',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.mediaType !== 'video' && siblingData?.imageSizingMode !== 'natural',
      },
      fields: [
        {
          name: 'imageRatio',
          type: 'select',
          defaultValue: '3/2',
          options: [
            { label: '2:3 (Portrait)', value: '2/3' },
            { label: '3:4 (Portrait)', value: '3/4' },
            { label: '4:5 (Portrait)', value: '4/5' },
            { label: '5:6 (Portrait)', value: '5/6' },
            { label: '9:10 (Portrait)', value: '9/10' },
            { label: '1:1 (Square)', value: '1/1' },
            { label: '10:9 (Landscape)', value: '10/9' },
            { label: '6:5 (Landscape)', value: '6/5' },
            { label: '5:4 (Landscape)', value: '5/4' },
            { label: '4:3 (Landscape)', value: '4/3' },
            { label: '3:2 (Landscape)', value: '3/2' },
          ],
          admin: {
            description: 'Aspect ratio of the image (width/height)',
            width: '50%',
          },
        },
        {
          name: 'imageVerticalMargin',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          admin: {
            description: 'Vertical margin above and below the image',
            width: '50%',
          },
        },
        {
          name: 'imageHorizontalMargin',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          admin: {
            description: 'Horizontal margin on left and right of the image',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'imageSize',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Tiny Icon (32px)', value: 'tiny-icon' },
        { label: 'Small Icon (48px)', value: 'small-icon' },
        { label: 'Icon (64px)', value: 'icon' },
        { label: 'Large Icon (100px)', value: 'large-icon' },
        { label: 'Tiny (200px)', value: 'tiny' },
        { label: 'Small (300px)', value: 'small' },
        { label: 'Medium (430px)', value: 'medium' },
        { label: 'Large (700px)', value: 'large' },
        { label: 'Extra Large (900px)', value: 'xlarge' },
        { label: 'Huge (1200px)', value: 'huge' },
      ],
      admin: {
        description: 'Maximum size of the image (maintains natural aspect ratio)',
        condition: (_, siblingData) =>
          siblingData?.mediaType !== 'video' && siblingData?.imageSizingMode === 'natural',
      },
    },
    {
      name: 'textContainerMargin',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        description: 'Margin around the text container (centered within text section)',
      },
    },
    createColorField({
      name: 'backgroundColor',
      label: 'Background Color',
      defaultValue: 'transparent',
      description: 'Background color for this block',
    }),
    {
      name: 'fullBleed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Color stretches horizontally across the full page width (content stays within container)',
      },
    },
    {
      name: 'roundedCorners',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Apply rounded corners to the entire block',
      },
    },
    {
      name: 'collapsedByDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Text is collapsed to the height of the media with a fade effect. A "Lees meer" button expands it.',
      },
    },
    {
      name: 'startNumberedListAtZero',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, numbered lists in this block start at 0 instead of 1',
      },
    },
  ],
}
