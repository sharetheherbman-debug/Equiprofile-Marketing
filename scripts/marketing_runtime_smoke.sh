#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[runtime] verifying Marketing App runtime storage, render, and UX contracts"
npx vitest run server/pr64j.runtimeStorageRenderUx.test.ts
grep -q "getRuntimeFileStorageReadiness" server/_core/index.ts
grep -q "findServableUploadFile" server/_core/index.ts
grep -q "getMarketingRenderRuntimeReadiness" server/routers.ts
grep -q "repairMarketingBrandLogo" server/routers.ts
grep -q "Scan Site" client/src/components/marketing/app/workspace/ProductContextPanel.tsx
grep -q "latest-outcome-card" client/src/components/marketing/app/TheMarketingApp.tsx
grep -q "VITE_MARKETING_SUPPORT_MODE" client/src/components/marketing/app/MarketingAppSettings.tsx
echo "[runtime] PASS: storage roots, file route lookup, render readiness, Brand Kit repair, Product Setup, and focused outcome UI contracts are present."
echo "[runtime] NOTE: if BASE_URL is set on VPS, run a live curl against /api/files and /media/generated with real fixture URLs after deploy."
