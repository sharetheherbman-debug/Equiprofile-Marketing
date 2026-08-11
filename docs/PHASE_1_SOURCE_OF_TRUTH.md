# EquiProfile Phase 1 — Source of Truth

## Canonical repository and protected starting point

- Canonical writable repository: `sharetheherbman-debug/Equiprofile-Marketing`
- Phase 1 branch: `phase-1/equiprofile-core-relaunch`
- Branch starting commit: `4eddfa89d7a56cf67a125fdf15a85fbf6d707261`
- That starting commit matches the application currently identified on the production VPS.
- Production remains untouched until the Phase 1 release passes its gates.

The historical production origin `amarktainetwork-blip/Amarktai-MarketingV3` is treated as a read-only legacy source. It is not the writable source of truth for the relaunch.

## Products in the current release

### In scope

1. EquiProfile core at `equiprofile.online`
2. Standalone EquiProfile Marketing at `marketing.equiprofile.online`

### Deferred

- EquiProfile Academy / School
- Academy subdomain and Academy-specific billing

Academy code is retained but is not part of the 48–72 hour relaunch scope.

## EquiProfile responsibility

EquiProfile owns only the core horse and stable product:

- public product website
- authentication and accounts
- Pro dashboard and entitlements
- Stable dashboard and entitlements
- horses, health, training, feeding, documents, tasks and stable operations
- subscriptions and account billing
- a single administrator-only connection card that opens EquiProfile Marketing
- consent-safe conversion events sent to Marketing

## Marketing responsibility

All campaign, content-generation, publishing, social, email-marketing, advertising, attribution, Growth Memory and relaunch automation belongs in the standalone Marketing application.

EquiProfile must not retain a second active marketing engine after migration. The old embedded marketing code remains temporarily only while useful capabilities and data are inventoried and moved safely.

## Secrets and infrastructure configuration

Infrastructure credentials are environment-only and must never be entered through the EquiProfile frontend or stored in `siteSettings`.

This includes:

- GenX API key, base URL and model configuration
- Stripe secret and webhook keys
- SMTP host, user, password and sender configuration
- Twilio / WhatsApp infrastructure credentials
- legacy Qwen and Hugging Face credentials during removal

The Phase 1 branch enforces this in `server/dynamicConfig.ts` and clears/blocks sensitive `siteSettings` values through migration `0013_environment_only_runtime_secrets.sql`.

Frontend forms that display or accept these credentials are scheduled for removal. Until that UI cleanup is committed, database and runtime safeguards prevent those forms from becoming a secret source.

## AI policy

- GenX is the sole remote AI provider.
- No Qwen, Hugging Face, Together, DeepInfra or OpenAI provider fallback is permitted.
- Failed GenX work remains failed or queued; template output may not be represented as successful AI output.
- Deterministic local services such as database search, image processing and FFmpeg are platform infrastructure, not AI fallbacks.

## EquiProfile-to-Marketing connection

The applications use separate databases and separate sessions.

The connection will use:

1. an immutable host application ID
2. an application connector key stored hashed in Marketing
3. short-lived signed SSO authorisation codes for administrators
4. signed conversion-event delivery
5. no shared cookies and no shared database credentials

Only approved product and aggregate/consent-safe growth data may cross the boundary. Horse health records and other private operational records remain in EquiProfile.

## Release rule

No destructive deletion of embedded marketing code or tables occurs until:

1. the corresponding capability is present and tested in standalone Marketing
2. scheduled jobs and writes have been disabled
3. required data has been exported or migrated
4. rollback evidence exists
5. production smoke tests pass

This document is the binding Phase 1 implementation scope unless explicitly revised.

## Release-candidate completion update — 11 August 2026

- The protected Phase 1 branch remains the release source; production and `main` were not changed.
- Pro/Stable customer boundaries, hidden exact-owner administration, disabled embedded Marketing execution, signed one-use SSO and consent-safe conversion delivery are covered by the full automated suite.
- Regression tests now normalize line endings so the same security assertions run reliably on Windows and Linux.
- Runtime dependencies with critical/high production advisories were upgraded and revalidated. The production-only audit has no critical/high findings; two moderate `exceljs`/nested `uuid` advisories remain and require a deliberate spreadsheet-library migration rather than a release-breaking downgrade.
- Management stays operational when standalone Marketing is unavailable. The connector remains disabled until the controlled join step.
- Remaining gates are operational: production backup/restore evidence, migration dry run, reverse-proxy/VPS validation, deployed browser acceptance, connector activation and combined acceptance.
