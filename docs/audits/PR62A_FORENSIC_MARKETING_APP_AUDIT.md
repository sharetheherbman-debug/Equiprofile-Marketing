# PR62A Forensic Marketing App Audit

Date: 2026-06-01  
Repo: https://github.com/amarktainetwork-blip/Equiprofile-MarketingV2.git  
Baseline branch during audit: `main`  
Baseline HEAD during audit: `bf23eab`

## 1. Executive summary

Current product readiness is **4.3 / 10** for live autonomous marketing use.

Evidence-backed conclusion:
- The codebase has broad backend contracts and truthful guardrails (providers, readiness, publishing truth, media resolver, review gates).
- The product does not yet deliver reliable end-to-end user outcomes for the core promises (image ad, 30-second ad, full campaign package with user-facing deliverables) without manual assembly and setup-heavy intervention.
- The frontend command centre exposes truth states (`setup_needed`, `waiting_for_backend`, `insufficient_data`) correctly, but creation UX is still mostly orchestration + diagnostics over direct deliverable production.

## 2. Current readiness score (out of 10)

| Dimension | Score | Evidence |
|---|---:|---|
| Router/API breadth | 8.5 | `server/routers.ts` marketing procedures (`runAutonomousMarketingCampaign`, `getMarketingCommandCentreState`, readiness/intelligence endpoints) |
| Truthful safety controls | 8.0 | Publishing requires real ID (`server/routers.ts:7778-7806`), stub adapters return setup-needed (`server/modules/marketing/social-publishing/adapters/basePublisherStub.ts`) |
| Provider/task routing integrity | 6.0 | Durable provider tables + resolver exist (`drizzle/schema.ts`, `server/modules/marketing/provider-capabilities/*`), but some capability mappings still proxy through non-native task semantics (`music_generation -> text_to_speech`) |
| Media generation reliability | 3.5 | Strong normalization/resolver guards (`server/_core/ai/outputNormalization.ts`, `server/_core/ai/mediaResolver.ts`) but no guaranteed user-facing one-click media pipeline |
| Campaign deliverable completeness | 2.5 | Autonomous run persists campaign + agent runs, but does not compose full campaign item/package outputs (`server/modules/marketing/autonomous-campaign/index.ts`) |
| Frontend creation usability | 4.0 | Desktop command centre exists (`client/src/components/marketing/app/TheMarketingApp.tsx`) but many flows still surface readiness/diagnostic states over concrete generated artifacts |
| Results intelligence loop | 5.0 | Attribution redirect + scoring/pattern modules exist (`server/_core/index.ts:/m/:code`, `server/modules/marketing/results-conversion/index.ts`), but production evidence of fully closed loop is limited |
| Overall live readiness | **4.3** | Combined forensic evidence below |

## 3. Baseline and history audit

### 3.1 Commands and baseline evidence

Executed:
- `git status` -> clean `main...origin/main`
- `git remote -v` -> source-of-truth remote confirmed
- `git log --oneline -20` -> PR53..PR61 merge chain confirmed
- `git branch --show-current` -> `main`
- `npm run check` -> pass
- `npm test` -> pass (`73 files`, `562 tests`)
- `npm run preflight` -> pass
- `npm run build` -> pass

Additional targeted subsets executed:
- marketing-focused tests: pass
- media-focused tests: pass
- provider-focused tests: pass
- frontend Marketing App tests (`TheMarketingApp`, `StudioWorkbench`): pass

Note: one initial subset glob call returned "No test files found" due Windows glob handling; explicit-file reruns passed.

### 3.2 PR timeline forensic table

