/**
 * Restore Payload CMS content from JSON backup
 *
 * Usage: pnpm restore:content <backup-name> [--force]
 *
 * Options:
 *   --force    Skip confirmation prompt (useful for CI/CD)
 *
 * This script will:
 * 1. Run database migrations to ensure schema is up to date
 * 2. Delete all existing content (pages, media, site settings)
 * 3. Restore content from the backup
 */

import { getPayload } from 'payload'
import { execSync } from 'child_process'
import config from '../src/payload.config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface MediaDoc {
  id: number
  filename: string
  alt?: string
  caption?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  sizes?: Record<string, unknown>
  url?: string
  [key: string]: unknown
}

interface PageDoc {
  id: number
  title: string
  slug: string
  content?: unknown[]
  showInMenu?: boolean
  menuOrder?: number
  [key: string]: unknown
}

interface SiteSettingsDoc {
  id: number
  siteTitle?: string
  logo?: number | null
  favicon?: number | null
  styling?: Record<string, unknown>
  [key: string]: unknown
}

interface Manifest {
  createdAt: string
  payloadVersion: string
  collections: Array<{ collection: string; count: number }>
  hasUploads: boolean
}

async function restoreContent(): Promise<void> {
  const backupName = process.argv[2]
  const forceFlag = process.argv.includes('--force')

  if (!backupName) {
    console.error('❌ Please provide a backup name')
    console.log('\nUsage: pnpm restore:content <backup-name> [--force]')
    console.log('\nAvailable backups:')
    await listBackups()
    process.exit(1)
  }

  const backupDir = path.resolve(__dirname, '..', 'backups', backupName)

  // Check if backup exists
  try {
    await fs.access(backupDir)
  } catch {
    console.error(`❌ Backup not found: ${backupDir}`)
    console.log('\nAvailable backups:')
    await listBackups()
    process.exit(1)
  }

  // Read manifest
  let manifest: Manifest | null = null
  try {
    const manifestContent = await fs.readFile(path.join(backupDir, 'manifest.json'), 'utf-8')
    manifest = JSON.parse(manifestContent) as Manifest
  } catch {
    console.warn('⚠ No manifest found, proceeding anyway...')
  }

  console.log(`\n📦 Restoring from: ${backupDir}`)
  if (manifest) {
    console.log(`   Created: ${manifest.createdAt}`)
    console.log(`   Collections: ${manifest.collections.map(c => `${c.collection} (${c.count})`).join(', ')}`)
  }

  // Confirmation
  if (!forceFlag) {
    console.log('\n⚠️  WARNING: This will DELETE all existing pages, media, and site settings!')
    const confirmed = await confirm('Are you sure you want to continue? (yes/no): ')
    if (!confirmed) {
      console.log('Restore cancelled.')
      process.exit(0)
    }
  }

  // Step 1: Run migrations to ensure schema is up to date
  console.log('\n🔄 Running database migrations...')
  try {
    const payloadDir = path.resolve(__dirname, '..')
    execSync('pnpm migrate', {
      cwd: payloadDir,
      stdio: 'inherit',
      env: process.env,
    })
    console.log('   ✓ Migrations complete')
  } catch (error) {
    console.error('❌ Migration failed:', (error as Error).message)
    process.exit(1)
  }

  // Initialize Payload
  console.log('\n🔄 Initializing Payload...')
  const payload = await getPayload({ config })

  // Track ID mappings for relationships
  const mediaIdMap = new Map<number, number>()

  // Step 2: Delete existing content
  console.log('\n🗑️  Clearing existing content...')

  // Delete pages first (they reference media)
  const existingPages = await payload.find({ collection: 'pages', limit: 0 })
  for (const page of existingPages.docs) {
    await payload.delete({ collection: 'pages', id: page.id })
  }
  console.log(`   ✓ Deleted ${existingPages.docs.length} pages`)

  // Delete media
  // Note: When restoring to production from local, files don't exist locally
  // so file deletion may fail - we catch and continue since files will be replaced
  const existingMedia = await payload.find({ collection: 'media', limit: 0 })
  let mediaDeletedCount = 0
  let mediaDeleteErrors = 0
  for (const item of existingMedia.docs) {
    try {
      await payload.delete({ collection: 'media', id: item.id })
      mediaDeletedCount++
    } catch (error) {
      // ErrorDeletingFile happens when running locally against remote DB
      // The DB record may still be deleted, or we can try direct deletion
      const errorName = (error as Error).name || (error as Error).constructor?.name
      if (errorName === 'ErrorDeletingFile') {
        // Try to delete the DB record directly without file operations
        try {
          await payload.db.deleteOne({
            collection: 'media',
            where: { id: { equals: item.id } },
          })
          mediaDeletedCount++
        } catch {
          mediaDeleteErrors++
          console.warn(`   ⚠ Could not delete media id=${item.id}`)
        }
      } else {
        throw error
      }
    }
  }
  if (mediaDeleteErrors > 0) {
    console.log(`   ✓ Deleted ${mediaDeletedCount} media items (${mediaDeleteErrors} failed)`)
  } else {
    console.log(`   ✓ Deleted ${mediaDeletedCount} media items`)
  }

  // Step 3: Copy upload files first
  console.log('\n📁 Restoring upload files...')
  const uploadsBackupDir = path.join(backupDir, 'uploads')
  const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads')
  try {
    // Clear existing uploads
    await fs.rm(uploadsDir, { recursive: true, force: true })
    await fs.mkdir(uploadsDir, { recursive: true })

    // Copy backup uploads
    await copyDirectory(uploadsBackupDir, uploadsDir)
    const fileCount = await countFiles(uploadsDir)
    console.log(`   ✓ ${fileCount} files restored`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('   ⚠ No uploads in backup (skipping)')
    } else {
      throw error
    }
  }

  // Step 4: Restore media (needed before pages for relationships)
  console.log('\n🖼️  Restoring media...')
  try {
    const mediaContent = await fs.readFile(path.join(backupDir, 'media.json'), 'utf-8')
    const mediaItems = JSON.parse(mediaContent) as MediaDoc[]
    let skippedCount = 0

    for (const item of mediaItems) {
      const oldId = item.id
      const filePath = path.join(uploadsDir, item.filename)

      // Check if file exists before trying to restore
      try {
        await fs.access(filePath)
      } catch {
        console.warn(`   ⚠ Skipping "${item.filename}": file not found in backup`)
        skippedCount++
        continue
      }

      // Remove fields that Payload manages
      const { id, createdAt, updatedAt, url, sizes, ...mediaData } = item

      try {
        // Create media entry (file already exists in uploads)
        const created = await payload.create({
          collection: 'media',
          data: mediaData as Record<string, unknown>,
          filePath,
        })
        mediaIdMap.set(oldId, created.id as number)
      } catch (error) {
        console.warn(`   ⚠ Failed to restore media "${item.filename}":`, (error as Error).message)
      }
    }
    const status = skippedCount > 0 ? ` (${skippedCount} skipped - missing files)` : ''
    console.log(`   ✓ ${mediaIdMap.size}/${mediaItems.length} media items restored${status}`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('   ⚠ No media.json found (skipping)')
    } else {
      throw error
    }
  }

  // Step 5: Restore pages (two passes — create first, then set page-to-page relationships)
  console.log('\n📄 Restoring pages...')
  const pageIdMap = new Map<number, number>()
  const pagesWithMenuFilter: Array<{ oldId: number; menuFilter: number[] }> = []
  // The new per-page menu override. Each item's `page` references another page by
  // its (source) id, so — like menuFilter — it must be remapped to the new ids in
  // a second pass once every page exists. Held back from the create call below.
  type MenuItem = { page?: number | null; label?: string | null; anchor?: string | null }
  const pagesWithMenuItems: Array<{ oldId: number; menuItems: MenuItem[] }> = []
  try {
    const pagesContent = await fs.readFile(path.join(backupDir, 'pages.json'), 'utf-8')
    const pages = JSON.parse(pagesContent) as PageDoc[]
    let restoredCount = 0

    // Pass 1: Create pages without menuFilter. We always create as draft
    // first to skip required-field validation, then publish in pass 3 if the
    // source doc was published.
    const publishedOldIds = new Set<number>()
    for (const page of pages) {
      const oldId = page.id
      // Remove fields that Payload manages, plus the page-to-page relationship
      // fields (menuFilter legacy, menuItems current) which are remapped below.
      const { id, createdAt, updatedAt, menuFilter, menuItems, ...pageData } = page

      if (page._status === 'published') {
        publishedOldIds.add(oldId)
      }

      // Track pages that have menuFilter for second pass
      if (Array.isArray(menuFilter) && menuFilter.length > 0) {
        pagesWithMenuFilter.push({ oldId, menuFilter: menuFilter as number[] })
      }

      // Track pages that have menuItems (new override) for the remap pass
      if (Array.isArray(menuItems) && menuItems.length > 0) {
        pagesWithMenuItems.push({ oldId, menuItems: menuItems as MenuItem[] })
      }

      // Remap media IDs in content blocks
      if (pageData.content) {
        pageData.content = remapMediaIds(pageData.content as unknown[], mediaIdMap)
      }

      try {
        const created = await payload.create({
          collection: 'pages',
          data: pageData as Record<string, unknown>,
          draft: true,
        })
        pageIdMap.set(oldId, created.id as number)
        restoredCount++
      } catch (error) {
        console.warn(`   ⚠ Failed to restore page "${page.title}":`, (error as Error).message)
      }
    }
    console.log(`   ✓ ${restoredCount}/${pages.length} pages restored`)

    // Pass 2: Set menuFilter relationships with remapped IDs
    if (pagesWithMenuFilter.length > 0) {
      console.log('\n🔗 Restoring page relationships (menuFilter)...')
      for (const { oldId, menuFilter } of pagesWithMenuFilter) {
        const newId = pageIdMap.get(oldId)
        if (!newId) continue

        const remappedFilter = menuFilter
          .map((oldRefId) => pageIdMap.get(oldRefId))
          .filter((id): id is number => id !== undefined)

        if (remappedFilter.length === 0) continue

        try {
          await payload.update({
            collection: 'pages',
            id: newId,
            data: { menuFilter: remappedFilter } as Record<string, unknown>,
            draft: true,
          })
        } catch (error) {
          console.warn(`   ⚠ Failed to set menuFilter for page id=${newId}:`, (error as Error).message)
        }
      }
      console.log(`   ✓ ${pagesWithMenuFilter.length} menuFilter relationships restored`)
    }

    // Pass 2b: Set menuItems overrides with remapped page ids. Each item's
    // `page` is remapped; items whose target page wasn't restored are dropped.
    if (pagesWithMenuItems.length > 0) {
      console.log('\n🔗 Restoring page relationships (menuItems)...')
      let menuItemsRestored = 0
      for (const { oldId, menuItems } of pagesWithMenuItems) {
        const newId = pageIdMap.get(oldId)
        if (!newId) continue

        const remappedItems = menuItems
          .map((item) => {
            const remappedPage = item.page != null ? pageIdMap.get(item.page) : null
            // Keep items even if they have no page (a label-only / anchor item).
            if (item.page != null && remappedPage == null) return null
            return {
              page: remappedPage ?? null,
              label: item.label ?? null,
              anchor: item.anchor ?? null,
            }
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)

        if (remappedItems.length === 0) continue

        try {
          await payload.update({
            collection: 'pages',
            id: newId,
            data: { menuItems: remappedItems } as Record<string, unknown>,
            draft: true,
          })
          menuItemsRestored++
        } catch (error) {
          console.warn(`   ⚠ Failed to set menuItems for page id=${newId}:`, (error as Error).message)
        }
      }
      console.log(`   ✓ ${menuItemsRestored}/${pagesWithMenuItems.length} menuItems overrides restored`)
    }

    // Pass 3: Publish pages that were published in the source
    if (publishedOldIds.size > 0) {
      console.log('\n📢 Publishing pages...')
      let publishedCount = 0
      for (const oldId of publishedOldIds) {
        const newId = pageIdMap.get(oldId)
        if (!newId) continue
        try {
          await payload.update({
            collection: 'pages',
            id: newId,
            data: { _status: 'published' } as Record<string, unknown>,
          })
          publishedCount++
        } catch (error) {
          console.warn(`   ⚠ Failed to publish page id=${newId}:`, (error as Error).message)
        }
      }
      console.log(`   ✓ ${publishedCount}/${publishedOldIds.size} pages published`)
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('   ⚠ No pages.json found (skipping)')
    } else {
      throw error
    }
  }

  // Step 6: Restore site settings
  console.log('\n⚙️  Restoring site settings...')
  try {
    const settingsContent = await fs.readFile(path.join(backupDir, 'site-settings.json'), 'utf-8')
    const settings = JSON.parse(settingsContent) as SiteSettingsDoc

    // Remove fields that Payload manages. We also drop _status: the source
    // may have been a draft, but globals are singletons and dev environments
    // want the latest values visible in the non-preview frontend.
    const { id, createdAt, updatedAt, globalType, _status, ...settingsData } = settings

    // Deep-remap all media references (logo, favicon, splashPage.backgroundImage,
    // rich text embeds, etc.)
    const remappedSettings = remapMediaIds(
      [settingsData as unknown],
      mediaIdMap,
    )[0] as Record<string, unknown>

    await payload.updateGlobal({
      slug: 'site-settings',
      data: { ...remappedSettings, _status: 'published' },
      draft: false,
    })
    console.log('   ✓ Site settings restored')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('   ⚠ No site-settings.json found (skipping)')
    } else {
      console.warn('   ⚠ Failed to restore site settings:', (error as Error).message)
    }
  }

  console.log('\n✅ Restore complete!')
  process.exit(0)
}

