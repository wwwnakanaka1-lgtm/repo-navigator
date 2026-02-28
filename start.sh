#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "[Repo Navigator] node_modules not found. Installing dependencies..."
  npm install
fi

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
fi

PORT=3000
while command -v lsof >/dev/null 2>&1 && lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

APP_URL="http://localhost:${PORT}/"
echo "[Repo Navigator] Opening browser: ${APP_URL}"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${APP_URL}" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "${APP_URL}" >/dev/null 2>&1 || true
fi

if [ ! -f .next/BUILD_ID ]; then
  echo "[Repo Navigator] Production build not found. Running build..."
  npm run build
fi

npm run start -- --port "${PORT}"
