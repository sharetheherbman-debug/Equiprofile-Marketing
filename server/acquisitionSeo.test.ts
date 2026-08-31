import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildMeasurementBootstrap,
  getPublicOrigins,
  injectSeoHtml,
  resolveCanonicalRedirect,
  resolveSeo,
  robotsText,
  sitemapXml,
  validGtmContainerId,
} from "./_core/acquisitionSeo";

const shell = `<!doctype html><html><head>
  <title>Generic shell</title>
  <meta name="description" content="generic">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://temporary.invalid/">
  <script type="application/ld+json">{"@type":"Placeholder"}</script>
</head><body><div id="root"></div></body></html>`;

const env = {
  PUBLIC_SITE_URL: "https://www.equiprofile.example",
  ACADEMY_PUBLIC_ORIGIN: "https://learn.equiprofile.example",
  SHOP_PUBLIC_ORIGIN: "https://store.equiprofile.example",
} as NodeJS.ProcessEnv;

describe("acquisition crawler metadata", () => {
  it("renders unique meaningful public metadata into initial HTTP HTML", () => {
    const home = injectSeoHtml(shell, "management", "/", env);
    const features = injectSeoHtml(shell, "management", "/features", env);
    expect(home.resolution.status).toBe(200);
    expect(home.html).toContain(
      "<title>EquiProfile — Professional Horse Management Platform</title>",
    );
    expect(features.html).toContain(
      "<title>Horse Management Features | EquiProfile</title>",
    );
    expect(features.html).toContain('name="description"');
    expect(features.html).toContain('property="og:title"');
    expect(features.html).toContain('name="twitter:card"');
    expect(features.html).toContain(
      'href="https://www.equiprofile.example/features"',
    );
  });

  it("keeps tracking parameters out of canonical URLs", () => {
    const rendered = injectSeoHtml(
      shell,
      "management",
      "/pricing?utm_source=newsletter&gclid=tracking-value",
      env,
    );
    expect(rendered.html).toContain(
      'href="https://www.equiprofile.example/pricing"',
    );
    expect(rendered.html).not.toContain("utm_source");
    expect(rendered.html).not.toContain("gclid=tracking-value");
  });

  it("marks private and unknown routes noindex without leaking route data", () => {
    const privatePage = injectSeoHtml(
      `${shell}<p>Private horse name: Secretariat</p>`,
      "management",
      "/horses/42?horseName=Secretariat",
      env,
    );
    const unknown = resolveSeo("management", "/not-a-real-public-route");
    expect(privatePage.resolution).toMatchObject({
      status: 200,
      robots: "noindex, nofollow, noarchive",
    });
    const head = privatePage.html.split("</head>")[0];
    expect(head).not.toContain("Secretariat");
    expect(head).not.toContain("horseName");
    expect(unknown).toMatchObject({
      status: 404,
      robots: "noindex, nofollow, noarchive",
    });
  });

  it("emits parseable supported structured data only on indexable pages", () => {
    const publicPage = injectSeoHtml(
      shell,
      "academy",
      "/academy/features",
      env,
    );
    const blocks = Array.from(
      publicPage.html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ).map((match) => JSON.parse(match[1]));
    expect(blocks.map((block) => block["@type"])).toEqual(
      expect.arrayContaining(["Organization", "WebSite", "BreadcrumbList"]),
    );
    expect(blocks.map((block) => block["@type"])).not.toContain(
      "AggregateRating",
    );
    expect(
      injectSeoHtml(shell, "academy", "/student-dashboard", env).html,
    ).not.toContain('type="application/ld+json"');
  });

  it("publishes canonical public-only robots and sitemaps", () => {
    const origins = getPublicOrigins(env);
    const managementRobots = robotsText("management", origins);
    const managementSitemap = sitemapXml("management", origins);
    const academySitemap = sitemapXml("academy", origins);
    expect(managementRobots).toContain(
      "Sitemap: https://www.equiprofile.example/sitemap.xml",
    );
    expect(managementRobots).toContain("Disallow: /horses");
    expect(managementSitemap).toContain(
      "https://www.equiprofile.example/features",
    );
    expect(academySitemap).toContain(
      "https://learn.equiprofile.example/academy",
    );
    for (const xml of [managementSitemap, academySitemap]) {
      expect(xml).not.toMatch(
        /dashboard|\/api\/|\/horses|\/health|\/tasks|\/calendar|\/messages|\/school/i,
      );
    }
  });

  it("preserves School-to-Academy permanent redirect targets without duplicate indexing", () => {
    const origins = getPublicOrigins(env);
    expect(
      resolveCanonicalRedirect("academy", "/school/features", origins),
    ).toBe("https://learn.equiprofile.example/academy/features");
    expect(
      resolveCanonicalRedirect("management", "/for-schools", origins),
    ).toBe("https://learn.equiprofile.example/academy");
  });
});

