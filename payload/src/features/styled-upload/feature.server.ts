import { createServerFeature } from '@payloadcms/richtext-lexical'

export const StyledUploadFeature = createServerFeature({
  feature: {
    ClientFeature:
      '@/features/styled-upload/feature.client#StyledUploadFeatureClient',
    clientFeatureProps: null,
  },
  key: 'styledUpload',
})
