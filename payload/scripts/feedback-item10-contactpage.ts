/**
 * Client feedback — Item 10
 * Dedicated contact page brought back, same layout as the homepage contact section.
 *
 * Context (item 6): the old dedicated contact page (id 60) was deleted and its
 * job moved into in-page #contact sections on voor-particulieren (56) /
 * voor-bedrijven (55). Jorka still wants a separate `/contact` page for the
 * bedrijven + aanbod "contact" links, and asked that it use the SAME layout as
 * the homepage (voor-particulieren) contact section.
 *
 * TASK A — (re)create the `contact` page:
 *   - Page title "Contact", slug "contact", published. Idempotent (update if it
 *     already exists).
 *   - Its content REUSES page 56 content[15] — the `splitTextImage` block with
 *     blockName "contact details" (photo 200 left / "Ben je klaar…" heading /
 *     subtext / email+phone+socials with inline icons / "Boek je vrijblijvend
 *     gesprek in" button). Deep-cloned at runtime with all nested `id` keys
 *     stripped so Payload assigns fresh ones.
 *   - An `anchor` block (anchorId 'contact') is placed immediately before it so a
 *     same-page #contact menu item works (mirrors pages 55/56).
 *   - Normalized override menu (item-7 convention), neutral page so funnel
 *     Home = voor-particulieren (56), but its own Contact item is a same-page
 *     anchor at this page.
 *
 * TASK B — retarget the contact links that live OUTSIDE 55/56 to /contact:
 *   - 54 over-mij        — menuItem 'Contact' {56,'contact'} -> {newId,null}
 *   - 57 aanbod-particulier — menuItem 'Contact' {56,'contact'} -> {newId,null}
 *   - 58 aanbod-bedrijf  — menuItem 'Contact' {55,'contact'} -> {newId,null}
 *   - 58 aanbod-bedrijf  — hero CTA link url '/voor-bedrijven#contact' -> '/contact'
 *   - 59 boek-je-gesprek-in — menuItem 'Contact' {56,'contact'} -> {newId,null}
 *   Pages 55 and 56 are deliberately left untouched (in-page #contact stays).
 *
 * No migration needed — only a page row + content/menuItems JSON edits.
 * Idempotent throughout. context: { skipDeploy: true }.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const SOURCE_PAGE_ID = 56 // voor-particulieren — holds the canonical "contact details" split
const CONTACT_BLOCK_NAME = 'contact details'
const PARTICULIER = 56
const OVER_MIJ = 54
const BOEK = 59

type Json = Record<string, unknown>
type MenuItem = { page: number; label: string | null; anchor: string | null }

/** Deep-clone a block tree, dropping every `id` key so Payload regenerates them. */
function cloneStripId<T>(value: T): T {
  const cloned = JSON.parse(JSON.stringify(value))
  const strip = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(strip)
    } else if (node && typeof node === 'object') {
      const obj = node as Json
      delete obj.id
      Object.values(obj).forEach(strip)
    }
  }
  strip(cloned)
  return cloned
}

function getPageId(rel: unknown): number | null {
  if (typeof rel === 'number') return rel
  if (rel && typeof rel === 'object' && 'id' in rel) return (rel as { id: number }).id
  return null
}