| PR | Merge evidence | Claimed scope (audit docs / title) | What was actually added | What is actually usable now | What remains incomplete |
|---|---|---|---|---|---|
| PR53 | `283cc8e` | Backend source-of-truth hardening | Active route consolidation, quarantined legacy, core marketing tables/guards | Active route and quarantine are real and tested | Product generation outcomes still not guaranteed |
| PR54A (+A-3) | `29be679` (+ earlier PR54A chain) | Provider capability persistence/routing truth | `marketingProviderModels`, `marketingProviderHealthChecks`, sync/readiness/task-map APIs | Durable provider inventory and capability map available | Capability map does not equal reliable media output |
| PR55 | `5f60cd8` | Backend completion engine | Studio generation services, avatar/voice/music/result/agent/readiness modules | Contracts compile and run | Autonomous run still not full deliverable composer |
| PR56-59 | `ab06d5a` | Hardening + results intelligence + autonomous + connectors | Scene routing fix, media resolver APIs, attribution redirect, connector readiness, autonomous command | Truthful statuses and stronger backend checks | Still setup-heavy; not consistently user-complete creative engine |
| PR60 | `5d7c541` | Genius/settings stability/intelligence | Genius brain, brand memory, specialists, market/result learning, settings stabilization | Intelligence modules and settings resilience exist | Intelligence is context-rich but not equivalent to finished deliverables |
| PR61 | `bf23eab` | Desktop command centre frontend | Fleet header, command box, readiness strip, agent timeline, tabs, large preview shell | Strong desktop shell with backend wiring | UX still shows many waiting/setup states; creation not reliably one-command to deliverable |

Why tests can pass while product still fails:
- Most tests validate contracts, truth guards, and fallback semantics.
- Limited tests prove end-to-end user deliverable creation (image/video/ad/campaign package shown in UI with real outputs).
- Passing readiness/truth tests does not prove production provider keys/models/connectors are configured.

## 4. What is genuinely complete

| Capability | Status | Evidence |
|---|---|---|
| Active route + legacy quarantine | complete | `AdminCampaigns -> TheMarketingApp -> StudioHome -> StudioWorkbench`; quarantine tests (`server/pr53.finalBackendSourceOfTruth.test.ts`, `client/.../studioWorkbench.test.tsx`) |
| Provider capability source-of-truth tables | complete | `drizzle/schema.ts` exports: `marketingProviderModels`, `marketingProviderHealthChecks`; `server/db.ts` create/alter guards |
| Connector publish truth guard | complete | `server/routers.ts:7778-7806` requires `platformPostId/uploadId` before persisted publish success |
| Stub adapter non-fake behavior | complete | `server/modules/marketing/social-publishing/adapters/basePublisherStub.ts` returns `success:false` setup-needed |
| Media normalization/rejection of non-playable outputs | complete | `server/_core/ai/outputNormalization.ts`, `server/_core/ai/mediaResolver.ts` |
| Test DB noise reduction | complete | `server/db.ts:2638` one-line fallback warning; `server/pr60.backendGeniusSettings.test.ts` |
| Command-centre backend aggregation endpoint | complete (as aggregator) | `server/modules/marketing/command-centre/index.ts` |

## 5. What is partial/scaffolded

| Capability | Status | Evidence |
|---|---|---|
| Autonomous campaign production | partial | `runAutonomousMarketingCampaign` creates campaign + agent runs/tasks, returns intelligence summary (`server/modules/marketing/autonomous-campaign/index.ts`) |
| Studio generation | partial | `createMarketingStudioPlan` + `generateMarketingStudioScript` generate structured plan/script/scene objects, with fallback semantics (`server/routers.ts:5010+`, `server/modules/marketing/studio-generation/index.ts`) |
| Media job resolution for avatar/voice/music | partial | Resolver APIs exist and enforce output truth (`server/modules/marketing/media-job-resolver/index.ts`); still depends on real provider completion |
| Results intelligence | partial | scoring/winning/learning modules exist (`server/modules/marketing/results-conversion/index.ts`, `server/modules/marketing/result-learning/index.ts`) but user-facing closed-loop flow is not yet strong end-to-end |
| Settings diagnostics UX | partial | Strong truth/readiness rendering in `MarketingAppSettings.tsx`, but still technical and status-heavy for non-technical users |

## 6. What is broken

| Area | Broken behavior | Evidence |
|---|---|---|
| End-to-end deliverable composition from autonomous run | Campaign run does not create campaign items/deliverable package automatically | `server/modules/marketing/autonomous-campaign/index.ts` imports `createMarketingCampaignRecord` only; no `createMarketingCampaignItemRecord` call |
| User-facing media completion confidence | Frontend may classify by playable URL/mime helper rather than strict DB workflow provenance | `client/src/components/marketing/app/marketingAppHelpers.ts:getAssetStatus`, `hasPlayablePublicAsset` path |
| Direct one-click “generate image ad” product flow | No clear dedicated production flow that guarantees image ad deliverable package in current command-centre path | frontend wiring primarily runs `createMarketingStudioPlan` and `runAutonomousMarketingCampaign`; legacy-compatible routes marked as such (`server/routers.ts:5702`, `9563`) |

