/**
 * Client feedback — Item 7
 * Menu consistency / dead-end fix.
 *
 * Bug (Jorka): on the "over mij" page the top menu showed only a bare set of
 * page links (Over mij / Voor bedrijven / Voor particulieren, no labels, no
 * "Home"/"Aanbod" structure, plus a pointless self-link to itself). It felt
 * like a dead-end compared to the other pages. Several other override pages
 * (boek-je-gesprek, the aanbod pages) were similarly bare or had empty labels.
 *
 * Fix: normalize every override page's `menuItems` to a consistent set that
 * always lets a visitor reach the main pages and never produces a broken
 * anchor link.
 *
 * Convention applied (mirrors what voor-particulieren(56) / voor-bedrijven(55)
 * already did well — each page is its own "Home" within its funnel):
 *   - Home          -> the page's funnel home (56 for particulier/neutral pages,
 *                      55 for bedrijf pages), top of page (no anchor)
 *   - Aanbod        -> funnel-home #aanbod
 *   - Over mij      -> 54
 *   - Resultaten    -> 56 #resultaten   (particulier/neutral funnel)
 *     / Reviews     -> 55 #reviews      (bedrijf funnel)
 *   - Boek je gesprek -> 59  (included on the particulier/neutral funnel pages,
 *                             matching page 56's existing menu)
 *   - Contact       -> funnel-home #contact
 *
 * Anchor targets are only ever pointed at a page that actually contains that
 * anchor block (verified: 56 has aanbod/resultaten/contact; 55 has
 * aanbod/reviews/contact). On the funnel-home page itself these become in-page
 * smooth-scroll links; on every other page they become cross-page links
 * (/<slug>#<anchor>), both handled by TheHeader.vue.
 *
 * CANONICAL-HOME ASSUMPTION (flag for the client): voor-particulieren (56) is
 * treated as the canonical "Home" for neutral pages (over-mij 54, boek-je-
 * gesprek 59). If the client prefers a different landing page, change FUNNEL
 * below.
 *
 * Idempotent: only updates a page when its menuItems actually differ.
 * No migration needed — menuItems is array/JSON data, not enum schema.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

type MenuItem = { page: number; label: string | null; anchor: string | null }

const PARTICULIER = 56 // voor-particulieren — canonical "Home" for neutral pages
const BEDRIJF = 55 // voor-bedrijven
const OVER_MIJ = 54
const BOEK = 59

// Menu for the particulier / neutral funnel (home = 56).
const particulierMenu = (home: number, ownAanbodPage?: number): MenuItem[] => [
  { page: home, label: 'Home', anchor: null },
  // On an aanbod page, "Aanbod" points at that page's own top; elsewhere at the home #aanbod.
  ownAanbodPage
    ? { page: ownAanbodPage, label: 'Aanbod', anchor: null }
    : { page: home, label: 'Aanbod', anchor: 'aanbod' },
  { page: OVER_MIJ, label: 'Over mij', anchor: null },
  { page: home, label: 'Resultaten', anchor: 'resultaten' },
  { page: home, label: 'Contact', anchor: 'contact' },
  { page: BOEK, label: null, anchor: null }, // "Boek je gesprek in" — label falls back to title; CTA style is page-driven
]

// Menu for the bedrijf funnel (home = 55).
const bedrijfMenu = (home: number, ownAanbodPage?: number): MenuItem[] => [
  { page: home, label: 'Home', anchor: null },
  ownAanbodPage
    ? { page: ownAanbodPage, label: 'Aanbod', anchor: null }
    : { page: home, label: 'Aanbod', anchor: 'aanbod' },
  { page: OVER_MIJ, label: 'Over mij', anchor: null },
  { page: home, label: 'Reviews', anchor: 'reviews' },
  { page: PARTICULIER, label: null, anchor: null }, // link across to the particulier funnel
  { page: home, label: 'Contact', anchor: 'contact' },
]

// Target menu per page id.
const TARGETS: Record<number, MenuItem[]> = {
  // voor-particulieren (home of particulier funnel) — keep its existing good shape.
  56: particulierMenu(PARTICULIER),
  // voor-bedrijven (home of bedrijf funnel) — keep its existing good shape.
  55: bedrijfMenu(BEDRIJF),
  // over-mij — neutral page, no on-page anchors. THE PRIMARY FIX.
  54: particulierMenu(PARTICULIER),
  // aanbod-particulier — particulier funnel, own aanbod page.
  57: particulierMenu(PARTICULIER, 57),
  // aanbod-bedrijf — bedrijf funnel, own aanbod page.
  58: bedrijfMenu(BEDRIJF, 58),
  // boek-je-gesprek-in — neutral page, no on-page anchors.
  59: particulierMenu(PARTICULIER),
}

function sameMenu(current: Array<Record<string, unknown>>, target: MenuItem[]): boolean {
  if (current.length !== target.length) return false
  return current.every((c, i) => {
    const t = target[i]
    const cPage = typeof c.page === 'object' && c.page ? (c.page as { id: number }).id : c.page
    const cLabel = (c.label ?? null) || null
    const cAnchor = (c.anchor ?? null) || null
    return cPage === t.page && cLabel === (t.label || null) && cAnchor === (t.anchor || null)
  })
}

async function run() {
  const payload = await getPayload({ config })
  let changed = 0

  for (const [idStr, target] of Object.entries(TARGETS)) {
    const id = Number(idStr)
    const page = await payload.findByID({ collection: 'pages', id, depth: 0 })
    const current = (page.menuItems ?? []) as Array<Record<string, unknown>>

    if (page.overrideMainMenu && sameMenu(current, target)) {
      console.log(`page ${id} (${page.slug}) — already normalized, skipping.`)
      continue
    }

    await payload.update({
      collection: 'pages',
      id,
      data: {
        overrideMainMenu: true,
        menuItems: target.map((m) => ({ page: m.page, label: m.label, anchor: m.anchor })),
      } as never,
      context: { skipDeploy: true },
    })
    console.log(`page ${id} (${page.slug}) — menu normalized (${target.length} items).`)
    changed += 1
  }

  console.log(`Item 7 done. ${changed} page menu(s) updated.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
