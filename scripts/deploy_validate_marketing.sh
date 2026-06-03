#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[deploy-validate] running Marketing App deployment gates"
npm run check
npm test
npm run preflight
npm run build
bash scripts/marketing_workspace_smoke.sh
bash scripts/marketing_render_fallback_smoke.sh
bash scripts/marketing_provider_routes_smoke.sh
bash scripts/marketing_runtime_smoke.sh
echo "[deploy-validate] PASS: all Marketing App deployment gates passed."
