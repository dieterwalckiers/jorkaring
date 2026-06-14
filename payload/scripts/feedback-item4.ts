/**
 * Client feedback — Item 4
 * Jorka: "kan het woord Aanbod op pagina individu wat groter, deze gaat nu
 * enorm verloren bij de rest van de tekst."
 *
 * On the individu homepage (voor-particulieren, id 56) the "Aanbod" section
 * title is a richText block (blockName "titel Aanbod", content index 6). It is
 * currently a Lexical `h2` heading, which renders at the same size as the
 * SplitTextImage section titles ("Wie ben ik", etc.) but — sitting alone above
 * the offering cards in a muted colour — reads as a faint label and gets lost.
 *
 * Fix: bump the "Aanbod" heading from `h2` to `h1` so it reads as a confident,
 * prominent section heading. The editorial type scale (web/app/assets/css/main.css)
 * renders h1 at clamp(2rem, …, 3.5rem) vs h2 at clamp(1.625rem, …, 2.625rem) —
 * a meaningful, on-brand step up without being absurdly large.
 *
 * Only richtext JSON is mutated (no schema/enum changes → no DB migration).
 *
 * Idempotent: skips if the "Aanbod" heading is already an h1.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 56
const BLOCK_INDEX = 6
const TARGET_TAG = 'h1'

interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

async function run() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Array<Record<string, any>>

  const block = content[BLOCK_INDEX]
  if (!block || block.blockType !== 'richText' || block.blockName !== 'titel Aanbod') {
    throw new Error(
      `Expected content[${BLOCK_INDEX}] to be the richText "titel Aanbod" block, ` +
        `got blockType=${block?.blockType} blockName=${block?.blockName}. Aborting.`,
    )
  }

  const children: LexicalNode[] = block.content?.root?.children ?? []
  const heading = children.find(
    (n) =>
      n.type === 'heading' &&
      (n.children ?? []).some((c) => (c.text ?? '').trim() === 'Aanbod'),
  )

  if (!heading) {
    throw new Error('Could not find the "Aanbod" heading node inside the block. Aborting.')
  }

  if (heading.tag === TARGET_TAG) {
    console.log(`Item 4 already applied — "Aanbod" is already <${TARGET_TAG}>. Skipping.`)
    return
  }

  const previousTag = heading.tag
  heading.tag = TARGET_TAG

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content } as never,
    context: { skipDeploy: true },
  })

  console.log(
    `Item 4 applied: bumped "Aanbod" heading from <${previousTag}> to <${TARGET_TAG}> ` +
      `on voor-particulieren (page ${PAGE_ID}, block ${BLOCK_INDEX}).`,
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