describe("Google configuration bootstrap", () => {
  it("emits no Google request or placeholder when GTM is absent or invalid", () => {
    expect(buildMeasurementBootstrap()).not.toContain("googletagmanager.com");
    expect(buildMeasurementBootstrap("GTM-PLACEHOLDER!")).not.toContain(
      "googletagmanager.com",
    );
    expect(validGtmContainerId("GTM-ABC123")).toBe("GTM-ABC123");
  });

  it("establishes all Consent Mode v2 defaults before GTM measurement", () => {
    const html = buildMeasurementBootstrap("GTM-ABC123");
    const consentIndex = html.indexOf("'consent','default'");
    const measurementIndex = html.indexOf("'gtm.start'");
    expect(consentIndex).toBeGreaterThanOrEqual(0);
    expect(measurementIndex).toBeGreaterThan(consentIndex);
    for (const field of [
      "analytics_storage",
      "ad_storage",
      "ad_user_data",
      "ad_personalization",
    ]) {
      expect(html).toContain(`${field}:'denied'`);
    }
    expect(html).toContain(
      "https://www.googletagmanager.com/gtm.js?id=GTM-ABC123",
    );
  });

  it("emits Search Console verification only from valid configuration", () => {
    const absent = injectSeoHtml(shell, "management", "/", env).html;
    const configured = injectSeoHtml(shell, "management", "/", {
      ...env,
      GOOGLE_SITE_VERIFICATION: "google-verification_token-123",
    }).html;
    expect(absent).not.toContain("google-site-verification");
    expect(configured).toContain(
      'name="google-site-verification" content="google-verification_token-123"',
    );
  });
});

describe("Academy curriculum release safety", () => {
  it("keeps learner requests read-only and requires an explicit version-confirmed bootstrap", () => {
    const pipeline = fs.readFileSync(
      path.resolve(process.cwd(), "server/academy/curriculumPipeline.ts"),
      "utf8",
    );
    const bootstrap = fs.readFileSync(
      path.resolve(process.cwd(), "scripts/bootstrap-academy-curriculum.ts"),
      "utf8",
    );
    const ensureBody = pipeline.slice(
      pipeline.indexOf("export async function ensureAcademyCurriculum"),
    );

    expect(ensureBody).toContain("inspectAcademyCurriculumReadiness()");
    expect(ensureBody).not.toContain("syncAcademyCurriculum(");
    expect(bootstrap).toContain('argumentsSet.has("--apply")');
    expect(bootstrap).toContain('startsWith("--confirm-version=")');
    expect(bootstrap).toContain('argumentsSet.has("--update-source-managed")');
    expect(bootstrap).toContain("syncAcademyCurriculum(mode)");
  });
});

describe("launch-critical routing boundaries", () => {
  it("keeps the Management dashboard behind the established authenticated route", () => {
    const managementApp = fs.readFileSync(
      path.resolve(process.cwd(), "client/management/src/ManagementApp.tsx"),
      "utf8",
    );
    const dashboardRoute = managementApp.slice(
      managementApp.indexOf('<Route path="/dashboard">'),
      managementApp.indexOf('<Route path="/horses">'),
    );

    expect(dashboardRoute).toContain("<ProtectedRoute>");
    expect(dashboardRoute).toContain("<ResolvedDashboard />");
  });

  it("keeps the owner-only Marketing launcher and signed standalone SSO route intact", () => {
    const connector = fs.readFileSync(
      path.resolve(process.cwd(), "server/marketingConnector.ts"),
      "utf8",
    );
    const api = fs.readFileSync(
      path.resolve(process.cwd(), "server/api.ts"),
      "utf8",
    );
    const launcher = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "client/src/components/admin/MarketingConnectionCard.tsx",
      ),
      "utf8",
    );

    expect(api).toContain("registerMarketingConnectorRoutes(apiRouter)");
    expect(connector).toContain('router.post("/admin/marketing/sso"');
    expect(connector).toContain('context.user.role !== "admin"');
    expect(connector).toContain("signedInEmail !== ownerEmail");
    expect(connector).toContain('"X-Application-Signature"');
    expect(connector).toContain('"/application-connectors/sso/issue"');
    expect(connector).toContain(
      "redirect.origin !== new URL(config().appUrl).origin",
    );
    expect(launcher).toContain('fetch("/api/v1/admin/marketing/sso"');
  });
});
