#!/bin/sh

echo "🔄 Waiting for Postgres on db:5432..."

# Wait for Postgres to be up
until nc -z db 5432; do
  sleep 1
done

echo "✅ Postgres is available!"

echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

echo "🔄 Seeding database..."
pnpm exec tsx prisma/seed.ts

echo "🚀 Starting NestJS application..."
exec node dist/src/main
