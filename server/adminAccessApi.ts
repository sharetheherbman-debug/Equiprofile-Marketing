import type { Request, Response } from "express";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { organizations } from "../drizzle/schema";
import {
  grantProductComplimentaryAccess,
  listProductComplimentaryAccess,
  revokeProductComplimentaryAccess,
  type EquiProfileProduct,
} from "../shared/productEntitlement";
import {
  grantComplimentaryAccess,
  revokeComplimentaryAccess,
} from "./complimentaryAccess";
import * as db from "./db";
import { getDb } from "./db";
import { isTrustedCookieWrite } from "./_core/requestSecurity";
import { sdk } from "./_core/sdk";

const PRODUCTS = new Set<EquiProfileProduct>([
  "management",
  "academy",
  "marketing",
  "shop",
]);

function parsePreferences(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

async function requireUnlockedAdmin(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.role !== "admin") {
      res.status(403).json({ error: "Administrator access required" });
      return null;
    }
    const session = await db.getAdminSession(user.id);
    if (!session || session.expiresAt < new Date()) {
      res.status(403).json({ error: "Admin session expired. Unlock admin mode again." });
      return null;
    }
    return user;
  } catch {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
}

function requireTrustedWrite(req: Request, res: Response) {
  if (!isTrustedCookieWrite(req)) {
    res.status(403).json({ error: "Cross-site authenticated request rejected" });
    return false;
  }
  return true;
}

export function registerAdminAccessRoutes(router: Router) {
  router.get("/admin-access/users", async (req, res) => {
    const admin = await requireUnlockedAdmin(req, res);
    if (!admin) return;

    const users = await db.getAllUsers();
    const database = await getDb();
    const academyByOwner = new Map<number, Array<Record<string, unknown>>>();
    if (database) {
      const academyOrgs = await database
        .select({
          id: organizations.id,
          ownerId: organizations.ownerId,
          name: organizations.name,
          planTier: organizations.planTier,
          billingStatus: organizations.academyBillingStatus,
          billingInterval: organizations.academyBillingInterval,
          billingCurrentPeriodEndsAt:
            organizations.academyBillingCurrentPeriodEndsAt,
        })
        .from(organizations);
      for (const org of academyOrgs) {
        const current = academyByOwner.get(org.ownerId) ?? [];
        current.push(org as unknown as Record<string, unknown>);
        academyByOwner.set(org.ownerId, current);
      }
    }

    res.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isSuspended: user.isSuspended,
        createdAt: user.createdAt,
        lastSignedIn: user.lastSignedIn,
        managementPayment: {
          status: user.subscriptionStatus,
          plan: user.subscriptionPlan,
          currentPeriodEndsAt: user.subscriptionEndsAt,
          lastPaymentAt: user.lastPaymentAt,
          stripeCustomerId: user.stripeCustomerId,
        },
        academyOrganizations: academyByOwner.get(user.id) ?? [],
        complimentary: listProductComplimentaryAccess(user.preferences),
      })),
    });
  });

  router.post("/admin-access/users/:userId/grants", async (req, res) => {
    if (!requireTrustedWrite(req, res)) return;
    const admin = await requireUnlockedAdmin(req, res);
    if (!admin) return;

    const userId = Number(req.params.userId);
    const product = req.body?.product as EquiProfileProduct;
    const tier = typeof req.body?.tier === "string" ? req.body.tier.trim() : "";
    const days = req.body?.days === null ? null : Number(req.body?.days ?? 30);
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
    const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";

    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (!PRODUCTS.has(product)) {
      return res.status(400).json({ error: "Invalid product" });
    }
    if (!tier || tier.length > 80) {
      return res.status(400).json({ error: "A valid access tier is required" });
    }
    if (days !== null && (!Number.isInteger(days) || days < 1 || days > 3650)) {
      return res.status(400).json({ error: "Days must be between 1 and 3650" });
    }
    if (!reason || reason.length > 500) {
      return res.status(400).json({ error: "A grant reason is required" });
    }

    const target = await db.getUserById(userId);
    if (!target) return res.status(404).json({ error: "User not found" });

    let preferences = grantProductComplimentaryAccess(target.preferences, {
      product,
      tier,
      days,
      grantedByUserId: admin.id,
      reason,
      note,
    });

    // Preserve the existing Management entitlement resolver during the central
    // Billing migration. This is an access overlay only; Stripe/payment fields
    // are deliberately never modified here.
    if (product === "management") {
      const managementTier =
        tier === "stable" || tier === "management_full" ? tier : "pro";
      preferences = grantComplimentaryAccess(preferences, {
        tier: managementTier,
        days,
        grantedByUserId: admin.id,
        reason,
        note,
      });
    }

    await db.updateUser(userId, { preferences: JSON.stringify(preferences) });
    await db.logActivity({
      userId: admin.id,
      action: "product_complimentary_access_granted",
      entityType: "user",
      entityId: userId,
      details: JSON.stringify({ product, tier, days, reason, note: note || null }),
    });

    res.json({
      success: true,
      complimentary: listProductComplimentaryAccess(preferences),
    });
  });

  router.delete(
    "/admin-access/users/:userId/grants/:product",
    async (req, res) => {
      if (!requireTrustedWrite(req, res)) return;
      const admin = await requireUnlockedAdmin(req, res);
      if (!admin) return;

      const userId = Number(req.params.userId);
      const product = req.params.product as EquiProfileProduct;
      if (!Number.isInteger(userId) || userId < 1 || !PRODUCTS.has(product)) {
        return res.status(400).json({ error: "Invalid user or product" });
      }
      const target = await db.getUserById(userId);
      if (!target) return res.status(404).json({ error: "User not found" });

      let preferences = revokeProductComplimentaryAccess(target.preferences, product);
      if (product === "management") {
        preferences = revokeComplimentaryAccess(preferences);
      }
      await db.updateUser(userId, { preferences: JSON.stringify(preferences) });
      await db.logActivity({
        userId: admin.id,
        action: "product_complimentary_access_revoked",
        entityType: "user",
        entityId: userId,
        details: JSON.stringify({ product }),
      });
      res.json({ success: true });
    },
  );

  router.post("/admin-access/users/:userId/role", async (req, res) => {
    if (!requireTrustedWrite(req, res)) return;
    const admin = await requireUnlockedAdmin(req, res);
    if (!admin) return;

    const userId = Number(req.params.userId);
    const role = req.body?.role;
    if (!Number.isInteger(userId) || userId < 1 || !["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid user or role" });
    }
    if (userId === admin.id && role !== "admin") {
      return res.status(409).json({
        error: "You cannot remove your own administrator permission from this session.",
      });
    }
    const target = await db.getUserById(userId);
    if (!target) return res.status(404).json({ error: "User not found" });

    await db.updateUser(userId, { role });
    await db.logActivity({
      userId: admin.id,
      action: "admin_role_changed",
      entityType: "user",
      entityId: userId,
      details: JSON.stringify({ previousRole: target.role, role }),
    });
    res.json({ success: true, role });
  });
}
