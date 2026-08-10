import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import { Button } from "@/components/ui/button";

/**
 * Owner-only launch surface for the standalone EquiProfile Marketing app.
 *
 * Marketing is not an EquiProfile customer feature. It is an operational tool
 * used by the EquiProfile owner to market the EquiProfile product. The actual
 * Marketing application runs separately and is opened through signed one-use
 * SSO from this hidden administration area.
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
            Owner administration
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            EquiProfile Marketing
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This is the private owner launch point for the standalone white-label
            EquiProfile Marketing application used to market EquiProfile. It is
            not part of the customer dashboard or subscription feature set.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            The Marketing application keeps its own database and session. Access
            is issued from EquiProfile through a short-lived signed one-use owner
            sign-in; connector credentials remain on the servers only.
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
