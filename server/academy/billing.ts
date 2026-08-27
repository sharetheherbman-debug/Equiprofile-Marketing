import Stripe from "stripe";

export const ACADEMY_PLAN_TIERS = [
  "school_10",
  "school_20",
  "school_50",
  "school_enterprise",
] as const;

export type AcademyPlanTier = (typeof ACADEMY_PLAN_TIERS)[number];
export type AcademyBillingInterval = "monthly" | "yearly";

export type AcademyBillingConfig =
  | { configured: true; secretKey: string; priceId: string }
  | { configured: false; reason: string };

const priceVariable: Record<
  AcademyPlanTier,
  Record<AcademyBillingInterval, string>
> = {
  school_10: {
    monthly: "ACADEMY_STRIPE_SCHOOL_10_MONTHLY_PRICE_ID",
    yearly: "ACADEMY_STRIPE_SCHOOL_10_YEARLY_PRICE_ID",
  },
  school_20: {
    monthly: "ACADEMY_STRIPE_SCHOOL_20_MONTHLY_PRICE_ID",
    yearly: "ACADEMY_STRIPE_SCHOOL_20_YEARLY_PRICE_ID",
  },
  school_50: {
    monthly: "ACADEMY_STRIPE_SCHOOL_50_MONTHLY_PRICE_ID",
    yearly: "ACADEMY_STRIPE_SCHOOL_50_YEARLY_PRICE_ID",
  },
  school_enterprise: {
    monthly: "ACADEMY_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID",
    yearly: "ACADEMY_STRIPE_ENTERPRISE_YEARLY_PRICE_ID",
  },
};

/**
 * Academy checkout remains intentionally limited to Stripe TEST mode until a
 * separately approved live-billing change is made. It never falls back to
 * SaaS or Store credentials or price IDs.
 */
export function academyBillingConfig(
  environment: NodeJS.ProcessEnv = process.env,
  planTier: AcademyPlanTier,
  interval: AcademyBillingInterval,
): AcademyBillingConfig {
  if (environment.ENABLE_ACADEMY_BILLING !== "true") {
    return { configured: false, reason: "Academy billing is disabled." };
  }
  if (environment.ACADEMY_STRIPE_TEST_MODE !== "true") {
    return {
      configured: false,
      reason: "Academy billing is restricted to Stripe TEST mode.",
    };
  }
  const secretKey = environment.ACADEMY_STRIPE_SECRET_KEY?.trim() ?? "";
  if (!secretKey.startsWith("sk_test_")) {
    return {
      configured: false,
      reason: "A Stripe TEST secret is required for Academy billing.",
    };
  }
  const priceId = environment[priceVariable[planTier][interval]]?.trim() ?? "";
  if (!priceId.startsWith("price_")) {
    return {
      configured: false,
      reason: `The Academy TEST price for ${planTier}/${interval} is not configured.`,
    };
  }
  return { configured: true, secretKey, priceId };
}

export type AcademyScopedMetadata = Record<string, string> & {
  academyScope: "academy";
  organizationId: string;
};

export function isAcademyScopedMetadata(
  metadata: Record<string, string> | null | undefined,
): metadata is AcademyScopedMetadata {
  return (
    metadata?.academyScope === "academy" &&
    /^\d+$/.test(metadata.organizationId ?? "")
  );
}

export function academySubscriptionStatus(
  stripeStatus: string,
): "active" | "past_due" | "cancelled" | "expired" {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid")
    return "past_due";
  if (stripeStatus === "incomplete_expired") return "expired";
  return "cancelled";
}

export function getAcademyStripe(
  environment: NodeJS.ProcessEnv = process.env,
): Stripe | null {
  const secretKey = environment.ACADEMY_STRIPE_SECRET_KEY?.trim() ?? "";
  if (
    environment.ENABLE_ACADEMY_BILLING !== "true" ||
    environment.ACADEMY_STRIPE_TEST_MODE !== "true" ||
    !secretKey.startsWith("sk_test_")
  ) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

export function academyPlanLimits(planTier: AcademyPlanTier) {
  const maxStudents = {
    school_10: 10,
    school_20: 20,
    school_50: 50,
    school_enterprise: 999,
  }[planTier];
  return {
    maxStudents,
    maxTeachers:
      planTier === "school_enterprise" ? 50 : Math.ceil(maxStudents / 5),
  };
}
