import { getPayload } from 'payload'
import config from '../src/payload.config'
const run = async () => {
  const p = await getPayload({ config })
  const r = await p.find({ collection: 'media', limit: 1000, depth: 0 })
  const names = new Set<string>()
  for (const d of r.docs as any[]) {
    if (d.filename) names.add(d.filename)
    if (d.sizes) {
      for (const s of Object.values(d.sizes) as any[]) {
        if (s && s.filename) names.add(s.filename)
      }
    }
  }
  // stderr for human, stdout pure list
  console.error('prod media docs=', r.totalDocs, 'referenced files=', names.size)
  process.stdout.write([...names].join('\n') + '\n')
  process.exit(0)
}
run().catch(e=>{console.error(e);process.exit(1)})
