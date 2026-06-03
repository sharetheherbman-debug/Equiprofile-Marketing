#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[workspace] verifying AI-guided Marketing App wiring contracts"
npx vitest run server/pr64h.aiGuidedWorkspace.test.ts server/pr64i.liveGenerationRenderHardening.test.ts -t "intent routing|preview, Library, Calendar, and Settings truth"
grep -q 'label: "Create"' client/src/components/marketing/app/TheMarketingApp.tsx
grep -q 'label: "Library"' client/src/components/marketing/app/TheMarketingApp.tsx
grep -q 'label: "Calendar"' client/src/components/marketing/app/TheMarketingApp.tsx
grep -q 'label: "Results"' client/src/components/marketing/app/TheMarketingApp.tsx
grep -q 'label: "Settings"' client/src/components/marketing/app/TheMarketingApp.tsx
grep -q "StudioWorkbench" client/src/components/marketing/app/TheMarketingApp.tsx
grep -q "createMarketingRenderJob" server/routers.ts
grep -q "listMarketingRenderJobs" server/routers.ts
grep -q "useMarketingAssets" client/src/components/marketing/app/TheMarketingApp.tsx
grep -q "useMarketingCalendar" client/src/components/marketing/app/TheMarketingApp.tsx
grep -q 'view === "settings"' client/src/components/marketing/app/TheMarketingApp.tsx
echo "[workspace] PASS: top menu, AI intent router, Studio/render reuse, Library, Calendar, Results, and Settings workspace contracts are wired."
echo "[workspace] NOTE: run live browser smoke after deploy; this shell script does not claim visual browser proof."
