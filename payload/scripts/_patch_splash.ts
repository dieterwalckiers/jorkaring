import { getPayload } from 'payload'
import config from '../src/payload.config'
const run = async () => {
  const p = await getPayload({ config })
  const cur = (await p.findGlobal({ slug: 'site-settings', depth: 0 })) as any
  const splash = { ...(cur.splashPage || {}) }
  const before = splash.backgroundImage
  splash.backgroundImage = 178
  const { id, createdAt, updatedAt, globalType, _status, ...data } = cur
  await p.updateGlobal({
    slug: 'site-settings',
    data: { ...data, splashPage: splash, _status: 'published' },
    draft: false,
    depth: 0,
    context: { skipDeploy: true },
  })
  const after = (await p.findGlobal({ slug: 'site-settings', depth: 0 })) as any
  console.log('splash backgroundImage:', before, '->', after.splashPage?.backgroundImage)
  console.log('ebook.pdf still:', after.ebook?.pdf, '| enabled:', after.ebook?.enabled)
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
