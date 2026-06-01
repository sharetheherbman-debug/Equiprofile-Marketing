# PR62D Frontend Studio Creation Flow — Audit

## Baseline

Branch: `copilot/pr62d-frontend-studio-creation-flow`

PR62B (media truth + image generation) and PR62C (deliverable engine + video packages) are confirmed merged into `main`.

```
ee8fe56 Merge pull request #7 from amarktainetwork-blip/copilot/pr62c-marketing-deliverable-engine-video-packages
dcdf3c6 Merge pull request #6 from amarktainetwork-blip/pr62b-media-truth-image-generation
```

## Pre-PR62D Frontend UX Problems

1. **Diagnostics-first main screen** — readiness grid, connector debug cards, and provider state were shown as the primary content before any creation action.
2. **Empty agent cards** — seven `waiting_for_backend` agent timeline cards were rendered before generation had run.
3. **Buried/tiny preview** — the output panel was below the fold and small.
4. **No creation menu** — users had no clear list of what they could create.
5. **Command-form UX** — the composer was presented as a backend command box, not a product creation flow.
6. **Raw JSON in main view** — package viewer dumped raw package objects.
7. **Non-playable assets shown as completed** — setup_needed assets appeared with no clear state.
8. **Confusing tab names** — "Media Studio", "Review / QA", "Results / Learning", "Settings / Readiness" reflected backend internals, not user journeys.

## Files Changed

| File | Change |
|------|--------|
| `client/src/components/marketing/app/TheMarketingApp.tsx` | Full JSX rebuild — creation-first Studio layout, 3-column desktop grid, creation menu, composer, preview panel, post-generation tabs, hidden diagnostics |
| `client/src/components/marketing/app/MarketingAppSettings.tsx` | Added setup wizard checklist (10 items) at the top |
| `client/src/components/marketing/app/TheMarketingApp.test.tsx` | Updated PR61 tests for new UI, added 14 PR62D tests, imported MarketingDeliverablePackageViewer |
| `server/pr62b.mediaTruthImageGeneration.test.ts` | Updated "Generate Image Ad" literal check to match dynamic button text |
| `docs/audits/PR62D_FRONTEND_STUDIO_CREATION_FLOW_AUDIT.md` | This file |
| `docs/audits/PR62D_FRONTEND_ACCEPTANCE_TESTS.md` | Manual acceptance test doc |

## New Frontend Shape (Phase 1)

**A. Top Studio Header**
- Shows "The Marketing App" and "Studio — {app}"
- Simple readiness badge: Ready to create / Partial setup / Setup needed / Backend unavailable
- Settings button opens a dialog

**B. Left Creation Menu** (`creation-menu`, 220px, `lg:flex-col`)
- Image Ad
- 30-Second Video Ad
- 3-Minute Assembled Video
- Signup Campaign
- Social Post
- Email Campaign
- Blog / SEO Article
- Weekly Content Pack
- Avatar Video

**C. Center Composer**
- Description field
- Audience, Platforms, Quality mode
- Export-first / Require approval toggles
- Generate button (dynamic label: "Generate {type}")

**D. Right Large Preview** (`data-testid="preview-panel"`, 500px, sticky)
- Hero output panel shown immediately
- Shows readiness badge when no output exists
- Shows package viewer + tabs after generation

**E. Post-Generation Tabs**
- Preview | Plan | Creative | Media | Review | Schedule / Export | Details
- Details contains Advanced Diagnostics (collapsed `<details>`) and technical JSON

## Four Primary Actions (Phase 2)

| Creation Type | Mutation Called |
|--------------|-----------------|
| Image Ad | `generateMarketingImageAsset` |
| 30-Second Video Ad | `generateMarketingAdPackage` |
| 3-Minute Assembled Video | `generateMarketingVideoPackage` |
| Signup Campaign | `generateMarketingCampaignPackage` |

## Agent Timeline Rule (Phase 7)

Agent Mission Timeline only renders when:
```tsx
{(isAnyGenerationPending || autonomousRunSummaries.length > 0) ? (
  <AgentMissionTimeline ... />
) : null}
```

Never shown as seven empty `waiting_for_backend` cards.

## Setup Wizard (Phase 5)

`MarketingAppSettings` now opens with a 10-item setup checklist:
1. Text generation
2. Image generation
3. Campaign / ad packages
4. 3-minute video package planning
5. Media rendering / Remotion / FFmpeg
6. Stock media
7. Voiceover
8. Music / audio
9. Export / schedule
10. Publishing connectors

Each item shows: status badge (ready / setup_needed), enables, next action.

## Verification Outputs

```
Test Files  76 passed (76)
Tests  597 passed (597)
```

All PR62B, PR62C, PR61, PR62D tests pass.

## Remaining Work for PR63

- Final rendered video output (Remotion / FFmpeg pipeline)
- Direct publishing connectors (Facebook, Instagram, etc.)
- Real voiceover and music provider integration
- Export file download pipeline
- Mobile layout polish
