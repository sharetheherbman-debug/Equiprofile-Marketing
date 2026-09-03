import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  parseManagementPreferences,
  resolveEffectiveManagementEntitlement,
} from "@shared/managementEntitlement";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  stableOnly?: boolean;
  studentOnly?: boolean;
  teacherOnly?: boolean;
}

/**
 * Protected route wrapper.
 *
 * Management access and Stable routing use the same canonical complimentary
 * entitlement resolver as the server. Billing fields remain authoritative;
 * an active complimentary overlay may extend access, while an expired overlay
 * falls back to the underlying paid/trial state.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  stableOnly = false,
  studentOnly = false,
  teacherOnly = false,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, error } = useAuth();
  const [location, setLocation] = useLocation();

  const preferences = parseManagementPreferences(user?.preferences);
  const basePlanTier = preferences.planTier === "stable" ? "stable" : "pro";
  const managementEntitlement = resolveEffectiveManagementEntitlement(
    {
      subscriptionStatus: user?.subscriptionStatus ?? "unknown",
      planTier: basePlanTier,
      bothDashboardsUnlocked: Boolean(preferences.bothDashboardsUnlocked),
    },
    preferences,
  );
  const complimentaryAccessActive =
    managementEntitlement.complimentaryAccessState === "active";
  const isStablePlan = managementEntitlement.effectivePlanTier === "stable";

  const isStudentPlan =
    preferences.planTier === "student" ||
    preferences.selectedExperience === "student";
  const isTeacherPlan =
    preferences.planTier === "teacher" ||
    preferences.selectedExperience === "teacher";

  const isAdmin = user?.role === "admin";
  const trialEndsAt = user?.trialEndsAt
    ? new Date(user.trialEndsAt)
    : user?.createdAt
      ? new Date(new Date(user.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
      : null;
  const accessExpired =
    !isAdmin &&
    !complimentaryAccessActive &&
    user?.subscriptionStatus === "trial" &&
    !!trialEndsAt &&
    trialEndsAt.getTime() <= Date.now();
  const subscriptionLocked =
    !isAdmin &&
    !complimentaryAccessActive &&
    (user?.subscriptionStatus === "expired" ||
      user?.subscriptionStatus === "overdue" ||
      (user?.subscriptionStatus === "cancelled" &&
        !!user?.subscriptionEndsAt &&
        new Date(user.subscriptionEndsAt).getTime() <= Date.now()));
  const isBillingRecoveryRoute = location.startsWith("/pricing");
  const shouldShowPaywall =
    isAuthenticated &&
    (accessExpired || subscriptionLocked) &&
    !isBillingRecoveryRoute;

  useEffect(() => {
    if (loading) return;

    // If there's a network/fetch error but we had a previous user in cache,
    // don't redirect — the user may still have a valid session and just had a
    // momentary network issue. Only redirect if we definitively have no auth.
    if (!isAuthenticated && !error) {
      const oauthUrl = getLoginUrl();
      const returnUrl = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      const loginUrl = oauthUrl
        ? `${oauthUrl}&returnUrl=${returnUrl}`
        : `/login?returnUrl=${returnUrl}`;
      window.location.href = loginUrl;
      return;
    }

    // If there's a network error but no cached user, redirect to login.
    if (!isAuthenticated && error) {
      const cachedUser = localStorage.getItem("equiprofile-user-info");
      if (!cachedUser) {
        const loginUrl = `/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        window.location.href = loginUrl;
        return;
      }
      return;
    }

    if (requireAdmin && !isAdmin) {
      setLocation("/dashboard");
    }

    if (stableOnly && !isStablePlan && !isAdmin) {
      toast.error("This feature requires the Stable plan. Upgrade to access.");
      window.location.href = "/api/v1/billing/launch?product=management&action=home";
    }

    if (studentOnly && !isStudentPlan && !isAdmin) {
      toast.error("This feature requires the Student plan.");
      setLocation("/dashboard");
    }

    if (teacherOnly && !isTeacherPlan && !isAdmin) {
      toast.error("This feature requires the Teacher plan.");
      setLocation("/dashboard");
    }
  }, [
    loading,
    isAuthenticated,
    error,
    requireAdmin,
    stableOnly,
    studentOnly,
    teacherOnly,
    isStablePlan,
    isStudentPlan,
    isTeacherPlan,
    isAdmin,
    user,
    setLocation,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (shouldShowPaywall) {
    const title = accessExpired
      ? "Your free trial has ended"
      : "Your subscription needs attention";
    const description = accessExpired
      ? "Subscribe to restore dashboard access and keep using your existing EquiProfile data."
      : "Renew or update your payment method to regain access to protected dashboard tools.";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border bg-card shadow-xl p-6 sm:p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <AlertCircle className="h-3.5 w-3.5" />
            Access paused
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
          <div className="mt-6 grid gap-3 rounded-xl border bg-muted/35 p-4 text-left text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>Your account data is preserved while billing is resolved.</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>Account settings and admin preview remain available.</span>
            </div>
          </div>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => { window.location.href = "/api/v1/billing/launch?product=management&action=home"; }}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              View Plans & Restore Access
            </button>
            <button
              type="button"
              onClick={() => setLocation("/contact")}
              className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (stableOnly && !isStablePlan && !isAdmin) {
    return null;
  }

  if (studentOnly && !isStudentPlan && !isAdmin) {
    return null;
  }

  if (teacherOnly && !isTeacherPlan && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

/** Stable plan route - requires the effective Stable entitlement. */
export function StableRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute stableOnly>{children}</ProtectedRoute>;
}

/** Student plan route - requires Student subscription tier. Admin can access. */
export function StudentRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute studentOnly>{children}</ProtectedRoute>;
}

/** Teacher plan route - requires Teacher subscription tier. Admin can access. */
export function TeacherRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute teacherOnly>{children}</ProtectedRoute>;
}

export default ProtectedRoute;
