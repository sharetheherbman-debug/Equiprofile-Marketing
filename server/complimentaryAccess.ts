import {
  parseManagementPreferences,
  resolveEffectiveManagementEntitlement,
  type ComplimentaryPreferences,
  type ComplimentaryTier,
  type ManagementAccessSubject,
  type ManagementPlanTier,
} from "../shared/managementEntitlement";

export {
  isComplimentaryAccessActive,
  parseManagementPreferences,
  readComplimentaryAccess,
  resolveEffectiveManagementEntitlement,
} from "../shared/managementEntitlement";
export type {
  BaseSubscriptionState,
  ComplimentaryAccessGrant,
  ComplimentaryPreferences,
  ComplimentaryTier,
  EffectiveManagementEntitlement,
  ManagementAccessSubject,
  ManagementPlanTier,
} from "../shared/managementEntitlement";

/**
 * Create a complimentary-access overlay without mutating the user's underlying
 * subscription status, paid plan tier, Stripe state or dashboard entitlement.
 */
export function grantComplimentaryAccess(
  preferences: Record<string, unknown> | null | undefined,
  input: {
    tier: ComplimentaryTier;
    days?: number | null;
    now?: Date;
    grantedByUserId?: number;
    reason?: string;
    note?: string;
  },
): ComplimentaryPreferences {
  const now = input.now ?? new Date();
  if (input.days !== undefined && input.days !== null) {
    if (!Number.isInteger(input.days) || input.days < 1 || input.days > 3650) {
      throw new Error("Complimentary access days must be an integer from 1 to 3650");
    }
  }
  const endsAt =
    input.days === undefined || input.days === null
      ? null
      : new Date(now.getTime() + input.days * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...(preferences ?? {}),
    complimentaryAccess: {
      version: 1,
      tier: input.tier,
      startsAt: now.toISOString(),
      endsAt,
      ...(input.grantedByUserId
        ? { grantedByUserId: input.grantedByUserId }
        : {}),
      ...(input.reason?.trim() ? { reason: input.reason.trim() } : {}),
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    },
  };
}

/**
 * Revoke only the overlay. Underlying paid/trial subscription fields are owned
 * by billing and are deliberately not accepted by this function.
 */
export function revokeComplimentaryAccess(
  preferences: Record<string, unknown> | null | undefined,
): ComplimentaryPreferences {
  return {
    ...(preferences ?? {}),
    complimentaryAccess: null,
    // Prevent a retained historical preference from re-enabling the overlay.
    freeAccess: false,
    freeAccessUntil: null,
    freeAccessDays: null,
  };
}

/**
 * Canonical access predicate for Management-protected surfaces. It preserves
 * billing-owned paid/trial status and treats complimentary access only as a
 * separate overlay; it never mutates stored subscription data.
 */
export function hasEffectiveManagementAccess(
  subject: ManagementAccessSubject | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!subject) return false;
  if (subject.role === "admin") return true;
  const preferences = parseManagementPreferences(subject.preferences);
  const planTier: ManagementPlanTier = preferences.planTier === "stable" ? "stable" : "pro";
  const entitlement = resolveEffectiveManagementEntitlement(
    {
      subscriptionStatus: subject.subscriptionStatus,
      planTier,
      bothDashboardsUnlocked: Boolean(preferences.bothDashboardsUnlocked),
    },
    preferences,
    now,
  );
  if (entitlement.complimentaryAccessState === "active") return true;
  if (subject.subscriptionStatus === "active") return true;
  if (subject.subscriptionStatus !== "trial" || !subject.trialEndsAt) return false;
  const trialEndsAt = new Date(subject.trialEndsAt);
  return Number.isFinite(trialEndsAt.getTime()) && trialEndsAt > now;
}
