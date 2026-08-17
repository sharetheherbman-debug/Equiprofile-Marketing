#!/usr/bin/env node

import { createServer } from "vite";
import path from "node:path";
import process from "node:process";

const port = Number(process.env.MANAGEMENT_ACCEPTANCE_PORT || 4173);
process.env.VITE_SITE = "management";
process.env.VITE_UI_VERSION = "v2";
process.env.VITE_PWA_ENABLED = "false";
process.env.VITE_OAUTH_PORTAL_URL = `http://127.0.0.1:${port}/login`;
process.env.VITE_APP_ID = "management-acceptance";

const now = new Date().toISOString();
const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
const user = {
  id: 1,
  openId: "acceptance-owner",
  name: "Alex Morgan",
  email: "owner@example.test",
  role: "admin",
  isActive: true,
  isSuspended: false,
  subscriptionStatus: "active",
  subscriptionPlan: "stable_monthly",
  subscriptionEndsAt: future,
  trialEndsAt: null,
  lastPaymentAt: now,
  profileImageUrl: null,
  phone: "+44 7700 900000",
  location: "Yorkshire, UK",
  preferences: JSON.stringify({
    planTier: "stable",
    bothDashboardsUnlocked: true,
    onboardingCompleted: true,
  }),
  createdAt: now,
  updatedAt: now,
};
const horse = {
  id: 1,
  userId: 1,
  name: "Willow",
  breed: "Irish Sport Horse",
  age: 9,
  gender: "Mare",
  color: "Bay",
  height: "16.1",
  weight: 540,
  microchipNumber: "TEST-10001",
  passportNumber: "EP-TEST-001",
  stableLocation: "North Barn",
  isActive: true,
  profileImageUrl: null,
  notes: "Acceptance-test horse",
  createdAt: now,
  updatedAt: now,
};
const stable = {
  id: 1,
  ownerId: 1,
  name: "Willowbrook Stables",
  description: "A calm home for horses and their people.",
  location: "Yorkshire, UK",
  maxHorses: 30,
  maxStaff: 8,
  createdAt: now,
  updatedAt: now,
};

let signedIn = true;
const requestLog = [];

function mockProcedure(name) {
  if (name === "auth.me") return signedIn ? user : null;
  if (name === "auth.logout") {
    signedIn = false;
    return { success: true };
  }
  const values = {
    "adminUnlock.getStatus": { isUnlocked: true, isLockedOut: false, remainingAttempts: 5 },
    "user.getSubscriptionStatus": {
      status: "active",
      plan: "stable_monthly",
      planTier: "stable",
      freeAccess: false,
      bothDashboardsUnlocked: true,
      trialEndsAt: null,
      subscriptionEndsAt: future,
      lastPaymentAt: now,
    },
    "user.getDashboardStats": { horseCount: 1, upcomingSessionCount: 0, reminderCount: 0, latestWeather: null },
    "user.getNotificationPreferences": {
      emailNotifications: true,
      healthReminders: true,
      trainingReminders: true,
      feedingReminders: true,
      weatherAlerts: true,
      weeklyDigest: true,
      trainingCalendarIntegration: false,
      whatsappPhone: null,
    },
    "horses.list": [horse],
    "horses.get": horse,
    "stables.list": [stable],
    "billing.getStatus": {
      status: "active",
      plan: "stable_monthly",
      planTier: "stable",
      trialEndsAt: null,
      subscriptionEndsAt: future,
      lastPaymentAt: now,
      hasActiveSubscription: true,
    },
    "billing.getPricing": {
      pro: { name: "Pro", monthly: { amount: 1499 }, yearly: { amount: 14990 } },
      stable: { name: "Stable", monthly: { amount: 3999 }, yearly: { amount: 39990 } },
    },
    "school.getMyOrganization": null,
    "weather.getCurrent": null,
    "weather.getForecast": [],
    "weather.getHourly": [],
    "analytics.getTrainingStats": { totalSessions: 0, completedSessions: 0, totalDuration: 0, averageDuration: 0, byType: [] },
    "analytics.getHealthStats": { totalRecords: 0, upcomingReminders: 0, byType: [] },
    "admin.getStats": {
      users: { totalUsers: 1, activeUsers: 1, paidUsers: 1, trialUsers: 0, overdueUsers: 0, suspendedUsers: 0 },
      horses: { totalHorses: 1, activeHorses: 1 },
      healthRecords: { totalRecords: 0 },
      trainingSessions: { totalSessions: 0, completedSessions: 0 },
    },
    "admin.getUserSegmentation": { paidUsers: 1, freeAccessUsers: 0, trialUsers: 0, overdueUsers: 0, deletedUsers: 0, leads: 0, cancelledUsers: 0, expiredUsers: 0, recentSignups: 1, totalReal: 1 },
    "admin.getUsers": [user],
    "admin.getDeletedUsers": [],
    "admin.getOverdueUsers": [],
    "admin.getActivityLogs": [],
    "admin.getLeads": [],
    "admin.getChurnRisk": [],
  };
  if (Object.prototype.hasOwnProperty.call(values, name)) return values[name];
  const procedure = name.split(".").at(-1) || "";
  if (procedure.startsWith("list") || ["getEvents", "getReminders", "getUpcoming", "getThreads", "getMessages", "getInvites", "getMembers", "getHealthAlerts", "getHorseTimeline"].includes(procedure)) return [];
  if (/\.(create|update|delete|complete|revoke|attachToHorse|detachFromHorse|logout)$/.test(name)) return { success: true, id: 1 };
  return null;
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(json);
}

const acceptanceApi = {
  name: "equiprofile-management-acceptance-api",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
      if (url.pathname === "/__acceptance__/requests") {
        sendJson(res, 200, requestLog);
        return;
      }
      if (url.pathname === "/__acceptance__/reset") {
        signedIn = true;
        requestLog.length = 0;
        sendJson(res, 200, { success: true });
        return;
      }
      if (url.pathname === "/api/v1/admin/marketing/status") {
        requestLog.push({ method: req.method, path: url.pathname, status: 503 });
        sendJson(res, 503, { error: "unavailable" });
        return;
      }
      if (url.pathname === "/api/v1/admin/marketing/sso") {
        requestLog.push({ method: req.method, path: url.pathname, status: 503 });
        sendJson(res, 503, { error: "unavailable" });
        return;
      }
      if (!url.pathname.startsWith("/api/trpc/")) {
        next();
        return;
      }
      const names = decodeURIComponent(url.pathname.slice("/api/trpc/".length)).split(",");
      const payload = names.map((name) => ({ result: { data: { json: mockProcedure(name) } } }));
      requestLog.push({ method: req.method, path: url.pathname, procedures: names, status: 200 });
      sendJson(res, 200, url.searchParams.get("batch") === "1" ? payload : payload[0]);
    });
  },
};

const server = await createServer({
  configFile: path.resolve("vite.config.ts"),
  plugins: [acceptanceApi],
  server: { host: "127.0.0.1", port, strictPort: true },
});

await server.listen();
console.log(`Management acceptance server: http://127.0.0.1:${port}`);
