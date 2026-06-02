#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[huggingface] verifying current router contract, candidate retries, and failure classification"
npx vitest run server/_core/ai/providers/huggingFaceProvider.test.ts server/pr64g.goLiveCompletion.test.ts -t "Hugging Face|classifies actionable"
if [[ -n "${HUGGINGFACE_API_KEY:-}" ]]; then
  echo "[huggingface] HUGGINGFACE_API_KEY is present. Run Admin Support live smoke with executeLiveProviders=true for the VPS generation proof."
else
  echo "[huggingface] SETUP: add HUGGINGFACE_API_KEY or marketing_huggingface_api_key for a real live generation proof."
fi
