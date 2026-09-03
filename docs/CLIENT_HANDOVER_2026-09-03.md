# EquiProfile Core client handover — 2026-09-03

## Release identity

- Repository: `sharetheherbman-debug/Equiprofile-Marketing`
- Branch: `chatgpt/final-client-handover-2026-09-02`
- Audited starting SHA: `c6dc23ef6f69bd563bf28a6381870d0517788baa`
- Release-code SHA: `114f85a722f34cb9fbcb9c5c2dd70dcc85f41937`
- The documentation commit is intentionally later than the release-code SHA. The final review/push SHA is recorded in the PR and final handover report.

## Product and service boundaries

This repository owns EquiProfile Management, Academy, School, the Shop Coming Soon surface, Core authentication/administration, the Management AI and Academy Tutor entry points, and the server-side connectors to standalone Marketing and Billing. It does not own a second Marketing engine or a second billing ledger.

| Surface | Canonical domain | Boundary |
| --- | --- | --- |
| Management/Core | `https://equiprofile.online` | Horse, stable and customer administration |
| Academy | `https://academy.equiprofile.online` | Academy-only catalogue, learning, assessments, progress and Tutor |
| Shop | `https://shop.equiprofile.online` | Premium Coming Soon page only; no commerce claims; `noindex,nofollow` |
| Marketing | `https://marketing.equiprofile.online` | Signed server-to-server handoff to standalone white-label Marketing |
| Billing | `https://billing.equiprofile.online` | Signed server-to-server handoff to standalone central Billing |

## Completed release work

- Product-aware registration, login, password reset, verification and welcome emails; Academy registration now receives Academy branding and an Academy destination.
- Academy route isolation and an Academy entitlement guard covering direct, complimentary and organisation-inherited access. Management routes are not exposed in the Academy bundle.
- Management and Academy AI requests have bounded history and server-controlled instructions. GenX is the only executable remote AI boundary; the client receives an honest unavailable state on provider failure.
- The duplicate in-Core billing pages and navigation were removed. Core issues the central Billing handoff and presents a branded unavailable state when Billing cannot be reached.
- Consent defaults to denied, can be reopened from product footers, and does not leave a permanent floating control.
- Canonical AmarktAI links use `amarktai.co.za`; runtime `amarktai.com` leakage is rejected by a release contract test.
- Shop is an explicitly non-transactional Coming Soon surface.
- Academy's 105 lessons have a current factual-evidence register, complete specific-claim review, and no exact or threshold-level near duplicates.

## Security, identity and entitlements

Browser sessions are established by Core. Marketing and Billing launch credentials are issued server-to-server and never expose shared connector secrets to the browser. Academy access is evaluated independently from Management subscription state. Billing synchronization updates the paid layer; administrator and complimentary access remain Core-owned overlays and must not be erased by paid-state events.

Secrets belong only in the deployment environment. Required variables and safe placeholders are documented in `.env.example`; key production requirements include database/JWT/admin-unlock settings, public product origins, GenX settings, and matching server-only Marketing/Billing connector keys.

## Verification evidence

Executed on Windows with Node 22 against the release-code tree:

- `npm run check` — PASS.
- `npm test` — 86 files; 489 passed, 11 skipped, 0 failed (500 total).
- `npm run preflight` — PASS.
- `npm run build:management`, `build:academy`, `build:school`, `build:shop`, `build:server` — PASS. Vite reported advisory large-chunk warnings only.
- `npm run acceptance:acquisition` — 16 passed, 0 failed.
- `npm run acceptance:management` — 9 passed, 0 failed, including paid/complimentary precedence, responsive Settings, central Billing absence, and explicit-confirmation AI action persistence.
- `npm run academy:factual:audit` — 105 accepted, 0 unresolved.
- `npm run academy:duplicate:audit` — 105 lessons, 5,460 comparisons, 0 exact/near duplicates and 0 gaps.
- In-app Chromium responsive acceptance — Management, Academy and Shop at 1440px, 768px and 390px; 0 horizontal overflow and 0 console errors. Consent reject/reopen passed; Shop robots passed.
- Changed-code whitespace check — PASS. The repository has no standalone lint script; CI's changed-code quality gate is the applicable lint policy.

CI additionally provisions and verifies a disposable MariaDB schema and runs the repository security scan. Those checks must be green on the final pushed SHA before release approval.

## Deployment and rollback

Do not deploy as part of this source-completion job. After review, deploy Core before dependent SSO smoke tests, apply only reviewed additive migrations, then deploy Marketing and Billing and run cross-system launch acceptance. Preserve the previous application artifact and database backup so the application can be rolled back without reversing additive schema history.

Do not casually reintroduce Management routes into Academy, a local billing UI, client-provided AI system prompts, non-GenX remote AI execution, transactional Shop claims, or consent-before-choice tracking.
