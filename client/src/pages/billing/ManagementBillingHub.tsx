import { useState } from "react";
import { Building2, Check, CreditCard, Crown, Loader2 } from "lucide-react";
import PlanAwareLayout from "@/components/PlanAwareLayout";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  BILLING_CATALOG,
  type BillingInterval,
  type BillingPlanKey,
} from "@shared/billingCatalog";

const planFeatures: Record<"management_pro" | "management_stable", string[]> = {
  management_pro: [
    "Up to 5 horses",
    "Complete health tracking",
    "Advanced training logs",
    "Competition results",
    "AI weather analysis",
    "Email reminders",
    "CSV and PDF exports",
  ],
  management_stable: [
    "Everything in Pro",
    "Up to 20 horses",
    "Up to 5 users",
    "Role-based permissions",
    "Stable management",
    "Advanced analytics",
    "Priority support",
  ],
};

function launchUrl(action: "home" | "checkout" | "portal", plan?: BillingPlanKey, interval?: BillingInterval) {
  const params = new URLSearchParams({ product: "management", action });
  if (plan) params.set("plan", plan);
  if (interval) params.set("interval", interval);
  return `/api/v1/billing/launch?${params.toString()}`;
}

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;
}

export default function ManagementBillingHub() {
  const { user } = useAuth();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [openingPlan, setOpeningPlan] = useState<string | null>(null);
  const status = user?.subscriptionStatus ?? "trial";

  const openPlan = (plan: "management_pro" | "management_stable") => {
    setOpeningPlan(plan);
    window.location.assign(launchUrl("checkout", plan, interval));
  };

  return (
    <PlanAwareLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <PageHeader title="Management Billing" />
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage your EquiProfile Management subscription through the secure EquiProfile Billing centre. Academy billing is separate, even when the same customer uses both products.
          </p>
        </div>

        <Card className="mb-8 border-[#c5a55a]/30 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#163563]" /> Current Management access
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Payment state comes from Billing/Stripe. Complimentary admin access is tracked separately and never appears as a paid subscription.
                </p>
              </div>
              <Badge className={status === "active" ? "bg-emerald-600 text-white" : "capitalize"} variant={status === "active" ? "default" : "secondary"}>
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={launchUrl("portal")}>Payment methods, invoices & subscription</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="https://academy.equiprofile.online/pricing">View Academy plans</a>
            </Button>
          </CardContent>
        </Card>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Management plans</h2>
            <p className="text-sm text-muted-foreground">Existing Management pricing is unchanged.</p>
          </div>
          <div className="inline-flex self-start rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${interval === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${interval === "yearly" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Yearly
              <span className="ml-2 text-xs text-emerald-600">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(["management_pro", "management_stable"] as const).map((key) => {
            const plan = BILLING_CATALOG[key];
            const price = plan[interval];
            const Icon = key === "management_pro" ? Crown : Building2;
            return (
              <Card key={key} className={`flex flex-col border-2 ${key === "management_pro" ? "border-[#2e6da4]" : "border-[#c5a55a]"}`}>
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#163563] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{plan.shortName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-5">
                    <span className="text-4xl font-bold text-[#102a43]">{formatPrice(price.amount)}</span>
                    <span className="text-sm text-muted-foreground">/{interval === "monthly" ? "month" : "year"}</span>
                  </div>
                  <ul className="mb-7 space-y-2">
                    {planFeatures[key].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto"
                    disabled={openingPlan !== null}
                    onClick={() => openPlan(key)}
                  >
                    {openingPlan === key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Choose {plan.shortName}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PlanAwareLayout>
  );
}
