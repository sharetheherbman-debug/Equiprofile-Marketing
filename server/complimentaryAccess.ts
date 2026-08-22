export type ManagementPlanTier = "pro" | "stable";
export type ComplimentaryTier = ManagementPlanTier | "management_full";

export type BaseSubscriptionState = {
  subscriptionStatus: string;
  planTier: ManagementPlanTier;
  bothDashboardsUnlocked?: boolean;
};

export type ComplimentaryAccessGrant = {
  version: 1;
  tier: ComplimentaryTier;
  startsAt: string;
  endsAt: string | null;
  grantedByUserId?: number;
  reason?: string;
  note?: string;
};

export type ComplimentaryPreferences = Record<string, unknown> & {
  complimentaryAccess?: ComplimentaryAccessGrant | null;
};

export type EffectiveManagementEntitlement = BaseSubscriptionState & {
  effectivePlanTier: ManagementPlanTier;
  effectiveBothDashboardsUnlocked: boolean;
  complimentaryAccessState: "none" | "active" | "expired";
  complimentaryAccessUntil: string | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ISO_DATE.test(value) &&
    Number.isFinite(new Date(value).getTime())
  );
}

function readLegacyComplimentaryAccess(
  preferences: Record<string, unknown>,
): ComplimentaryAccessGrant | null {
  if (preferences.freeAccess !== true) return null;
  const rawTier = preferences.freeAccessTier ?? preferences.planTier;
  const tier: ComplimentaryTier = rawTier === "stable" || rawTier === "pro"
    ? rawTier
    : "management_full";
  const rawEnd = preferences.freeAccessUntil;
  let endsAt: string | null = null;
  if (rawEnd !== null && rawEnd !== undefined && rawEnd !== "") {
    const parsed = new Date(String(rawEnd));
    if (!Number.isFinite(parsed.getTime())) return null;
    endsAt = parsed.toISOString();
  }
  const rawStart = preferences.freeAccessGrantedAt ?? preferences.freeAccessStartedAt;
  const parsedStart = rawStart ? new Date(String(rawStart)) : new Date(0);
  return {
    version: 1,
    tier,
    startsAt: Number.isFinite(parsedStart.getTime()) ? parsedStart.toISOString() : new Date(0).toISOString(),
    endsAt,
  };
}

/**
 * Reads the canonical overlay first. Legacy free-access preferences are
 * compatibility-only: a canonical null/invalid marker never falls back to an
 * old flag, which makes an explicit revoke durable without billing mutation.
 */
export function readComplimentaryAccess(
  preferences: Record<string, unknown> | null | undefined,
): ComplimentaryAccessGrant | null {
  if (!preferences) return null;
  if (!Object.prototype.hasOwnProperty.call(preferences, "complimentaryAccess")) {
    return readLegacyComplimentaryAccess(preferences);
  }
  const raw = preferences.complimentaryAccess;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as Partial<ComplimentaryAccessGrant>;
  if (candidate.version !== 1) return null;
  if (!candidate.tier || !["pro", "stable", "management_full"].includes(candidate.tier)) {
    return null;
  }
  if (!validDate(candidate.startsAt)) return null;
  if (candidate.endsAt !== null && !validDate(candidate.endsAt)) return null;
  return candidate as ComplimentaryAccessGrant;
}

export function isComplimentaryAccessActive(
  grant: ComplimentaryAccessGrant | null,
  now: Date = new Date(),
): boolean {
  if (!grant) return false;
  const startsAt = new Date(grant.startsAt).getTime();
  if (startsAt > now.getTime()) return false;
  return grant.endsAt === null || new Date(grant.endsAt).getTime() > now.getTime();
}

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
 * Resolve the effective Management capability. An expired complimentary grant
 * falls back to the base subscription; it never blocks an otherwise-valid paid
 * subscription and never rewrites plan/billing state.
 */
export function resolveEffectiveManagementEntitlement(
  base: BaseSubscriptionState,
  preferences: Record<string, unknown> | null | undefined,
  now: Date = new Date(),
): EffectiveManagementEntitlement {
  const grant = readComplimentaryAccess(preferences);
  if (!grant) {
    return {
      ...base,
      effectivePlanTier: base.planTier,
      effectiveBothDashboardsUnlocked: Boolean(base.bothDashboardsUnlocked),
      complimentaryAccessState: "none",
      complimentaryAccessUntil: null,
    };
  }

  if (!isComplimentaryAccessActive(grant, now)) {
    return {
      ...base,
      effectivePlanTier: base.planTier,
      effectiveBothDashboardsUnlocked: Boolean(base.bothDashboardsUnlocked),
      complimentaryAccessState: "expired",
      complimentaryAccessUntil: grant.endsAt,
    };
  }

  const full = grant.tier === "management_full";
  const effectivePlanTier: ManagementPlanTier =
    grant.tier === "stable" || full ? "stable" : "pro";

  return {
    ...base,
    effectivePlanTier,
    effectiveBothDashboardsUnlocked:
      full || Boolean(base.bothDashboardsUnlocked),
    complimentaryAccessState: "active",
    complimentaryAccessUntil: grant.endsAt,
  };
}
