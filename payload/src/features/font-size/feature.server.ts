import { createServerFeature } from '@payloadcms/richtext-lexical'

export const FontSizeFeature = createServerFeature({
  feature: {
    ClientFeature:
      '@/features/font-size/feature.client#FontSizeFeatureClient',
    clientFeatureProps: null,
  },
  key: 'fontSize',
})
