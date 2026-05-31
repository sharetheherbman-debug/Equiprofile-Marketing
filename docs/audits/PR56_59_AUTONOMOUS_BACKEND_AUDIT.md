# PR56-59 Autonomous Backend Audit

## Current Merge/Branch State
- Branch: `pr56-59-autonomous-marketing-backend`
- Base includes merge commit `5f60cd8` (`PR55` merged to `main`).
- Working tree was clean at audit start.

## Exact Blockers Found
1. `scene_planning` route mismatch:
   - `server/modules/marketing/provider-capabilities/marketingProviderRouteResolver.ts` hard-routes `scene_planning` to `media_factory/assembled_video` with `routeType: media_factory_assembled_video`.
   - `server/modules/marketing/studio-generation/index.ts` executes `scene_planning` via text AI execution (`executeAITaskWithProviderRoute`), causing semantic route mismatch.
2. Studio unsafe optional fallback:
   - `client/src/components/marketing/app/studio/StudioWorkbench.tsx` uses optional chaining around `trpc.admin.generateMarketingStudioScript?.useMutation` and falls back locally.
3. Queued media job resolver missing:
   - No backend module currently resolves queued avatar/lipsync/voice/music jobs to completion/failure truth based on real output assets.
4. Music taxonomy mismatch:
   - `server/modules/marketing/avatar-voice-music/index.ts` creates music jobs with `createMediaAsset({ type: "voice", task: "text_to_speech" })`.
5. Closed-loop attribution redirect not implemented:
   - `marketingAttributionLinks` table exists and stores `/m/:code`, but no live redirect endpoint increments `clickCount` + `lastClickedAt`.
6. Results intelligence missing:
   - Current results module aggregates totals but lacks campaign performance scoring and winning-pattern detection functions.
7. Autonomous pipeline command incomplete:
   - Agent workforce module has run/task primitives, but no `runAutonomousMarketingCampaign` orchestration step chain.
8. Connector readiness truth endpoint incomplete:
   - Publisher readiness exists (`listSocialPublisherReadiness`) but not full per-platform connector readiness status integrated into backend readiness truth.

## Files/Modules Affected (Planned)
- `server/modules/marketing/provider-capabilities/*`
- `server/modules/marketing/studio-generation/*`
- `client/src/components/marketing/app/studio/StudioWorkbench.tsx` (compile-safety wiring only)
- `server/modules/marketing/avatar-voice-music/*`
- `server/modules/marketing/results-conversion/*`
- `server/modules/marketing/agent-workforce/*`
- `server/modules/marketing/backend-readiness/*`
- `server/modules/marketing/social-publishing/*`
- `server/routers.ts`
- `drizzle/schema.ts` and `server/db.ts` for any incremental persistence requirements
- new resolver/orchestration/intelligence modules under `server/modules/marketing/`

## Backend Contracts to Add/Fix in This PR
- `resolveQueuedMarketingMediaJobs`
- `getMarketingMediaJobResolverStatus`
- `getMarketingPerformanceScore`
- `getMarketingWinningPatterns`
- `getMarketingPerformanceContext`
- `runAutonomousMarketingCampaign`
- `getMarketingConnectorReadiness`
- Attribution redirect path with durable click increment + redirect

## Expected Frontend-Only Remainder After This PR
- UX/layout polish, dashboard visuals, Academy/public page work, and broader frontend redesign remain out-of-scope.
- Frontend should only consume hardened backend contracts and statuses after this PR.
