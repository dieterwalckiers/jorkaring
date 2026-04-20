# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jorkaring is a CMS-driven website with two independent apps:
- **`payload/`** — Payload CMS 3.0 backend (Next.js 15, React 19, PostgreSQL 16)
- **`web/`** — Nuxt 4 frontend (Vue 3.5, Tailwind CSS 4, Nuxt UI 4) built as a static site (SSG)

Content flows: Editors manage pages in Payload admin → content changes trigger GitHub Actions via webhook (`triggerDeploy.ts` hook) → Nuxt generates static HTML from the Payload API → deployed to GitHub Pages.

## Development Commands

### Local Development (Docker)

```bash
docker-compose up                    # Start all services (postgres, payload, web, storybook)
```
- Frontend: http://localhost:3201
- CMS Admin: http://localhost:3202/admin
- Storybook: http://localhost:6006

### Payload CMS (`payload/`)

All commands run inside the `payload` container:

```bash
docker compose exec payload npm run dev              # Next.js dev server
docker compose exec payload npm run build            # generate:importmap + next build
docker compose exec payload npm run generate:types   # Regenerate payload-types.ts
docker compose exec payload npm run migrate          # Run DB migrations
docker compose exec payload npm run export:content   # Export content as JSON backup
docker compose exec payload npm run restore:content  # Restore from backup
```

### Web Frontend (`web/`, uses pnpm)

All commands run inside the `web` container:

```bash
docker compose exec web pnpm run dev                 # Nuxt + Storybook concurrently
docker compose exec web pnpm run dev:nuxt            # Nuxt only
docker compose exec web pnpm run dev:storybook       # Storybook only
docker compose exec web pnpm run generate            # Static site generation
docker compose exec web pnpm run build-storybook     # Build Storybook
```

## Architecture

### Block System

The core content model is a **block-based page builder**:

1. **Payload blocks** are defined in `payload/src/blocks/` (ContactForm, ContentGrid, Hero, NewsletterSignup, RichText, Spacer, SplitTextImage, Table, Testimonials, Video)
2. **Frontend block components** live in `web/app/components/blocks/` and are dispatched by `BlockRenderer.vue` based on `blockType`
3. **Types** are defined in `web/app/types/blocks.ts` as a `ContentBlock` union type

When adding a new block: define it in `payload/src/blocks/`, register it in `payload/src/collections/Pages.ts`, create a Vue component in `web/app/components/blocks/`, add a case in `BlockRenderer.vue`, and extend the types in `web/app/types/blocks.ts`.

Block visibility in the admin UI is controlled by the `hiddenBlockSlugs` array in `payload/src/blocks/index.ts`. Add a block's slug there to hide it from the editor. `Pages.ts` imports the filtered `pageBlocks` list, so no other file needs to change.

### API Communication (`web/app/composables/usePayload.ts`)

- **Server-side** rendering uses `config.payloadApiUrl` (Docker internal URL: `http://payload:3000/api`)
- **Client-side** uses `config.public.payloadApiUrl` (public URL: `http://localhost:3202/api`)
- `useMediaUrl()` converts relative media paths to absolute URLs — must be called at top-level of `<script setup>`, not inside `computed()`

### Routing

- `web/app/pages/index.vue` — Home page, fetches the page with slug `'home'`
- `web/app/pages/[...slug].vue` — All other pages, resolved by slug from Payload API
- Routes are pre-rendered at build time via a hook in `nuxt.config.ts` that fetches all pages from the API

### Rich Text

Uses Lexical editor with custom features in `payload/src/features/` (font-size, text-color, styled-upload). Frontend rendering is handled by `web/app/components/RichTextRenderer.vue`.

### Global Configuration

`payload/src/globals/SiteSettings.ts` defines site-wide settings (logo, styling, fonts, sticky messages, cookie consent). Consumed on the frontend via `useSiteSettings()`.

## Environment Variables

See `.env.example`. Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `PAYLOAD_SECRET` — CMS encryption secret
- `PAYLOAD_PUBLIC_SERVER_URL` — Public URL of the Payload server
- `NUXT_PUBLIC_PAYLOAD_API_URL` — Payload API URL for the frontend
- `GITHUB_TOKEN` / `GITHUB_REPO` — For deploy webhook

## Deployment

