# Client feedback triage — Jorka, juni 2026

Synthesized from the email thread (Jorka's two mails + clarifications). Each item is marked
`actor: agent` (an agent can do it given railway CLI / CMS API access) or `actor: human`
(needs a design/content decision, an asset, or the ask is too unclear to act on).

> **Note on actor split:** almost all content lives in Payload CMS (SplitTextImage, Hero, nav,
> testimonials, Calendly page are all CMS-editable). With railway CLI access an agent can seed/edit
> that content directly. So most items are `agent`. Items are `human` only where a real decision,
> a missing asset (PDF / photo), or genuine ambiguity blocks the work.

> **Image handling:** where an item needs an image but doesn't name one, the agent should use **any
> existing Media item as a placeholder** — Dieter will swap it manually afterwards. Do **not** treat a
> missing image as a blocker. The one exception is item 1, where Jorka explicitly asked to reuse the
> hero photo: the agent should read the actual Media ID off the `voor-particulieren` hero block and
> reuse that exact image, not a random one.

---

## ⚠️ Blocking clarifications (resolve before agent work starts)

- ~~**Which page is "de homepagina individu"?**~~ **Resolved:** it is the **`voor-particulieren`** page
  (the page with the hero, aanbod, wie ben ik). All "individu/homepage" items below target `voor-particulieren`.
- **Font conflict — see item 12.** This is a brand decision that touches every other text item below
  (the new contact copy specifies "Archivo Black" / "Archivo Narrow"). Decide first. `actor: human`
- **Assets needed from Jorka:** the e-book PDF (item 8) and the Calendly URL to wire into all the buttons.
  (Images are *not* blockers — placeholders are fine, see the image-handling note above.)

---

## 1. Contact-blok onderaan de homepage (individu) — ✅ DONE

- **DONE (2026-06-13):** Appended to `voor-particulieren` (id 56), below the "Wie ben ik" section, a
  `SplitTextImage` block (photo **left** / text **right**) reusing the hero photo (media 200), with the
  "Ben je klaar…" headline, the "Boek dan…" subline, and a **Boek je vrijblijvend gesprek in** button →
  `/boek-je-gesprek-in`. Directly below it, a `RichText` block with "Nog vragen of bedenkingen?…" + the
  email/phone-with-icons contact line **reused verbatim from the existing contact page**. Verified visually.
  Built via `payload/scripts/feedback-item1.ts`. Socials turned out **not** to be a blocker — the reused
  contact line already carries working Instagram (`jorkaring`) and LinkedIn (`jorka-ring`) links.
  _Human follow-up (optional): swap the placeholder/hero photo for a dedicated contact photo if desired._
- **actor: agent**
- **Where:** `voor-particulieren` page (the individu homepage), append below the "wie ben ik" section.
- **How:** new `SplitTextImage` block — photo one side, text the other (Jorka: "foto links – tekst rechts").
  Reuse the hero photo. The block already supports image + richtext + buttons.
- **Copy (groot):** "Ben je klaar om alles uit het leven te halen en je rug je leven niet te laten bepalen?"
- **Copy (kleiner, eronder):** "Boek dan je vrijblijvende kennismakingsgesprek met me in via de knop hieronder."
- **Button → Calendly** (the `boek-je-gesprek-in` page / Calendly URL).
- **Daaronder:** "Nog vragen of bedenkingen? Neem gerust eerst contact met me op:" + e-mailadres + telefoonnummer + social media handles.
- **Blocker:** needs the email/phone/socials list + Calendly URL from Jorka (email & phone exist on the
  current `contact` page: `jorka.ring@gmail.com`, `0479730195` — confirm socials).

## 2. Contact-blok voor de bedrijven-pagina (zelfde lay-out) — ✅ DONE

- **DONE (2026-06-13):** Appended to the END of `voor-bedrijven` (id 55) the same pattern as item 1: a
  `SplitTextImage` block (photo **left** / text **right**), with the "Wil jij ook een lager ziekteverzuim…"
  headline, the "Neem gerust contact op via e-mail of plan een vrijblijvende videocall in…" subline, and a
  **Boek je vrijblijvend gesprek in** button → `/boek-je-gesprek-in`. Directly below it, a `RichText` block
  with "Neem gerust contact op:" (centered) + the email/phone-with-icons contact line **reused verbatim from
  the existing contact page** (id 60) — same working `jorka.ring@gmail.com` / `0479730195` / Instagram /
  LinkedIn links as item 1. Verified via API (blocks `item2-contact-cta` + `item2-contact-details` at the end
  of `content`) and visually on the rendered page. Built via `payload/scripts/feedback-item2.ts`.
  _Human follow-up: item 2 named no photo, so the placeholder reuses the bedrijven **hero** image (media 210);
  swap it for a dedicated contact photo when available._
- **actor: agent**
- **Where:** `voor-bedrijven` page (and/or the dedicated contact page reached from the bedrijven buttons — see item 10).
- **How:** same `SplitTextImage` photo/text split as item 1.
- **Copy (groot):** "Wil jij ook een lager ziekteverzuim, hogere productiviteit en meer werkplezier op de werkvloer?"
- **Copy (eronder):** "Neem gerust contact op via e-mail of plan een vrijblijvende videocall in. Samen bekijken we
  hoe ergonomie, beweging en duurzame gewoontes kunnen bijdragen aan een gezonde en productieve werkvloer."
- **Button → Calendly** + e-mailadres, gsm-nummer en social media handles eronder.

## 3. Hero-knop (individu) gaat niet naar Calendly — ✅ DONE

- **DONE (2026-06-13):** On `voor-particulieren` (id 56), the hero `heroCta` block (nested in
  `content[0].content`) had its "Boek je vrijblijvend gesprek in" link pointing to `/contact`.
  Changed that single link's `url` to `/boek-je-gesprek-in` (the Calendly page); the sibling
  `#aanbod` anchor link was left untouched. Matched the link by `url === '/contact'` / label
  containing "gesprek" to avoid disturbing the anchor. Built via `payload/scripts/feedback-item3.ts`
  (idempotent, `skipDeploy: true`). Verified via API (`/api/pages/56?depth=0` now shows
  `url: "/boek-je-gesprek-in"`, `#aanbod` unchanged) and visually on the rendered page — the hero
  CTA anchor href resolves to `http://localhost:3201/boek-je-gesprek-in`.
- **actor: agent**
- **Bug.** Jorka: "Bij de hero (op pagina individu) gaat de knop voor vrijblijvend gesprek niet naar calendly."
- **How:** on `voor-particulieren`, the hero CTA is a CMS field (`HeroCta` → `links[].url`). Set the url to the Calendly page.
  Verify it actually renders/links after the change.

## 4. "Aanbod" groter maken (individu) — ✅ DONE

- **DONE (2026-06-13):** On `voor-particulieren` (id 56), the "Aanbod" section title is a richText
  block (blockName "titel Aanbod", `content[6]`). It was a Lexical **`h2`** heading — rendering at the
  same 42px as the SplitTextImage section titles, but sitting alone above the offering cards in a muted
  off-white colour, so it read as a faint label and got lost. **Bumped it from `h2` to `h1`**, which the
  editorial type scale (`web/app/assets/css/main.css`) renders at `clamp(2rem, …, 3.5rem)` vs h2's
  `clamp(1.625rem, …, 2.625rem)` — a confident, on-brand step up (Playfair, no new styling). Only the
  richtext JSON was mutated (no schema/enum change → no DB migration). Built via
  `payload/scripts/feedback-item4.ts` (idempotent — no-ops if already `h1`; `skipDeploy: true`).
  **Verified:** API (`/api/pages/56?depth=0` → `content[6]` heading `tag: "h1"`); visually on the rendered
  page the computed font-size went **42px → 56px** and "Aanbod" now reads as a prominent section heading,
  no longer lost in the surrounding text.
  _Human follow-up (optional, taste): if Dieter wants it larger/smaller still, fine-tune by switching the
  tag (h1↔h2) or adjusting the `editorial-heading--h1` clamp; current h1 was chosen to match the page's
  other section titles while clearly out-ranking them._
- **actor: agent**
- Jorka: "kan het woord Aanbod op pagina individu wat groter, deze gaat nu enorm verloren bij de rest van de tekst."
  (page: `voor-particulieren`)
- **How:** investigate whether "Aanbod" is a block heading (has a `fontSize` field) or a richtext H2.
  Bump its size. If it's global richtext styling, scope the change so it doesn't blow up every heading.

## 5. Knop onder de resultaten / testimonials — ✅ DONE

- **DONE (2026-06-13):** Used **Approach A (inline button block)**. The recent inline-block work added a
  `button` inlineBlock (`payload/src/features/buttonInlineBlock.ts`, slug `button`) that
  `RichTextRenderer.vue` renders as a real `.btn-outline-inline` button, centered when the paragraph's
  button has `align: 'center'`. Inserted a `richText` block (blockName `item5-results-cta`) on
  `voor-particulieren` (id 56) **directly after the Testimonials block** — at `content[11]`, right after
  `content[10]` (testimonials), pushing "Wie ben ik" down. Its content is a single centered paragraph
  containing the inline button: caption **"Wil jij dit ook, laten we kennismaken."** → `/boek-je-gesprek-in`
  (the Calendly page). No DB migration needed (inline blocks live in the lexical JSON). Built via
  `payload/scripts/feedback-item5.ts` (idempotent — skips if `item5-results-cta` exists; `skipDeploy: true`).
  **Verified:** API (`/api/pages/56?depth=0` → block `item5-results-cta` at index 11, inline `button`
  caption + link `/boek-je-gesprek-in`); visually via Playwright — a clear centered outlined button renders
  directly under the testimonials carousel ("01 / 03" pager + "Linde" quote) and above "Wie ben ik", with
  `href` resolving to `http://localhost:3201/boek-je-gesprek-in`. On-brand (outlined, restrained, centered).
  Chose A over the SplitTextImage fallback because A is lighter for a lone centered button.
  _No human follow-up required._
- **actor: agent**
- Jorka: "kan er onder de resultaten (die twee kolommen met tekst van klanten) misschien nog een knop met:
  Wil jij dit ook, laten we kennismaken."
- **How:** the `Testimonials` block has **no CTA field**. Add a separate block (RichText or small
  SplitTextImage) with the button directly after the Testimonials block. Button → Calendly / contact section.

## 6. "Contact" toevoegen aan de menubalk (individu) — ✅ DONE

- **DONE (2026-06-13):** Client decision baked in — **there is no longer a dedicated contact page**; the
  in-page contact sections (items 1 & 2) replace it. So the **contact page (id 60, slug `contact`) was
  deleted** (safety backup taken first: `payload/backups/pre-item6`). On both `voor-particulieren` (id 56)
  and `voor-bedrijven` (id 55) an `anchor` block with id **`contact`** was inserted immediately **before**
  the in-page contact `splitTextImage` section (block "contact details" on 56, "item2-contact-cta" on 55 —
  the cta+details blocks were merged into one splitTextImage since items 1/2 were written), and a
  self-referencing menu item **`{ page: <self>, label: "Contact", anchor: "contact" }`** was appended last
  to each page's `menuItems`. The frontend renders a same-page anchor menu item as `<a href="#contact">`
  (TheHeader's `samePageAnchor` branch), so clicking **Contact** smooth-scrolls to the in-page contact
  section. All dead menu-override references to page 60 were removed first (pages **54, 55, 58, 59** each
  had one — page 56 had none) to avoid dangling relationship rows before the delete. String `/contact`
  links were repointed `/contact` → `#contact` **only on the pages that have an in-page contact section**:
  page **55**'s hero "Neem contact op" CTA (1 link). Page 56 had no `/contact` string links. Built via
  `payload/scripts/feedback-item6.ts` (idempotent, `skipDeploy: true`). **Verified:** API (page 60 gone —
  6 pages, no `contact` slug; no menuItem references 60; both 55/56 have the `contact` anchor right before
  their contact section + a Contact menu item); functionally via Playwright on both pages — the header shows
  a **Contact** item, clicking it puts `#contact` in the URL and scrolls the "Ben je klaar…" / "Wil jij ook…"
  contact section into view with the menu item highlighted (screenshots `item6-particulieren-contact.jpeg`,
  `item6-bedrijven-contact.jpeg`). No new console/runtime error (only a pre-existing dev-mode Vue hydration
  warning; no 404 for a missing /contact route).
  ✅ **Resolved (2026-06-13):** the one dangling `/contact` link — **aanbod-bedrijf (id 58)** heroCta
  "Ontdek wat ik kan betekenen voor jouw bedrijf" — was repointed to **`/voor-bedrijven#contact`**
  (cross-page anchor to the bedrijven in-page contact section), per client instruction. Built via
  `payload/scripts/feedback-item10-page58.ts`; verified the rendered href is `/voor-bedrijven#contact`
  and the target page returns 200. **over-mij (54)** and **aanbod-particulier (57)** have **no** `/contact`
  string links. No dangling `/contact` links remain.
- **actor: agent**
- Jorka: "ik vermoed als op de pagina individu onderaan contact komt dat bovenaan in de balk daar ook contact
  bij moet komen? Ik volg jouw advies hierin op." → Yes, add it.
- **How:** add a nav entry pointing to the contact section/page (CMS: page `showInMenu`/`menuOrder`,
  or an anchor menu item to the on-page contact block). Decide anchor-to-section vs link-to-contact-page.

## 7. Menubalk-inconsistentie op "Over mij" (en mogelijk andere pagina's) — ✅ DONE

- **actor: agent**
- **Bug.** Jorka: "als ik op de over mij pagina zit dan zie ik bovenaan in de balk: voor bedrijven, voor
  particulieren. Zo dit dezelfde set up kunnen krijgen als al de rest? Met home, aanbod,... erop.
  Als mensen nu naar de eerste pagina weer willen lukt dat niet."
- **How:** some pages set `overrideMainMenu: true` with a custom `menuItems` array (the Contact page and
  likely over-mij). Normalize so every page shows the same global menu (home / aanbod / … / contact), or
  fix the override's items so users can navigate back. Audit all pages for stray overrides.

- **DONE (2026-06-13):** Audited all 6 override pages and normalized their `menuItems` via
  `payload/scripts/feedback-item7.ts` (Local API, `skipDeploy`, idempotent).

  **Audit (before).** Every page has `overrideMainMenu: true`. Anchors that actually exist:
  voor-particulieren(56)=`aanbod/resultaten/contact`, voor-bedrijven(55)=`aanbod/reviews/contact`;
  over-mij(54) and boek-je-gesprek(59) have **no** anchors; the aanbod pages (57/58) only have
  sub-section anchors. Findings:
  - **over-mij(54) — the reported bug:** menu was 3 bare unlabeled page-links
    (`54→self`, `55`, `56`) → rendered as "Over mij / Voor bedrijven / Voor particulieren", no
    Home/Aanbod, plus a useless self-link. Felt like a dead-end vs. the other pages.
  - 55 & 56 were already the "good" 6-item template (each its own funnel Home).
  - 57/58 were bare/partial (missing main links; 58 had an empty-string label on the 56 link).
  - 59 was 4 bare unlabeled links incl. a self-link.

  **Convention applied (mirrors 55/56).** Each page keeps a 6-item menu where each item is one of
  Home / Aanbod / Over mij / (Resultaten|Reviews) / (Boek je gesprek|cross-funnel link) / Contact.
  Anchor items are only ever pointed at a page that contains that anchor, so cross-page links resolve
  to `/<slug>#<anchor>` and same-page ones smooth-scroll. Funnel home = 56 for the
  particulier/neutral pages (54, 56, 57, 59), 55 for the bedrijf pages (55, 58).

  **Pages changed:** all 6 (54, 55, 56, 57, 58, 59) rewritten to the normalized 6-item menus
  (55/56 re-asserted identically; 54/57/58/59 substantively fixed). No dead-ends; no broken anchors.

  **Verified (Playwright, desktop):** on /over-mij the header now shows
  HOME / AANBOD / OVER MIJ / RESULTATEN / CONTACT / BOEK JE GESPREK IN; clicking "Home" navigates to
  /voor-particulieren (dead-end gone). Cross-page anchor items resolve to `/voor-particulieren#…`;
  on-page anchors on 55/56 render as in-page `#…` smooth-scroll. Screenshot:
  `item7-over-mij-header.jpeg`.

- **⚠️ HUMAN FOLLOW-UP / ASSUMPTION:** There is **no `home` page** (the de-facto homes are
  voor-particulieren and voor-bedrijven). I treated **voor-particulieren (56) as the canonical "Home"**
  for the neutral pages (over-mij, boek-je-gesprek) and for their Aanbod/Resultaten/Contact cross-page
  anchor links. If you'd rather those neutral pages land on a different page (or want a slimmer menu on
  them), change `PARTICULIER`/the per-page `TARGETS` map in `payload/scripts/feedback-item7.ts` and
  re-run. The bedrijf pages (aanbod-bedrijf) point their Home/anchors at voor-bedrijven (55).
- **UPDATE (2026-06-13, per client):** the **over-mij "Home"** item now points to the **site root `/`**
  (the splash landing / funnel chooser), not to voor-particulieren. Mechanism: `TheHeader.vue` now treats
  a `menuItems` entry whose `anchor` is an absolute path (e.g. `/`) as a direct route link (no migration —
  `anchor` is free text). Data set via `payload/scripts/feedback-overmij-home-root.ts`. Verified: the
  over-mij Home link is `href="/"` and lands on the splash. _This same `anchor="/"` trick can repoint any
  other page's "Home" to root if you want it site-wide — say the word._

## 8. E-book pop-up → invulformulier met lead-capture — ✅ DONE (Mailchimp + instant download)

- **REWORKED (2026-06-14):** The first build used **Tally**, but Tally's autoresponder is a paid feature,
  so the client chose a **free** approach. The flow now: capture the lead via the project's existing
  **client-side Mailchimp** pattern (JSONP — no API key, no server) and deliver the PDF by **instant
  in-browser download** on submit. **No Tally, no server, no email-to-visitor.** This matches Jorka's ask
  exactly ("ze kunnen mijn pdf downloaden" + "zo verkrijg ik hun mailadressen voor latere mailmarketing").
  - **PDF asset (unchanged):** `ebook.pdf` at **Media id 233**, url `http://localhost:3202/api/media/file/ebook.pdf`,
    mimeType `application/pdf`. `Media.ts` `mimeTypes` keeps `['image/*', 'application/pdf']` (upload config, no
    migration). Verified: GET returns **200 application/pdf**.
  - **CMS config:** the `ebook` group in `payload/src/globals/SiteSettings.ts` now has `enabled` (checkbox),
    **`mailchimpActionUrl`** (text — Mailchimp classic form action URL, same kind as the Newsletter block),
    `pdf` (upload→media), `buttonCaption` (text). The old `tallyFormId` field was **removed**.
    NEW migration **`20260614_120000_ebook_tally_to_mailchimp`** drops `ebook_tally_form_id` and adds
    `ebook_mailchimp_action_url` (varchar, nullable) on both `site_settings` and `_site_settings_v`
    (`version_` prefix). Registered in `migrations/index.ts`, ran `npm run migrate`, regenerated
    `payload-types.ts` (now has `ebook.mailchimpActionUrl`, no `tallyFormId`). Web type
    `web/app/types/siteSettings.ts` `SiteEbook` updated to match. Seeded via `payload/scripts/feedback-item8.ts`
    (Local API, `skipDeploy:true`, idempotent): `ebook.enabled=true`, `ebook.pdf=233`,
    `ebook.buttonCaption='Download gratis e-book'`, and `ebook.mailchimpActionUrl` — the seed scans existing
    NewsletterSignup blocks for a configured Mailchimp URL to reuse; **none is configured anywhere yet, so it
    was left EMPTY** (human follow-up below). When empty, the popup skips lead capture but still delivers the
    download.
  - **Frontend popup (rewritten):** `web/app/components/EbookPopup.vue` — all Tally code removed. Keeps the
    site-wide **`#ebook` global-click convention**: a single delegated `document` click listener intercepts
    any anchor whose href is `#ebook` (or ends in `#ebook`), `preventDefault()`s it, and opens our **own
    on-brand modal** (teleported to body, moss-green scrim, off-white card, Playfair/Archivo heading per CMS,
    Esc + overlay-click + × to close, `prefers-reduced-motion` respected, ease-out-cubic entrance). Fields:
    **Voornaam (FNAME)** + **E-mailadres (EMAIL)**, submit caption from `ebook.buttonCaption`. On submit it
    validates the email client-side, JSONP-subscribes to Mailchimp using `ebook.mailchimpActionUrl` (FNAME +
    EMAIL + honeypot `b_{u}_{id}` — same helper as `NewsletterSignupBlock.vue`), then triggers the PDF
    download (url resolved at setup via `useMediaUrlResolver()`).
  - **Download UX (2026-06-14):** submitting the form **no longer auto-downloads** anything (an automatic
    save/file-picker on submit felt disorienting). Instead it lands on an **enriched thank-you state**
    (moss-green check badge, "Bedankt! / Je e-book staat klaar", a warm line, a prominent **"Download je
    e-book"** button, and a small reassurance line about occasional tips + easy unsubscribe). The PDF only
    downloads when the visitor **clicks that button**. `downloadPdf()` **fetches the PDF as a blob** and saves
    it from a same-origin object URL with a friendly filename (`In-10-dagen-naar-minder-hinder-in-je-rug.pdf`)
    — the cross-origin `download`-attribute limitation is why it used to open a new tab; CORS already allows
    the site origin (`payload.config.ts` cors list). Falls back to opening the file only if the blob fetch is
    blocked. Lead capture (Mailchimp) still runs on submit, independent of the download. Verified via
    Playwright: submit shows the thank-you with no auto-download/new-tab; clicking the button fires a real
    file download.
    **The PDF is delivered on any terminal result** — Mailchimp `result:'success'`, "already subscribed"
    (`result:'error'` with a msg matching `/already/i`), or even a hard network error (the value exchange
    already happened, so we still download and show a friendly notice + manual `<a download>` fallback link).
    If `mailchimpActionUrl` is empty, the subscribe step is skipped (dev-only `console.warn`) and the download
    still fires. Loading/success/error states mirror `NewsletterSignupBlock`.
  - **Live test trigger (unchanged):** promo **toast** (bottom-right, no delay, `rememberDismissal` off,
    dismissalKey `ebook-promo-1`) "Ga in 10 dagen naar minder hinder in je rug." with an inline `button`
    → `#ebook`.
  - **Verified (Playwright on /voor-particulieren):** toast button click **opens OUR modal** (Voornaam +
    E-mailadres, NOT a Tally iframe) — on-brand, readable on the live moss/off-white theme (screenshot
    `ebook-modal-fixed.jpeg`). Filling the form + submitting **fires the PDF download** (opens the media url;
    manual fallback `<a download>` href === `http://localhost:3202/api/media/file/ebook.pdf`) and shows the
    "Bedankt!" success state. With the URL empty, the dev warning logged and the download still fired. PDF url
    **200 application/pdf**. `grep -i tally` on EbookPopup.vue → none. `payload-types.ts` has
    `mailchimpActionUrl`, no `ebook.tallyFormId`. Web compiles clean, pages serve 200 (the only remaining
    console error is a **pre-existing** `TheHeader` hydration mismatch, unrelated to this work).

- **⚠️ HUMAN FOLLOW-UP (Item 8):**
  1. **Create (or reuse) a Mailchimp audience for e-book leads** and paste its **classic form action URL**
     (same kind of `…list-manage.com/subscribe/post-json?u=…&id=…` URL as the Newsletter block) into
     **SiteSettings → E-book lead capture → Mailchimp action URL**. Set that audience to **single opt-in** so
     subscribers are added immediately (the download already fires regardless, but single opt-in keeps the
     lead list clean and avoids a confirmation step). Until this is set, the popup still delivers the PDF but
     **captures no leads**.
  2. **Decide final placement/copy** of the `#ebook` CTA button(s). The current bottom-right promo **toast**
     is a test trigger — keep, restyle, or remove it (SiteSettings → Toast). Any CMS button/link with URL
     `#ebook` opens the popup.
  3. **Optional (future):** if Jorka later wants the visitor to ALSO receive the PDF by email, that's a
     separate **free** add-on (e.g. a Brevo automation, or a small Railway SMTP endpoint) — not built now.

- **actor: agent** (build) — **human** must supply the Mailchimp e-book-leads action URL.
- Jorka: "De pop up voor het gratis e-book is naar een invulformuliertje waar ze naam, emailadres kunnen
  invullen en ze dan mijn pdf kunnen downloaden. Zo verkrijg ik hun mailadressen voor latere mailmarketing."

## 9. Calendly-pagina herindelen (split lay-out + tekst links) — ✅ DONE

- **DONE (2026-06-14):** The Calendly page (`boek-je-gesprek-in`, id 59) was a bare full-width embed.
  Reworked it into a **split layout: text LEFT, Calendly embed RIGHT** (stacks text-above-embed on mobile),
  by **extending the existing `CalendlyEmbed` block** (no new block).
  - **Block fields added** (`payload/src/blocks/CalendlyEmbed.ts`): `text` (richText, optional — inherits the
    default lexical editor exactly like SplitTextImage's `text`, so inline `icon` blocks + autolinks +
    font-size render identically), `textPosition` (select left/right, default `left`), `textPercentage`
    (number, default 45). Existing `url`/`style` kept. Backward-compatible: no `text` → embed-only full width.
  - **Migration:** `20260614_140000_item9_calendly_split` (hand-written — the auto-diff tool wanted to
    rename unrelated tables, so it was cancelled). Touches **only the two `pages` tables** the block lives in
    (`CalendlyEmbed` is in `pageBlocks` only, not SiteSettings): **`pages_blocks_calendly_embed`** and
    **`_pages_v_blocks_calendly_embed`**. Each gets a `text` jsonb (nullable), a `text_position` column backed
    by a new enum (`enum_pages_blocks_calendly_embed_text_position` + the `_v` copy, values 'left'/'right',
    default 'left'), and a `text_percentage` numeric (default 45). Registered in `migrations/index.ts`, ran
    `npm run migrate` (clean), regenerated `payload-types.ts` (now has `text`/`textPosition`/`textPercentage`
    on the calendlyEmbed block).
  - **Frontend:** `web/app/types/blocks.ts` `CalendlyEmbedBlock` extended with the three optional fields.
    `web/app/components/blocks/CalendlyEmbedBlock.vue` rewritten: when `text` has content it renders a
    `flex flex-col md:flex-row` row (text column via `<RichTextRenderer :content="block.text" />` + embed
    column), `textPosition` flips sides via `md:flex-row-reverse`, `textPercentage` sets the text width
    (embed takes the rest); mobile stacks text-above-embed. No `text` → original embed-only markup. Calendly
    `widget.js` `useHead` script kept. `BlockRenderer.vue` already dispatches `calendlyEmbed` (unchanged).
  - **Content:** `payload/scripts/feedback-item9.ts` (Local API, `skipDeploy:true`, idempotent — no-ops if the
    "Boek hier je vrijblijvende" heading already present) populates page 59's existing single `calendlyEmbed`
    block (no second block) with `textPosition:'left'` + a richtext root: an **h2** "Boek hier je vrijblijvende
    gesprek in", the "Klaar om weer voluit te leven…" paragraph, the "Vragen, bemerkingen… Contacteer me
    gerust." line, and the **email/phone/socials icon paragraphs**. Those icon paragraphs (with their working
    `mailto:` autolink, phone, instagram + linkedin links and inline `icon` blocks) are sourced at runtime
    from **page 56's `splitTextImage` block "contact details"** (children index 3=email/`at`, 4=phone,
    5=instagram+linkedin) — the dedicated contact page (id 60) was deleted in item 6.
  - **Fonts intentionally SKIPPED:** item 9's copy mentioned Archivo Black/Narrow, but that is gated on the
    item-12 brand decision which the client chose to skip. Used plain heading/paragraph tags so the existing
    Playfair Display (headings) + Inter (body) apply. The Archivo-font question remains deferred to item 12.
  - **Verified:** migration applied clean (columns + enums present, no errors); `boek-je-gesprek-in` serves
    **200**; SSR HTML contains the heading, both paragraphs, `mailto:jorka.ring@gmail.com`, `0479730195`, the
    `calendly-inline-widget`, and the `at`/`phone`/`instagram`/`linkedin` icons render as inline SVGs (with
    `aria-label`s). Playwright **desktop** (1280px): text column left, Calendly embed right — phone + mail
    icons clearly visible (`item9-calendly-desktop.jpeg`). Playwright **mobile** (390px): stacks text above
    embed (`item9-calendly-mobile.jpeg`). Idempotency re-run logged "already applied — skipping". The only
    console error is the **pre-existing** `TheHeader` hydration mismatch (known/unrelated); no new errors.
