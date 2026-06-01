# PR64A Full Marketing App Truth Audit

Generated: 2026-06-01
Repo: https://github.com/amarktainetwork-blip/Equiprofile-MarketingV2
Baseline commit: `5fa28f0` (PR63A merge)
Branch: `pr64a-full-marketing-app-truth-audit`

## Executive Summary

Readiness score: **5.2 / 10** for truthful go-live.

What is now strong:
- Active route and legacy quarantine are clean and test-backed.
- Creation capability contract exists and is consumed by frontend.
- Image generation has a first-class backend procedure with playable-media truth guards.
- Schedule/export persistence got hardened and uses safe empty fallbacks.
- Publishing remains truthful (export-first and no fake posted IDs).

Why product still feels broken:
- Many visible modules are package/planning systems, not guaranteed playable outputs.
- Avatar/voice/music flows mostly queue/process metadata and depend on unresolved provider execution.
- 30s/3m video flows are mostly plan/package outputs unless render dependencies and runtime execution are truly available.
- Social/email/blog/weekly content are still contract-level `not_wired` in first-class creation flow.
- Frontend still mixes creation and broad diagnostics in the main experience, increasing user confusion.

## Repo Map (Marketing Surface)

Primary active flow:
- [AdminCampaigns.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/pages/AdminCampaigns.tsx)
- [TheMarketingApp.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/app/TheMarketingApp.tsx)
- [StudioHome.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/app/studio/StudioHome.tsx)
- [StudioWorkbench.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/app/studio/StudioWorkbench.tsx)

