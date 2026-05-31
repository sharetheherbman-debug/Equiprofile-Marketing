# PR61 Desktop Marketing Command Centre Frontend Audit

Date: 2026-05-31
Branch: `pr61-desktop-marketing-command-centre`

## Baseline

- Latest baseline commit observed before edits: `5d7c541` (`Merge pull request #4 from amarktainetwork-blip/pr60-backend-genius-settings-stability`)
- PR60 proof in history:
  - `07089d2 PR60: add backend genius layer and settings stability`

## Current Frontend Problems Found (Pre-PR61)

- The Marketing App experience was section-first and not a desktop-first command centre.
- Preview/intelligence context was not consistently presented as a large right-side production panel.
- Command composer and quick-action workflow were not unified around autonomous backend run contracts.
- Older test assumptions still referenced pre-command-centre shell internals (`activeSection === "create"`).

## Active Route Confirmation

Confirmed preserved active route chain:

- `AdminCampaigns -> TheMarketingApp -> StudioHome -> StudioWorkbench`

Source/test evidence:

- `client/src/pages/AdminCampaigns.tsx`
- `client/src/components/marketing/app/TheMarketingApp.tsx`
- `client/src/components/marketing/app/studio/StudioHome.tsx`
- `server/pr53.finalBackendSourceOfTruth.test.ts`

## Legacy Route Reactivation Check

Confirmed legacy layers remain quarantined and are not active-route imports:

- `MarketingStudioV2`
- `MarketingAppChat`
- `MarketingAppPreview`

Validated by existing regression tests and source assertions.

## Backend Procedure Mapping (Actual Names)

Verified in `server/routers.ts` and `server/modules/marketing/*`:

- `getMarketingCommandCentreState`
- `runAutonomousMarketingCampaign`
- `getMarketingBackendReadiness`
- `getMarketingConnectorReadiness`
- `getMarketingMediaJobResolverStatus`
- `resolveQueuedMarketingMediaJobs`
- `getMarketingPerformanceContext`
- `getMarketingWinningPatterns`
- `getMarketingLearningInsights`
- `recommendMarketingPlaybook`
- `listMarketingPlatformSpecialists`
- `getMarketingBrandMemory`
- `getMarketingTrendContext`
- `getMarketingCompetitorContext`
- `detectMarketingContentGaps`
- `scoreMarketingCreative`
- `generateMarketingManagerGuidance`
- `recommendMarketingNextSteps`

## Files Changed

- `client/src/components/marketing/app/TheMarketingApp.tsx`
- `client/src/components/marketing/app/TheMarketingApp.test.tsx`
- `client/src/components/marketing/app/studio/studioWorkbench.test.tsx`
- `server/marketingMediaFactory.wiring.test.ts`
- `server/pr53.finalBackendSourceOfTruth.test.ts`
- `docs/audits/PR61_DESKTOP_MARKETING_COMMAND_CENTRE_FRONTEND_AUDIT.md`

## Verification Outputs

### `npm run check`

- Status: PASS
- Output summary:
  - `tsc --noEmit` completed with no errors.

### `npm test`

- Status: PASS
- Output summary:
  - `73` test files passed
  - `562` tests passed
  - No legacy `testuser/test_db` access-denied spam; DB-optional tests report clean fallback message.

### `npm run preflight`

- Status: PASS
- Output summary:
  - dependency spec validation passed
  - route pattern validation passed

### `npm run build`

- Status: PASS
- Output summary:
  - management + school frontend builds succeeded
  - server + CLI bundles succeeded
  - build fingerprint written (`SHA: 5d7c541`)
  - non-blocking warnings only (existing CSS import order + chunk size warnings)
