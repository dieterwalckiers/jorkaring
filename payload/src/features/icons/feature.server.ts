import { createServerFeature } from '@payloadcms/richtext-lexical'

export const IconsFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/icons/feature.client#IconsFeatureClient',
    clientFeatureProps: null,
  },
  key: 'icons',
})
