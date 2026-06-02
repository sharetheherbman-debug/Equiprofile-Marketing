#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[stock] verifying Pexels/Pixabay normalization and category-aware queries"
npx vitest run server/marketingStockMediaService.test.ts server/pr64g.goLiveCompletion.test.ts -t "stock|Pexels|Pixabay"
if [[ -z "${MARKETING_PEXELS_API_KEY:-${PEXELS_API_KEY:-}}" && -z "${MARKETING_PIXABAY_API_KEY:-${PIXABAY_API_KEY:-}}" ]]; then
  echo "[stock] SETUP: Pexels/Pixabay keys required for live stock media."
else
  echo "[stock] key detected; use Media Studio to run a live stock search."
fi
