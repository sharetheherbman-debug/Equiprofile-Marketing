# EquiProfile Core — Marketing Boundary

**Status:** EquiProfile Core is a host product for Management, Academy, Shop and School. It is **not** a second Marketing implementation.

## Canonical decision

EquiProfile Marketing lives only in the standalone **Amarktai Marketing** repository. Core exposes an owner-only signed launch card within its protected Management administration surface. The connector exists to open the standalone product, not to proxy content creation, model selection, generation, cost tracking, campaigns, contacts, publishing, or provider configuration through Core.

| Area | Core responsibility | Explicit exclusion |
|---|---|---|
| Management | Horse, stable, health, training, documents, tasks, reporting and entitlement workflows | Embedded Marketing dashboard, campaign engine, creative studio, provider setup and publishing controls |
| Academy | Learner, teacher and Academy administrator workflows | Embedded Marketing client or Marketing contacts/campaign routes |
| Marketing connector | Owner-scoped availability check and signed short-lived SSO redirect | Direct access to Marketing records, provider credentials, credit wallets or release actions |
| Core onboarding | Account-type onboarding retained in `server/onboardingFlow.ts` | Legacy Growth Engine namespace or marketing CRM coupling |

> **Non-negotiable rule:** A future Core feature must not add a Marketing UI, router procedure, persistence module, worker, test, or provider adapter. New Marketing capability belongs in the standalone Marketing application and is reached through the connector contract only.

## Implemented boundary

The duplicate Core Marketing client, Marketing router procedures, campaign/contact administration controls, Marketing-only analytics screens, Marketing domain modules, related contracts, and associated legacy tests have been removed. The retained Core connector is implemented by `server/marketingConnector.ts` and its presentation card is `client/src/components/admin/MarketingConnectionCard.tsx`.

The connector is disabled by default. It requires all of the following before it will report available or issue a redirect:

| Requirement | Safeguard |
|---|---|
| Connector enabled | `MARKETING_CONNECTOR_ENABLED` must be explicitly true. |
| Application endpoint | The configured Marketing API URL must be HTTPS. |
| Secret | `EQUIPROFILE_CONNECTOR_KEY` must meet the configured minimum secret length and remains server-only. |
| Owner identity | The signed-in Core administrator must match `PRIMARY_ADMIN_EMAIL`. |
| Request integrity | Mutating SSO issuance rejects cross-site cookie-authenticated requests. |
| Redirect safety | The returned URL must have the configured Marketing application origin. |

No connector or provider secret is displayed by the Core client. A disabled or failed connector returns a clear unavailable state and Management remains usable.

## Client workflow integrity

Management retains its normal navigation and entitlement guards. The dedicated Management browser acceptance suite validates paid Pro, Stable, complimentary, expired-overlay, mobile Settings, and Billing paths. Academy retains its learner/teacher/administrator application route structure and factual evidence register; it contains no embedded Marketing surface.

Core onboarding was extracted from the deleted Growth Engine into `server/onboardingFlow.ts`. The implementation deliberately resolves the database dependency lazily so the pre-existing isolated router tests keep their database-mock contract without weakening runtime persistence behavior.

## Verification evidence

| Gate | Result | Evidence |
|---|---|---|
| Core preflight, type check, Management and Academy builds | Passed before client acceptance | `audit/core-management-academy-verification.log` (handover workspace) |
| Full Core automated suite | Passed: **77 files, 428 tests, 11 explicit skips** | `audit/core-full-test-suite-final-2.log` (handover workspace) |
| Connector owner boundary | Passed: **7 tests** | `audit/core-marketing-owner-boundary-test.log` (handover workspace) |
| Management client browser acceptance | Passed: **9 scenarios, 0 failures** | Authenticated deterministic-provider suite, including governed action confirmation and reload persistence |
| Academy factual evidence | Passed: **105 registered lessons, 0 unresolved specific claim reviews** | `audit/academy-factual-evidence.log` (handover workspace) |
| Patch integrity | Passed | `git diff --check` on the release branch |
| Public endpoint, read-only | Reachable public landing page with Management positioning; no Marketing workspace exposed publicly | `audit/production-endpoint-readonly-checks.md` (handover workspace) |

## Release discipline

Core changes are a source-verified release candidate. No production deployment, connector activation, secret rotation, live provider action, or database migration was performed from this sandbox. Production rollout must use the existing approved environment and secret manager, take a rollback point, apply only safe migrations, deploy Core and standalone Marketing through their normal independently verifiable paths, then validate connector status and signed SSO with the configured primary owner.

A production verification must distinguish these outcomes explicitly: **disabled**, **configured but unavailable**, **available**, **redirect issued**, and **redirect followed successfully**. It must not infer successful access from the mere presence of a Core UI card.
