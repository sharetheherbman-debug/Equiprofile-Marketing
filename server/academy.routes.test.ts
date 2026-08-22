import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const readRepoFile = (relativePath: string) =>
  fs.readFileSync(path.resolve(process.cwd(), relativePath), "utf8");

const marketingPages = [
  "client/src/pages/academy/Home.tsx",
  "client/src/pages/academy/Features.tsx",
  "client/src/pages/academy/Pricing.tsx",
  "client/src/pages/academy/About.tsx",
  "client/src/pages/academy/Contact.tsx",
];

describe("EquiProfile Academy route compatibility", () => {
  const routerSource = readRepoFile("client/academy/src/AcademyApp.tsx");

  it.each([
    "/academy",
    "/academy/features",
    "/academy/pricing",
    "/academy/about",
    "/academy/contact",
  ])("keeps canonical Academy public route %s", (route) => {
    expect(routerSource).toContain(`path=\"${route}\"`);
  });

  it.each([
    "/school",
    "/school/features",
    "/school/pricing",
    "/school/about",
    "/school/contact",
  ])("keeps LEGACY_COMPAT_ONLY School alias %s", (route) => {
    expect(routerSource).toContain(`path=\"${route}\"`);
  });

  it.each(["/", "/features", "/pricing", "/about", "/contact"])(
    "keeps historical root route %s",
    (route) => {
      expect(routerSource).toContain(`path=\"${route}\"`);
    },
  );

  it("provides Academy dashboard with LEGACY_COMPAT_ONLY school-dashboard compatibility", () => {
    expect(routerSource).toContain('path="/academy-dashboard"');
    expect(routerSource).toContain('path="/school-dashboard"');
  });
});

describe("EquiProfile Academy public branding contract", () => {
  it("uses Academy branding in navigation, footer and document metadata", () => {
    const navbar = readRepoFile(
      "client/src/components/academy/AcademyNavbar.tsx",
    );
    const footer = readRepoFile(
      "client/src/components/academy/AcademyFooter.tsx",
    );
    const html = readRepoFile("client/academy/index.html");

    expect(navbar).toContain("Academy");
    expect(footer).toContain("EquiProfile Academy");
    expect(html).toContain(
      "EquiProfile Academy — Premium Equestrian Learning Platform",
    );
  });

  it("uses Academy paths for customer-facing navigation", () => {
    const navbar = readRepoFile(
      "client/src/components/academy/AcademyNavbar.tsx",
    );
    const footer = readRepoFile(
      "client/src/components/academy/AcademyFooter.tsx",
    );

    for (const route of [
      "/academy/features",
      "/academy/pricing",
      "/academy/about",
      "/academy/contact",
    ]) {
      expect(navbar + footer).toContain(route);
    }
  });

  it.each(marketingPages)(
    "does not present the old product name in %s",
    (file) => {
      expect(readRepoFile(file)).not.toContain("EquiProfile School"); // LEGACY_COMPAT_ONLY regression sentinel
    },
  );

  it.each(marketingPages)(
    "does not claim BHS or Pony Club alignment in %s",
    (file) => {
      expect(readRepoFile(file)).not.toMatch(/\bBHS\b|Pony Club/);
    },
  );

  it.each(marketingPages)(
    "does not retain the conflicting 14-day trial copy in %s",
    (file) => {
      expect(readRepoFile(file)).not.toMatch(/14[- ]day/i);
    },
  );

  it("derives public trial copy from the shared trial constant", () => {
    const pricing = readRepoFile("client/src/pages/academy/Pricing.tsx");
    const contact = readRepoFile("client/src/pages/academy/Contact.tsx");

    expect(pricing).toContain("FREE_TRIAL_DAYS");
    expect(contact).toContain("FREE_TRIAL_DAYS");
  });
});

describe("Academy owner compatibility contract", () => {
  const ownerDashboard = readRepoFile("client/src/pages/AcademyDashboard.tsx");

  it("presents the Academy product name to Academy owners", () => {
    expect(ownerDashboard).toContain("Welcome to EquiProfile Academy");
    expect(ownerDashboard).toContain("Academy Dashboard");
    expect(ownerDashboard).toContain('"Academy Owner"');
    expect(ownerDashboard).not.toContain("Welcome to School Management"); // LEGACY_COMPAT_ONLY regression sentinel
    expect(ownerDashboard).not.toContain("School Dashboard"); // LEGACY_COMPAT_ONLY regression sentinel
  });

  it("uses canonical Academy APIs while retaining legacy compatibility", () => {
    expect(ownerDashboard).toContain("trpc.academy.createOrganization");
    expect(ownerDashboard).toContain("trpc.academy.inviteMember");
    expect(ownerDashboard).toContain('m.role === "school_owner"');
  });

  it("preserves real-world Riding School terminology as an organisation type", () => {
    expect(ownerDashboard).toContain('label: "Riding School"');
    expect(ownerDashboard).toContain('value: "riding_school"');
  });
});

