#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
until PGPASSWORD=$DB_PASS psql -h "$DB_HOST" -U "$DB_USER" -c '\q'; do
  >&2 echo "Waiting for database connection..."
  sleep 1
done

>&2 echo "Database is up - running migrations"

npm run migration:run

>&2 echo "Migrations complete - starting application"

exec "$@"
