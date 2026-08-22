# EquiProfile Academy Acceptance

**Source branch:** `phase-1/small-medium-completion`
**Based on:** `feature/equiprofile-academy-commerce` at `40995fdfe7afbff5e723e59e6a6419ecf6329d3c`
**Release status:** **NOT READY TO DEPLOY**
**Reason:** 101 lesson-level source-to-claim factual reviews remain unresolved, and several authenticated role workflows still require complete acceptance evidence.

This is an evidence record, not a completion claim. A capability is marked **Complete/Pass** only when the current branch contains implementation plus suitable automated or disposable-environment evidence. External production services remain separate activation gates.

## 1. Branding, compatibility and architecture

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Canonical Academy public routes, navigation, footer and metadata | Complete | Canonical `/academy/*` surface and Academy build exist. |
| Canonical public host | Complete | `https://academy.equiprofile.online`; `school.equiprofile.online` is compatibility-only. |
| Legacy School source naming | Complete for in-scope Academy source | Naming audit reports zero invalid canonical School remnants; persisted legacy database values remain compatibility-only where destructive renaming is unsafe. |
| Academy visual family | Complete for public surface | Navy/gold EquiProfile family is implemented. Authenticated owner/student/teacher screens still require final suite-wide visual acceptance after Core reconciliation. |
| Single-Core deployment model | Defined | Management, Academy and Shop are intended to share one Core backend/database. Final reconciliation with the newer Management rescue branch remains a separate release task. |

## 2. Curriculum structure and editorial quality

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Pathways | Complete | 15 pathways. |
| Lessons | Complete structurally | 105 lessons. |
| Knowledge checks | Complete structurally | 334 checks. |
| Competency references | Complete structurally | 198 references. |
| Structural quality gate | Pass | 105/105 meet the current structural/editorial thresholds; zero placeholders/shallow records/semantic-duplicate flags in the generated structural report. |
| Server-trusted completion | Pass | Score and canonical lesson facts are derived server-side; completion persistence is versioned/idempotent. |
| Unsupported accreditation wording | Pass | No unsupported BHS/Pony Club accreditation or endorsement claim is permitted. |
| **Specific factual acceptance** | **BLOCKED** | Current factual evidence register records **101 lessons as `SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW`** and only 4 as `NOT_MATERIAL_FACT_CHECK_REQUIRED`. Source mapping is not factual acceptance. |
| Safety/clinical/legal/numerical claim acceptance | **BLOCKED where included in the 101** | Material claims must be source-to-claim reviewed or rewritten as appropriately individualised/professional-guidance principles. |

### Binding factual-review count

The current `lesson-factual-evidence-register.json` is the source of truth until the large lesson-review pass is completed:

- Lessons registered: **105**
- `NOT_MATERIAL_FACT_CHECK_REQUIRED`: **4**
- `SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW`: **101**
- Release-blocking unresolved specific-claim reviews: **101**

Do **not** replace these unresolved states with generated or inferred PASS values. The remaining 101 reviews are the principal large Academy task for the next completion pass.

Corrective rewrites already made are documented in `docs/academy/factual-source-findings.md`; those corrections do not imply that every remaining material statement in the affected lesson has been independently accepted.

## 3. Disposable authenticated Academy acceptance

| Persona / route | Status | Evidence / remaining work |
| --- | --- | --- |
| Public Academy home | Pass | Disposable browser surface rendered. |
| Student registration/local verification | Pass | Disposable non-production flow exercised. |
| Student dashboard/recommendation | Pass | Live disposable curriculum recommendation rendered. |
| Lesson detail/knowledge checks | Pass | Lesson content and checks rendered. |
| Server-scored completion/progress persistence | Pass | Disposable completion persisted from server-owned facts. |
| Academy owner organisation/dashboard | Pass for organisation/membership baseline | Organisation, plan/seat counts, member list and invitation surface rendered. |
| Teacher invitation/acceptance | Pass for disposable flow | Invite acceptance routed the email-matched user to the Instructor Portal. |
| Student/teacher feedback | **Not yet fully evidenced** | Requires role-specific acceptance fixture and browser journey. |
| Assignments/tasks | **Not yet fully evidenced** | Requires student + teacher create/complete/review journey. |
| Groups/classes | **Not yet fully evidenced** | Requires create/member/change/isolation journey. |
| Scheduling/calendar | **Not yet fully evidenced** | Requires teacher/owner/student visibility and authorization journey. |
| Owner curriculum administration | **Not yet fully evidenced** | Membership/invitation is proven; the complete owner curriculum/admin surface is not yet accepted. |
| Owner activity/reporting | **Not yet fully evidenced** | Must use persisted data; no fake analytics may be accepted. |

