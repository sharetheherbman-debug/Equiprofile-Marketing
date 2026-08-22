import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "@shared/const";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import {
  hasEffectiveManagementAccess,
  parseManagementPreferences,
  resolveEffectiveManagementEntitlement,
  type ManagementPlanTier,
} from "../complimentaryAccess";
import type { TrpcContext } from "./context";
import { isTrustedCookieWrite } from "./requestSecurity";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const STABLE_ONLY_PROCEDURE_PREFIXES = [
  "lessonBookings.",
  "trainerAvailability.",
] as const;

function requiresStableEntitlement(path: string): boolean {
  return STABLE_ONLY_PROCEDURE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

const EMBEDDED_MARKETING_WRITE_VERBS = [
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "cancel",
  "reschedule",
  "attach",
  "detach",
  "connect",
  "disconnect",
  "publish",
  "send",
  "sync",
  "test",
  "run",
  "execute",
  "generate",
  "save",
  "upsert",
  "grant",
] as const;

const EXPLICIT_EMBEDDED_MARKETING_WRITES = new Set([
  "sendCampaign",
  "sendTestEmail",
  "publishApprovedScheduleDraft",
  "testMarketingProviderTaskRoute",
  "connectMarketingPlatform",
  "permanentDeleteMediaAsset",
]);

function isEmbeddedMarketingWrite(path: string): boolean {
  const leaf = path.split(".").at(-1) ?? path;
  if (EXPLICIT_EMBEDDED_MARKETING_WRITES.has(leaf)) return true;

  const lowerPath = path.toLowerCase();
  const lowerLeaf = leaf.toLowerCase();
  const belongsToLegacyMarketing =
    lowerPath.includes("marketing") ||
    lowerPath.includes("campaign") ||
    lowerPath.includes("beastmode") ||
    lowerPath.includes("growthengine");

  return (
    belongsToLegacyMarketing &&
    EMBEDDED_MARKETING_WRITE_VERBS.some((verb) => lowerLeaf.startsWith(verb))
  );
}

function trialEndFromCreatedAt(createdAt: Date | string): Date {
  const end = new Date(createdAt);
  end.setDate(end.getDate() + 7);
  return end;
}

async function loadManagementAccess(userId: number) {
  const db = await import("../db");
  const user = await db.getUserById(userId);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  const preferences = parseManagementPreferences(user.preferences);
  const planTier: ManagementPlanTier =
    preferences.planTier === "stable" ? "stable" : "pro";
  const trialEndsAt = trialEndFromCreatedAt(user.createdAt);
  const hasAccess = hasEffectiveManagementAccess({
    role: user.role,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt,
    preferences,
  });
  const entitlement = resolveEffectiveManagementEntitlement(
    {
      subscriptionStatus: user.subscriptionStatus,
      planTier,
      bothDashboardsUnlocked: Boolean(preferences.bothDashboardsUnlocked),
    },
    preferences,
  );

  return { user, preferences, entitlement, hasAccess, trialEndsAt };
}

const requireUser = t.middleware(async (opts) => {
  const { ctx, next, path } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  if (!isTrustedCookieWrite(ctx.req)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cross-site authenticated request rejected",
    });
  }

  if (requiresStableEntitlement(path)) {
    const state = await loadManagementAccess(ctx.user.id);
    if (state.user.isSuspended) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Account suspended: ${state.user.suspendedReason || "Please contact support"}`,
      });
    }
    if (!state.hasAccess) {
      throw new TRPCError({
        code: "PAYMENT_REQUIRED",
        message: "An active subscription, trial, or complimentary grant is required.",
      });
    }
    const hasStableAccess =
      state.entitlement.effectivePlanTier === "stable" ||
      state.entitlement.effectiveBothDashboardsUnlocked;
    if (!hasStableAccess && state.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "This feature requires the Stable plan. Please upgrade to continue.",
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

const checkTrialStatus = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  const state = await loadManagementAccess(ctx.user.id);

  if (state.user.isSuspended) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Account suspended: ${state.user.suspendedReason || "Please contact support"}`,
    });
  }

  if (!state.hasAccess) {
    const isExpiredTrial =
      state.user.subscriptionStatus === "trial" && state.trialEndsAt <= new Date();
    throw new TRPCError({
      code: "PAYMENT_REQUIRED",
      message: isExpiredTrial
        ? "Your 7-day trial has ended. Please upgrade to continue using EquiProfile."
        : "Your subscription is not active. Please renew or upgrade to continue using EquiProfile.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const activeUserProcedure = protectedProcedure.use(checkTrialStatus);

export const adminUnlockedProcedure = protectedProcedure.use(
  t.middleware(async (opts) => {
    const { ctx, next, path } = opts;

    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    if (isEmbeddedMarketingWrite(path)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Legacy embedded Marketing is read-only. Open the standalone Marketing application instead.",
      });
    }

    const db = await import("../db");
    const session = await db.getAdminSession(ctx.user.id);

    if (!session || session.expiresAt < new Date()) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin session expired. Please unlock admin mode in AI Chat.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