describe("Academy TEST billing contract", () => {
  const academyRouter = readRepoFile("server/academyRouter.ts");
  const bootstrap = readRepoFile("server/_core/index.ts");
  const academyBilling = readRepoFile("server/academy/billing.ts");
  const migration = readRepoFile("drizzle/0030_academy_billing_test_mode.sql");

  it("uses owner-authorized server-priced TEST checkout and a billing portal", () => {
    expect(academyRouter).toContain(
      "createBillingCheckout: academyOwnerProcedure",
    );
    expect(academyRouter).toContain("academyBillingConfig(");
    expect(academyRouter).toContain("getAcademyStripe()");
    expect(academyRouter).toContain('mode: "subscription"');
    expect(academyRouter).toContain("subscription_data: { metadata }");
    expect(academyRouter).toContain(
      "createBillingPortal: academyOwnerProcedure",
    );
    expect(academyRouter).not.toContain("STORE_STRIPE_SECRET_KEY");
  });

  it("keeps Academy TEST webhook processing isolated, signed and replay-protected", () => {
    expect(bootstrap).toContain('"/api/webhooks/academy-stripe"');
    expect(bootstrap).toContain("ACADEMY_STRIPE_WEBHOOK_SECRET");
    expect(bootstrap).toContain("isAcademyScopedMetadata(metadata)");
    expect(bootstrap).toContain("academyBillingEvents");
    expect(bootstrap).toContain("cached: true");
    expect(bootstrap).toContain("stripe.webhooks.constructEvent");
    expect(migration).toContain("academyBillingEvents_provider_event_unique");
    expect(academyBilling).toContain(
      'environment.ACADEMY_STRIPE_TEST_MODE !== "true"',
    );
  });
});

describe("Academy invitation delivery contract", () => {
  const router = readRepoFile("server/academyRouter.ts");
  const email = readRepoFile("server/_core/email.ts");
  const schema = readRepoFile("drizzle/schema.ts");

  it("persists a truthful delivery state and provides a retryable owner workflow", () => {
    expect(router).toContain("sendAcademyInviteEmail");
    expect(router).toContain(
      'deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED"',
    );
    expect(router).toContain("resendInvite: academyOwnerProcedure");
    expect(router).toContain("reusedActiveInvite");
    expect(router).not.toContain("TODO: Send invite email via SMTP");
    expect(schema).toContain('deliveryStatus: varchar("deliveryStatus"');
    expect(schema).toContain('lastDeliveryError: varchar("lastDeliveryError"');
  });

  it("uses a canonical Academy invitation link and explicit SMTP failure result", () => {
    expect(email).toContain("sendAcademyInviteEmail");
    expect(email).toContain("ACADEMY_BASE_URL");
    expect(email).toContain("https://academy.equiprofile.online");
    expect(email).toContain("SMTP_NOT_CONFIGURED");
    expect(email).toContain("SMTP_SEND_FAILED");
  });

  it("does not include invitation tokens in the owner pending-invite list", () => {
    const listInvitesSection = router.slice(
      router.indexOf("listInvites: academyOwnerProcedure"),
      router.indexOf("resendInvite: academyOwnerProcedure"),
    );
    expect(listInvitesSection).not.toContain(
      "token: organizationInvites.token",
    );
  });
});

describe("Academy canonical public-domain and PWA contract", () => {
  const academyHtml = readRepoFile("client/academy/index.html");
  const academyManifest = readRepoFile("client/public/academy-manifest.json");
  const academySitemap = readRepoFile("client/public/academy-sitemap.xml");
  const robots = readRepoFile("client/public/robots.txt");

  it("uses academy.equiprofile.online for canonical, social and structured metadata", () => {
    expect(academyHtml).toContain("https://academy.equiprofile.online/academy");
    expect(academyHtml).not.toContain("https://school.equiprofile.online");
    expect(academySitemap).toContain(
      "https://academy.equiprofile.online/academy",
    );
    expect(academySitemap).not.toContain("https://school.equiprofile.online");
    expect(robots).toContain(
      "https://academy.equiprofile.online/academy-sitemap.xml",
    );
  });

  it("uses the navy Academy PWA theme instead of stale green residue", () => {
    expect(academyManifest).toContain('"theme_color": "#0f1d2e"');
    expect(academyManifest).toContain('"background_color": "#0f1d2e"');
    expect(academyHtml).toContain('name="theme-color" content="#0f1d2e"');
  });
});
