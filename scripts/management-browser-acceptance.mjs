#!/usr/bin/env node

import assert from "node:assert/strict";
import path from "node:path";
import process from "node:process";
import { createServer } from "vite";
import { chromium } from "playwright";

const port = Number(process.env.MANAGEMENT_ACCEPTANCE_PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;
process.env.VITE_SITE = "management";
process.env.VITE_UI_VERSION = "v2";
process.env.VITE_PWA_ENABLED = "false";
process.env.VITE_OAUTH_PORTAL_URL = `${baseUrl}/login`;
process.env.VITE_APP_ID = "management-acceptance";

const now = new Date();
const iso = (value) => value.toISOString();
const future = iso(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
const past = iso(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
const started = iso(new Date(now.getTime() - 24 * 60 * 60 * 1000));

function complimentary(tier, endsAt = future) {
  return { version: 1, tier, startsAt: started, endsAt };
}

const scenarios = {
  paid_pro: {
    status: "active",
    plan: "monthly",
    preferences: { planTier: "pro", bothDashboardsUnlocked: false, onboardingCompleted: true },
  },
  paid_stable: {
    status: "active",
    plan: "stable_monthly",
    preferences: { planTier: "stable", bothDashboardsUnlocked: false, onboardingCompleted: true },
  },
  complimentary_stable_over_pro: {
    status: "active",
    plan: "monthly",
    preferences: {
      planTier: "pro",
      bothDashboardsUnlocked: false,
      onboardingCompleted: true,
      complimentaryAccess: complimentary("stable"),
    },
  },
  complimentary_full_expired_paid: {
    status: "expired",
    plan: "monthly",
    preferences: {
      planTier: "pro",
      bothDashboardsUnlocked: false,
      onboardingCompleted: true,
      complimentaryAccess: complimentary("management_full", null),
    },
  },
  complimentary_full_expired_trial: {
    status: "trial",
    plan: "monthly",
    trialEndsAt: past,
    preferences: {
      planTier: "pro",
      bothDashboardsUnlocked: false,
      onboardingCompleted: true,
      complimentaryAccess: complimentary("management_full", null),
    },
  },
  expired_overlay_paid_pro: {
    status: "active",
    plan: "monthly",
    preferences: {
      planTier: "pro",
      bothDashboardsUnlocked: false,
      onboardingCompleted: true,
      complimentaryAccess: complimentary("stable", past),
    },
  },
};

let scenarioName = "paid_pro";
let signedIn = true;
const requestLog = [];

function currentScenario() {
  return scenarios[scenarioName];
}

function currentUser() {
  const scenario = currentScenario();
  return {
    id: 1,
    openId: `acceptance-${scenarioName}`,
    name: "Alex Morgan",
    email: "owner@example.test",
    role: "user",
    isActive: true,
    isSuspended: false,
    subscriptionStatus: scenario.status,
    subscriptionPlan: scenario.plan,
    subscriptionEndsAt: scenario.status === "active" ? future : past,
    trialEndsAt: scenario.trialEndsAt ?? null,
    lastPaymentAt: scenario.status === "active" ? iso(now) : past,
    profileImageUrl: null,
    phone: "+44 7700 900000",
    location: "Yorkshire, UK",
    preferences: JSON.stringify(scenario.preferences),
    createdAt: past,
    updatedAt: iso(now),
  };
}

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
  createdAt: past,
  updatedAt: iso(now),
};

const stable = {
  id: 1,
  ownerId: 1,
  name: "Willowbrook Stables",
  description: "A calm home for horses and their people.",
  location: "Yorkshire, UK",
  maxHorses: 30,
  maxStaff: 8,
  createdAt: past,
  updatedAt: iso(now),
};

function rawPlanTier() {
  return currentScenario().preferences.planTier === "stable" ? "stable" : "pro";
}

function mockProcedure(name) {
  const user = currentUser();
  const scenario = currentScenario();
  if (name === "auth.me") return signedIn ? user : null;
  if (name === "auth.logout") {
    signedIn = false;
    return { success: true };
  }

  const values = {
    "adminUnlock.getStatus": { isUnlocked: false, isLockedOut: false, remainingAttempts: 5 },
    "user.getSubscriptionStatus": {
      status: scenario.status,
      plan: scenario.plan,
      planTier: rawPlanTier(),
      freeAccess: false,
      bothDashboardsUnlocked: Boolean(scenario.preferences.bothDashboardsUnlocked),
      trialEndsAt: scenario.trialEndsAt ?? null,
      subscriptionEndsAt: user.subscriptionEndsAt,
      lastPaymentAt: user.lastPaymentAt,
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
      marketingAnalyticsConsent: false,
      whatsappPhone: null,
    },
    "horses.list": [horse],
    "horses.get": horse,
    "stables.list": [stable],
    "billing.getStatus": {
      status: scenario.status,
      plan: scenario.plan,
      planTier: rawPlanTier(),
      trialEndsAt: scenario.trialEndsAt ?? null,
      subscriptionEndsAt: user.subscriptionEndsAt,
      lastPaymentAt: user.lastPaymentAt,
      hasActiveSubscription: scenario.status === "active",
    },
    "billing.getPricing": {
      enabled: true,
      trial: { name: "Trial", features: ["7-day free trial"] },
      pro: { name: "Pro", monthly: { amount: 1499 }, yearly: { amount: 14990 }, features: ["Complete horse management"] },
      stable: { name: "Stable", monthly: { amount: 3999 }, yearly: { amount: 39990 }, features: ["Stable management"] },
    },
    "school.getMyOrganization": null,
    "academy.getMyOrganization": null,
    "weather.getCurrent": null,
    "weather.getForecast": [],
    "weather.getHourly": [],
    "analytics.getTrainingStats": { totalSessions: 0, completedSessions: 0, totalDuration: 0, averageDuration: 0, byType: [] },
    "analytics.getHealthStats": { totalRecords: 0, upcomingReminders: 0, byType: [] },
  };
  if (Object.prototype.hasOwnProperty.call(values, name)) return values[name];

  const procedure = name.split(".").at(-1) || "";
  if (
    procedure.startsWith("list") ||
    ["getEvents", "getReminders", "getUpcoming", "getThreads", "getMessages", "getInvites", "getMembers", "getHealthAlerts", "getHorseTimeline"].includes(procedure)
  ) return [];
  if (/\.(create|update|delete|complete|revoke|attachToHorse|detachFromHorse|logout)$/.test(name)) {
    return { success: true, id: 1 };
  }
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
      const url = new URL(req.url || "/", baseUrl);
      if (url.pathname === "/__acceptance__/requests") {
        sendJson(res, 200, requestLog);
        return;
      }
      if (url.pathname === "/__acceptance__/scenario") {
        const requested = url.searchParams.get("name") || "";
        if (!Object.prototype.hasOwnProperty.call(scenarios, requested)) {
          sendJson(res, 400, { error: `unknown scenario: ${requested}` });
          return;
        }
        scenarioName = requested;
        signedIn = true;
        requestLog.length = 0;
        sendJson(res, 200, { success: true, scenario: scenarioName });
        return;
      }
      if (url.pathname === "/api/v1/admin/marketing/status" || url.pathname === "/api/v1/admin/marketing/sso") {
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
      requestLog.push({ method: req.method, path: url.pathname, procedures: names, status: 200, scenario: scenarioName });
      sendJson(res, 200, url.searchParams.get("batch") === "1" ? payload : payload[0]);
    });
  },
};

