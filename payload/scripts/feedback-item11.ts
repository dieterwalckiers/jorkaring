/**
 * Client feedback — Item 11
 * "Over mij" hero (over-mij, id 54) — no rotating loop, just static text.
 *
 * Jorka: the hero headline shouldn't be a loop, it should just be the line
 * "Van rugpatiënt naar bergbeklimmer en alles daartussen" (note the ë). All
 * subtext and other hero content stays intact.
 *
 * Replaces the `heroRotatingHeadline` sub-block (nested in content[0].content)
 * with a `heroHeadline` sub-block at the same array position. Both block types
 * already exist in the schema, so this is a pure JSON content edit — no DB
 * migration required. The new heroHeadline mirrors the richText shape of the
 * sibling subtext heroHeadline (root → paragraph → textNode), fontSize 'h1'.
 *
 * Also corrects the spelling: "rugpatient" → "rugpatiënt".
 *
 * Idempotent: no-ops if there's no heroRotatingHeadline left (already replaced).
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 54
const STATIC_HEADLINE = 'Van rugpatiënt naar bergbeklimmer en alles daartussen'

const textNode = (text: string, style = '') => ({
  mode: 'normal',
  text,
  type: 'text',
  style,
  detail: 0,
  format: 0,
  version: 1,
})

const paragraph = (children: unknown[], format = '') => ({
  type: 'paragraph',
  format,
  indent: 0,
  version: 1,
  direction: null,
  textStyle: '',
  textFormat: 0,
  children,
})

async function run() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Array<Record<string, unknown>>

  const heroBlock = content[0] as Record<string, unknown> | undefined
  if (!heroBlock || heroBlock.blockType !== 'hero') {
    console.log('Item 11: content[0] is not a hero block — nothing to do.')
    return
  }

  const heroChildren = (heroBlock.content ?? []) as Array<Record<string, unknown>>
  const rotatingIdx = heroChildren.findIndex((b) => b.blockType === 'heroRotatingHeadline')

  if (rotatingIdx === -1) {
    console.log('Item 11 already applied (no heroRotatingHeadline found) — skipping.')
    return
  }

  const staticHeadline = {
    blockType: 'heroHeadline',
    blockName: null,
    fontSize: 'h1',
    text: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [paragraph([textNode(STATIC_HEADLINE)])],
      },
    },
  }

  const newHeroChildren = heroChildren.map((b, i) => (i === rotatingIdx ? staticHeadline : b))
  const newContent = content.map((b, i) =>
    i === 0 ? { ...heroBlock, content: newHeroChildren } : b,
  )

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content: newContent } as never,
    context: { skipDeploy: true },
  })

  console.log(
    `Item 11 applied: replaced heroRotatingHeadline (index ${rotatingIdx}) with a static heroHeadline ("${STATIC_HEADLINE}") on over-mij.`,
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
