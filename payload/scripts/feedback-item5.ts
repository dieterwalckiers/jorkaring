/**
 * Client feedback — Item 5
 * CTA button under the results/testimonials section of the individu homepage
 * (voor-particulieren, id 56).
 *
 * Jorka: "kan er onder de resultaten (die twee kolommen met tekst van klanten)
 * misschien nog een knop met: Wil jij dit ook, laten we kennismaken."
 *
 * Approach A (preferred): a `richText` block whose content is a single centered
 * paragraph containing the inline `button` block (slug 'button', see
 * payload/src/features/buttonInlineBlock.ts). The frontend RichTextRenderer.vue
 * renders an inlineBlock with blockType 'button' as a real centered button when
 * the button's `align` field is 'center'. No DB migration needed — inline blocks
 * live inside the lexical JSON.
 *
 * Inserted right after the Testimonials block (content[10]), i.e. at index 11,
 * so it sits directly under the two columns of client text.
 *
 * Idempotent: skips if a block tagged blockName 'item5-results-cta' already exists.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 56
const MARKER = 'item5-results-cta'
const BUTTON_CAPTION = 'Wil jij dit ook, laten we kennismaken.'
const BUTTON_LINK = '/boek-je-gesprek-in'

async function run() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Array<Record<string, unknown>>

  if (content.some((b) => b.blockName === MARKER)) {
    console.log('Item 5 already applied — skipping.')
    return
  }

  // Locate the testimonials block; insert directly after it (fallback to index 11).
  const testimonialsIdx = content.findIndex((b) => b.blockType === 'testimonials')
  const insertAt = testimonialsIdx >= 0 ? testimonialsIdx + 1 : 11

  const buttonInlineBlock = {
    type: 'inlineBlock',
    version: 1,
    fields: {
      caption: BUTTON_CAPTION,
      link: BUTTON_LINK,
      align: 'center',
      newTab: false,
      blockType: 'button',
    },
  }

  const ctaBlock = {
    blockType: 'richText',
    blockName: MARKER,
    variant: 'body',
    width: 'full',
    margin: 'small',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          {
            type: 'paragraph',
            format: 'center',
            indent: 0,
            version: 1,
            direction: null,
            textStyle: '',
            textFormat: 0,
            children: [buttonInlineBlock],
          },
        ],
      },
    },
  }

  const newContent = [
    ...content.slice(0, insertAt),
    ctaBlock,
    ...content.slice(insertAt),
  ]

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content: newContent } as never,
    context: { skipDeploy: true },
  })

  console.log(
    `Item 5 applied: inserted CTA button RichText at index ${insertAt} (after testimonials) on voor-particulieren.`,
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
