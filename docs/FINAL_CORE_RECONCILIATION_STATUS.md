# Final Core Reconciliation Status

**Branch:** `release-candidate/final-core-2026-08-22`

**Starting point:** Management-authoritative `phase-1/small-medium-completion` at `b20a622039c65503f8d54dceeff5b072f1521cc6`

**Current candidate:** Current `release-candidate/final-core-2026-08-22` branch head. Always verify the exact SHA and its CI checks before any release or VPS action.

**Status:** **IN PROGRESS — MANAGEMENT INTERNALLY ACCEPTED SUBJECT TO FINAL EXACT-HEAD CI; ACADEMY/SHOP AND LIVE DEPLOYMENT ACCEPTANCE REMAIN**

This record preserves current reconciliation truth. No production deployment, merge, production database mutation, DNS change, live Stripe charge, supplier activation, paid advertising action, or secret exposure has been performed from this release-candidate work.

| Reconciliation area | Current state | Evidence / boundary |
| --- | --- | --- |
| Management-authoritative base | Preserved | Management remains the authoritative source; Academy and Shop are additive product namespaces in this same cumulative Core release candidate. |
| Canonical Academy and Shop build targets | Implemented and built | `management`, `academy`, and `shop` are explicit build targets; `school` remains a compatibility alias only. |
| Academy router, curriculum, and invitation domain | Implemented; factual/browser acceptance incomplete | Canonical Academy router and persisted invitation-delivery outcome contract are present. Claim-level factual review and authenticated multi-role browser acceptance remain release blockers. |
| Shop router and Store Stripe boundary | Implemented; provider/browser acceptance incomplete | Commerce router is registered. Store Stripe remains TEST-only and requires `ENABLE_STORE_STRIPE=true` plus Store-specific credentials; no SaaS fallback or live provider action occurred. |
| Academy/Store webhook isolation | Implemented | Signed raw-body handlers are separate from SaaS billing and fail closed when dedicated configuration is absent. |
| Final-Core migration architecture | **Internally accepted on disposable MariaDB** | Fresh zero, exact five-entry tracked Management, exact legacy adoption with backup gate, current no-op, and unknown fail-closed paths are documented in [the migration matrix](./MIGRATION_TEST_MATRIX.md). Historical journals are untouched; orphaned `0014`–`0024` are neither executed nor marked applied. Production still requires read-only schema classification and a verified backup before migration. |
| Standalone Marketing release candidate | **Internally frozen** | Marketing PR #4 / `release-candidate/marketing-product-2026-08-22` is frozen at `93361324cbd6a030539eb3e09b500bc91cebf974` after green TypeScript, 192 API tests, clean migrations, production build, Docker/proxy/Compose validation, security audit, and verification. Production host/provider/SMTP/browser acceptance remains a separate deployment gate. |
| Shared Management entitlement | **Implemented and tested across server and browser gates** | The canonical paid/trial/complimentary resolver is shared by server authorization, Management navigation, protected-route/paywall logic, and trial messaging. Active complimentary Stable/full access is represented correctly; an expired complimentary overlay falls back to valid paid/trial state and cannot block a paid user. Billing-owned subscription fields are not rewritten. |
| Management browser acceptance | **Implemented and passing on validated functional head** | CI run `32630847274` passed the public Playwright smoke and authenticated Management Chromium acceptance. Scenarios cover paid Pro, paid Stable, complimentary Stable over Pro, full complimentary access over underlying expired billing/trial state, expired-overlay fallback, Settings at 390 px without horizontal overflow, and Billing on tablet. Final release still requires the current exact head to repeat these gates after documentation/CI-only changes. |
| Management GenX fail-closed behavior | **Internally proven; live provider acceptance pending** | Provider-routing regression coverage requires GenX only and an empty provider list when unavailable; no legacy AI fallback is accepted. AI Chat surfaces provider/internal errors rather than fabricating a successful response. The final production GenX key/catalogue/generation/outage test has not yet been performed and must not be marked provider-tested until deployment acceptance. |
| Trusted Core-to-Marketing event boundary | **Implemented and tested** | The standalone Marketing connector receives only consented, allow-listed, HTTPS-signed, idempotent events. Payload validation rejects PII, payment, supplier, health, learning, and secret-related fields. Missing connector configuration remains a truthful disabled state. Final live Core→Marketing E2E remains a deployment acceptance gate. |
| Core deterministic quality gates | **Passing on validated Management head; final exact-head rerun required** | Management functional CI run `32630847274` passed typecheck, build, **891 deterministic tests**, changed-code quality, public UI smoke, and authenticated Management browser acceptance. The current candidate must repeat the same checks after the final documentation/CI cleanup before it is frozen. |
| Production dependency security gate | **Blocking high/critical audit enabled and passing** | CI now runs `npm audit --omit=dev --audit-level=high`, and future production deployment depends on the security job. The production tree has no high/critical npm-audit findings. Two moderate advisories remain in ExcelJS's nested `uuid` dependency; npm proposes a breaking ExcelJS change, so this is tracked rather than force-fixed without compatibility evidence. Trivy remains supplemental SARIF scanning. |

