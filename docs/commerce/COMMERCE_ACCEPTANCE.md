# EquiProfile Shop / Commerce Acceptance Record

**Source branch:** `phase-1/small-medium-completion`  
**Based on:** `feature/equiprofile-academy-commerce` at `40995fdfe7afbff5e723e59e6a6419ecf6329d3c`  
**Release status:** internal Commerce software is substantially implemented, but **not ready for live supplier/payment activation** until the final Core reconciliation and credentialled test acceptance are complete.

## 1. Customer software implemented

| Capability | Status | Evidence / boundary |
| --- | --- | --- |
| Dedicated Shop frontend/host target | Implemented | `client/shop`, dedicated Vite build and `shop.equiprofile.online` contract. |
| Public catalogue | Implemented | Published, non-development, non-archived products with licensed imagery only. |
| Search/category filtering | Implemented | Server-side catalogue query/category filtering. |
| Product detail | Implemented | Active variants, attributes and licensed product images. |
| Persistent authenticated cart | Implemented | Customer-scoped cart with server-side variant/product/stock validation. |
| Server-authoritative totals | Implemented | Price/VAT/inventory are recalculated from persisted records at checkout. |
| Checkout idempotency | Implemented | Customer + idempotency-key lookup prevents normal duplicate order creation. |
| Customer order history/detail | Implemented | Order, item, payment and fulfilment state exposed to the owning customer. |
| Shipment/tracking visibility | Implemented | Shipment state, carrier, tracking reference, dispatch/delivery estimates and tracking-event timeline. |
| Return request | Implemented | Server validates ownership, return policy snapshot/window and remaining quantity. |
| Return/refund visibility | Implemented | Customer order detail exposes persisted return and refund state. |
| Honest unavailable states | Implemented | Missing provider/supplier configuration is shown truthfully; no fake payment/fulfilment success. |

## 2. Commerce Admin implemented

| Capability | Status | Evidence / boundary |
| --- | --- | --- |
| Operational dashboard | Implemented | Persisted revenue/AOV/order/pending-payment/fulfilment/supplier-sync/stock/margin/return metrics. |
| Product review/governance | Implemented | Human approve/reject workflow. |
| Product editing | Implemented | Product facts/pricing/availability/image-rights/return-policy controls. |
| Publish/unpublish/archive | Implemented | Server prerequisites still apply; development data cannot become public merely from UI state. |
| Supplier onboarding/status | Implemented | Supplier state and connection-readiness controls exist. |
| Orders | Implemented baseline | Admin order records are queryable; final credentialled fulfilment workflow acceptance remains. |
| Returns | Implemented baseline | Admin return review/state controls exist. |
| Audit visibility | Implemented | Commerce audit records surfaced. |
| Synthetic development supplier/product | Implemented | Remains development-only and excluded from public catalogue. |

## 3. Integrity/security software implemented

Current branch includes focused protection for:

- unpublished/development/archive product exclusion;
- licensed-image publication requirement;
- active variant validation;
- stale/unavailable supplier stock rejection;
- server-authoritative price and VAT calculation;
- customer cart/order ownership;
- checkout idempotency;
- return order/item ownership;
- return-policy snapshot and configured return window;
- cumulative remaining-returnable quantity;
- duplicate return items;
- Store/SaaS/Academy Stripe credential separation;
- Store payment reconciliation module;
- provider event replay/idempotency boundaries;
- Commerce audit logging.

These controls must be rerun on the final reconciled Core SHA and exercised against real Stripe TEST credentials before Store payments are enabled.

## 4. Payment status

The Store software can create a Stripe checkout session **only when the dedicated Store payment configuration is explicitly enabled**. Store payment credentials and webhook secret are separate from Management SaaS and Academy billing.

Until credentialled acceptance passes:

- `ENABLE_STORE_STRIPE` must remain false in production;
- no live charge is permitted;
- the UI must state that payment is not configured where applicable;
- no order may be marked paid solely from a browser redirect;
- only the signed Store webhook/reconciliation path may establish trusted provider payment state.

### Still required before payment activation

1. Configure Stripe TEST Store secret + webhook secret.
2. Run valid signed checkout completion.
3. Prove invalid signature rejection.
4. Prove duplicate/replayed event safety.
5. Prove amount mismatch rejection.
6. Prove currency mismatch rejection.
7. Prove wrong-order metadata rejection.
8. Prove full and partial refund bookkeeping.
9. Confirm Store events cannot mutate SaaS/Academy billing.
10. Repeat customer order/refund browser acceptance after provider state changes.

## 5. Supplier status

Supplier framework/admin software exists, but no real supplier is considered active merely because a record or connector stub exists.

Current intended candidates:

- **Avasam** — scalable marketplace/API/feed candidate; requires approved seller account and verified API/feed documentation.
- **Stable Environment** — direct equine supplier advertising dropshipping; requires trade approval, data/feed method and image/description rights.
- **Equetech** — direct stockist/dropship candidate; requires trade approval and explicit catalogue/image usage permission.

Before any supplier becomes ACTIVE obtain and record:

- commercial/trade agreement;
- dropship permission;
- catalogue/feed/API access;
- stock refresh policy;
- price refresh policy;
- product factual provenance;
- image/description licence;
- VAT/tax data;
- shipping zones/rates/lead times;
- order-submission procedure/API;
- fulfilment/tracking contract;
- returns process;
- test-order procedure;
- support contact.

No scraping or unauthorised catalogue/image copying is permitted.

## 6. External blockers vs internal blockers

### Legitimate external blockers

- supplier trade/API/feed credentials and agreements;
- supplier image/description rights;
- actual delivery/shipping tariffs and fulfilment feed;
- Stripe TEST/live account credentials and webhooks;
- final VAT/tax/business configuration;
- production DNS/TLS/reverse-proxy acceptance.

### Internal work still required before release freeze

- final Core reconciliation with the newer Management branch;
- complete credentialled Store Stripe TEST acceptance;
- complete authenticated customer browser journey after provider events;
- complete Commerce Admin fulfilment/refund journey;
- concurrency/race regression on the final database/schema;
- final responsive/accessibility/SEO sweep;
- final Core→Marketing event wiring for Shop events;
- fresh migration-from-zero and upgrade rehearsal on the final Core SHA.

## 7. Release gate

Do not enable real supplier or Store payment traffic until all of these are true:

- final Core tests/builds pass;
- Shop catalogue/product/cart/order/return browser acceptance passes;
- Store Stripe TEST checkout/webhook/refund acceptance passes;
- supplier connector is tested with authorised provider data;
- licensed product images are proven;
- stock freshness is proven;
- shipping/returns configuration is proven;
- Commerce Admin operational acceptance passes;
- Core→Marketing Shop conversion events are accepted by standalone Marketing;
- backup/rollback and migration rehearsal are complete.

No production deployment, payment, supplier activation or customer order is authorised by this document.
