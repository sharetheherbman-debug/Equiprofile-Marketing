import { Router, Request, Response, NextFunction } from "express";
import * as db from "./db";
import { getDb } from "./db";
import {
  horses,
  healthRecords,
  trainingSessions,
  competitions,
  apiKeys,
} from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { registerMarketingConnectorRoutes } from "./marketingConnector";
import { registerAdminAccessRoutes } from "./adminAccessApi";
import { registerBillingServiceRoutes } from "./billingServiceConnector";

const apiRouter = Router();

// Browser-session routes are registered before the public API-key guard.
registerMarketingConnectorRoutes(apiRouter);
registerAdminAccessRoutes(apiRouter);
registerBillingServiceRoutes(apiRouter);

// Middleware to verify API key
async function verifyApiKey(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header" });
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  try {
    // Validate API key against database
    const dbInstance = await getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    // API key format: ep_XXXX_<secret> — prefix is "ep_XXXX"
    const underscoreIdx = apiKey.indexOf("_", 3); // skip "ep_"
    const prefix =
      underscoreIdx > 0 ? apiKey.substring(0, underscoreIdx) : null;

    if (!prefix) {
      return res.status(401).json({ error: "Invalid API key format" });
    }

    // Find candidate keys by prefix (narrows down bcrypt comparison)
    const candidates = await dbInstance
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyPrefix, prefix));

    let matchedKey: (typeof candidates)[0] | undefined;
    for (const candidate of candidates) {
      if (await bcrypt.compare(apiKey, candidate.keyHash)) {
        matchedKey = candidate;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!matchedKey.isActive) {
      return res.status(401).json({ error: "API key has been revoked" });
    }

    if (matchedKey.expiresAt && matchedKey.expiresAt < new Date()) {
      return res.status(401).json({ error: "API key has expired" });
    }

    // Update last used timestamp (fire and forget)
    dbInstance
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, matchedKey.id))
      .catch((err) => {
        console.error("[API] Failed to update lastUsedAt:", err);
      });

    (req as any).apiUserId = matchedKey.userId;

    next();
  } catch (error) {
    console.error("API key verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Apply API key middleware to all routes below this point.
apiRouter.use(verifyApiKey);

// GET /api/v1/horses - List all horses for the authenticated user
apiRouter.get("/horses", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).apiUserId;
    const dbInstance = await getDb();

    if (!dbInstance) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    const userHorses = await dbInstance
      .select()
      .from(horses)
      .where(eq(horses.userId, userId))
      .orderBy(desc(horses.createdAt));

    res.json({
      success: true,
      data: userHorses,
      count: userHorses.length,
    });
  } catch (error) {
    console.error("Error fetching horses:", error);
    res.status(500).json({ error: "Failed to fetch horses" });
  }
});

// GET /api/v1/horses/:id - Get a specific horse
apiRouter.get("/horses/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).apiUserId;
    const horseId = parseInt(req.params.id);

    if (isNaN(horseId)) {
      return res.status(400).json({ error: "Invalid horse ID" });
    }

    const dbInstance = await getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    const horse = await dbInstance
      .select()
      .from(horses)
      .where(eq(horses.id, horseId))
      .limit(1);

    if (!horse.length) {
      return res.status(404).json({ error: "Horse not found" });
    }

    // Verify ownership
    if (horse[0].userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      success: true,
      data: horse[0],
    });
  } catch (error) {
    console.error("Error fetching horse:", error);
    res.status(500).json({ error: "Failed to fetch horse" });
  }
});

// GET /api/v1/health-records/:horseId - List health records for a horse
apiRouter.get(
  "/health-records/:horseId",
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).apiUserId;
      const horseId = parseInt(req.params.horseId);

      if (isNaN(horseId)) {
        return res.status(400).json({ error: "Invalid horse ID" });
      }

      const dbInstance = await getDb();
      if (!dbInstance) {
        return res.status(500).json({ error: "Database connection failed" });
      }

      // Verify horse ownership
      const horse = await dbInstance
        .select()
        .from(horses)
        .where(eq(horses.id, horseId))
        .limit(1);

      if (!horse.length || horse[0].userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const records = await dbInstance
        .select()
        .from(healthRecords)
        .where(eq(healthRecords.horseId, horseId))
        .orderBy(desc(healthRecords.recordDate));

      res.json({
        success: true,
        data: records,
        count: records.length,
      });
    } catch (error) {
      console.error("Error fetching health records:", error);
      res.status(500).json({ error: "Failed to fetch health records" });
    }
  },
);

// GET /api/v1/training-sessions/:horseId - List training sessions for a horse
apiRouter.get(
  "/training-sessions/:horseId",
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).apiUserId;
      const horseId = parseInt(req.params.horseId);

      if (isNaN(horseId)) {
        return res.status(400).json({ error: "Invalid horse ID" });
      }

      const dbInstance = await getDb();
      if (!dbInstance) {
        return res.status(500).json({ error: "Database connection failed" });
      }

      // Verify horse ownership
      const horse = await dbInstance
        .select()
        .from(horses)
        .where(eq(horses.id, horseId))
        .limit(1);

      if (!horse.length || horse[0].userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const records = await dbInstance
        .select()
        .from(trainingSessions)
        .where(eq(trainingSessions.horseId, horseId))
        .orderBy(desc(trainingSessions.sessionDate));

      res.json({
        success: true,
        data: records,
        count: records.length,
      });
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ error: "Failed to fetch training sessions" });
    }
  },
);

// GET /api/v1/competitions/:horseId - List competitions for a horse
apiRouter.get("/competitions/:horseId", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).apiUserId;
    const horseId = parseInt(req.params.id);

    if (isNaN(horseId)) {
      return res.status(400).json({ error: "Invalid horse ID" });
    }

    const dbInstance = await getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Verify ownership
    const horse = await dbInstance
      .select()
      .from(horses)
      .where(eq(horses.id, horseId))
      .limit(1);

    if (!horse.length || horse[0].userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const comps = await dbInstance
      .select()
      .from(competitions)
      .where(eq(competitions.horseId, horseId))
      .orderBy(desc(competitions.date));

    res.json({
      success: true,
      data: comps,
      count: comps.length,
    });
  } catch (error) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
});

export { apiRouter };
