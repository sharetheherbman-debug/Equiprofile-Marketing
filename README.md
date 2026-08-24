# EquiProfile Core

This repository is the authoritative **EquiProfile Core** application. Its GitHub repository name, `Equiprofile-Marketing`, is historical and misleading; it is intentionally not being renamed during the handover because existing remotes and deployment automation may depend on it.

## Products in this repository

- **Management** — horse, stable, health, training, scheduling, documents, billing, and governed AI-assisted management.
- **Academy** — the EquiProfile learning product, including 15 pathways, 105 reviewed lessons, student/teacher/owner workflows, invitations, assessments, and Academy billing boundaries.
- **Shop** — catalogue, cart, checkout, orders, inventory, suppliers, fulfilment, returns/refunds, Commerce Admin, and Store payment boundaries.
- **Core-side Marketing Connector** — the signed, failure-isolated server integration to the standalone Marketing platform.

The standalone white-label Marketing operating system is not implemented here. It lives in [`sharetheherbman-debug/Amarktai-MarketingV21`](https://github.com/sharetheherbman-debug/Amarktai-MarketingV21). EquiProfile is its first configured customer deployment.

## Runtime architecture

Core is a TypeScript/Node application with a shared server and database plus separate production frontend targets for Management, Academy, and Shop. The Marketing Connector sends only approved, consented, allow-listed data to Marketing over its signed Application Connector. Marketing outages must not block Core transactions.

## Development

Requirements: Node.js 22+, npm, and the configured MariaDB/MySQL runtime.

```bash
npm ci
cp .env.example .env
npm run check
npm run test
npm run dev
```

Never commit real `.env` files or production/provider/payment/connector credentials.

## Quality gates

```bash
npm run preflight
npm run check
npm run academy:factual:audit
npm run test
npm run build
npm run acceptance:management
```

Database-backed Shop concurrency tests require the documented disposable Commerce database URL. Migration classification is fail-closed; production migration requires a verified owner-controlled backup and a separately authorised deployment task.

## Production builds

`npm run build` produces Management, Academy, Shop, and server targets. PWA output remains controlled by deployment configuration. Advisory chunk-size warnings are not a substitute for a failed build, and provider-dependent behaviour must remain disabled when not configured.

## Marketing boundary

Core does not embed Marketing UI, Marketing provider credentials, or Marketing database state. The connector uses server-side signing, one-use SSO, product/service scopes, approved business snapshots, idempotent conversion/events, and failure isolation. Browser code never receives the shared connector secret.

## Release status and documentation

[docs/INDEX.md](docs/INDEX.md) identifies the canonical active documents. The final-Core release candidate and its evidence are recorded in [Final Core reconciliation status](docs/FINAL_CORE_RECONCILIATION_STATUS.md).

Production deployment, DNS/TLS changes, provider activation, live payments, supplier activation, and production migration are separate controlled operations and are not authorised by repository readiness.
