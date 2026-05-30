import { createServerFeature } from '@payloadcms/richtext-lexical'
import { BlockGroupNode } from './node'

export const BlockStyleFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/block-style/feature.client#BlockStyleFeatureClient',
    clientFeatureProps: null,
    // The wrapper holds no fields of its own — styling lives in NodeState ($),
    // and the frontend renders it from JSON via RichTextRenderer.vue.
    nodes: [{ node: BlockGroupNode }],
  },
  key: 'blockStyle',
})
