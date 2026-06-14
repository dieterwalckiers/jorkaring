/**
 * Client feedback — Item 8
 * E-book lead-capture flow.
 *
 * Jorka: "De pop up voor het gratis e-book is naar een invulformuliertje waar ze
 * naam, emailadres kunnen invullen en ze dan mijn pdf kunnen downloaden. Zo
 * verkrijg ik hun mailadressen voor latere mailmarketing."
 *
 * This script:
 *  1. Uploads the e-book PDF to the Media collection (from the mounted
 *     /app/scripts/ebook.pdf — the host /home/dyte/temp dir is NOT mounted).
 *     Idempotent: reuses an existing media item with the same alt text.
 *  2. Seeds SiteSettings.ebook: enabled=true, pdf=<uploaded id>,
 *     mailchimpActionUrl — reuses an existing NewsletterSignup block's Mailchimp
 *     action URL if one is configured anywhere; otherwise leaves it EMPTY (a
 *     human must paste the e-book leads audience URL, see CLIENT-FEEDBACK-TODO.md
 *     item 8). When empty, the popup still delivers the PDF download.
 *  3. Seeds a tasteful e-book promo Toast with an inline button linking to
 *     '#ebook' — the site-wide convention that opens the e-book popup. This
 *     gives one live, visible trigger so the flow is testable.
 *
 * All updates use context:{ skipDeploy:true } so they don't fire a deploy.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PDF_PATH = '/app/scripts/ebook.pdf'
const PDF_ALT = 'E-book: In 10 dagen naar minder hinder in je rug'

async function run() {
  const payload = await getPayload({ config })

  // 1. Upload the PDF (idempotent on alt text).
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: PDF_ALT } },
    limit: 1,
  })

  let mediaId: number
  let mediaUrl: string | null | undefined
  if (existing.docs.length > 0) {
    mediaId = existing.docs[0]!.id as number
    mediaUrl = existing.docs[0]!.url
    console.log(`PDF already in Media (id ${mediaId}) — reusing.`)
  } else {
    const created = await payload.create({
      collection: 'media',
      data: { alt: PDF_ALT },
      filePath: PDF_PATH,
    })
    mediaId = created.id as number
    mediaUrl = created.url
    console.log(`PDF uploaded to Media: id ${mediaId}, url ${mediaUrl}, mimeType ${created.mimeType}`)
  }

  // 2a. Try to reuse an existing NewsletterSignup Mailchimp action URL as a
  //     sensible default for the e-book leads audience. If none is configured
  //     anywhere yet, leave it empty (human follow-up).
  let mailchimpActionUrl = ''
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const blocks = (settings as { splashPage?: { content?: Array<Record<string, unknown>> } })?.splashPage?.content ?? []
    for (const b of blocks) {
      if (b.blockType === 'newsletterSignup' && typeof b.mailchimpActionUrl === 'string' && b.mailchimpActionUrl.trim()) {
        mailchimpActionUrl = b.mailchimpActionUrl.trim()
        break
      }
    }
    if (!mailchimpActionUrl) {
      const pages = await payload.find({ collection: 'pages', depth: 0, limit: 200 })
      for (const page of pages.docs) {
        const layout = (page as { layout?: Array<Record<string, unknown>> }).layout ?? []
        const hit = layout.find(
          (blk) => blk.blockType === 'newsletterSignup' && typeof blk.mailchimpActionUrl === 'string' && (blk.mailchimpActionUrl as string).trim(),
        )
        if (hit) {
          mailchimpActionUrl = (hit.mailchimpActionUrl as string).trim()
          break
        }
      }
    }
  } catch (e) {
    console.warn('Could not scan for an existing Mailchimp action URL:', (e as Error).message)
  }

  // 2b. Seed the ebook config.
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ebook: {
        enabled: true,
        pdf: mediaId,
        mailchimpActionUrl,
        buttonCaption: 'Download gratis e-book',
      },
    } as never,
    context: { skipDeploy: true },
  })
  if (mailchimpActionUrl) {
    console.log(`SiteSettings.ebook seeded (enabled, pdf=${mediaId}, mailchimpActionUrl reused from an existing NewsletterSignup block).`)
  } else {
    console.log(`SiteSettings.ebook seeded (enabled, pdf=${mediaId}, mailchimpActionUrl EMPTY).`)
    console.log('  ⚠ HUMAN STEP: paste the e-book leads audience Mailchimp action URL into SiteSettings → E-book. Until then the popup skips lead capture but still delivers the PDF download.')
  }

  // 3. Seed a promo toast with an inline '#ebook' button.
  const ebookButton = {
    type: 'inlineBlock',
    version: 1,
    fields: {
      caption: 'Download hier je gratis e-book',
      link: '#ebook',
      align: 'left',
      newTab: false,
      blockType: 'button',
    },
  }

  const toastContent = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textStyle: '',
          textFormat: 0,
          children: [
            {
              mode: 'normal',
              text: 'Ga in 10 dagen naar minder hinder in je rug.',
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textStyle: '',
          textFormat: 0,
          children: [ebookButton],
        },
      ],
    },
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      toast: {
        enabled: true,
        content: toastContent,
        position: 'bottomRight',
        displayDelaySeconds: 0,
        dismissible: true,
        autoDismissSeconds: 0,
        rememberDismissal: false,
        dismissalKey: 'ebook-promo-1',
        pageVisibility: 'all',
      },
    } as never,
    context: { skipDeploy: true },
  })
  console.log('Promo toast seeded with an inline "#ebook" button (bottom-right, no delay, rememberDismissal off for testing).')

  console.log('\nItem 8 seed complete.')
  console.log(`  media id:  ${mediaId}`)
  console.log(`  media url: ${mediaUrl}`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