## 7. What is missing

| Missing product layer | Why this matters | Evidence |
|---|---|---|
| Deliverable composer that writes campaign items + assets + QA + schedule bundle in one run | Core user promise requires concrete outputs, not only agent metadata | autonomous workflow output shape in `server/modules/marketing/autonomous-campaign/index.ts` |
| Strong “creation-first” success path for image/ad/campaign | Users still face status panels before concrete output | `client/src/components/marketing/app/TheMarketingApp.tsx` has heavy readiness/timeline/status emphasis |
| Guaranteed media output contract per task in UX | Needs clear produced/not-produced state with MIME/playable checks tied to deliverable cards | mixed status handling across `MarketingAppPanels.tsx`, asset helpers, media resolver |
| Production-grade setup wizard | Current settings are detailed but technical | `MarketingAppSettings.tsx` shows raw diagnostics and many readiness blocks |

## 8. User journey failures (end-to-end)

### A. “Create a premium image ad …”

| Step | Evidence | Verdict |
|---|---|---|
| Frontend input path exists | Command box + content type (`TheMarketingApp.tsx`) | working |
| Backend planning endpoint exists | `createMarketingStudioPlan` (`server/routers.ts:5010`) | working |
| Provider readiness checks exist | readiness endpoints and capability routes | working |
| Guaranteed media job + playable image output in this primary flow | not guaranteed by command-centre path alone; depends on downstream job flow/provider config | partial |
| Honest setup/failure states | present (`setup_needed`, `waiting_for_backend`) | working |

Flow status: **partial**

### B. “Create a 30-second Facebook/Instagram ad …”

| Required deliverable | Evidence | Verdict |
|---|---|---|
| Strategy/hook/copy/script scaffolding | agent/studio modules exist | partial |
| Scene plan + required assets | `studio-generation` outputs scenePlan/requiredAssets | partial |
| Schedule/export draft | separate APIs exist; not guaranteed from one run | partial |
| Review item creation | review endpoints exist | partial |
| Clear final package shown in one flow | not consistently composed from autonomous run | broken/partial |

Flow status: **partial**

### C. “Get me 50 signups this month …”

| Step | Evidence | Verdict |
|---|---|---|
| Campaign record creation | yes (`createMarketingCampaignRecord`) | working |
| Campaign item creation in autonomous path | missing in autonomous service | missing |
| Content calendar + export drafts auto-composed | not fully auto-created in autonomous run | partial |
| UI shows full deliverables package | mostly run summaries/intelligence; deliverable detail limited | partial |

Flow status: **partial to scaffold**

### D. 1-minute assembled video

| Requirement | Evidence | Verdict |
|---|---|---|
| Assembled-video distinction in UI | present (`TheMarketingApp.tsx` assembled-video notes) | working |
| Render job APIs | `createMarketingRenderJob`, `get/list/cancel/retry` etc. | working |
| No fake completion | media resolver + render truth rules | working |
| Consistent one-command generation from prompt to completed 60s asset | still setup/provider/binary dependent and not guaranteed | partial |

Flow status: **partial**

### E. Export/schedule

| Requirement | Evidence | Verdict |
|---|---|---|
| Export draft exists | schedule draft APIs + export pack builder | working |
| Direct publish blocked unless readiness + real ID | `server/routers.ts:7778-7806` | working |
| No fake posted state | adapter stubs + persistence rule | working |

Flow status: **working (truthful), but connector-dependent for live posting**

## 9. Backend generation audit

### 9.1 What can actually execute now

- Text/copy/strategy/campaign/social/email generation tasks execute through provider orchestration (`server/_core/ai/orchestrator.ts`, provider modules).
- Studio script/scene planning executes through provider route resolver with fallback labeling (`server/modules/marketing/studio-generation/index.ts`).
- Media task execution routes exist for `text_to_image`, `image_edit`, `text_to_video`, `image_to_video`, `avatar_video`, `text_to_speech` (`server/_core/ai/tasks/taskRegistry.ts`, `server/_core/ai/providers/*`).

