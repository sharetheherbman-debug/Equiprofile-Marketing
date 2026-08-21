# Management small/medium completion handoff — 21 August 2026

## Branch

`phase-1/small-medium-completion`

Base checkpoint:

`e898923cf8b20da9eb2e93b33476af632b92185f`

No production deployment, merge, migration, DNS, VPS or database mutation is authorised by this branch.

## Completed in this branch

### Legacy School public surface

`client/src/pages/management/SchoolLanding.tsx` is now explicitly `LEGACY_COMPAT_ONLY` and redirects old `/for-schools` traffic to the canonical EquiProfile Academy surface at `https://academy.equiprofile.online/academy`.

The old School campaign is no longer presented as a second education product.

### Complimentary access model

Added:

- `server/complimentaryAccess.ts`
- `server/complimentaryAccess.test.ts`

The new model treats complimentary access as an **overlay** rather than rewriting the underlying subscription.

Properties:

- preserves `subscriptionStatus`;
- preserves underlying paid `planTier`;
- preserves existing paid dashboard entitlements;
- expiry falls back to the base subscription rather than blocking a paid subscriber;
- revoke removes only the overlay;
- supports `pro`, `stable` and `management_full` grants;
- supports timed or explicit no-expiry grants;
- validates duration;
- supports grant audit metadata (`grantedByUserId`, reason, note).

Regression tests cover paid-plan preservation, expiry, revoke, full Management access and invalid duration.

## Large reconciliation work still required

The legacy `server/routers.ts` currently owns subscription middleware plus the old grant/revoke mutations. It is intentionally **not rewritten wholesale in this small/medium branch** because it is a very large shared file that will be reconciled with the newer Academy/Shop Core implementation.

During the final Core reconciliation:

1. wire `resolveEffectiveManagementEntitlement()` into Management access middleware;
2. remove the legacy behavior that rejects an expired free-access overlay before checking a valid paid subscription;
3. change admin grant to store `complimentaryAccess` only and never overwrite Stripe/subscription state;
4. change revoke to call `revokeComplimentaryAccess()` and never force `subscriptionStatus='trial'` or `planTier='pro'`;
5. expose active/expiry/tier/reason safely in Admin;
6. migrate/read legacy `freeAccess/freeAccessUntil/freeAccessDays` values conservatively where existing records require compatibility;
7. run admin browser acceptance for grant → access → expiry → revoke → original paid entitlement restored.

Also part of the large final Core reconciliation:

- replace the historical School backend with the canonical Academy implementation;
- physically remove the now-unreachable embedded Marketing engine in dependency-safe batches;
- preserve the current Management rescue work while importing Academy + Shop;
- standardise the final Core AI boundary on the provider-neutral interface backed by GenX;
- rerun Management regression after all shared-file changes.

## Do not overwrite

Tomorrow's reconciliation should preserve the complimentary-access module/tests and the legacy School redirect from this branch rather than re-implementing them independently.
