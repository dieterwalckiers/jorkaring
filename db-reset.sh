#!/bin/bash
# Reset the Payload database (drops all data)
echo "Resetting database..."
docker compose exec postgres psql -U payload -d payload -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
echo "Database reset complete. Restart payload to recreate schema:"
echo "  docker compose restart payload"
