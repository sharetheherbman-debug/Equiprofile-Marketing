/**
 * Tests for Settings page backend functionality:
 * - auth.changePassword logic (inline handler test)
 * - user.updateNotificationPreferences tRPC procedure
 * - user.getNotificationPreferences tRPC procedure
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB ────────────────────────────────────────────────────────────────
// NOTE: vi.mock factory is hoisted to top of file; must NOT reference variables
// defined in module scope. Use vi.fn() inline and import the mock via vi.mocked().

vi.mock("./db", () => ({
  getUserById: vi.fn().mockResolvedValue({
    id: 1,
    preferences: null,
    subscriptionStatus: "active",
    isSuspended: false,
  }),
  updateUser: vi.fn().mockResolvedValue(undefined),
  logActivity: vi.fn().mockResolvedValue(undefined),
  getUserByEmail: vi.fn().mockResolvedValue(null),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
  getHorsesByUserId: vi.fn().mockResolvedValue([]),
  getUpcomingTrainingSessions: vi.fn().mockResolvedValue([]),
  getUpcomingReminders: vi.fn().mockResolvedValue([]),
  getLatestWeatherLog: vi.fn().mockResolvedValue(null),
}));

import * as db from "./db";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeContext(userId = 1): TrpcContext {
  return {
    req: {} as any,
    res: {} as any,
    user: {
      id: userId,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      passwordHash: null,
      emailVerified: false,
      resetToken: null,
      resetTokenExpiry: null,
      loginMethod: "email",
      role: "user",
      subscriptionStatus: "active",
      subscriptionPlan: "monthly",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      trialEndsAt: null,
      subscriptionEndsAt: null,
      lastPaymentAt: null,
      isActive: true,
      isSuspended: false,
      suspendedReason: null,
      phone: null,
      location: null,
      latitude: null,
      longitude: null,
      profileImageUrl: null,
      storageUsedBytes: 0,
      storageQuotaBytes: 104857600,
      preferences: null,
      language: "en",
      theme: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    hasAccess: true,
  };
}

// ─── auth.changePassword (inline handler logic mirrors authRouter.ts) ────────

async function handleChangePassword(
  currentPassword: string,
  newPassword: string,
  user: { id: number; passwordHash: string | null },
  dbMock: {
    updateUser: (id: number, data: Record<string, unknown>) => Promise<void>;
  },
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (!currentPassword || !newPassword) {
    return {
      status: 400,
      body: { error: "currentPassword and newPassword are required" },
    };
  }
  if (newPassword.length < 8) {
    return {
      status: 400,
      body: { error: "New password must be at least 8 characters" },
    };
  }
  if (!user.passwordHash) {
    return {
      status: 400,
      body: { error: "No password set. Use forgot-password to create one." },
    };
  }
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { status: 400, body: { error: "Current password is incorrect" } };
  }
  const newHash = await bcrypt.hash(newPassword, 10);
  await dbMock.updateUser(user.id, { passwordHash: newHash });
  return { status: 200, body: { success: true } };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("auth.changePassword", () => {
  const dbMock = { updateUser: vi.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    dbMock.updateUser.mockClear();
  });

  it("rejects when currentPassword is missing", async () => {
    const result = await handleChangePassword(
      "",
      "newPassword123",
      { id: 1, passwordHash: "hash" },
      dbMock,
    );
    expect(result.status).toBe(400);
    expect(result.body.error).toContain("required");
  });

  it("rejects when newPassword is too short", async () => {
    const result = await handleChangePassword(
      "oldpass",
      "short",
      { id: 1, passwordHash: "hash" },
      dbMock,
    );
    expect(result.status).toBe(400);
    expect(result.body.error).toContain("8 characters");
  });

  it("rejects when no password hash is set (OAuth user)", async () => {
    const result = await handleChangePassword(
      "oldpass",
      "newPassword123",
      { id: 1, passwordHash: null },
      dbMock,
    );
    expect(result.status).toBe(400);
    expect(result.body.error).toContain("No password set");
  });

  it("rejects when current password is wrong", async () => {
    const correctHash = await bcrypt.hash("correctPassword", 10);
    const result = await handleChangePassword(
      "wrongPassword",
      "newPassword123",
      { id: 1, passwordHash: correctHash },
      dbMock,
    );
    expect(result.status).toBe(400);
    expect(result.body.error).toContain("incorrect");
    expect(dbMock.updateUser).not.toHaveBeenCalled();
  });

  it("succeeds with correct current password and updates hash", async () => {
    const currentPassword = "myCurrentPass1!";
    const correctHash = await bcrypt.hash(currentPassword, 10);
    const result = await handleChangePassword(
      currentPassword,
      "myNewPassword1!",
      { id: 1, passwordHash: correctHash },
      dbMock,
    );
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(dbMock.updateUser).toHaveBeenCalledOnce();
    const [callId, callData] = dbMock.updateUser.mock.calls[0];
    expect(callId).toBe(1);
    expect(callData).toHaveProperty("passwordHash");
    expect(callData.passwordHash).not.toBe(correctHash);
    const isValid = await bcrypt.compare(
      "myNewPassword1!",
      callData.passwordHash as string,
    );
    expect(isValid).toBe(true);
  });
});

describe("user.updateNotificationPreferences", () => {
  beforeEach(() => {
    vi.mocked(db.getUserById).mockResolvedValue({
      id: 1,
      preferences: null,
      subscriptionStatus: "active",
      isSuspended: false,
    } as any);
    vi.mocked(db.updateUser).mockClear();
  });

  it("saves notification preferences to user.preferences JSON", async () => {
    const caller = appRouter.createCaller(makeContext());
    await caller.user.updateNotificationPreferences({
      emailNotifications: false,
      healthReminders: true,
      trainingReminders: false,
    });

    expect(vi.mocked(db.updateUser)).toHaveBeenCalledOnce();
    const [, callData] = vi.mocked(db.updateUser).mock.calls[0];
    const saved = JSON.parse((callData as any).preferences);
    expect(saved.notifications.emailNotifications).toBe(false);
    expect(saved.notifications.healthReminders).toBe(true);
    expect(saved.notifications.trainingReminders).toBe(false);
  });

  it("persists only an explicit marketing-analytics opt-in", async () => {
    const caller = appRouter.createCaller(makeContext());
    await caller.user.updateNotificationPreferences({
      marketingAnalyticsConsent: true,
    });

    const [, callData] = vi.mocked(db.updateUser).mock.calls[0];
    const saved = JSON.parse((callData as any).preferences);
    expect(saved.notifications.marketingAnalyticsConsent).toBe(true);
  });

  it("merges with existing preferences", async () => {
    vi.mocked(db.getUserById).mockResolvedValue({
      id: 1,
      preferences: JSON.stringify({
        notifications: { emailNotifications: true, weeklyDigest: true },
        theme: "dark",
      }),
      subscriptionStatus: "active",
      isSuspended: false,
    } as any);

    const caller = appRouter.createCaller(makeContext());
    await caller.user.updateNotificationPreferences({ weeklyDigest: false });

    const [, callData] = vi.mocked(db.updateUser).mock.calls[0];
    const saved = JSON.parse((callData as any).preferences);
    expect(saved.notifications.weeklyDigest).toBe(false);
    expect(saved.notifications.emailNotifications).toBe(true);
    expect(saved.theme).toBe("dark");
  });
});

describe("user.getNotificationPreferences", () => {
  it("returns defaults when no preferences are stored", async () => {
    vi.mocked(db.getUserById).mockResolvedValue({
      id: 1,
      preferences: null,
      subscriptionStatus: "active",
      isSuspended: false,
    } as any);

    const caller = appRouter.createCaller(makeContext());
    const prefs = await caller.user.getNotificationPreferences();
    expect(prefs.emailNotifications).toBe(true);
    expect(prefs.healthReminders).toBe(true);
    expect(prefs.weeklyDigest).toBe(true);
    expect(prefs.marketingAnalyticsConsent).toBe(false);
  });

  it("returns stored preferences when they exist", async () => {
    vi.mocked(db.getUserById).mockResolvedValue({
      id: 1,
      preferences: JSON.stringify({
        notifications: { emailNotifications: false, weeklyDigest: false },
      }),
      subscriptionStatus: "active",
      isSuspended: false,
    } as any);

    const caller = appRouter.createCaller(makeContext());
    const prefs = await caller.user.getNotificationPreferences();
    expect(prefs.emailNotifications).toBe(false);
    expect(prefs.weeklyDigest).toBe(false);
    expect(prefs.healthReminders).toBe(true);
    expect(prefs.marketingAnalyticsConsent).toBe(false);
  });
});
