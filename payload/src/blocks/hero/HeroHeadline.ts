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
  ],
}