## Accepted Management boundary

Management's canonical entitlement is one shared capability rule, not a collection of UI-specific interpretations. Server middleware, dashboard navigation, Stable-only route access, paywall behavior, and trial messaging must continue to consume the shared resolver. A complimentary grant is an overlay only: it can extend access while valid, but it never mutates Stripe/subscription ownership and its expiry cannot invalidate an otherwise-valid paid plan.

The authenticated browser suite is a deterministic release test, not production-provider evidence. It uses the real Management frontend in Chromium with controlled authenticated tRPC fixtures so Pro/Stable/complimentary/expired-overlay states can be regression-tested without mutating a production database or payment provider.

## Accepted migration boundary

The normal `npm run db:migrate` command is classification-first and intentionally conservative. It provisions only an inspected zero database, upgrades only the exact fingerprint-gated tracked Management baseline, and returns a no-op for a current final schema. Partial, ambiguous, drifted, and unknown schemas fail closed. An exact untracked legacy baseline is detected but cannot be upgraded automatically; it requires a separately invoked named adoption command plus an owner-controlled backup reference.

> The marker-only replay fixture remains **diagnostic evidence only**. It establishes neither production journal history nor permission to rewrite a migration file, journal row, or orphaned migration.

## Remaining release blockers

### Management external acceptance

Management software is internally accepted only after the final exact branch head repeats all required CI gates. Production acceptance still requires:

- read-only production DB classification and verified rollback backup before migration;
- final production GenX credentials: successful real request, governed result, controlled provider failure/outage, and proof that no fallback provider answers instead;
- final production browser sweep for owner/admin and representative Pro/Stable/paid/complimentary states after deployment;
- final live signed Core→Marketing SSO/event delivery and privacy/failure-isolation proof against the frozen Marketing SHA.

Until the real GenX provider test is run, record **PROVIDER TESTED = NO** rather than inferring success from source/CI coverage.

### Academy

Academy factual acceptance is not complete. The evidence register must retain individual claim-level review rather than bulk promotion. Authenticated Academy role/isolation/browser acceptance, remaining teacher/student workflow depth, Tutor/provider acceptance, SMTP delivery and final PWA/device checks remain outstanding.

### Shop

Shop internal contracts are substantial, but full customer/admin browser journeys, concurrency/idempotency races, Store Stripe TEST lifecycle and refund isolation, responsive/accessibility/SEO acceptance, Shop→Marketing events, and authorized supplier-connector acceptance remain outstanding. Keep Store Stripe disabled until its dedicated TEST acceptance passes.

## Deployment boundary

A fresh VPS cutover is a separate controlled operation after all four product phases are internally accepted. Inventory and back up first; do not perform a blind wipe. Remove only explicitly identified obsolete application builds/containers/caches and only remove persistent volumes when ownership, retention intent, and verified rollback evidence are established. Preserve production secrets, databases/data selected for retention, uploads/media selected for retention, certificates, reverse-proxy configuration, and backups.

Deploy only the exact frozen Marketing SHA and the final exact frozen Core SHA. Record final SHAs, migration classification, backup/checksum, TLS/vhost state, provider acceptance, browser acceptance, cross-application acceptance, and rollback evidence before customer handover.
