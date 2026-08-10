import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import { Button } from "@/components/ui/button";

/**
 * Phase 1 separation boundary for the legacy embedded Marketing Studio.
 *
 * The old Marketing implementation and its data remain in the repository and
 * database for migration/reconciliation, but administrators must not start new
 * work through the embedded UI while standalone Marketing is being completed.
 * The secure connection card is the only supported EquiProfile-side Marketing
 * surface during the separation.
 */
export default function AdminCampaigns({
  onBackToAdmin,
}: {
  onBackToAdmin?: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Phase 1 separation
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Embedded Marketing Studio disabled
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            EquiProfile Marketing is moving to the standalone Marketing
            application. The legacy embedded Marketing Studio is disabled here
            to prevent new campaigns, publishing or generation work from being
            started in the old system while migration is completed.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Existing Marketing records and services have not been deleted. They
            remain preserved for inventory, migration, reconciliation and
            rollback until the standalone replacement is verified.
          </p>
          {onBackToAdmin ? (
            <Button type="button" variant="outline" onClick={onBackToAdmin}>
              Back to Admin
            </Button>
          ) : null}
        </div>
      </section>

      <MarketingConnectionCard />
    </div>
  );
}
