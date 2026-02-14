import { createServerFeature } from '@payloadcms/richtext-lexical'

export const TextColorFeature = createServerFeature({
  feature: {
    ClientFeature:
      '@/features/text-color/feature.client#TextColorFeatureClient',
    clientFeatureProps: null,
  },
  key: 'textColor',
})
