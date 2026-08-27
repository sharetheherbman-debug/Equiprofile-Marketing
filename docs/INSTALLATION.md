# EquiProfile Core Installation and Operations Guide

**Scope.** This guide covers the single **EquiProfile Core** deployment that serves Management, Academy and Shop from one Express server and one MariaDB/MySQL database. It is an operator guide, not an instruction to perform an automatic deployment. Review all environment values, credentials, data protection requirements and change approvals before running any production command.

> **Deployment boundary:** Management, Academy and Shop share the Core backend, but their public hosts, Stripe credentials, webhooks and product data must remain logically isolated. Academy billing is currently implemented for **Stripe TEST mode only**. Store payment credentials must not be reused for SaaS or Academy billing.

## 1. Architecture and host routing

| Surface    | Canonical public host                | Build command              | Primary purpose                                                                  |
| ---------- | ------------------------------------ | -------------------------- | -------------------------------------------------------------------------------- |
| Management | `https://equiprofile.online`         | `npm run build:management` | Authenticated horse, yard and management workflows                               |
| Academy    | `https://academy.equiprofile.online` | `npm run build:academy`    | Public Academy pages and organization learning workflows                         |
| Shop       | `https://shop.equiprofile.online`    | `npm run build:shop`       | Governed Commerce catalogue, cart, orders and returns                            |
| Core API   | Private behind the reverse proxy     | `npm run build:server`     | Shared authentication, tRPC, webhooks, email, migrations and storage integration |

The three Vite bundles are served by one Node/Express process. Use a reverse proxy to terminate TLS, forward the canonical host to Core, and preserve `X-Forwarded-*` headers. Set `ALLOWED_ORIGINS` to the exact HTTPS public origins plus any temporary local acceptance origins; do not use a wildcard in production.

Shared authentication requires secure, HTTPS-only cookie configuration, a stable production `JWT_SECRET`, and a consistent top-level cookie domain only where a shared session is intended. Validate the Management, Academy and Shop sign-in, sign-out and cross-host session behavior in a staging environment before a release.

## 2. Prerequisites

| Requirement         | Operational expectation                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Runtime             | Supported Node.js 22 runtime and npm dependencies installed with `npm ci`                                                          |
| Database            | MariaDB/MySQL reachable through a least-privilege application account; separate database and credentials for each environment      |
| Reverse proxy       | TLS termination, canonical host routing, WebSocket support if used, body-size limits appropriate to uploads, and forwarded headers |
| Storage             | Durable writable volume or configured storage proxy; never rely on a container’s ephemeral filesystem for uploads                  |
| Email               | SMTP configuration verified before sending Academy invitations or transactional mail                                               |
| Stripe              | Separate credentials and webhook secrets per product line; TEST mode during acceptance                                             |
| Supplier services   | Contract, credentials, image-rights confirmation and human onboarding approval before any supplier can be activated                |
| Marketing connector | HTTPS endpoint and signing secret only when consent-gated event publishing is approved                                             |

## 3. Fresh installation

1. Clone the authorized repository and check out the approved release commit or reviewed feature branch. Do not deploy an unreviewed draft pull request.
2. Install dependencies with `npm ci`.
3. Create a production-only `.env` from `.env.example`. Keep it outside source control and restrict file permissions.
4. Create the database and an application account with only the required database privileges. Do **not** point a development or acceptance `.env` at a production database.
5. Run the additive migration command with `DATABASE_URL` explicitly set for the target environment:

   ```bash
   DATABASE_URL='mysql://app_user:REDACTED@db-host:3306/equiprofile' npm run db:migrate
   ```

   The migration script is additive and does not automatically drop tables. Confirm the backup in Section 5 exists before every production schema change.

6. Validate configuration and code before starting the service:

   ```bash
   npm run check
   npm run preflight
   npm test
   npm run build
   ```

7. Provision durable upload storage, make it writable by the service account, and set `STORAGE_PATH` or the configured storage proxy variables. Confirm that storage is not world-writable.
8. Start the built service through the approved process manager. The process should run as a non-root account and be restarted only after health checks pass.
9. Configure reverse-proxy routing for all canonical hosts and send webhook routes directly to Core without a body parser in front of Stripe raw-body verification.
10. Perform the acceptance checks in Section 9 before enabling user traffic.

## 4. Upgrade procedure

Every upgrade must be reversible at the application level and based on a completed backup.

