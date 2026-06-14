/**
 * Client feedback — Item 6 (expanded)
 *
 * The client decided there is NO dedicated contact page anymore — the in-page
 * contact sections (items 1 & 2) replace it. This script, in order & idempotently:
 *
 *  Step 2 — adds an `anchor` block with anchorId "contact" immediately BEFORE the
 *           in-page contact section on pages 56 (voor-particulieren) and 55
 *           (voor-bedrijven). The contact section is located by blockName.
 *  Step 3 — appends a self-referencing `{ page: <self>, label: "Contact",
 *           anchor: "contact" }` menu item to pages 56 and 55 (last position).
 *  Step 4 — removes from EVERY page's menuItems any entry whose page === 60, and
 *           repoints any "/contact" string link → "#contact" on pages 56 and 55.
 *  Step 5 — deletes the dedicated contact page (id 60).
 *
 * Pages WITHOUT an in-page contact section (54, 57, 58) keep their /contact
 * string links untouched — those are entangled with items 7/10/11 and must NOT
 * be guessed (they will dangle until those items repoint them).
 *
 * Run: docker compose exec -T payload npx tsx scripts/feedback-item6.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const CONTACT_PAGE_ID = 60
const ANCHOR_ID = 'contact'
const ALL_PAGE_IDS = [54, 55, 56, 57, 58, 59]

// Pages that have an in-page contact section, and the blockName that identifies it.
// The anchor is inserted immediately before this block.
const CONTACT_SECTION: Record<number, string> = {
  56: 'contact details',
  55: 'item2-contact-cta',
}

type Block = Record<string, unknown>
type MenuItem = { page?: unknown; label?: string; anchor?: string; [k: string]: unknown }

function deepReplaceContactUrl(value: unknown): { value: unknown; changed: number } {
  let changed = 0
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {}
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (typeof val === 'string' && val === '/contact') {
          out[k] = '#contact'
          changed++
        } else {
          out[k] = walk(val)
        }
      }
      return out
    }
    return v
  }
  return { value: walk(value), changed }
}

async function run() {
  const payload = await getPayload({ config })

  // ---- Step 2: insert anchor "contact" before the in-page contact section ----
  for (const pageId of [56, 55]) {
    const sectionName = CONTACT_SECTION[pageId]
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
    const content = ((page.content ?? []) as Block[]).slice()

    const alreadyHasAnchor = content.some(
      (b) => b.blockType === 'anchor' && b.anchorId === ANCHOR_ID,
    )
    if (alreadyHasAnchor) {
      console.log(`[step2] page ${pageId}: anchor "${ANCHOR_ID}" already present — skipping.`)
      continue
    }

    const sectionIndex = content.findIndex((b) => b.blockName === sectionName)
    if (sectionIndex === -1) {
      throw new Error(
        `[step2] page ${pageId}: could not find contact section block (blockName="${sectionName}"). ` +
          `Aborting — refusing to guess insertion point.`,
      )
    }

    const anchorBlock: Block = {
      blockType: 'anchor',
      blockName: 'contact',
      anchorId: ANCHOR_ID,
    }
    content.splice(sectionIndex, 0, anchorBlock)

    await payload.update({
      collection: 'pages',
      id: pageId,
      data: { content } as never,
      context: { skipDeploy: true },
    })
    console.log(
      `[step2] page ${pageId}: inserted anchor "${ANCHOR_ID}" before block "${sectionName}" (index ${sectionIndex}).`,
    )
  }

  // ---- Step 3: append a self-referencing "Contact" menu item ----
  for (const pageId of [56, 55]) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
    const menuItems = ((page.menuItems ?? []) as MenuItem[]).slice()

    if (menuItems.some((m) => m.anchor === ANCHOR_ID)) {
      console.log(`[step3] page ${pageId}: Contact menu item already present — skipping.`)
      continue
    }

    menuItems.push({ page: pageId, label: 'Contact', anchor: ANCHOR_ID })

    await payload.update({
      collection: 'pages',
      id: pageId,
      data: { menuItems } as never,
      context: { skipDeploy: true },
    })
    console.log(`[step3] page ${pageId}: appended Contact menu item (page=${pageId}, anchor=${ANCHOR_ID}).`)
  }

  // ---- Step 4a: remove menuItems pointing to page 60 from EVERY page ----
  for (const pageId of ALL_PAGE_IDS) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
    const menuItems = (page.menuItems ?? []) as MenuItem[]
    const pageRef = (m: MenuItem) => (typeof m.page === 'object' && m.page ? (m.page as { id?: number }).id : m.page)
    const filtered = menuItems.filter((m) => pageRef(m) !== CONTACT_PAGE_ID)
    if (filtered.length !== menuItems.length) {
      await payload.update({
        collection: 'pages',
        id: pageId,
        data: { menuItems: filtered } as never,
        context: { skipDeploy: true },
      })
      console.log(
        `[step4a] page ${pageId}: removed ${menuItems.length - filtered.length} menuItem(s) referencing page 60.`,
      )
    } else {
      console.log(`[step4a] page ${pageId}: no menuItem references page 60.`)
    }
  }

  // ---- Step 4b: repoint "/contact" string links → "#contact" on 56 & 55 ----
  for (const pageId of [56, 55]) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
    const { value: newContent, changed } = deepReplaceContactUrl(page.content)
    if (changed > 0) {
      await payload.update({
        collection: 'pages',
        id: pageId,
        data: { content: newContent } as never,
        context: { skipDeploy: true },
      })
      console.log(`[step4b] page ${pageId}: repointed ${changed} "/contact" → "#contact" link(s).`)
    } else {
      console.log(`[step4b] page ${pageId}: no "/contact" string links to repoint.`)
    }
  }

  // ---- Step 5: delete the dedicated contact page (id 60) ----
  const existing = await payload
    .findByID({ collection: 'pages', id: CONTACT_PAGE_ID, depth: 0 })
    .catch(() => null)
  if (existing) {
    await payload.delete({
      collection: 'pages',
      id: CONTACT_PAGE_ID,
      context: { skipDeploy: true } as never,
    })
    console.log(`[step5] deleted contact page (id ${CONTACT_PAGE_ID}, slug "${existing.slug}").`)
  } else {
    console.log(`[step5] contact page (id ${CONTACT_PAGE_ID}) already absent — skipping.`)
  }

  console.log('Item 6 complete.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
