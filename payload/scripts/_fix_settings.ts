import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKUP = process.argv[2]
const MEDIA_KEYS = new Set(['image', 'backgroundImage', 'logo', 'favicon', 'pdf'])
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const run = async () => {
  const p = await getPayload({ config })
  const dir = path.resolve(__dirname, '../backups', BACKUP)
  const backupMedia = JSON.parse(await fs.readFile(path.join(dir, 'media.json'), 'utf-8')) as any[]
  const prod = (await p.find({ collection: 'media', limit: 1000, depth: 0 })).docs as any[]
  const byAlt = new Map<string, any[]>()
  for (const m of prod) {
    const a = (m.alt || '').trim()
    if (a) (byAlt.get(a) || byAlt.set(a, []).get(a)!).push(m)
  }
  const byFile = new Map<string, any>(prod.map((m) => [m.filename, m]))

  const mediaIdMap = new Map<number, number>()
  for (const bm of backupMedia) {
    const alt = (bm.alt || '').trim()
    let match: any = null
    if (alt && byAlt.get(alt)?.length === 1) match = byAlt.get(alt)![0]
    if (!match && byFile.has(bm.filename)) match = byFile.get(bm.filename)
    if (!match) {
      const dot = bm.filename.lastIndexOf('.')
      const base = dot >= 0 ? bm.filename.slice(0, dot) : bm.filename
      const ext = dot >= 0 ? bm.filename.slice(dot) : ''
      const re = new RegExp('^' + esc(base) + '-\\d+' + esc(ext) + '$')
      const cands = prod.filter((m) => re.test(m.filename))
      if (cands.length === 1) match = cands[0]
    }
    if (match) mediaIdMap.set(bm.id, match.id)
  }
  console.log('mapped', mediaIdMap.size, '/', backupMedia.length)
  console.log('199 ->', mediaIdMap.get(199), '| 233 ->', mediaIdMap.get(233))

  const settings = JSON.parse(await fs.readFile(path.join(dir, 'site-settings.json'), 'utf-8')) as Record<string, unknown>
  const { id, createdAt, updatedAt, globalType, _status, ...data } = settings
  const remapped = JSON.parse(JSON.stringify([data]), (k, v) => {
    if (MEDIA_KEYS.has(k) && typeof v === 'number') return mediaIdMap.get(v) ?? null
    if (k === 'value' && typeof v === 'number') return mediaIdMap.get(v) ?? v
    return v
  })[0]
  await p.updateGlobal({ slug: 'site-settings', data: { ...remapped, _status: 'published' }, draft: false, context: { skipDeploy: true } })
  console.log('OK site-settings updated')
  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})
