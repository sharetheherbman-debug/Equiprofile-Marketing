import { Button } from "@/components/ui/button";

/**
 * Temporary migration notice for the legacy embedded Marketing section.
 *
 * This section contains no Marketing launcher and no executable Marketing UI.
 * The standalone EquiProfile Marketing launch control exists only in the hidden
 * owner administration wrapper and is server-gated to PRIMARY_ADMIN_EMAIL.
 * This legacy section will be physically removed when the oversized Admin page
 * is split and the final migration inventory is complete.
 */
export default function AdminCampaigns({
  onBackToAdmin,
}: {
  onBackToAdmin?: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Legacy migration
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Embedded Marketing retired
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            New Marketing work cannot be started from EquiProfile. Historical
            Marketing records remain temporarily available to the migration
            process only while useful data is reconciled into the standalone
            owner Marketing application.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            This legacy section will be deleted after migration verification. It
            is not a customer feature and contains no link to the standalone app.
          </p>
          {onBackToAdmin ? (
            <Button type="button" variant="outline" onClick={onBackToAdmin}>
              Back to Admin
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
