/**
 * Trial Lock Middleware
 *
 * Enforces 7-day hard trial lock across the application.
 * - Trial accounts have full access for 7 days from created_at
 * - After 7 days: HARD LOCK server-side (return 402/403)
 * - Frontend shows upgrade overlay
 * - Must be impossible to bypass by calling API directly
 *
 * This middleware is applied at the Express level before TRPC,
 * ensuring ALL API calls are checked (except auth/billing routes).
 */

import { Request, Response, NextFunction } from "express";
import { sdk } from "./sdk";

// Routes that should NOT be blocked by trial expiration
const EXEMPT_PATHS = [
  "/api/auth",
  "/api/billing",
  "/api/health",
  "/api/build",
  "/trpc/billing.", // Allow billing-related TRPC calls (prefix match: billing.*)
  "/trpc/user.getProfile", // Allow getting profile
  "/trpc/user.getOnboardingStatus", // Allow onboarding status checks
  "/trpc/user.updateOnboardingStep", // Allow onboarding progress
  "/trpc/user.completeOnboarding", // Allow completing onboarding
  "/trpc/user.setExperience", // Allow setting experience during onboarding
  "/trpc/user.getSubscriptionStatus", // Allow subscription status checks
  "/trpc/user.dismissTour", // Allow dismissing tours
  "/trpc/user.dismissTip", // Allow dismissing tips
  "/trpc/user.updateActivationChecklist", // Allow activation tracking
  "/trpc/user.skipOnboarding", // Allow skipping onboarding
  "/trpc/user.resetOnboarding", // Allow resetting onboarding
  "/trpc/auth.", // Allow all auth-related TRPC calls (prefix match: auth.*)
  "/trpc/system.getFeatureFlags", // Public read-only feature flags (used on billing pages)
  "/trpc/horses.getPassport", // Public horse passport (QR code scan — no auth needed)
];

/**
 * Check if a single path/procedure is exempt from trial checking
 */
function isSinglePathExempt(path: string): boolean {
  return EXEMPT_PATHS.some((exempt) => path.startsWith(exempt));
}

/**
 * Check if a path is exempt from trial checking.
 * Handles TRPC batch requests where multiple procedure names are
 * comma-separated in the path (e.g. /trpc/billing.getStatus,system.getFeatureFlags).
 * A batch is only exempt if EVERY procedure in it is individually exempt.
 */
function isExemptPath(path: string): boolean {
  // For TRPC batch requests, check each procedure individually
  if (path.startsWith("/trpc/") && path.includes(",")) {
    const procedurePart = path.slice("/trpc/".length);
    const procedures = procedurePart.split(",");
    return procedures.every((proc) => isSinglePathExempt(`/trpc/${proc}`));
  }

  return isSinglePathExempt(path);
}

/**
 * Check if trial has expired (7 days from createdAt)
 */
function hasTrialExpired(createdAt: Date): boolean {
  const now = new Date();
  const trialEndDate = new Date(createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  return now > trialEndDate;
}

/**
 * Trial Lock Middleware
 * Apply this BEFORE your TRPC handler and other protected routes
 */
export async function trialLockMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  // Skip exempt paths (auth, billing, health checks)
  if (isExemptPath(req.path)) {
    return next();
  }

  try {
    // Authenticate user
    const user = await sdk.authenticateRequest(req);

    // If no user, let auth middleware handle it
    if (!user) {
      return next();
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        error: "Account suspended",
        message: user.suspendedReason || "Please contact support",
        code: "ACCOUNT_SUSPENDED",
      });
    }

    // Check trial status
    if (user.subscriptionStatus === "trial") {
      if (hasTrialExpired(user.createdAt)) {
        return res.status(402).json({
          error: "Trial expired",
          message:
            "Your 7-day trial has ended. Please upgrade to continue using EquiProfile.",
          code: "TRIAL_EXPIRED",
          trialEndedAt: new Date(
            user.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });
      }
    }

    // Check if subscription is expired or overdue
    if (
      user.subscriptionStatus === "expired" ||
      user.subscriptionStatus === "overdue"
    ) {
      return res.status(402).json({
        error: "Subscription expired",
        message:
          "Your subscription has expired. Please renew to continue using EquiProfile.",
        code: "SUBSCRIPTION_EXPIRED",
      });
    }

    // Check if subscription is cancelled (give grace period until subscriptionEndsAt)
    if (user.subscriptionStatus === "cancelled" && user.subscriptionEndsAt) {
      const now = new Date();
      if (now > user.subscriptionEndsAt) {
        return res.status(402).json({
          error: "Subscription ended",
          message:
            "Your subscription has ended. Please resubscribe to continue.",
          code: "SUBSCRIPTION_ENDED",
        });
      }
    }

    // All checks passed, continue
    next();
  } catch (error) {
    // ForbiddenError (no session / invalid cookie) is expected for public
    // requests – do not spam logs for it.  Only log genuine server errors.
    const isAuthError =
      error instanceof Error &&
      (error.message.includes("Invalid session cookie") ||
        error.message.includes("User not found") ||
        error.message.includes("session"));
    if (!isAuthError) {
      console.error("[TrialLock] Error checking trial status:", error);
    }
    // Don't block on error, let request through
    next();
  }
}
