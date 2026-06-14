/**
 * Fix the dangling /contact link on aanbod-bedrijf (page 58) after the dedicated
 * contact page was removed in item 6. Repoint the hero CTA to the in-page contact
 * section on the bedrijven page: /contact -> /voor-bedrijven#contact.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 58
const OLD = '/contact'
const NEW = '/voor-bedrijven#contact'

async function run() {
  const payload = await getPayload({ config })
  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Array<Record<string, any>>

  let changed = 0
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (node && typeof node === 'object') {
      const obj = node as Record<string, any>
      if (obj.blockType === 'heroCta' && Array.isArray(obj.links)) {
        for (const link of obj.links) {
          if (link?.url === OLD) {
            link.url = NEW
            changed++
          }
        }
      }
      for (const v of Object.values(obj)) walk(v)
    }
  }
  walk(content)

  if (changed === 0) {
    console.log('No /contact heroCta link found on page 58 — already fixed or absent. Skipping.')
    return
  }

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content } as never,
    context: { skipDeploy: true },
  })
  console.log(`Repointed ${changed} hero CTA link(s) on page 58: ${OLD} -> ${NEW}`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
