# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jorkaring is a CMS-driven website with two independent apps:
- **`payload/`** — Payload CMS 3.0 backend (Next.js 15, React 19, PostgreSQL 16)
- **`web/`** — Nuxt 4 frontend (Vue 3.5, Tailwind CSS 4, Nuxt UI 4) built as a static site (SSG)

Content flows: Editors manage pages in Payload admin → content changes trigger GitHub Actions via webhook (`triggerDeploy.ts` hook) → Nuxt generates static HTML from the Payload API → deployed via FTP.

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
- **Frontend**: Static site deployed via FTP through GitHub Actions (`.github/workflows/deploy.yml`)
- **Content backup**: `./export-content.sh` / `./restore-content.sh` (supports `--production` flag via Railway CLI)

## Conventions

- Payload uses npm; web uses pnpm
- The web app builds with base URL `/jorka/` in production (`nuxt.config.ts`)
- Storybook has viewport presets for mobile devices defined in `.storybook/preview.ts`