### 9.2 Which tasks are still mostly route/config dependent

- Qwen media tasks explicitly indicate DashScope-native setup-needed path until native media endpoint execution is enabled (`server/_core/ai/providers/qwenProvider.ts`: setup-needed messaging).
- Connector publishing depends on real connection tokens/scopes/adapter readiness (`server/modules/marketing/connector-readiness/index.ts`, social adapters).

### 9.3 Task mapping risks

- `music_generation` and `background_audio_selection` currently map to canonical `text_to_speech` in capability matrix (`server/modules/marketing/provider-capabilities/marketingTaskCapabilityMatrix.ts:41-42`).
- This is truthful as an implementation mapping but indicates unresolved dedicated audio-generation taxonomy at route-policy level.

## 10. Media/image/video truth audit

### 10.1 Completion truth strengths

- Resolver refuses non-playable `text/plain` completion and failed result URLs (`server/_core/ai/mediaResolver.ts` fail paths).
- Resolver writes completed status only after persisted playable file/url metadata (`persistPlayableFile` path in `mediaResolver.ts`).
- Avatar/voice/music resolver marks completed-without-real-output as failed (`server/modules/marketing/media-job-resolver/index.ts`).

### 10.2 Remaining risks

- `updateMediaAsset` accepts status/mime/url patch without strict invariant enforcement at the persistence API boundary (`server/modules/growth-engine/mediaAssets.ts`).
- Frontend helper derives visual completion status from playable URL/mime (`client/src/components/marketing/app/marketingAppHelpers.ts:getAssetStatus`), which can diverge from deeper provenance expectations.

## 11. Campaign/ad deliverable audit

Required 30-second ad package:

| Deliverable | Status | Evidence |
|---|---|---|
| Strategy | partial | agent runs and manager guidance exist |
| 3 hooks | partial | copy generation possible, not guaranteed packaged |
| Primary ad copy | partial | copy generation paths exist |
| CTA | partial | genius CTA libraries + copy prompting exist |
| 30s script | partial | `generateMarketingStudioScript` |
| Scene plan | partial | `generateMarketingStudioScenePlan` |
| Visual prompts | partial | scene fields include visual prompts |
| Media requirements | partial | `requiredAssets` in studio generation |
| Caption plan | partial | caption generation exists; not guaranteed package |
| QA result | partial | QA APIs exist |
| Review status | partial | review records exist |
| Export/schedule draft | partial | schedule APIs exist, not guaranteed auto-attached |

Core finding: autonomous run and studio services produce many components, but no strong single composer guarantees the full package is created, persisted, and surfaced together.

## 12. Agent workforce audit

What is real:
- Durable `marketingAgentRuns` and `marketingAgentTasks` tables (`drizzle/schema.ts`).
- Run/task creation and execution (`server/modules/marketing/agent-workforce/index.ts`).
- Export-first default and no direct posting in autonomous command (`server/modules/marketing/autonomous-campaign/index.ts`).

What is incomplete:
- Agent workflow output is mostly metadata/result summaries, not guaranteed deliverable objects for users.
- No end-to-end campaign item writer in autonomous pipeline.

## 13. Frontend UX audit

UX score: **5.1 / 10**

What is strong:
- Desktop-first shell with clear sections, timeline, readiness strip, preview panel (`TheMarketingApp.tsx`).
- Honest state language (`setup_needed`, `waiting_for_backend`, `insufficient_data`).

What blocks product feel:
- Creation flow still feels diagnostics-first in many states.
- User often lands in readiness/timeline context before seeing concrete generated outputs.
- Multiple legacy-compatible pathways still coexist in backend (`createMarketingDraft`, `generateMarketingDraft`, `createMediaJob` marked legacy compatibility).

## 14. Settings/setup audit

| Setup area | Current state | User confusion risk | Required fix |
|---|---|---|---|
| Provider keys/status | truthful + masked key display | medium (technical jargon) | convert to guided checklist with “next required action” |
| Connector readiness | truthful per-platform states | medium | simplify scope/token errors into actionable steps |
| FFmpeg/Remotion | shown via readiness | low | add direct install/verify action hints |
| Raw diagnostics JSON | available | high for non-technical users | collapse by default, label as advanced |

