#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[render-fallback] proving no-stock/no-provider branded caption render contracts"
npx vitest run server/pr64i.liveGenerationRenderHardening.test.ts -t "branded caption fallback"
echo "[render-fallback] PASS: 30s/120s/180s fallback timelines are renderable, fixture MP4 URLs are playable, and the real FFmpeg text-card path produced an MP4 without stock, voice, or music."
echo "[render-fallback] NOTE: deploy smoke must still open the generated public URL in a browser."
