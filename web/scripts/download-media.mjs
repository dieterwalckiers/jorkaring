import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'public', 'api', 'media', 'file')

const apiUrl = process.env.PAYLOAD_API_URL || process.env.NUXT_PUBLIC_PAYLOAD_API_URL
if (!apiUrl) {
  console.error('[download-media] PAYLOAD_API_URL or NUXT_PUBLIC_PAYLOAD_API_URL must be set')
  process.exit(1)
}

const baseUrl = apiUrl.replace(/\/api\/?$/, '')

async function listAllMedia() {
  const docs = []
  let page = 1
  while (true) {
    const res = await fetch(`${apiUrl}/media?limit=100&page=${page}&depth=0`)
    if (!res.ok) throw new Error(`Failed to list media (page ${page}): ${res.status}`)
    const data = await res.json()
    docs.push(...(data.docs ?? []))
    if (!data.hasNextPage) break
    page += 1
  }
  return docs
}

function collectFilenames(doc) {
  const names = new Set()
  if (doc.filename) names.add(doc.filename)
  const sizes = doc.sizes ?? {}
  for (const size of Object.values(sizes)) {
    if (size && typeof size === 'object' && size.filename) names.add(size.filename)
  }
  return [...names]
}

async function downloadOne(filename) {
  const url = `${baseUrl}/api/media/file/${encodeURIComponent(filename)}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`[download-media] Skipping ${filename}: ${res.status}`)
    return false
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(outDir, filename), buf)
  return true
}

async function main() {
  await mkdir(outDir, { recursive: true })
  console.log(`[download-media] Listing media from ${apiUrl}`)
  const docs = await listAllMedia()
  const filenames = [...new Set(docs.flatMap(collectFilenames))]
  console.log(`[download-media] ${docs.length} media docs, ${filenames.length} files to download`)

  let ok = 0
  let failed = 0
  const concurrency = 8
  for (let i = 0; i < filenames.length; i += concurrency) {
    const batch = filenames.slice(i, i + concurrency)
    const results = await Promise.all(batch.map(downloadOne))
    for (const r of results) r ? ok++ : failed++
  }
  console.log(`[download-media] Downloaded ${ok}, skipped ${failed} → ${outDir}`)
}

main().catch((err) => {
  console.error('[download-media] Failed:', err)
  process.exit(1)
})