Evidence: `client/src/components/marketing/app/MarketingAppSettings.tsx`, `server/modules/marketing/backend-readiness/index.ts`, `server/modules/marketing/connector-readiness/index.ts`.

## 15. Provider/model audit

Status distinctions are implemented and must remain separate:
- model discovered
- key exists
- task route exists
- live test passed
- playable output produced

Evidence:
- provider discovery/routing: `server/_core/ai/providerModelDiscovery.ts`, provider capability stores
- readiness endpoints: `getMarketingBackendReadiness`, `getMarketingConnectorReadiness`
- output validation: `outputNormalization.ts`, `mediaResolver.ts`

Provider reality summary:
- GenX: best media-oriented implementation depth (async job/poll support)
- Qwen: strong text; media path explicitly setup-needed pending native endpoint enablement
- Hugging Face: configurable media/text inference paths exist
- Pexels/Pixabay: key-gated stock config readiness
- FFmpeg/Remotion: binary/package readiness is explicit in backend readiness
- Social connectors: explicit readiness states and truthful non-posting stubs by default

## 16. DB/schema/persistence audit

Strong:
- Broad marketing table coverage in `drizzle/schema.ts`.
- `server/db.ts` includes extensive `CREATE TABLE IF NOT EXISTS` and drift-safe `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` guards.

Gap:
- Existence of tables and guards does not ensure full product-level workflow composition.

## 17. Tests audit

What tests prove well:
- provider routing policy behavior
- setup-needed truth paths
- no fake publishing IDs
- media resolver safety
- command-centre/frontend render contracts

What tests do not prove sufficiently:
- end-to-end image ad creation resulting in validated playable asset and surfaced preview
- end-to-end 30-second ad deliverable package composition and persistence
- autonomous run writing full campaign items/schedule/review bundle

Evidence: `npm test` output + focused subset runs; files including `server/pr55.marketingBackendCompletion.test.ts`, `server/pr56_59.autonomousBackend.test.ts`, `client/.../TheMarketingApp.test.tsx`, `client/.../studioWorkbench.test.tsx`.

## 18. Competitor benchmark gap (category-based)

| Capability group | Current state |
|---|---|
| Buffer/Later/Hootsuite scheduling core | **partial** (draft/export-first truth exists; live connector maturity incomplete) |
| Predis/Creatify AI creative generation | **partial/missing** (contracts present; reliable polished one-click output incomplete) |
| Canva/CapCut/Pippit prompt-to-visual production | **missing to partial** (assembled pipeline pieces exist, but not productized output reliability) |
| HubSpot-style campaign automation + reporting loop | **partial** (results modules exist; practical closed-loop productization incomplete) |
| Intended fleet advantage (multi-app brand memory + routing + safety) | **partial** (architecture exists; operational excellence not yet achieved) |

## 19. Exact repair roadmap

### PR62 — Product recovery (P0)
Goal: truthful one-click image/ad/campaign generation deliverables.

Acceptance criteria:
- Dedicated deliverable composer writes campaign items, asset links, QA state, review state, and schedule draft bundle per run.
- New smoke tests validate end-to-end image ad and 30-second ad creation.
- Primary UI flow is creation-first with minimal diagnostics exposure.

### PR63 — Video/media production (P0/P1)
Goal: real 30/60s assembled video pipeline.

Acceptance criteria:
- Scene slot -> media fill -> voice/music/captions/overlay -> render job -> truthful completed asset lifecycle.
- Video outcome tests require playable output metadata and render-state truth.

### PR64 — Fleet app scaling (P1)
Goal: reusable multi-app marketing control.

Acceptance criteria:
- app selector + per-app memory/settings/templates + cross-app calendar layer.
- tenant/workspace/app isolation tests.

### PR65 — Better-than-competitors polish (P1/P2)
Goal: premium product superiority.

Acceptance criteria:
- fast setup wizard, templates/variants/repurposing, robust results dashboard, workflow speed + quality benchmarks.

## 20. Definition of done

### Go-live done
- User can generate image ad, 30-second ad package, and campaign package with persisted deliverables in one primary flow.
- No fake completion, no fake posting, no fake analytics.
- Production smoke suite passes on configured staging/prod environment.

