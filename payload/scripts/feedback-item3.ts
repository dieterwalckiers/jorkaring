/**
 * Client feedback — Item 3
 * Hero CTA on the individu homepage (voor-particulieren, id 56) "Boek je vrijblijvend
 * gesprek in" button currently links to /contact; it should point to the Calendly page
 * /boek-je-gesprek-in.
 *
 * Deep-walks the hero block's nested `content` sub-blocks to find the `heroCta` block and
 * updates the matching link's url. Leaves the #aanbod anchor link untouched.
 *
 * Idempotent: no-op if the link already points to /boek-je-gesprek-in.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 56
const OLD_URL = '/contact'
const NEW_URL = '/boek-je-gesprek-in'

type Block = Record<string, unknown> & { blockType?: string; content?: unknown }
type Link = Record<string, unknown> & { url?: string; label?: string }

async function run() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Block[]

  let changed = 0

  const walk = (blocks: unknown): void => {
    if (!Array.isArray(blocks)) return
    for (const block of blocks as Block[]) {
      if (block?.blockType === 'heroCta' && Array.isArray(block.links)) {
        for (const link of block.links as Link[]) {
          const matches =
            link.url === OLD_URL ||
            (typeof link.label === 'string' && link.label.toLowerCase().includes('gesprek'))
          if (matches && link.url !== NEW_URL) {
            console.log(`Updating heroCta link "${link.label}": ${link.url} -> ${NEW_URL}`)
            link.url = NEW_URL
            changed++
          }
        }
      }
      // recurse into nested sub-blocks (e.g. hero -> content[])
      if (Array.isArray(block?.content)) walk(block.content)
    }
  }

  walk(content)

  if (changed === 0) {
    console.log('Item 3 already applied (no /contact heroCta link found) — skipping.')
    return
  }

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content } as never,
    context: { skipDeploy: true },
  })

  console.log(`Item 3 applied: updated ${changed} hero CTA link(s) to ${NEW_URL}.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
