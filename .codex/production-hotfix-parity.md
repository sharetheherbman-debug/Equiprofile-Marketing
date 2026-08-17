# EquiProfile Management production hotfix parity

Before any client-go-live rescue work, reproduce the exact two-file behavior currently proven in production from local commit `d5d3704603b9666fa4784a495bd9168ac0557641` (parent `8792f51f3f3b91a53c8209c4f4649b112f11c014`).

Do not try to fetch that local-only commit; its object was never pushed to GitHub.

Apply exactly these code changes first:

1. `client/src/pages/Admin.tsx`
   - Change `function AdminContent() {` to `export function AdminContent() {`.
   - Keep the existing default `Admin` export and its existing `DashboardLayout` wrapper unchanged.

2. `client/src/pages/AdminEnvironmentSafe.tsx`
   - Import `DashboardLayout` from `@/components/DashboardLayout`.
   - Keep `MarketingConnectionCard` import.
   - Replace the default `LegacyAdmin` import with named import `{ AdminContent }` from `./Admin`.
   - Keep the existing infrastructure-hiding `<style>` selectors unchanged.
   - Remove the old padding wrapper `className="px-4 pt-4 md:px-6 md:pt-6"`.
   - Render exactly this wrapper structure:

```tsx
<DashboardLayout>
  <>
    <style>{`...existing selectors unchanged...`}</style>
    <div className="space-y-5">
      <MarketingConnectionCard />
      <AdminContent />
    </div>
  </>
</DashboardLayout>
```

After applying these two changes, run the Management type/build tests before proceeding with the wider client-go-live rescue. Do not deploy, merge, force-push, or modify production from Codex.
