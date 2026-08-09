# EquiProfile Rebuild and Marketing Separation

## Target product boundary

### EquiProfile (`equiprofile.online`)

EquiProfile remains a focused horse and stable management product. It owns:

- Authentication and user accounts
- Horse, health, training, feeding, stable, calendar, document and reporting data
- EquiProfile subscriptions and entitlements
- A single secure launch card linking eligible users to EquiProfile Marketing
- An event outbox that sends approved product and conversion events to the marketing platform

It must not contain marketing campaign generation, marketing media generation, social publishing, advertising, marketing provider routing, marketing queues, or marketing workspace tables after migration is complete.

### EquiProfile Marketing (`marketing.equiprofile.online`)

EquiProfile Marketing is a standalone multi-tenant marketing platform that can connect to EquiProfile and future applications. It owns:

- Marketing organizations, workspaces, users, roles and usage limits
- Brand intelligence and approved host-app context
- Campaign Autopilot and Growth Memory
- Content, image, audio and video generation
- Social publishing and scheduling
- Organic, SEO, email and paid advertising workflows
- Marketing analytics, attribution and revenue reporting
- Marketplace packages and reusable vertical campaign systems

## Authentication boundary

Do not share the EquiProfile session cookie or database with the marketing platform.

Use a short-lived, single-use signed SSO handoff:

1. An authenticated EquiProfile user selects **Open EquiProfile Marketing**.
2. EquiProfile creates a one-time authorization code containing only the stable user ID, tenant ID, role and entitlement.
3. The browser is redirected to the marketing subdomain with the one-time code.
4. EquiProfile Marketing exchanges the code server-to-server, creates or links its local user, then issues its own secure session.
5. The code is invalidated immediately.

Required protections: 60-second expiry, one-time use, issuer/audience validation, nonce, PKCE or equivalent verifier, HTTPS only, HttpOnly cookies, SameSite=Lax or Strict, key rotation, audit logging and explicit logout behaviour.

## Provider policy

- GenX is the primary AI provider.
- Together and DeepInfra are optional fallback AI providers.
- No other AI provider is required.
- Deterministic fallback content must be visibly labelled and cannot be treated as successful model output.
- Social networks, advertising platforms, analytics systems, email delivery and payment processors still require their own credentials or OAuth grants; an AI API key cannot replace those external service credentials.

## Removal sequence

1. Inventory and freeze the embedded marketing feature.
2. Export any marketing records that must be retained.
3. Add the external Marketing launch card and SSO handoff.
4. Prove the standalone platform in staging.
5. Disable embedded marketing UI, routes, queues and scheduled jobs.
6. Remove old frontend components and admin sections.
7. Remove old server procedures, provider modules and workers.
8. Archive then drop marketing-only tables in a later reversible migration.
9. Preserve only shared utilities that EquiProfile still uses independently.
10. Verify clean build, clean database migration, backups, account flows and production smoke tests.

## Launch gates

Neither product is considered ready until all applicable checks pass:

- TypeScript and production builds
- Automated tests
- Clean database migration from an empty database
- Upgrade migration against a production-shaped database copy
- Authentication and account lifecycle tests
- Authorization and tenant-isolation tests
- Backup and restore test
- Mobile dashboard smoke test
- GenX text and representative media tests
- Together and DeepInfra fallback tests when configured
- Social/ads/analytics/email connector tests with real sandbox credentials
- Stripe test-mode subscription and webhook tests
- DNS, TLS, reverse proxy and container health checks
- Rollback drill
