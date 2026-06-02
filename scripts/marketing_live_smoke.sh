#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[live] checking Marketing App compile-time and focused go-live contracts"
npm run check
npx vitest run server/pr64g.goLiveCompletion.test.ts server/pr64f.frontendFlowRescue.test.ts
grep -q "runMarketingLiveSmokeCheck" server/routers.ts
grep -q 'app.get("/m/:code"' server/_core/index.ts
grep -q "createMarketingAttributionLink" server/modules/marketing/deliverable-composer/index.ts
echo "[live] PASS: runMarketingLiveSmokeCheck, export quality gate, attribution creation, and /m/:code click route are wired."
echo "[live] NOTE: invoke Admin Support runMarketingLiveSmokeCheck with executeLiveProviders=true on VPS for credential-backed Qwen/HF proof."
