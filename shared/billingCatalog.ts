import { DEFAULT_PRICING, SCHOOL_PRICING } from "./pricing";

export type BillingInterval = "monthly" | "yearly";
export type BillingProductFamily = "management" | "academy";

export const BILLING_CATALOG = {
  management_pro: {
    key: "management_pro",
    productFamily: "management",
    name: "Management Pro",
    shortName: "Pro",
    description: "For individual horse owners managing up to 5 horses.",
    monthly: DEFAULT_PRICING.individual.monthly,
    yearly: DEFAULT_PRICING.individual.yearly,
  },
  management_stable: {
    key: "management_stable",
    productFamily: "management",
    name: "Management Stable",
    shortName: "Stable",
    description: "For stable teams managing up to 20 horses and 5 users.",
    monthly: DEFAULT_PRICING.stable.monthly,
    yearly: DEFAULT_PRICING.stable.yearly,
  },
  academy_rider: {
    key: "academy_rider",
    productFamily: "academy",
    name: "Academy Rider",
    shortName: "Rider",
    description: "For individual riders who want structured learning, progress tracking and Tutor support.",
    monthly: DEFAULT_PRICING.student.monthly,
    yearly: DEFAULT_PRICING.student.yearly,
  },
  academy_school_10: {
    key: "academy_school_10",
    productFamily: "academy",
    name: "Academy Small School",
    shortName: "Small School",
    description: "For riding schools and equestrian organisations with up to 10 students.",
    monthly: SCHOOL_PRICING.tiers[0].monthly!,
    yearly: SCHOOL_PRICING.tiers[0].yearly!,
  },
  academy_school_20: {
    key: "academy_school_20",
    productFamily: "academy",
    name: "Academy Medium School",
    shortName: "Medium School",
    description: "For growing riding schools and equestrian organisations with up to 20 students.",
    monthly: SCHOOL_PRICING.tiers[1].monthly!,
    yearly: SCHOOL_PRICING.tiers[1].yearly!,
  },
  academy_school_50: {
    key: "academy_school_50",
    productFamily: "academy",
    name: "Academy Large School",
    shortName: "Large School",
    description: "For larger riding schools and equestrian organisations with up to 50 students.",
    monthly: SCHOOL_PRICING.tiers[2].monthly!,
    yearly: SCHOOL_PRICING.tiers[2].yearly!,
  },
} as const;

export type BillingPlanKey = keyof typeof BILLING_CATALOG;

export const MANAGEMENT_BILLING_PLANS = [
  BILLING_CATALOG.management_pro,
  BILLING_CATALOG.management_stable,
] as const;

export const ACADEMY_BILLING_PLANS = [
  BILLING_CATALOG.academy_rider,
  BILLING_CATALOG.academy_school_10,
  BILLING_CATALOG.academy_school_20,
  BILLING_CATALOG.academy_school_50,
] as const;

export function billingLaunchUrl(input: {
  product: BillingProductFamily;
  plan?: BillingPlanKey;
  interval?: BillingInterval;
  action?: "home" | "checkout" | "portal";
}) {
  const params = new URLSearchParams({
    product: input.product,
    action: input.action ?? "home",
  });
  if (input.plan) params.set("plan", input.plan);
  if (input.interval) params.set("interval", input.interval);
  return `/api/v1/billing/launch?${params.toString()}`;
}
