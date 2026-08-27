# Academy final-Core acceptance

**Candidate branch:** `release-candidate/final-core-2026-08-22`

**Internal status:** **PASS** on the final-Core candidate, subject to exact-head CI.

**External status:** GenX, SMTP and Academy Stripe provider acceptance remain disabled/fail-closed gates.

This is the authoritative Academy acceptance record for Core PR #3. It supersedes the earlier source-branch and unresolved-count wording.

## Factual and curriculum acceptance

| Evidence                                       | Result                                                 |
| ---------------------------------------------- | ------------------------------------------------------ |
| Pathways / lessons                             | 15 / 105                                               |
| Knowledge checks / competency references       | 334 / 198                                              |
| Structural-quality acceptance                  | 105/105                                                |
| `CLAIM_REVIEWED_AND_ACCEPTED`                  | 102                                                    |
| `NOT_MATERIAL_FACT_CHECK_REQUIRED`             | 3                                                      |
| `SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW` | **0**                                                  |
| Evidence-register audit                        | **PASS**; 105 factually accepted, zero register issues |

Every formerly unresolved lesson now has an explicit reviewer decision. Where the old lesson could not safely support a universal, clinical, fitting, coaching, legal or numerical claim, the learner content and assessments were rewritten around observation, the current plan, stop conditions and escalation to the responsible qualified person. Citations alone were not treated as acceptance.

The publication gate is server-owned. Student and teacher lesson queries expose only factually accepted content; the owner browser cannot override the gate. Legacy static scenarios, legacy daily-practice answers, virtual-horse automated care material and the legacy Study Hub default catalogue remain withheld unless they independently receive the same review.

## Functional acceptance

| Area        | Result and evidence                                                                                                                                                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Student     | **PASS** — authenticated dashboard, 15 pathways/105 lessons, ordered unlocks, lesson detail, three-question server-scored checks, completion/progress persistence, assigned task, group membership and lesson-specific Tutor handoff were exercised with disposable data. Cross-student access remains server-rejected.        |
| Teacher     | **PASS** — authenticated Instructor Portal, persisted group/student/task, 105 reviewed lesson choices (plus placeholder), lesson assignment, resources, messaging, feedback/report surfaces and membership-scoped isolation were exercised. Unrelated-student identifiers are rejected server-side.                            |
| Owner       | **PASS** — organisation, seat/member counts, invite/resend outcome, member management, 105-lesson curriculum count, persisted group/completion/due-task metrics and truthful billing state were exercised. Owner-only procedures reject teacher/student callers.                                                               |
| Invitations | **PASS internally** — active, resend, expired, used, correct-email and wrong/missing-email cases pass. A no-SMTP browser run persisted the invitation while showing `Delivery needs attention`; resend increased the attempt count and again showed failure. Batch UI records per-recipient delivery outcome.                  |
| Billing     | **PASS internally / provider gate open** — plan/price ownership, owner authorisation, checkout/portal boundaries, signature/replay/metadata rejection and cross-product isolation are deterministic-test covered. With no Academy TEST credentials, status is `not_configured`, portal is disabled and no checkout is claimed. |
| Tutor       | **PASS internally / provider gate open** — current lesson slug is preserved, server resolves only published lesson/pathway context, usage limits and veterinary/emergency boundaries remain server-side, and Tutor cannot write progress. With GenX unavailable the browser displayed the explicit configuration warning.      |
| Reporting   | **PASS** — owner counts and teacher/student activity are derived from persisted records; no fabricated analytics were introduced.                                                                                                                                                                                              |

## Browser, responsive and accessibility acceptance

Disposable authenticated browser journeys were run against the production bundles at 390×844, 768×1024 and desktop. Student, teacher and owner screens had no horizontal overflow. Navigation, semantic headings, labelled forms, invitation errors, empty states, lesson content, knowledge checks and Shop-separated billing state remained usable. The 390px owner page measured 384px document width; student and teacher pages measured no wider than their viewport.

## Deterministic evidence

- Complete repository suite: **125 files / 912 tests passed / 0 skipped** with the Commerce database suite enabled.
- Academy factual-publication and curriculum tests enforce the 105-lesson release gate.
- Invitation lifecycle tests cover active, resend, expired, used and email-bound acceptance.
- Tutor/source, billing, route, role-isolation and curriculum tests pass.
- Production Academy bundle builds successfully.

## External activation gates

- `ACADEMY_GENX_TEST_ACCEPTANCE=NOT_RUN_NO_AUTHORISED_PROVIDER_CREDENTIALS`
- `ACADEMY_SMTP_ACCEPTANCE=NOT_RUN_NO_AUTHORISED_SMTP_CREDENTIALS`
- `ACADEMY_STRIPE_TEST_ACCEPTANCE=NOT_RUN_NO_AUTHORISED_ACADEMY_STRIPE_CREDENTIALS`
- Real-device/PWA/network and production DNS/TLS routing remain deployment-stage checks.

No live provider result, accreditation, partnership or deployment is implied by this internal acceptance.