- **CMS**: Railway (see `payload/railway.toml`)
- **Frontend**: Static site built by GitHub Actions and deployed to GitHub Pages (`.github/workflows/deploy.yml`)
- **Content backup**: `./export-content.sh` / `./restore-content.sh` (supports `--production` flag via Railway CLI). Both scripts target the `jorkaring` Railway service by default; override with `RAILWAY_SERVICE=<name>` if renamed. Production restores run inside the payload container.

## Knowledge base

Longer-form operational notes (gotchas, troubleshooting, undocumented infra behavior) live in `docs/knowledge-base/`. Check there before debugging anything production-adjacent. Current entries:

- `restore-production-data.md` — pulling production content down into local
- `restore-local-data-to-production.md` — pushing local content up to production

When you learn something non-obvious about the stack (especially anything that took more than a few minutes to figure out), add or update a doc in that directory rather than only leaving it in a commit message.

## Conventions

- Payload uses npm; web uses pnpm
- The web app builds with base URL `/jorka/` in production (`nuxt.config.ts`)
- Storybook has viewport presets for mobile devices defined in `.storybook/preview.ts`

## Design Context

### Users
Prospective clients evaluating whether to engage Jorkaring for its services. They arrive curious, likely comparing a few providers, and need to quickly form a sense of credibility, taste, and care. The job-to-be-done is: "help me feel confident enough in these people to reach out." Conversion happens through trust, not persuasion — the site earns an inquiry rather than chasing it.

### Brand Personality
Refined, editorial, considered. The voice is calm and assured — never loud, never salesy, never overclaiming. Reads more like a well-edited magazine feature than a product page. Emotional target: quiet confidence in the visitor, a sense that things here are handled with intention and without shortcuts.

### Aesthetic Direction

**Visual references (aim for this feel):**
- Editorial / magazine: NYT, The Guardian, Are.na — strong typographic hierarchy, considered grids, room to breathe, long-form comfort.
- Warm / organic / lifestyle: Aesop, Frama, Studio McGee — muted earthy palette, honest imagery, humane tone, tactile restraint.

**Anti-references (actively avoid):**
- Generic SaaS / AI-startup aesthetics: purple gradients, floating glass/blur cards, neon accents, "Built with AI" decoration, grid-of-feature-cards hero sections, aggressive CTAs, shiny 3D mesh blobs. These signal wrong category and break trust for this audience.

**Palette (client-locked — do not substitute):**
- `#194E55` Moss green — primary
- `#99B7E8` Sky blue — primary
- `#EDE3D9` Off-white — accent / surfaces
- `#8F6C53` Woody — accent

Moss and sky carry the work; off-white and woody are for surfaces, dividers, secondary type, and small accents. Avoid pushing woody or off-white into primary roles. These values are wired through the CMS theme colors, so reach them via CSS variables (`--color-theme*`, `--color-main-bg`, etc.) rather than hardcoding hex.

**Typography (locked):**
- Headings: Playfair Display (400, 700) — editorial, serif, confident.
- Body / UI: Inter (400, 600) — neutral, legible, quiet.
- The pairing is intentional and preserved. Don't introduce a third family. Use weight and size — not new faces — for hierarchy.

**Mode:** Light mode only. Dark mode is explicitly disabled site-wide; don't design for it.

### Design Principles

1. **Editorial before interface.** Treat each page like a considered spread: strong hierarchy, generous whitespace, considered line lengths (~60–75ch for body), serif headlines doing real work. If a layout could run in a magazine, it's on track.
2. **Restraint is the feature.** Fewer elements, more space, quieter motion. When in doubt, remove. Avoid decorative flourishes that don't earn their place (no purple gradients, no glass cards, no neon).
3. **Warm, not cold.** Lean on the moss + woody + off-white side of the palette to keep the overall feel humane. Sky blue adds lift and openness — use it as room, not as accent spam. Pure white is rarely the right background; prefer `#EDE3D9` off-white for warmth.
4. **Motion should feel considered, never showy.** Existing work already uses `cubic-bezier(0.33, 1, 0.68, 1)` (ease-out-cubic) for header condensing — match that character. Motion exists to clarify, not to impress. Respect `prefers-reduced-motion`.
5. **Credibility through craft.** This audience notices alignment, consistent spacing, typographic detail, and tasteful hovers. Polish the last 10% — it's the thing that earns the inquiry.
