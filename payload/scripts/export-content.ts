/**
 * Export Payload CMS content to JSON files
 *
 * Usage: pnpm export:content [backup-name]
 *
 * Creates a backup folder in ./backups/ with:
 * - pages.json - All pages with block content
 * - media.json - Media metadata (files are in public/uploads)
 * - site-settings.json - Global site settings
 * - uploads/ - Copy of all uploaded files
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ExportResult {
  collection: string
  count: number
}

interface MediaSize {
  filename?: string | null
  url?: string | null
}

interface MediaDoc {
  filename?: string | null
  url?: string | null
  sizes?: Record<string, MediaSize | null> | null
}

async function exportContent(): Promise<void> {
  const backupName = process.argv[2] || `backup-${new Date().toISOString().replace(/[:.]/g, '-')}`
  const backupDir = path.resolve(__dirname, '..', 'backups', backupName)
  const uploadsBackupDir = path.join(backupDir, 'uploads')

  console.log(`\n📦 Exporting Payload content to: ${backupDir}\n`)

  // Initialize Payload
  const payload = await getPayload({ config })

  // Create backup directory
  await fs.mkdir(backupDir, { recursive: true })
  await fs.mkdir(uploadsBackupDir, { recursive: true })

  const results: ExportResult[] = []

  // Export Pages
  // draft: true returns the latest version of each doc (draft or published),
  // so in-progress edits aren't silently dropped.
  console.log('📄 Exporting pages...')
  const pages = await payload.find({
    collection: 'pages',
    limit: 0, // No limit - get all
    depth: 0, // Don't expand relationships - we'll handle them during restore
    draft: true,
  })
  await fs.writeFile(
    path.join(backupDir, 'pages.json'),
    JSON.stringify(pages.docs, null, 2)
  )
  results.push({ collection: 'pages', count: pages.docs.length })
  console.log(`   ✓ ${pages.docs.length} pages exported`)

  // Export Media (metadata only - files are copied separately)
  console.log('🖼️  Exporting media...')
  const media = await payload.find({
    collection: 'media',
    limit: 0,
    depth: 0,
  })
  await fs.writeFile(
    path.join(backupDir, 'media.json'),
    JSON.stringify(media.docs, null, 2)
  )
  results.push({ collection: 'media', count: media.docs.length })
  console.log(`   ✓ ${media.docs.length} media items exported`)

  // Copy upload files
  console.log('📁 Copying upload files...')
  const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads')
  try {
    await copyDirectory(uploadsDir, uploadsBackupDir)
    const fileCount = await countFiles(uploadsBackupDir)
    console.log(`   ✓ ${fileCount} files copied`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('   ⚠ No uploads directory found (no files to copy)')
    } else {
      throw error
    }
  }

  // For files that don't exist on the local container's disk (typical when
  // exporting against a remote DATABASE_URL like production), fetch them from
  // the public media URLs returned by the API. This makes `--production`
  // exports actually self-contained.
  console.log('🌐 Fetching missing files from media URLs...')
  const fetchResult = await fetchMissingMediaFiles(
    media.docs as MediaDoc[],
    uploadsBackupDir,
  )
  if (fetchResult.fetched > 0 || fetchResult.failed > 0) {
    const failedNote = fetchResult.failed > 0 ? `, ${fetchResult.failed} failed` : ''
    console.log(`   ✓ ${fetchResult.fetched} files fetched${failedNote}`)
  } else {
    console.log('   ✓ All media files already present locally')
  }

  // Export Site Settings
  console.log('⚙️  Exporting site settings...')
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    draft: true,
  })
  await fs.writeFile(
    path.join(backupDir, 'site-settings.json'),
    JSON.stringify(siteSettings, null, 2)
  )
  console.log('   ✓ Site settings exported')

  // Create manifest
  const manifest = {
    createdAt: new Date().toISOString(),
    payloadVersion: '3.0.0',
    collections: results,
    hasUploads: await directoryExists(uploadsBackupDir),
  }
  await fs.writeFile(
    path.join(backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  console.log('\n✅ Export complete!')
  console.log(`   Backup location: ${backupDir}`)
  console.log('\n   To restore this backup, run:')
  console.log(`   pnpm restore:content ${backupName}\n`)

  process.exit(0)
}

async function fetchMissingMediaFiles(
  docs: MediaDoc[],
  uploadsBackupDir: string,
): Promise<{ fetched: number; failed: number }> {
  let fetched = 0
  let failed = 0

  for (const doc of docs) {
    const variants: Array<{ filename: string; url: string }> = []
    if (doc.filename && doc.url) {
      variants.push({ filename: doc.filename, url: doc.url })
    }
    if (doc.sizes) {
      for (const size of Object.values(doc.sizes)) {
        if (size?.filename && size.url) {
          variants.push({ filename: size.filename, url: size.url })
        }
      }
    }

    for (const { filename, url } of variants) {
      const dest = path.join(uploadsBackupDir, filename)
      try {
        await fs.access(dest)
        continue
      } catch {
        // missing — fall through to fetch
      }

      try {
        const res = await fetch(url)
        if (!res.ok) {
          console.warn(`   ⚠ Failed to fetch "${filename}" (HTTP ${res.status})`)
          failed++
          continue
        }
        const buf = Buffer.from(await res.arrayBuffer())
        await fs.writeFile(dest, buf)
        fetched++
      } catch (error) {
        console.warn(`   ⚠ Error fetching "${filename}":`, (error as Error).message)
        failed++
      }
    }
  }

  return { fetched, failed }
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

async function directoryExists(dir: string): Promise<boolean> {
  try {
    await fs.access(dir)
    return true
  } catch {
    return false
  }
}

exportContent().catch((error) => {
  console.error('❌ Export failed:', error)
  process.exit(1)
})
