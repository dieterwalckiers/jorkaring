import type { Block } from 'payload'
import {
  lexicalEditor,
  ParagraphFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { TextColorFeature } from '../../features/text-color'

export const HeroHeadline: Block = {
  slug: 'heroHeadline',
  labels: {
    singular: 'Headline',
    plural: 'Headlines',
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          TextColorFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'The main headline text. Select text to color individual words or phrases.',
      },
    },
    {
      name: 'fontSize',
      type: 'select',
      required: true,
      defaultValue: 'h1',
      options: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' },
      ],
      admin: {
        description: 'Heading level — matches the WYSIWYG heading sizes.',
      },
    },
  ],
}
