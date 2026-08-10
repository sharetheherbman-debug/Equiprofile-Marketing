import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardV2 from "./DashboardV2";

/**
 * Management-product gate for the redesigned dashboard.
 *
 * Education plan dashboards live outside the Management product and must not be
 * routed to non-existent /student-dashboard, /teacher-dashboard or
 * /school-dashboard paths here. Stable customers are sent to the Stable
 * dashboard; Pro customers render the redesigned Management dashboard.
 */
export default function ManagementDashboardV2() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const { data: subscription, isLoading } =
    trpc.user.getSubscriptionStatus.useQuery();
  const [, setLocation] = useLocation();

  const planTier = subscription?.planTier;
  const isAdmin = user?.role === "admin";
  const shouldOpenStable =
    !isAdmin && planTier === "stable" && !subscription?.bothDashboardsUnlocked;
  const shouldReturnToOnboarding =
    !isAdmin &&
    (planTier === "student" ||
      planTier === "teacher" ||
      planTier === "school_owner");

  useEffect(() => {
    if (shouldOpenStable) {
      setLocation("/stable-dashboard");
      return;
    }
    if (shouldReturnToOnboarding) {
      setLocation("/onboarding");
    }
  }, [setLocation, shouldOpenStable, shouldReturnToOnboarding]);

  if (isLoading || shouldOpenStable || shouldReturnToOnboarding) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading your EquiProfile dashboard…
      </div>
    );
  }

  return <DashboardV2 />;
}