const server = await createServer({
  configFile: path.resolve("vite.config.ts"),
  plugins: [acceptanceApi],
  server: { host: "127.0.0.1", port, strictPort: true },
});

let browser;
let failures = 0;
let passes = 0;

function report(ok, name, detail = "") {
  if (ok) {
    passes += 1;
    console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures += 1;
    console.error(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function selectScenario(name) {
  const response = await fetch(`${baseUrl}/__acceptance__/scenario?name=${encodeURIComponent(name)}`);
  assert.equal(response.ok, true, `failed to select scenario ${name}`);
}

async function withPage({ scenario, path: route, viewport = { width: 1440, height: 900 } }, checks) {
  await selectScenario(scenario);
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    assert(response && response.ok(), `${route} did not return HTTP success`);
    await page.waitForTimeout(1000);
    await checks(page);
    assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join(" | ")}`);
  } finally {
    await context.close();
  }
}

async function visible(page, text) {
  return page.getByText(text, { exact: true }).filter({ visible: true }).count().catch(() => 0);
}

async function expectVisible(page, text) {
  await page.getByText(text, { exact: true }).first().waitFor({ state: "visible", timeout: 15000 });
}

async function runCase(name, fn) {
  try {
    await fn();
    report(true, name);
  } catch (error) {
    report(false, name, error instanceof Error ? error.message : String(error));
  }
}

try {
  await server.listen();
  browser = await chromium.launch({ headless: true });
  console.log(`Management browser acceptance — ${baseUrl}`);

  await runCase("Paid Pro stays on standard Management navigation", async () => {
    await withPage({ scenario: "paid_pro", path: "/dashboard" }, async (page) => {
      await expectVisible(page, "Dashboard");
      assert.equal(await visible(page, "Stable Dashboard"), 0);
      assert(!page.url().includes("/billing"));
    });
  });

  await runCase("Paid Stable reaches Stable dashboard", async () => {
    await withPage({ scenario: "paid_stable", path: "/stable-dashboard", viewport: { width: 1180, height: 820 } }, async (page) => {
      await expectVisible(page, "Stable Dashboard");
      assert(page.url().endsWith("/stable-dashboard"));
    });
  });

  await runCase("Complimentary Stable over paid Pro reaches Stable-only routes", async () => {
    await withPage({ scenario: "complimentary_stable_over_pro", path: "/stable-dashboard" }, async (page) => {
      await expectVisible(page, "Stable Dashboard");
      assert(page.url().endsWith("/stable-dashboard"));
      assert.equal(await visible(page, "Your subscription needs attention"), 0);
    });
  });

  await runCase("Full complimentary Management bypasses underlying expired paywall and exposes both dashboards", async () => {
    await withPage({ scenario: "complimentary_full_expired_paid", path: "/dashboard" }, async (page) => {
      assert.equal(await visible(page, "Your subscription needs attention"), 0);
      await expectVisible(page, "Standard");
      await expectVisible(page, "Stable");
    });
  });

  await runCase("Full complimentary Management suppresses expired-trial warning", async () => {
    await withPage({ scenario: "complimentary_full_expired_trial", path: "/dashboard" }, async (page) => {
      assert.equal(await visible(page, "Your free trial has ended"), 0);
      await expectVisible(page, "Standard");
      await expectVisible(page, "Stable");
    });
  });

  await runCase("Expired complimentary overlay falls back to active paid Pro", async () => {
    await withPage({ scenario: "expired_overlay_paid_pro", path: "/dashboard" }, async (page) => {
      await expectVisible(page, "Dashboard");
      assert.equal(await visible(page, "Stable Dashboard"), 0);
      assert.equal(await visible(page, "Your subscription needs attention"), 0);
    });
  });

  await runCase("Settings renders responsively at 390px without horizontal overflow", async () => {
    await withPage({ scenario: "paid_pro", path: "/settings", viewport: { width: 390, height: 844 } }, async (page) => {
      await expectVisible(page, "Settings");
      for (const label of ["Profile", "Security", "Notifs", "App", "Help"]) {
        await expectVisible(page, label);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert(overflow <= 1, `horizontal overflow is ${overflow}px`);
    });
  });

  await runCase("Billing renders current subscription surface on tablet", async () => {
    await withPage({ scenario: "paid_stable", path: "/billing", viewport: { width: 820, height: 1180 } }, async (page) => {
      await expectVisible(page, "Billing & Subscription");
      await expectVisible(page, "Current Plan");
      assert(page.url().endsWith("/billing"));
    });
  });
} finally {
  if (browser) await browser.close();
  await server.close();
}

console.log(`Management acceptance: ${passes} passed / ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