1. Record the currently running commit, build fingerprint, database migration state, process status and active environment revision.
2. Take and verify a database backup and storage snapshot according to Section 5.
3. Fetch the reviewed release, run `npm ci`, then run `npm run check`, `npm run preflight`, `npm test` and `npm run build` in a staging or release workspace.
4. Review the migration files. Only additive migrations are permitted by this project’s acceptance contract. Do not introduce a destructive reset or use `db:push` as a substitute for reviewed migrations.
5. Put the service into the approved maintenance or drain mode if required by the release plan. Apply `npm run db:migrate` using the exact target environment `DATABASE_URL`.
6. Start the new build, then verify `/api/health`, `/api/health/ready` if configured, the Management host, `academy.equiprofile.online`, `shop.equiprofile.online`, authentication and static assets.
7. Confirm migration tracking, service logs and background schedulers. Retain the previous application artifact until the operational observation window has elapsed.

## 5. Backup and restore rehearsal

### Backup

Back up the database **before every migration** and on the approved routine schedule. Store encrypted backups outside the runtime host with retention and access controls appropriate to the organization.

```bash
mariadb-dump --single-transaction --routines --events \
  --host="$DB_HOST" --user="$BACKUP_USER" --databases equiprofile \
  | gzip > "equiprofile-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
```

Back up the configured file-storage volume or object-store bucket separately. Database backups do not include uploaded assets held outside the database. Record the application commit and migration journal alongside each backup.

### Restore rehearsal

At least periodically, restore to a **new isolated database** and a non-public storage location. Run migrations only if the restored migration tracking state requires them; never test restoration against production. Start a disposable Core instance with redacted/non-delivery SMTP and TEST-only Stripe settings. Verify sample authentication, Academy organization data, Shop orders, uploaded assets and `/api/health` without contacting real customers, suppliers or payment systems.

## 6. Environment-variable contract

The following groups are intentionally separated. Keep secrets in an approved secret manager or protected `.env`, not in browser code, source control, query parameters or logs.