async function run() {
  const payload = await getPayload({ config })

  // --- Fetch & clone the source "contact details" split block --------------
  const source = await payload.findByID({ collection: 'pages', id: SOURCE_PAGE_ID, depth: 0 })
  const sourceContent = (source.content ?? []) as Array<Json>
  const sourceSplit = sourceContent.find((b) => b.blockName === CONTACT_BLOCK_NAME)
  if (!sourceSplit) {
    throw new Error(`Could not find a "${CONTACT_BLOCK_NAME}" block on page ${SOURCE_PAGE_ID}`)
  }

  const splitClone = cloneStripId(sourceSplit)
  const anchorBlock = { blockType: 'anchor', anchorId: 'contact', blockName: 'contact' }
  const newPageContent = [anchorBlock, splitClone]

  // --- TASK A: create or update the contact page ---------------------------
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' } },
    depth: 0,
    limit: 1,
  })

  let contactId: number

  // Menu built after we know the page id (its own Contact is a same-page anchor).
  const buildMenu = (selfId: number): MenuItem[] => [
    { page: PARTICULIER, label: 'Home', anchor: null },
    { page: PARTICULIER, label: 'Aanbod', anchor: 'aanbod' },
    { page: OVER_MIJ, label: 'Over mij', anchor: null },
    { page: PARTICULIER, label: 'Resultaten', anchor: 'resultaten' },
    { page: selfId, label: 'Contact', anchor: 'contact' },
    { page: BOEK, label: null, anchor: null },
  ]

  if (existing.docs.length > 0) {
    contactId = existing.docs[0].id as number
    const menu = buildMenu(contactId)
    await payload.update({
      collection: 'pages',
      id: contactId,
      data: {
        title: 'Contact',
        slug: 'contact',
        _status: 'published',
        showInMenu: true,
        overrideMainMenu: true,
        content: newPageContent,
        menuItems: menu,
      } as never,
      context: { skipDeploy: true },
    })
    console.log(`Contact page existed — updated (id ${contactId}).`)
  } else {
    // Create first without a self-referential menu, then patch the menu in.
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact',
        slug: 'contact',
        _status: 'published',
        showInMenu: true,
        overrideMainMenu: true,
        content: newPageContent,
      } as never,
      context: { skipDeploy: true },
    })
    contactId = created.id as number
    await payload.update({
      collection: 'pages',
      id: contactId,
      data: { menuItems: buildMenu(contactId) } as never,
      context: { skipDeploy: true },
    })
    console.log(`Contact page created (id ${contactId}).`)
  }

  // --- TASK B: retarget contact links outside 55/56 ------------------------
  let retargets = 0

  // Menu-item retargets on pages 54/57/58/59: Contact -> {contactId, null}.
  for (const pageId of [OVER_MIJ, 57, 58, BOEK]) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
    const menu = (page.menuItems ?? []) as Array<Json>
    let touched = false
    const next = menu.map((m) => {
      if (m.label !== 'Contact') return m
      const curPage = getPageId(m.page)
      if (curPage === contactId && (m.anchor ?? null) === null) return m // already done
      touched = true
      return { ...m, page: contactId, anchor: null }
    })
    if (!touched) {
      console.log(`page ${pageId} (${page.slug}) — Contact menu item already retargeted, skipping.`)
      continue
    }
    await payload.update({
      collection: 'pages',
      id: pageId,
      data: { menuItems: next } as never,
      context: { skipDeploy: true },
    })
    console.log(`page ${pageId} (${page.slug}) — Contact menu item -> /contact.`)
    retargets += 1
  }

  // Page 58 hero CTA body link: /voor-bedrijven#contact -> /contact.
  {
    const page = await payload.findByID({ collection: 'pages', id: 58, depth: 0 })
    const content = (page.content ?? []) as Array<Json>
    const clone = JSON.parse(JSON.stringify(content)) as Array<Json>
    let touched = false
    for (const block of clone) {
      const inner = (block.content ?? []) as Array<Json>
      if (!Array.isArray(inner)) continue
      for (const c of inner) {
        const links = (c.links ?? []) as Array<Json>
        if (!Array.isArray(links)) continue
        for (const link of links) {
          if (link.url === '/voor-bedrijven#contact') {
            link.url = '/contact'
            touched = true
          }
        }
      }
    }
    if (touched) {
      await payload.update({
        collection: 'pages',
        id: 58,
        data: { content: clone } as never,
        context: { skipDeploy: true },
      })
      console.log('page 58 (aanbod-bedrijf) — hero CTA url -> /contact.')
      retargets += 1
    } else {
      console.log('page 58 (aanbod-bedrijf) — hero CTA already /contact (or not found), skipping.')
    }
  }

  console.log(`Item 10 done. Contact page id=${contactId}, ${retargets} link(s) retargeted.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
