#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[connectors] verifying truthful missing-credential and provider-ID contracts"
npx vitest run server/pr50.schedulerSocial.test.ts server/pr60.backendGeniusSettings.test.ts -t "publish|connector readiness"
if grep -R "createPlatformPublisherStub" server/modules/marketing/social-publishing/adapters/*.ts >/dev/null; then
  echo "[connectors] BLOCKER: social and email posting adapters remain stubs. Export/manual flow is available; direct posting is not go-live."
else
  echo "[connectors] posting adapters are executable; run credential-backed platform tests on VPS."
fi
