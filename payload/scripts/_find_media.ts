import { getPayload } from 'payload'
import config from '../src/payload.config'
const run = async () => {
  const p = await getPayload({ config })
  const prod = (await p.find({ collection: 'media', limit: 1000, depth: 0 })).docs as any[]
  const size = Number(process.argv[2])
  const hits = prod.filter((m) => Number(m.filesize) === size)
  console.log(`prod media with filesize=${size}:`, hits.length)
  for (const h of hits) console.log('  id', h.id, '| w', h.width, 'h', h.height, '| alt', JSON.stringify(h.alt), '|', h.filename)
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