function remapMediaIds(content: unknown[], mediaIdMap: Map<number, number>): unknown[] {
  return JSON.parse(
    JSON.stringify(content),
    (key, value) => {
      // Remap media relationship IDs. If the referenced media was not
      // restored (file missing in backup), null the reference so we don't
      // violate foreign keys against stale production IDs.
      if (
        (key === 'image' ||
          key === 'backgroundImage' ||
          key === 'logo' ||
          key === 'favicon' ||
          key === 'pdf') &&
        typeof value === 'number'
      ) {
        return mediaIdMap.get(value) ?? null
      }
      // Handle media references in rich text
      if (key === 'relationTo' && value === 'media') {
        return value
      }
      if (key === 'value' && typeof value === 'number') {
        // This might be a media ID in rich text
        const mapped = mediaIdMap.get(value)
        return mapped ?? value
      }
      return value
    }
  ) as unknown[]
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function countFiles(dir: string): Promise<number> {
  let count = 0
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += await countFiles(path.join(dir, entry.name))
      } else {
        count++
      }
    }
  } catch {
    return 0
  }
  return count
}

async function listBackups(): Promise<void> {
  const backupsDir = path.resolve(__dirname, '..', 'backups')
  try {
    const entries = await fs.readdir(backupsDir, { withFileTypes: true })
    const backups = entries.filter(e => e.isDirectory()).map(e => e.name)
    if (backups.length === 0) {
      console.log('   (no backups found)')
    } else {
      for (const backup of backups) {
        console.log(`   - ${backup}`)
      }
    }
  } catch {
    console.log('   (no backups directory)')
  }
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
    })
  })
}

restoreContent().catch((error) => {
  console.error('❌ Restore failed:', error)
  process.exit(1)
})
