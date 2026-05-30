import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature, BlocksFeature } from '@payloadcms/richtext-lexical'
import { TextColorFeature } from './features/text-color'
import { FontSizeFeature } from './features/font-size'
import { BlockStyleFeature } from './features/block-style'
import { StyledUploadFeature } from './features/styled-upload'
import { IconsFeature } from './features/icons'
import { buttonInlineBlock } from './features/buttonInlineBlock'
import { iconInlineBlock } from './features/iconInlineBlock'
import sharp from 'sharp'

import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      providers: ['@/components/ThemeColorProvider#ThemeColorProvider'],
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const previewUrl = process.env.PREVIEW_URL || 'http://localhost:3201'
        if (collectionConfig?.slug === 'pages') {
          const slug = (data as Record<string, unknown>)?.slug
          return slug === 'home' ? previewUrl : `${previewUrl}/${slug}`
        }
        // For site-settings, preview the home page
        if (globalConfig?.slug === 'site-settings') {
          return previewUrl
        }
        return previewUrl
      },
      collections: ['pages'],
      globals: ['site-settings'],
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 667 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
      ],
    },
  },
  collections: [Pages, Media, Users],
  globals: [SiteSettings],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      TextColorFeature(),
      FontSizeFeature(),
      BlockStyleFeature(),
      IconsFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'size',
                type: 'select',
                defaultValue: 'medium',
                options: [
                  { label: 'Tiny Icon (32px)', value: 'tiny-icon' },
                  { label: 'Small Icon (48px)', value: 'small-icon' },
                  { label: 'Icon (64px)', value: 'icon' },
                  { label: 'Large Icon (100px)', value: 'large-icon' },
                  { label: 'Tiny (200px)', value: 'tiny' },
                  { label: 'Small (300px)', value: 'small' },
                  { label: 'Medium (500px)', value: 'medium' },
                  { label: 'Large (700px)', value: 'large' },
                  { label: 'Extra Large (900px)', value: 'xlarge' },
                  { label: 'Huge (1200px)', value: 'huge' },
                  { label: 'Full Width', value: 'full' },
                  { label: 'Original Size', value: 'original' },
                ],
                admin: {
                  description: 'Display size of the image',
                },
              },
              {
                name: 'alignment',
                type: 'select',
                defaultValue: 'center',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                admin: {
                  description: 'Image alignment',
                },
              },
              {
                name: 'caption',
                type: 'text',
                admin: {
                  description: 'Optional caption below the image',
                },
              },
            ],
          },
        },
      }),
      BlocksFeature({
        inlineBlocks: [buttonInlineBlock, iconInlineBlock],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  cors: [
    'http://localhost:3201',
    'http://localhost:3202',
    process.env.FRONTEND_URL || '',
    process.env.PREVIEW_URL || '',
  ].filter(Boolean),
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
  sharp,
  onInit: async (payload) => {
    // Auto-provision first admin user if none exists
    const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL
    const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.log('⚠️  PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD not set. Skipping admin user creation.')
      return
    }

    try {
      // Check if any users exist
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      })

      if (existingUsers.totalDocs === 0) {
        console.log('🔧 Creating first admin user...')
        await payload.create({
          collection: 'users',
          data: {
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
          },
        })
        console.log(`✅ Admin user created: ${adminEmail}`)
      } else {
        console.log('ℹ️  Admin user already exists. Skipping creation.')
      }
    } catch (error) {
      console.error('❌ Error creating admin user:', error)
    }
  },
})
