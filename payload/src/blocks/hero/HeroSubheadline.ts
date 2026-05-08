import type { Block } from 'payload'
import {
  lexicalEditor,
  ParagraphFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { TextColorFeature } from '../../features/text-color'

export const HeroSubheadline: Block = {
  slug: 'heroSubheadline',
  labels: {
    singular: 'Subheadline',
    plural: 'Subheadlines',
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
        description: 'Supporting text below the headline. Select text to color individual words or phrases.',
      },
    },
  ],
}