## 4. Invitation delivery

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Server-side Academy email sender | Implemented | `sendAcademyInviteEmail` is used for initial and resend delivery. |
| Delivery outcome persistence | Implemented | Delivery state is recorded rather than silently claiming success. |
| Expired invitation handling | Implemented | Expired invite is rejected and a new invitation is required. |
| SMTP live-provider acceptance | External acceptance outstanding | Must be exercised after the final Core environment is configured. |
| Batch/onboarding UI truth | Final acceptance required | UI must surface partial/failed delivery rather than reporting an unconditional successful batch. |

## 5. Academy billing

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Academy-specific billing domain | Implemented | Separate Academy billing module and migration. |
| Stripe isolation | Implemented | Academy uses Academy-specific TEST credentials and metadata, not Management/Store secrets. |
| Server plan/price resolution | Implemented | Browser cannot submit an arbitrary Stripe price ID. |
| Checkout/portal software | Implemented | Owner-authorised TEST-only checkout and portal routes exist. |
| Webhook isolation/replay handling | Covered by focused tests | Final test-account provider acceptance still required. |
| Live billing | **Not enabled** | Deliberately out of scope before final staging/production acceptance. |

## 6. Tutor and integrity controls

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Provider-neutral server-side AI boundary | Complete | No browser provider key and no implicit vendor/model fallback. |
| Current lesson/pathway context | Implemented | Existing Tutor context is retained. |
| Daily usage boundary | Implemented | Usage policy/limits retained. |
| Veterinary/emergency boundary | Implemented in policy/tests | Tutor must escalate and cannot diagnose/treat. |
| Tutor cannot fabricate completion | Complete | Completion remains a server-owned course action. |
| Provider-enabled guided-questioning session | **Not yet evidenced** | Must be run with the final configured Core/GenX provider. |
| Reading-level adaptation | **Not yet evidenced end-to-end** | Requires provider-enabled acceptance. |

## 7. Migration and local environment integrity

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Fresh additive migration chain | Pass in disposable environment | New Academy/Commerce migrations applied without a production reset. |
| Academy organisation/membership/invites migration-owned | Complete | Additive schema is present. |
| Academy invitation delivery fields | Complete | Additive migration present. |
| Academy TEST billing fields/event ledger | Complete | Additive migration present. |
| Commerce lifecycle tables | Complete for current branch | Final Core reconciliation requires a fresh migration-from-zero and upgrade rehearsal again. |
| Production DB touched | No | No production migration/deployment was performed. |

## 8. Responsive acceptance

| Surface | Status |
| --- | --- |
| Academy home at 390 × 844 | Pass in disposable browser evidence |
| Student dashboard at 390 × 844 | Pass in disposable browser evidence |
| Catalogue/pathway/lesson detail at 390 × 844 | Pass in disposable browser evidence |
| Academy home/student/catalogue/pathway/lesson at 768 × 1024 | Pass in disposable browser evidence |
| Real-device/PWA/network acceptance | External/device acceptance still required |

## 9. Current automated validation record

The latest corrective PR report at the Manus stopping point records:

- TypeScript check: passed
- Preflight: passed
- Full regression suite: **25 test files / 182 tests passed**
- Academy naming audit: passed
- Academy curriculum audit: passed
- Academy structural-quality audit: 105/105 structurally ready
- Academy safety-boundary guard: passed for configured automated flags
- Management/Academy/Shop/server build: passed
- PR-scoped Prettier/whitespace: passed

There is **no GitHub Actions run attached to `40995fdfe7afbff5e723e59e6a6419ecf6329d3c`**. The complete suite must be rerun on the final reconciled Core SHA.

## 10. External dependencies still outstanding

- live SMTP configuration and delivery acceptance;
- Academy Stripe TEST account/price/webhook acceptance if credentials are not already available;
- final production DNS/TLS/CORS/reverse-proxy acceptance;
- real-device/PWA testing;
- final Core/GenX Tutor provider acceptance.

These external items do **not** excuse unfinished internal software paths.

## 11. Release blockers

Academy must not be marked production-ready until all of the following are true:

1. All 101 unresolved source-to-claim lesson reviews are explicitly completed and resulting corrections pass the full curriculum suite.
2. Student/Teacher assignments, feedback, groups and scheduling receive complete authenticated acceptance.
3. Academy Owner curriculum/admin/activity/reporting surfaces receive complete authenticated acceptance.
4. Provider-enabled Tutor acceptance passes against the final Core AI/GenX route.
5. Academy is reconciled into the final single EquiProfile Core without regressing Management or Shop.
6. The final Core SHA passes clean migration, full tests/builds and browser/mobile acceptance.

## 12. Safety / repository state

- No merge performed.
- No production deployment performed.
- No production database migration/reset performed.
- No DNS/TLS change performed.
- No live payment or supplier activation performed.
- The separate Management and Marketing production candidates remain untouched by this acceptance record.
