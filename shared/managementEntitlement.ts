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

export type ManagementAccessSubject = {
  role?: string | null;
  subscriptionStatus: string;
  subscriptionPlan?: string | null;
  trialEndsAt?: Date | string | null;
  preferences?: string | Record<string, unknown> | null;
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

export function parseManagementPreferences(
  raw: string | Record<string, unknown> | null | undefined,
): ComplimentaryPreferences {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as ComplimentaryPreferences;
  }
  if (typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as ComplimentaryPreferences)
      : {};
  } catch {
    return {};
  }
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