### Better-than-anything-out-there done
- Faster workflow from brief to approved export than baseline competitor classes.
- Higher-quality reusable templates + specialist guidance with measurable conversion uplift.
- Fleet-level cross-app intelligence genuinely improves outcomes over isolated app tooling.

## 21. Top 10 blockers (strict order)

1. No guaranteed autonomous deliverable composer (campaign items/package writer) from `runAutonomousMarketingCampaign`.
2. Core user flows are still setup/status-heavy before output-heavy.
3. No guaranteed one-click image-ad output in primary command flow.
4. 30-second ad package generation is not strongly persisted as a complete bundle.
5. Media asset lifecycle invariants are not fully enforced at persistence boundary (`updateMediaAsset`).
6. Frontend completion labeling may diverge from deeper provenance expectations.
7. Music task canonical mapping still piggybacks text-to-speech semantics.
8. Live connector posting remains mostly unavailable until real credentials/scopes are configured.
9. Tests emphasize contracts/truth guards more than end-to-end deliverable outcomes.
10. Settings UX is accurate but too technical for fast operator setup.

## 22. Top 10 missing features

1. Deliverable package composer service.
2. End-to-end “image ad from prompt” product path.
3. End-to-end “30-second ad package from prompt” path.
4. Autonomous run to campaign item writer with deterministic schema.
5. Campaign package viewer tied to persisted deliverable bundle.
6. Setup wizard with minimal technical jargon.
7. Strong media provenance checks in persistence layer.
8. Built-in generation smoke tests for staging/prod environments.
9. Template-first creator flow for fast output quality.
10. Cross-app fleet operations layer (selector + consolidated calendar + shared learning controls).

## 23. Verification outputs

### `npm run check`
- Passed (`tsc --noEmit`).

### `npm test`
- Passed.
- Result: `73` test files, `562` tests.
- DB behavior: concise fallback warning (`[Database][test] Database unavailable, running DB-optional tests with setup_needed fallbacks.`), no repeated access-denied spam.

### `npm run preflight`
- Passed (`check-pkg` + `validate-routes`).

### `npm run build`
- Passed.
- Build fingerprint included SHA `bf23eab`.

### Focused subsets
- Frontend marketing tests: pass (`TheMarketingApp`, `StudioWorkbench`).
- Provider tests: pass.
- Media tests: pass.
- Marketing/autonomous tests: pass.

## 24. Files/function evidence index

Primary files used in this forensic audit:
- `server/routers.ts`
- `server/_core/ai/orchestrator.ts`
- `server/_core/ai/outputNormalization.ts`
- `server/_core/ai/mediaResolver.ts`
- `server/_core/ai/providerModelDiscovery.ts`
- `server/_core/ai/providers/genxProvider.ts`
- `server/_core/ai/providers/qwenProvider.ts`
- `server/_core/ai/providers/huggingFaceProvider.ts`
- `server/_core/ai/taskModelPolicy.ts`
- `server/_core/ai/tasks/taskRegistry.ts`
- `server/modules/marketing/studio-generation/index.ts`
- `server/modules/marketing/autonomous-campaign/index.ts`
- `server/modules/marketing/agent-workforce/index.ts`
- `server/modules/marketing/provider-capabilities/*`
- `server/modules/marketing/backend-readiness/index.ts`
- `server/modules/marketing/media-job-resolver/index.ts`
- `server/modules/marketing/results-conversion/index.ts`
- `server/modules/marketing/result-learning/index.ts`
- `server/modules/marketing/connector-readiness/index.ts`
- `server/modules/marketing/social-publishing/*`
- `server/modules/growth-engine/mediaAssets.ts`
- `server/modules/growth-engine/persistence.ts`
- `server/db.ts`
- `drizzle/schema.ts`
- `client/src/components/marketing/app/TheMarketingApp.tsx`
- `client/src/components/marketing/app/MarketingAppSettings.tsx`
- `client/src/components/marketing/app/MarketingAppPanels.tsx`
- `client/src/components/marketing/app/MarketingAppAssetStore.ts`
- `client/src/components/marketing/app/hooks/*`
- `client/src/components/marketing/app/studio/*`
- `client/src/components/marketing/studio/mediaStatus.ts`