| Group        | Required or significant variables                                                                                                                                | Boundary                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Core         | `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`, `ALLOWED_ORIGINS`, `PRIMARY_ADMIN_EMAIL`, `ADMIN_UNLOCK_PASSWORD`                                              | Shared server and authentication contract                                                            |
| Core AI      | `CORE_AI_BASE_URL`, `CORE_AI_API_KEY`, `CORE_AI_MODEL`                                                                                                           | Provider-neutral server-only contract; no implicit model or vendor fallback                          |
| SMTP         | SMTP host, port, user, password, sender/from settings                                                                                                            | Required for actual Academy invitation delivery; failed delivery is persisted and shown to the owner |
| Academy      | `ACADEMY_PUBLIC_URL`, `ENABLE_ACADEMY_BILLING`, `ACADEMY_STRIPE_TEST_MODE`, `ACADEMY_STRIPE_SECRET_KEY`, `ACADEMY_STRIPE_WEBHOOK_SECRET`, Academy plan price IDs | TEST-only Academy organization subscriptions; never reuse SaaS or Store credentials                  |
| SaaS billing | `ENABLE_STRIPE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, SaaS price IDs                                                                                    | Individual Management subscription billing only                                                      |
| Store        | `ENABLE_STORE_STRIPE`, `STORE_STRIPE_SECRET_KEY`, `STORE_STRIPE_WEBHOOK_SECRET`, `STORE_PUBLIC_URL`, `COMMERCE_RETURN_WINDOW_DAYS`                               | Shop checkout, Store webhook reconciliation and operational return policy only                       |
| Suppliers    | Supplier source URLs/credentials maintained in the protected onboarding process                                                                                  | Do not activate an unapproved source or expose credentials in the UI                                 |
| Marketing    | `MARKETING_CONNECTOR_URL`, `MARKETING_CONNECTOR_SIGNING_SECRET`                                                                                                  | Consent-gated, HMAC-signed Core-to-Marketing publisher only                                          |
| Storage      | `STORAGE_PATH` or storage-proxy endpoint and secret                                                                                                              | Durable server-side file storage                                                                     |

Use a long unique `JWT_SECRET` per environment. Rotate secrets using an approved dual-secret or maintenance plan; a blind rotation can invalidate active sessions and webhook verification. Configure `COMMERCE_RETURN_WINDOW_DAYS` explicitly. If absent, the Shop disables self-service return requests rather than assuming a legal deadline.

## 7. Billing and webhook configuration

### Academy billing

Academy checkout intentionally fails closed unless `ENABLE_ACADEMY_BILLING=true`, `ACADEMY_STRIPE_TEST_MODE=true`, an `sk_test_` Academy secret, valid Academy price IDs and an Academy webhook secret are supplied. The UI sends only the selected plan tier and interval; the server resolves the price ID. The webhook route is:

```text
POST /api/webhooks/academy-stripe
```

Configure this endpoint in the matching Stripe TEST account. It validates the raw body signature, requires `academyScope=academy` metadata, records provider-event replay protection in `academyBillingEvents`, and updates only the referenced Academy organization.

### Store payments

The Shop uses a separate Store Stripe client and webhook:

```text
POST /api/webhooks/store-stripe
```

The Store webhook validates its own secret, accepts only `commerceScope=store` metadata, records a unique provider event, and reconciles paid checkout amount/currency to the trusted order total. Do not configure it with SaaS or Academy credentials. Store checkout remains disabled unless `ENABLE_STORE_STRIPE=true` and the Store TEST secret is available.

### SaaS billing

The historic SaaS subscription webhook remains separate at `/api/webhooks/stripe`. It must use the SaaS secret and must not process Store or Academy events.

## 8. Supplier and Commerce readiness

No supplier becomes active merely because it exists in the database or appears in the Commerce Admin interface. Before human activation, obtain the commercial agreement, supplier credentials, product factual provenance, shipping/returns profile, inventory freshness arrangement and licensed image-rights confirmation. Record onboarding state and use the Commerce Admin connection check as a configuration-readiness record only; it does not make a live external supplier request.

Products remain unavailable to the public catalogue unless they are non-development records, published, human-approved, have licensed imagery and pass server-side stock freshness checks. Pricing, VAT and inventory are recalculated server-side during cart and checkout operations. Customer return requests are checked against owned order items, recorded delivery evidence, the policy snapshot, return window and cumulative quantity.

## 9. Post-installation acceptance checks

| Area            | Check                                                                                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Health          | `GET /api/health` returns an expected healthy response; review logs for database, SMTP and configuration warnings                                                                                   |
| Hosts           | Management, `academy.equiprofile.online` and `shop.equiprofile.online` resolve over HTTPS with expected canonical metadata and assets                                                               |
| Authentication  | Sign in, sign out, route protection and intended shared-session behavior verified in a staging account                                                                                              |
| Academy         | Organization creation, invitation delivery state, resend outcome, member acceptance and owner-only billing status checked with test accounts                                                        |
| Academy billing | Only TEST Stripe credentials; checkout, signed webhook replay protection, status update and billing portal tested without a live charge                                                             |
| Store           | Public product filters, cart ownership, server price validation, test checkout configuration state, signed Store webhook amount/currency mismatch rejection and customer order/return views checked |
| Commerce admin  | Product publish preconditions, supplier activation rejection without approvals, return review and audit visibility checked with an administrator account                                            |
| Marketing       | With connector disabled, no outbound request; with a staging endpoint, only consented allow-listed signed events are accepted                                                                       |
| Backups         | Database backup and storage snapshot completion recorded; a restore rehearsal has been completed or scheduled                                                                                       |

## 10. Rollback and incident response

Application rollback means returning to the previously verified build artifact and restarting the process. Because migrations are additive, **do not roll back a database by dropping new columns or tables during an incident**. Instead, deploy the previous compatible application where possible, disable the affected feature with its configuration flag, preserve evidence and investigate.

If a migration or application release causes data corruption or availability loss, stop write traffic according to the approved incident procedure, preserve logs and migration state, restore only to an isolated environment first, validate data and then execute an approved recovery. For webhook incidents, disable or rotate the affected product-line webhook secret in the payment provider, keep the other product lines isolated, and use the event ledger to identify replay-safe reconciliation work.

> **Do not claim production readiness solely from a successful build.** Production release requires a reviewed change, environment-specific secret validation, backup verification, migration review, staging acceptance and an authorized deployment decision.

## 11. Useful local acceptance commands

```bash
npm run check
npm run preflight
npm test
npx tsx scripts/audit-academy-naming.ts --json
npx tsx scripts/audit-academy-curriculum.ts --json
npx tsx scripts/audit-academy-lesson-quality.ts --write --json
npx tsx scripts/audit-academy-lesson-facts.ts --json
npx tsx scripts/audit-academy-factual-evidence.ts --json
npm run build
```

Run these only against a disposable local or designated staging environment. They do not authorize a production migration, deployment, supplier activation or live charge.
