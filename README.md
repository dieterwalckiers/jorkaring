# jorkaring

A full-stack CMS project with Nuxt frontend and Payload CMS backend.

## Local Development

```bash
# Start all services with Docker Compose
docker-compose up

# Access the services:
# - Frontend: http://localhost:3201
# - CMS Admin: http://localhost:3202/admin
# - Storybook: http://localhost:6006
```

## Project Structure

```
├── payload/          # Payload CMS (backend)
│   └── src/
│       ├── collections/
│       ├── blocks/
│       └── payload.config.ts
├── web/              # Nuxt frontend
│   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   └── composables/
│   └── .storybook/
└── docker-compose.yml
```

## Backup & Restore

Export and restore CMS content (pages, media, site settings) as JSON backups.

### Local Backup

```bash
# Export content from local Docker environment
./export-content.sh [backup-name]

# Restore content to local Docker environment
./restore-content.sh <backup-name>
```

### Production Backup

```bash
# Export from production database
./export-content.sh --production

# Restore to production (requires Railway CLI)
./restore-content.sh <backup-name> --production
```

### Prerequisites for Production

1. **Railway CLI**: Install and link to your project (`railway login && railway link`)
2. **Public Database URL**: Enable public networking on your Railway Postgres service and set `DATABASE_PUBLIC_URL`
3. **Persistent Volume**: Create a Railway volume mounted at `/app/public/uploads` for media files

Backups are stored in `payload/backups/` and are gitignored.

## Deployment

- **CMS:** Deployed on Railway
- **Frontend:** Static site generated and deployed via FTP

Content changes in the CMS automatically trigger a rebuild of the static site.