- **⚠️ HUMAN FOLLOW-UP:** The Archivo Black / Archivo Narrow fonts are still deferred to **item 12** (skipped
  for now). If item 12 is later honored, the heading/paragraph here will pick up the CMS fonts automatically
  (they're plain heading/body tags) — no rework of this block needed.

- **actor: agent** (layout/content) — depends on item 12 for fonts
- Jorka: "Calendly box wat naar rechts verplaatsen en links volgende tekst."
- **Layout:** text left, Calendly embed right.
- **Copy (groot — Archivo Black, zie item 12):** "Boek hier je vrijblijvende gesprek in"
- **Copy (Archivo Narrow eronder):** "Klaar om weer voluit te leven of je werking te optimaliseren? Prik een
  momentje bij me in. Tijdens een vrijblijvend kennismakingsgesprek bekijken we samen hoe jij of je bedrijf
  duurzaam vooruit kan."
- **Daaronder:** "Vragen, bemerkingen of een vrijblijvende offerte nodig? Contacteer me gerust." + e-mailadres,
  telefoonnummer en social media handles.
- **Icons:** "Een icoontje van telefoon, mail zou wel visueel aanspreken hierbij." → add phone/mail icons.
- **How:** the `CalendlyEmbed` block is currently a bare embed on page `boek-je-gesprek-in`. Needs a split
  layout around it (new layout/block, or place the embed inside a split container with the richtext).

## 10. Bedrijven/aanbod-knoppen → aparte contactpagina met dezelfde lay-out — ✅ DONE

- **DONE (2026-06-14):** Recreated a dedicated **`contact` page** (slug `contact`, **new id 61**, published)
  by **cloning page 56's "contact details" `splitTextImage` block** at runtime — so it carries the exact
  homepage (voor-particulieren) contact layout Jorka referenced: photo **left** (media 200), the "Ben je
  klaar om alles uit het leven te halen en je rug je leven niet te laten bepalen?" heading, the subtext, the
  email (`jorka.ring@gmail.com`) / phone (`0479730195`) / Instagram / LinkedIn contact line **with inline
  icons**, and the **Boek je vrijblijvend gesprek in** button → `/boek-je-gesprek-in`. All nested `id` keys
  were stripped on clone so Payload assigned fresh ones. An `anchor` block (`anchorId: 'contact'`) sits
  immediately before the split so a same-page `#contact` menu item works (mirrors pages 55/56). Gave it a
  normalized override menu (item-7 convention; neutral page → funnel Home = voor-particulieren 56), with its
  own Contact item as a same-page anchor `{page: 61, anchor: 'contact'}`. `overrideMainMenu: true`,
  `showInMenu: true`.
- **Retargeted the 5 contact links that live OUTSIDE 55/56** to the new `/contact` page (page relationship +
  null anchor → renders as a plain `/contact` link in TheHeader):
  - **54 over-mij** — menu "Contact" `{56,'contact'}` → `{61, null}`
  - **57 aanbod-particulier** — menu "Contact" `{56,'contact'}` → `{61, null}`
  - **58 aanbod-bedrijf** — menu "Contact" `{55,'contact'}` → `{61, null}`
  - **58 aanbod-bedrijf** — hero CTA "Ontdek wat ik kan betekenen voor jouw bedrijf" url `/voor-bedrijven#contact` → `/contact`
  - **59 boek-je-gesprek-in** — menu "Contact" `{56,'contact'}` → `{61, null}`
- **Per explicit decision, pages 55 and 56 were left untouched** — they keep their in-page `#contact`
  sections and same-page contact links, including the voor-bedrijven hero "Neem contact op" button on
  `#contact`.
- Built via `payload/scripts/feedback-item10-contactpage.ts` (idempotent: updates the page if slug `contact`
  already exists, no-ops retargets already pointing at /contact). **No migration** — only a page row +
  content/menuItems JSON edits.
- **Verified:** `http://localhost:3201/contact` returns **200** and renders photo-left / "Ben je klaar…"
  heading-right / subtext / email+phone+instagram+linkedin with 4 inline SVG icons / Boek-button →
  `/boek-je-gesprek-in` (curl SSR + Playwright screenshot). The /over-mij header Contact link href resolves
  to `/contact`. API re-fetch confirms 54/57/58/59 Contact items point at page 61 and page 58's hero CTA url
  is `/contact`; pages 55/56 Contact items still point in-page (`{55,'contact'}` / `{56,'contact'}`). Only
  console error is the known pre-existing TheHeader hydration mismatch (unrelated).
- _Human follow-up (optional): the contact page uses the **particulier-flavored** "Ben je klaar…" copy
  (per Jorka's referenced homepage layout). Swap copy/photo for a more neutral or bedrijven-specific version
  later if wanted._

<details><summary>Original triage (kept for reference)</summary>

- **actor: agent**
- ⚠️ **Context changed (item 6):** the **dedicated contact page (id 60) no longer exists** — it was deleted
  in item 6, with the in-page contact sections (items 1/2) replacing it. So the original framing ("point
  those buttons at a separate contact page with the same layout") is **no longer valid as written**. The two
  buttons currently still link to `/contact`, which now **404s**:
  - **aanbod-bedrijf (id 58)** — heroCta "Ontdek wat ik kan betekenen voor jouw bedrijf" → `/contact` (dangling).
  - The bedrijven hero "Vraag vrijblijvend informatie aan" button was a menu-override entry pointing at page
    60; that override ref was already removed in item 6. (Verify whether a body button with that copy still
    links to `/contact` when doing this item.)
- **Decision needed (human / item 10):** since there's no contact page anymore, either (a) give the
  aanbod-bedrijf page its own in-page contact `splitTextImage` + `anchor#contact` (same pattern as items 1/2)
  and repoint its button to `#contact`, or (b) repoint the button to an existing page's contact anchor
  (e.g. `/voor-bedrijven#contact`). Pick before implementing — do **not** leave the button on `/contact`.
- **How (original, kept for reference):** keep those two buttons pointing to a contact page, but make that
  contact page use the **same photo/text split layout** as the homepage contact block (items 1/2). Reuse the
  SplitTextImage pattern.

</details>

## 11. "Over mij" hero — geen loop, statische tekst — ✅ DONE

- **DONE (2026-06-14):** On `over-mij` (id 54), the hero block (`content[0]`) nested a `heroRotatingHeadline`
  sub-block (prefix "Van rugpatient…" + rotating words partner/loper/mama/wandelaar/collega/tuinier/fietser,
  `intervalMs` 2400) at position 1 of its `content` array. **Replaced it in place with a static `heroHeadline`**
  sub-block (`fontSize: 'h1'`, a richText root → paragraph → textNode containing the single static line
  **"Van rugpatiënt naar bergbeklimmer en alles daartussen"**). This was a **JSON-only content swap** — both
  block types already exist in the schema, so **no DB migration** was needed (no enum/column change). Also
  **corrected the spelling** the rotating block carried: "rugpatient" → **"rugpatiënt"** (with ë), per Jorka's
  exact wording. Kept the `heroSpacer` (index 0) and the subtext `heroHeadline` (index 2, the "Ik help
  rugpatiënten opnieuw grip krijgen…" paragraph at `h3`) **untouched**, preserving the order
  spacer → static headline → subtext. The frontend already has a `heroHeadline` renderer
  (`web/app/components/blocks/hero/HeroHeadlineBlock.vue`), so **no component change** was required. Built via
  `payload/scripts/feedback-item11.ts` (Local API, `findByID` page 54 depth 0, replaces the
  `heroRotatingHeadline` by index, `context: { skipDeploy: true }`, idempotent — no-ops if no
  `heroRotatingHeadline` remains).
  **Verified:** API (`/api/pages/54?depth=0`) → hero sub-blocks are now `heroSpacer / heroHeadline(h1) /
  heroHeadline(h3)`, the h1 text is exactly "Van rugpatiënt naar bergbeklimmer en alles daartussen", and
  `heroRotatingHeadline` is gone. `over-mij` serves **200**. SSR HTML contains the static headline (correct ë)
  and the subtext, the background image (media 228) is still present, and **none** of the rotating words
  (partner/loper/wandelaar/tuinier/fietser) appear in the rendered output. The known pre-existing `TheHeader`
  hydration warning is unrelated. _No human follow-up required._
- **actor: agent**
- Jorka: "op de pagina Over mij in de hero hoeft het geen loop te zijn. Het mag gewoon de tekst zijn:
  Van rugpatiënt naar bergbeklimmer en alles daartussen. De ondertekst enzo mag allemaal blijven."
- **How:** replace the `HeroRotatingHeadline` block on `over-mij` with a static headline (same text),
  keep all subtext/other hero content intact.

## 12. Lettertypes: Archivo Black / Archivo Narrow (brand-beslissing) — ✅ DONE

- **DONE (2026-06-14):** Client **decided to honor the Archivo/Raleway request** (overrides the original
  Playfair + Inter brief): **H1 = Archivo Black, H2–H6 = Archivo Narrow, body = Raleway**. These were already
  set in `SiteSettings.styling` (`googleFontH1` / `googleFontHeadings` / `googleFontBody`) and are applied at
  runtime by `web/app/app.vue`, which loads the Google Fonts and injects `body{Raleway}` / `h1{Archivo Black}`
  / `h2–h6{Archivo Narrow}` plus `--font-h1` / `--font-headings` CSS vars. **Verified on the live site**:
  `/boek-je-gesprek-in` loads the Archivo Black / Archivo Narrow / Raleway Google-Fonts stylesheets and the
  injected `font-family` rules apply; `web/app/assets/css/main.css` has **no** hardcoded Playfair/Inter
  overriding them, so the CMS fonts win — **no functional conflict remains**. The client also manually adjusted
  per-block stylings on `boek-je-gesprek-in` to match. Updated the **project `CLAUDE.md` typography lock** to
  the new Archivo/Raleway set (was Playfair + Inter) so future agents don't revert it.
  - _Optional cleanup (not blocking):_ `web/nuxt.config.ts` still lists Playfair Display + Inter in its
    `@nuxt/fonts` `families` preload — harmless (nothing references them; the runtime CMS fonts win) but can be
    trimmed to the Archivo/Raleway set when convenient. EbookPopup/ContentGridCounter keep Playfair/serif only
    as `var(--font-h1, …)` fallbacks, which never trigger since `--font-h1` is set.
- **actor: human** (decision) — **agent** (implementation once decided)
- The new copy (items 1, 2, 9) and Jorka's mail specify **Archivo Black** (H1) and **Archivo Narrow** (headings),
  with **Raleway** for body. The Payload SiteSettings are **already set** to these
  (`googleFontH1: Archivo Black`, `googleFontHeadings: Archivo Narrow`, `googleFontBody: Raleway`).
- **Conflict:** the project design brief (CLAUDE.md) locks typography to **Playfair Display + Inter**, and
  `web/nuxt.config.ts` **hardcodes** Playfair + Inter, which may be overriding/fighting the CMS values.
- **Decide (human):** honor the client's Archivo/Raleway request (overrides the brief), or push back and keep
  Playfair + Inter? This is a taste/brand call, not an agent call.
- **If Archivo/Raleway:** agent removes the hardcoded fonts in `nuxt.config.ts` so the CMS values apply cleanly,
  and verifies they load in the static build.

---

## Items copied literally (unclear — human to interpret)

- **"Misschien opbouw kleine tekst zoals foto in bijlage een beetje."** `actor: human`
  Refers to an attachment showing how the small text under the heading should be structured. Needs the image.
- **"Alsook zoals je zelf al klaarzette contactpagina."** — *Resolved* in the follow-up mail: it referred to the
  contact section at the bottom of the homepage **and** the (then) existing `contact` page. **Update (item 6,
  2026-06-13):** the client decided there is **no longer a dedicated contact page** — the in-page contact
  sections (items 1/2) replace it, and the `contact` page (id 60) was **deleted**. Future items must NOT
  assume a `/contact` page exists; use the in-page `#contact` anchors instead. Covered by items 1/2/6 (and
  item 10, which now needs rethinking — see its note).
