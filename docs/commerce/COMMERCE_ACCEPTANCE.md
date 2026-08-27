# Commerce / Shop final-Core acceptance

**Candidate branch:** `release-candidate/final-core-2026-08-22`

**Internal software status:** **PASS**, subject to exact-head CI.

**Live payment/supplier status:** deliberately disabled; external activation gates remain open.

## Customer workflow

The production Shop bundle was exercised at 390×844, 768×1024 and desktop with disposable MariaDB data. The catalogue/search/category boundary, licensed-image-only product detail, variant/stock display, canonical/title/description/JSON-LD metadata, authenticated cart, quantity/subtotal, order history/detail, shipment/tracking, return request and refund visibility were verified. No tested surface overflowed horizontally.

Checkout re-reads price, VAT, publication, variant, supplier and fresh inventory state on the server. With `ENABLE_STORE_STRIPE=false`, the browser showed a £12 preview for a £10 VAT-exclusive fixture and explicitly stated that no order, inventory reservation or charge was created.

## Money, inventory and concurrency

The database-backed suite ran against MariaDB 11.4 and passed **12/12** cases:

- two buyers serialize on the last unit; one succeeds and stock is decremented once;
- repeated idempotency keys return the existing order;
- server price and VAT are re-read;
- unpublished, development-only, archived, inactive-variant and inactive-supplier products are rejected;
- stale/unavailable inventory is rejected;
- simultaneous return requests cannot exceed the remaining quantity;
- partial returns may reach, but never exceed, the purchased quantity.

Signed Store webhook reconciliation separately covers duplicate payment/refund events, amount/currency/metadata mismatch, partial/full refund totals and replay safety. Browser state never establishes trusted payment state.

## Commerce Admin

The production admin bundle was exercised with persisted data at mobile, tablet and desktop widths. It showed database-derived revenue/order/queue metrics, product approval/publication/licensing/provenance state, variants/inventory/supplier assignment, orders, fulfilment, shipment/tracking, return review, refund ledger and audit records.

Observed fail-closed behavior:

- supplier activation rejected missing approved onboarding/licensed rights;
- synthetic development candidate creation was disabled in production;
- publication logic requires approval, non-development state and licensed imagery;
- provider refund submission reported `Store Stripe TEST processing is disabled; no refund was requested`;
- return requested → approved → received transitions were persisted and audited.

## Supplier architecture

The adapter boundary is provider-neutral for catalogue, provenance, variants, stock, price, VAT/tax, image rights, shipping, order submission, fulfilment, tracking and returns. The Avasam adapter has deterministic contract/error tests but no real supplier was activated or scraped. Supplier readiness requires commercial approval, authorised feed/API access, rights, refresh contracts, shipping/returns information and a controlled test order.

## Shop → standalone Marketing

Standalone Marketing was not modified. Core publishes only established signed Application Connector events: consented product view, checkout started and paid order. Events are server-side, allow-listed, idempotent and detached after the durable commerce transition. Restricted PII, payment/card data, Academy/health data, secrets and supplier cost data are rejected by the publisher contract. Connector failure cannot roll back a committed checkout/payment transition. No return/refund event was invented because the frozen connector contract does not establish one.

## SEO and security boundaries

- Public catalogue/detail queries exclude draft, development, archived, unlicensed and unavailable products.
- Public metadata and Product JSON-LD use persisted public facts only.
- Admin is noindex; robots and sitemap integration exclude non-public/development products.
- No browser API/Stripe/supplier secrets are used.

## External activation gates

- `STORE_STRIPE_TEST_ACCEPTANCE=NOT_RUN_NO_AUTHORISED_STORE_STRIPE_TEST_CREDENTIALS`
- `SUPPLIER_ACCEPTANCE=NOT_RUN_NO_AUTHORISED_COMMERCIAL_SUPPLIER_ACCOUNT_OR_FEED`
- `LIVE_CORE_TO_MARKETING_E2E=NOT_RUN_CONNECTOR_NOT_CONFIGURED_IN_DEPLOYMENT_ENVIRONMENT`
- Production DNS/TLS, migration and rollback rehearsals remain deployment-owner actions.

`ENABLE_STORE_STRIPE` remains false. No live charge, supplier activation, catalogue scrape or production deployment occurred.
