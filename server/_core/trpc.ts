import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "@shared/const";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { isTrustedCookieWrite } from "./requestSecurity";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Legacy routers that are presented exclusively as Stable-plan features but
 * historically used protectedProcedure rather than stablePlanProcedure.
 * Enforce these namespaces centrally so direct tRPC calls cannot bypass the
 * dashboard entitlement boundary while the oversized routers file is split.
 */
const STABLE_ONLY_PROCEDURE_PREFIXES = [
  "lessonBookings.",
  "trainerAvailability.",
] as const;

function requiresStableEntitlement(path: string): boolean {
  return STABLE_ONLY_PROCEDURE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Phase 1 EquiProfile / Marketing separation boundary.
 *
 * The embedded Marketing database records remain readable while we inventory,
 * reconcile and migrate them into the standalone white-label EquiProfile
 * Marketing application. EquiProfile must no longer create, mutate, generate,
 * send, publish or configure work in that legacy Marketing runtime.
 *
 * This boundary is intentionally central so an old hidden UI, direct tRPC call
 * or forgotten admin component cannot reactivate legacy execution while source
 * code is being removed in controlled batches.
 */
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

function parsePreferences(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw !== "string") return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
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
    const db = await import("../db");
    const user = await db.getUserById(ctx.user.id);
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }
    const prefs = parsePreferences(user.preferences);
    const hasStableAccess =
      prefs.planTier === "stable" || prefs.bothDashboardsUnlocked === true;
    if (!hasStableAccess) {
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

  if (ctx.user.subscriptionStatus === "trial") {
    const now = new Date();
    const trialEndDate = new Date(ctx.user.createdAt);
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    if (now > trialEndDate) {
      throw new TRPCError({
        code: "PAYMENT_REQUIRED",
        message:
          "Your 7-day trial has ended. Please upgrade to continue using EquiProfile.",
      });
    }
  }

  if (
    ctx.user.subscriptionStatus === "expired" ||
    ctx.user.subscriptionStatus === "overdue"
  ) {
    throw new TRPCError({
      code: "PAYMENT_REQUIRED",
      message:
        "Your subscription has expired. Please renew to continue using EquiProfile.",
    });
  }

  if (ctx.user.isSuspended) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Account suspended: ${ctx.user.suspendedReason || "Please contact support"}`,
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
          "Legacy embedded Marketing is read-only during migration. Open the owner-only EquiProfile Marketing application instead.",
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
