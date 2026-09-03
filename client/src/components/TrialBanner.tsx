import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  parseManagementPreferences,
  resolveEffectiveManagementEntitlement,
} from "@shared/managementEntitlement";

/**
 * Trial-countdown banner shown at the top of protected pages.
 *
 * Billing remains authoritative, but an active complimentary Management grant
 * truthfully extends access and must suppress an expired-trial warning while it
 * is active. Expired complimentary access falls back to the underlying trial.
 */
export function TrialBanner() {
  const { user } = useAuth();

  if (!user) return null;

  const preferences = parseManagementPreferences(user.preferences);
  const entitlement = resolveEffectiveManagementEntitlement(
    {
      subscriptionStatus: user.subscriptionStatus,
      planTier: preferences.planTier === "stable" ? "stable" : "pro",
      bothDashboardsUnlocked: Boolean(preferences.bothDashboardsUnlocked),
    },
    preferences,
  );

  if (entitlement.complimentaryAccessState === "active") return null;

  const trialDaysLeft = user.trialEndsAt
    ? Math.ceil(
        (new Date(user.trialEndsAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const isTrialActive =
    user.subscriptionStatus === "trial" && trialDaysLeft > 0;
  const isTrialExpired =
    user.subscriptionStatus === "trial" && trialDaysLeft <= 0;
  const isSubscriptionActive = user.subscriptionStatus === "active";

  if (isSubscriptionActive || user.role === "admin") {
    return null;
  }

  const isUrgent = isTrialActive && trialDaysLeft <= 2;

  if (!isTrialActive && !isTrialExpired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-3 px-4 mb-4 flex items-center justify-between gap-3 flex-wrap ${
        isTrialExpired
          ? "bg-red-950/40 border-red-500/30"
          : isUrgent
            ? "bg-amber-950/40 border-amber-500/30"
            : "bg-indigo-950/30 border-indigo-500/20"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Clock
          className={`w-4 h-4 shrink-0 ${
            isTrialExpired
              ? "text-red-400"
              : isUrgent
                ? "text-amber-400"
                : "text-indigo-400"
          }`}
        />
        <p
          className={`text-sm ${
            isTrialExpired
              ? "text-red-300"
              : isUrgent
                ? "text-amber-300"
                : "text-gray-300"
          }`}
        >
          {isTrialExpired
            ? "Your free trial has ended. Subscribe to keep your data and continue using all features."
            : isUrgent
              ? `Trial ending soon! ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left. Subscribe to keep your data.`
              : `Free Trial: ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} remaining. Enjoying EquiProfile?`}
        </p>
      </div>

      <a href="/api/v1/billing/launch?product=management&action=home">
        <Button
          size="sm"
          className={`shrink-0 text-white border-0 shadow-lg text-xs h-8 ${
            isTrialExpired || isUrgent
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20"
              : "bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] shadow-[#5b8def]/20"
          }`}
        >
          {isTrialExpired ? "Subscribe" : "View Plans"}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </a>
    </motion.div>
  );
}
