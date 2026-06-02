#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[scraper] verifying public crawl, category truth, and private chat rejection"
npx vitest run server/pr64g.goLiveCompletion.test.ts -t "PR64G product truth and public crawler"
echo "[scraper] PASS: free same-origin HTML crawl works without Firecrawl"
