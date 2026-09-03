import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { organizationMembers, organizations } from "../../drizzle/schema";
import {
  isProductComplimentaryActive,
  readProductComplimentaryGrant,
} from "../../shared/productEntitlement";
import { getDb, getUserById } from "../db";

export type AcademyEntitlement = {
  entitled: boolean;
  audience: "rider" | "learner" | "teacher" | "owner" | "admin" | "none";
  organizationId?: number;
  source:
    | "admin_role"
    | "complimentary_academy"
    | "individual_academy"
    | "legacy_academy"
    | "organization_entitlement"
    | "none";
};

function preferences(value: string | null | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function resolveIndividualAcademyEntitlement(user: {
  role?: string | null;
  preferences?: string | null;
}): AcademyEntitlement {
  if (user.role === "admin") {
    return { entitled: true, audience: "admin", source: "admin_role" };
  }
  const prefs = preferences(user.preferences);
  const preferredAudience = (() => {
    const value = String(prefs.academyPlan || prefs.selectedExperience || "").toLowerCase();
    if (value === "teacher") return "teacher" as const;
    if (value === "owner" || value === "school_owner") return "owner" as const;
    return "rider" as const;
  })();
  if (isProductComplimentaryActive(prefs, "academy")) {
    const tier = String(readProductComplimentaryGrant(prefs, "academy")?.tier || "").toLowerCase();
    const audience = tier === "teacher"
      ? "teacher"
      : tier === "owner" || tier.startsWith("school_")
        ? "owner"
        : preferredAudience;
    return { entitled: true, audience, source: "complimentary_academy" };
  }
  const status = String(prefs.academyEntitlementStatus || "").toLowerCase();
  const plan = String(prefs.academyPlan || prefs.planTier || "").toLowerCase();
  const experience = String(prefs.selectedExperience || "").toLowerCase();
  if (["active", "trial", "trialing", "grace"].includes(status)) {
    return { entitled: true, audience: preferredAudience, source: "individual_academy" };
  }
  if (plan === "student" || experience === "student") {
    // Compatibility for existing learners. New paid access is synchronized via
    // academyEntitlementStatus; this bridge never changes payment truth.
    return { entitled: true, audience: "rider", source: "legacy_academy" };
  }
  return { entitled: false, audience: "none", source: "none" };
}

export function isAcademyOrganizationEntitlementActive(
  input: { isActive: boolean; billingStatus: string | null; trialEndsAt: Date | null },
  now: Date = new Date(),
): boolean {
  if (!input.isActive) return false;
  const status = String(input.billingStatus || "").toLowerCase();
  if (["active", "trial", "trialing", "grace"].includes(status)) return true;
  return !!input.trialEndsAt && input.trialEndsAt.getTime() > now.getTime();
}

export async function getAcademyEntitlement(userId: number): Promise<AcademyEntitlement> {
  const user = await getUserById(userId);
  if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  const individual = resolveIndividualAcademyEntitlement(user);
  if (individual.source === "admin_role") return individual;

  const database = await getDb();
  if (!database) {
    if (individual.entitled) return individual;
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Academy access could not be checked." });
  }
  const [membership] = await database
    .select({
      organizationId: organizationMembers.organizationId,
      role: organizationMembers.role,
      organizationActive: organizations.isActive,
      billingStatus: organizations.academyBillingStatus,
      trialEndsAt: organizations.trialEndsAt,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
    .where(and(eq(organizationMembers.userId, userId), eq(organizations.isActive, true)))
    .limit(1);
  if (!membership || !isAcademyOrganizationEntitlementActive({
    isActive: membership.organizationActive,
    billingStatus: membership.billingStatus,
    trialEndsAt: membership.trialEndsAt,
  })) {
    return individual;
  }
  const audience = membership.role === "school_owner"
    ? "owner"
    : membership.role === "teacher" ? "teacher" : "learner";
  return {
    entitled: true,
    audience,
    organizationId: membership.organizationId,
    source: "organization_entitlement",
  };
}

export async function requireAcademyAudience(
  userId: number,
  allowed: AcademyEntitlement["audience"][],
): Promise<AcademyEntitlement> {
  const entitlement = await getAcademyEntitlement(userId);
  if (!entitlement.entitled || !allowed.includes(entitlement.audience)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your EquiProfile Academy entitlement does not include this area.",
    });
  }
  return entitlement;
}

export async function requireAcademyLearnerEntitlement(userId: number): Promise<AcademyEntitlement> {
  return requireAcademyAudience(userId, ["rider", "learner", "admin"]);
}
