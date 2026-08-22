import Stripe from "stripe";
import { ENV } from "./_core/env";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PRICING } from "../shared/pricing";

// Check if Stripe is enabled
function checkStripeEnabled() {
  if (!ENV.enableStripe) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Billing is disabled",
    });
  }
}

// Initialize Stripe with API key from environment
export function getStripe(): Stripe | null {
  if (!ENV.enableStripe) {
    console.warn("[Stripe] Billing feature is disabled");
    return null;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("[Stripe] Secret key not configured");
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

/**
 * Store payments are isolated from Management subscriptions. This factory must
 * never fall back to the SaaS secret or enablement flag.
 */
export function getStoreStripe(): Stripe | null {
  if (process.env.ENABLE_STORE_STRIPE !== "true") {
    return null;
  }
  if (!process.env.STORE_STRIPE_SECRET_KEY) {
    console.warn("[Store Stripe] Store secret key not configured");
    return null;
  }
  return new Stripe(process.env.STORE_STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

// Pricing configuration (should match Stripe dashboard)
// This is the SINGLE SOURCE OF TRUTH for all pricing
export const PRICING_PLANS = {
  trial: {
    name: "Free Trial",
    horses: 1,
    price: 0,
    currency: "gbp",
    interval: "trial",
    duration: 7, // days
    features: [
      "7-day free trial",
      "1 horse only",
      "ALL features enabled",
      "Basic health records",
      "Training session logging",
      "Secure storage",
      "Email support",
    ],
  },
  student: {
    name: "Student",
    horses: 1,
    monthly: {
      priceId: process.env.STRIPE_STUDENT_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.student.monthly.amount, // £8.00 in pence
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_STUDENT_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.student.yearly.amount, // £80.00 in pence
      currency: "gbp",
      interval: "year" as const,
    },
    features: [
      "Structured lesson pathways",
      "AI tutor access",
      "Assignment submissions",
      "Progress tracking",
      "Teacher communication",
      "Virtual horse management",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    horses: 5,
    monthly: {
      priceId: process.env.STRIPE_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.individual.monthly.amount, // £10.00 in pence
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.individual.yearly.amount, // £100.00 in pence
      currency: "gbp",
      interval: "year" as const,
    },
    features: [
      "Up to 5 horses",
      "Complete health tracking",
      "Advanced training logs",
      "Competition results",
      "Secure storage",
      "AI weather analysis (50/day)",
      "Email reminders",
      "Export to CSV/PDF",
    ],
  },
  stable: {
    name: "Stable",
    horses: 20,
    users: 5,
    monthly: {
      priceId: process.env.STRIPE_STABLE_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.stable.monthly.amount, // £30.00 in pence
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_STABLE_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.stable.yearly.amount, // £300.00 in pence
      currency: "gbp",
      interval: "year" as const,
    },
    features: [
      "Everything in Pro, plus:",
      "Up to 20 horses",
      "Up to 5 users",
      "Role-based permissions",
      "Stable management",
      "Secure storage",
      "Unlimited AI weather",
      "Advanced analytics",
      "Priority email support",
      "WhatsApp support",
    ],
  },
  // School plans — price IDs set via environment variables
  school_10: {
    name: "School (10 Students)",
    students: 10,
    monthly: {
      priceId: process.env.STRIPE_SCHOOL_10_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_10.monthly.amount,
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_SCHOOL_10_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_10.yearly.amount,
      currency: "gbp",
      interval: "year" as const,
    },
  },
  school_20: {
    name: "School (20 Students)",
    students: 20,
    monthly: {
      priceId: process.env.STRIPE_SCHOOL_20_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_20.monthly.amount,
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_SCHOOL_20_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_20.yearly.amount,
      currency: "gbp",
      interval: "year" as const,
    },
  },
  school_50: {
    name: "School (50 Students)",
    students: 50,
    monthly: {
      priceId: process.env.STRIPE_SCHOOL_50_MONTHLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_50.monthly.amount,
      currency: "gbp",
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_SCHOOL_50_YEARLY_PRICE_ID || "",
      amount: DEFAULT_PRICING.school.school_50.yearly.amount,
      currency: "gbp",
      interval: "year" as const,
    },
  },
} as const;

// Legacy export for backward compatibility
export const STRIPE_PRICING = {
  monthly: PRICING_PLANS.pro.monthly,
  yearly: PRICING_PLANS.pro.yearly,
};

// Validate Stripe price IDs and log warnings at startup
export function validatePricingConfig(): void {
  if (!ENV.enableStripe) {
    console.warn(
      `[Pricing] Stripe is disabled – showing default GBP prices (£${DEFAULT_PRICING.individual.monthly.amount / 100}/£${DEFAULT_PRICING.individual.yearly.amount / 100} Individual, £${DEFAULT_PRICING.stable.monthly.amount / 100}/£${DEFAULT_PRICING.stable.yearly.amount / 100} Stable). Configure ENABLE_STRIPE=true and Stripe keys to enable live billing.`,
    );
    return;
  }

  const requiredPriceIds: Array<{ name: string; value: string }> = [
    {
      name: "STRIPE_STUDENT_MONTHLY_PRICE_ID",
      value: PRICING_PLANS.student.monthly.priceId,
    },
    {
      name: "STRIPE_STUDENT_YEARLY_PRICE_ID",
      value: PRICING_PLANS.student.yearly.priceId,
    },
    {
      name: "STRIPE_MONTHLY_PRICE_ID",
      value: PRICING_PLANS.pro.monthly.priceId,
    },
    { name: "STRIPE_YEARLY_PRICE_ID", value: PRICING_PLANS.pro.yearly.priceId },
    {
      name: "STRIPE_STABLE_MONTHLY_PRICE_ID",
      value: PRICING_PLANS.stable.monthly.priceId,
    },
    {
      name: "STRIPE_STABLE_YEARLY_PRICE_ID",
      value: PRICING_PLANS.stable.yearly.priceId,
    },
  ];

  const missing = requiredPriceIds.filter((p) => !p.value);
  if (missing.length > 0) {
    console.warn(
      `[Pricing] Missing Stripe price IDs: ${missing.map((p) => p.name).join(", ")}. Checkout will fail until these are set.`,
    );
  } else {
    console.log("[Pricing] All Stripe price IDs configured.");
  }
}

// Create checkout session
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  customerId?: string,
): Promise<{ sessionId: string; url: string } | null> {
  checkStripeEnabled();

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
      },
      customer_email: customerId ? undefined : userEmail,
      allow_promotion_codes: true,
    };

    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      url: session.url!,
    };
  } catch (error) {
    console.error("[Stripe] Failed to create checkout session:", error);
    return null;
  }
}

// Create customer portal session
export async function createPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<string | null> {
  checkStripeEnabled();

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error("[Stripe] Failed to create portal session:", error);
    return null;
  }
}

// Get subscription details
export async function getSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error("[Stripe] Failed to retrieve subscription:", error);
    return null;
  }
}

// Cancel subscription at period end
export async function cancelSubscription(
  subscriptionId: string,
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return true;
  } catch (error) {
    console.error("[Stripe] Failed to cancel subscription:", error);
    return false;
  }
}

// Reactivate cancelled subscription
export async function reactivateSubscription(
  subscriptionId: string,
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return true;
  } catch (error) {
    console.error("[Stripe] Failed to reactivate subscription:", error);
    return false;
  }
}
