#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[provider-routes] verifying truthful model/media routing contracts"
npx vitest run \
  server/pr64i.liveGenerationRenderHardening.test.ts \
  server/marketingStockMediaService.test.ts \
  server/pr62b.mediaTruthImageGeneration.test.ts \
  server/_core/ai/providers/huggingFaceProvider.test.ts \
  -t "Settings truth|stock provider readiness|returns setup_needed when no image provider route is ready|classif|candidate|fallback"

if [[ -n "${QWEN_API_KEY:-}" ]]; then
  echo "[provider-routes] QWEN_API_KEY present: run Admin Support live provider test to prove text output on this host."
else
  echo "[provider-routes] SETUP: add QWEN_API_KEY or marketing_qwen_api_key for host-level Qwen proof."
fi
if [[ -n "${GENX_API_KEY:-}" ]]; then
  echo "[provider-routes] GENX_API_KEY present: run Settings live generation test to prove enabled GenX tasks."
else
  echo "[provider-routes] SETUP: add GENX_API_KEY or marketing_genx_api_key for GenX media proof."
fi
if [[ -n "${HUGGINGFACE_API_KEY:-}" ]]; then
  echo "[provider-routes] HUGGINGFACE_API_KEY present: run Settings live generation test to prove compatible HF candidates."
else
  echo "[provider-routes] SETUP: add HUGGINGFACE_API_KEY or marketing_huggingface_api_key for HF live proof."
fi
if [[ -n "${MARKETING_PEXELS_API_KEY:-}" || -n "${MARKETING_PIXABAY_API_KEY:-}" ]]; then
  echo "[provider-routes] Stock key env present: use Settings > Test stock search for host-level provider proof."
else
  echo "[provider-routes] OPTIONAL SETUP: add MARKETING_PEXELS_API_KEY or MARKETING_PIXABAY_API_KEY for stock scenes. Branded caption render remains available."
fi
echo "[provider-routes] PASS: route contracts stay truthful. This script does not claim external provider success without credentials and live tests."
