#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[media] verifying playable-output truth and renderer contracts"
npx vitest run server/marketingMediaFactory.core.test.ts server/pr62b.mediaTruthImageGeneration.test.ts
echo "[media] PASS: completed media requires playable output; optional providers remain setup-truthful."