Contract and orchestration core:
- [creation-capabilities/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/creation-capabilities/index.ts)
- [routers.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/routers.ts)
- [provider-capabilities/*](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/provider-capabilities)
- [orchestrator.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/_core/ai/orchestrator.ts)
- [mediaPlayability.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/_core/ai/mediaPlayability.ts)

Legacy quarantine retained:
- [MarketingStudioV2.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/legacy/quarantine/MarketingStudioV2.tsx)
- [MarketingAppChat.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/legacy/quarantine/MarketingAppChat.tsx)
- [MarketingAppPreview.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/legacy/quarantine/MarketingAppPreview.tsx)

## Frontend Truth

Current user journey is coherent for four creation types and blocked truthfully for others:
- First-class wired in `handleGenerate`:
  - `image_ad -> generateMarketingImageAsset`
  - `video_ad_30s -> generateMarketingAdPackage`
  - `assembled_video_3m -> generateMarketingVideoPackage`
  - `signup_campaign -> generateMarketingCampaignPackage`
- Non-first-class types are shown under not-ready and should not be treated as ready.

Evidence:
- [TheMarketingApp.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/app/TheMarketingApp.tsx): creation capability query, status gating, and explicit `not_wired` blockers.
- [TheMarketingApp.test.tsx](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/client/src/components/marketing/app/TheMarketingApp.test.tsx): asserts active route and non-reactivation of legacy components.

Why frontend still feels wrong:
- Main workspace still surfaces too much diagnostics/intelligence surface before clear deliverable confirmation.
- Plan/package results and real playable outputs are visually close, causing perceived “it generated but nothing works.”
- Capability status is present, but output semantics (package vs playable media) need stronger visual separation.

Surgical fix viability:
- Yes, still surgical. No full redesign required for tomorrow go-live.
- Required: make deliverable-first panel primary and collapse diagnostics by default except blockers.

## Creation Capability Contract Truth

Contract exists and is materially useful.

Evidence:
- [creation-capabilities/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/creation-capabilities/index.ts)
  - supports status model: `ready | setup_needed | planned_only | not_wired | broken`
  - contains all required creation IDs.
- [routers.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/routers.ts): `admin.getMarketingCreationCapabilities`.

Gaps:
- Missing explicit field for `outputGuarantee` (playable media guaranteed vs package-only).
- Missing `viewerContract` to tell frontend exactly which viewer component and schema to use.
- Missing `liveExecutionProof` (last successful real execution timestamp by creation type).

## Provider/Model Routing Truth

Good:
- Standard/Elite policy is explicit in provider capability routing.
- Standard preference: Qwen -> Hugging Face -> GenX.
- Dynamic config resolves DB `siteSettings` first, env fallback second.

Evidence:
- [marketingTaskCapabilityMatrix.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/provider-capabilities/marketingTaskCapabilityMatrix.ts)
- [marketingProviderRouteResolver.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/provider-capabilities/marketingProviderRouteResolver.ts)
- [dynamicConfig.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/dynamicConfig.ts)

Truth gap:
- Route resolvable != playable output proven.
- Some model/task coverage is inferred from model catalogs and may still return planning/text outputs.

## Media Truth (Complete/Partial/Scaffold/Broken/Missing)

- Image generation: **PARTIAL**
  - First-class flow exists and can produce playable output when provider route is real.
  - Truth guards block prompt-only/text/plain/video_plan from completed media.
  - Evidence: [image-generation/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/image-generation/index.ts), [mediaPlayability.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/_core/ai/mediaPlayability.ts).

- Avatar generation: **PARTIAL**
  - Queues jobs and persists records; playable completion depends on downstream provider output.
  - Evidence: [avatar-voice-music/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/avatar-voice-music/index.ts), [media-job-resolver/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/media-job-resolver/index.ts).

- Avatar lipsync: **PARTIAL**
- Voice preview/voiceover: **PARTIAL**
- Music generation: **PARTIAL**
- Background audio selection: **PARTIAL**
  - Same reason: truthful status logic exists; full provider execution proof path is incomplete.

- 30s video package: **PARTIAL**
  - Produces strategy/script/scene/requirements package.
  - Not a guaranteed rendered playable video.
  - Evidence: [deliverable-composer/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/deliverable-composer/index.ts).

- 3-minute assembled video package: **PARTIAL**
  - Explicitly uses `renderStatus: not_rendered` in package-level outputs.

- Rendered video output: **PARTIAL**
  - Render pipeline exists and can run synchronously without Redis or via BullMQ worker with Redis.
  - Requires FFmpeg/Remotion/runtime dependencies + valid timeline assets.
  - Evidence: [marketingRenderQueue.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/media-factory/marketingRenderQueue.ts), [marketingRenderWorker.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/media-factory/marketingRenderWorker.ts).

- Stock media sourcing: **PARTIAL**
  - Pexels/Pixabay integrations exist; returns setup-needed when keys missing.

- Visual QA: **PARTIAL**
  - Module/tables/tests exist, but live-quality dependence on actual vision execution and media quality remains conditional.

## Social/Email/Campaign Truth

- Signup campaign generation: **PARTIAL but usable for package creation**
  - Campaign records/items/review/schedule/export records are persisted.
  - Output quality depends on provider readiness and fallback handling.
- Social/email/blog/weekly pack as first-class creation types: **NOT WIRED**
  - Contract intentionally marks these `not_wired`.
- Publishing adapters: **TRUTHFUL BLOCKED/PARTIAL**
  - Real posting blocked until connector readiness and real platform IDs.

Evidence:
- [creation-capabilities/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/creation-capabilities/index.ts)
- [socialPublisherRegistry.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/social-publishing/socialPublisherRegistry.ts)
- [basePublisherStub.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/social-publishing/adapters/basePublisherStub.ts)

## Brain/Self-Learning Truth

Present and reusable:
- Genius brain framework libraries.
- Brand memory store/context.
- Platform specialist rules.
- Campaign manager guidance.
- Result-learning functions with confidence/source handling.

Still limited:
- Heavily rule/context based; not yet a fully closed autonomous optimization loop with high-confidence real data at scale.
- Frequently returns `insufficient_data` until attribution/connector metrics volume increases.

Evidence:
- [genius-brain/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/genius-brain/index.ts)
- [brand-memory/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/brand-memory/index.ts)
- [result-learning/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/result-learning/index.ts)
- [results-conversion/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/results-conversion/index.ts)

## Analytics/Results Truth

- Attribution links + click redirect path exist (`/m/:code`) and can increment clicks.
- Conversion events and manual/connector source labeling exist.
- Performance scoring and winning-pattern detection are implemented but confidence-aware.

Evidence:
- [server/_core/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/_core/index.ts) (`/m/:code`)
- [results-conversion/index.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/modules/marketing/results-conversion/index.ts)

Gap for live tomorrow:
- Need proven frontend loop for attribution links in campaign outputs and visible results back-propagation into next run context.

## DB/Schema/Startup Truth

Status: improved and mostly aligned post-PR63A.

Evidence:
- [drizzle/schema.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/drizzle/schema.ts): marketing table exports include provider models/health, schedule, render, avatar/voice/audio, results, experiments, learning.
- [server/db.ts](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/server/db.ts): runtime CREATE/ALTER guards across same domains.

Remaining risk:
- Runtime startup SQL remains large and hand-maintained; drift can reappear unless deeper automated schema parity checks are added.

## Tests/Build/Deploy Truth

Current repo has broad test coverage, but many tests are structural/contract assertions rather than full user-flow integration.

Strong test areas:
- Provider capability schema exports.
- Route policy and readiness behavior.
- Frontend route/legacy quarantine assertions.
- Media truth guards.

Gaps:
- End-to-end “user prompt -> playable deliverable preview” tests are still limited.
- No full browser E2E flow for go-live critical paths.

## Open-Source/Tooling Audit

Already present and useful:
- `bullmq` + `ioredis` (queue/worker)
- `ffmpeg-static`, `remotion`
- `sharp`
- `zod`, `trpc`, `vitest`

High-value practical additions (not random):
- **Playwright**: for real Studio E2E smoke tests tomorrow.
- **MSW**: for deterministic frontend contract tests when backend endpoints return setup-needed vs completed states.

Not recommended for tomorrow unless already required:
- large observability stack migration.

## Top Go-Live Blockers (P0/P1/P2)

P0:
1. No proven reliable playable output path beyond image in default environment.
2. 30s/3m creation UX still perceived as “video generated” while mostly package/plan.
3. Avatar/voice/music paths queue records but not reliably resolved playable media in live flow.
4. Social/email/blog/weekly content remain first-class `not_wired` creation types.
5. No strict frontend deliverable-first mode to separate “plan/package” from “playable asset”.

P1:
6. Schedule/export needs live smoke proof on VPS after each deploy (empty + populated drafts).
7. Render pipeline requires hard validation of FFmpeg/Remotion/runtime dependencies in production.
8. Result-learning loop needs guaranteed attribution link injection and campaign-item mapping.

P2:
9. Contract lacks explicit viewer/output guarantee fields.
10. Startup SQL drift risk remains without automated parity checks.

## Tomorrow Repair Plan Summary

See [pr64a_tomorrow_go_live_plan.md](/C:/Users/digit/Documents/Codex/2026-05-31/we-are-continuing-the-equiprofile-marketing/docs/audits/pr64a_tomorrow_go_live_plan.md).

## What Is Reusable vs Scaffold

Genuinely reusable now:
- Provider capability routing + budget policy + readiness.
- Image generation first-class truth path.
- Deliverable persistence (campaign items/review/schedule/export rows).
- Publishing truth guard architecture.
- Results/conversion data model and core scoring functions.

Mostly scaffold/partial:
- Avatar/voice/music end-to-end playable media execution.
- Full rendered-video certainty from Studio button through preview.
- First-class social/email/blog/weekly creation flow.
- Closed-loop autonomous self-improving campaign execution at high confidence.
