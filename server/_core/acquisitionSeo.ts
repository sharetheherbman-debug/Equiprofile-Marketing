import type { Request, Response } from "express";

export type PublicSiteMode = "management" | "academy" | "shop" | "school";

type SeoEntry = {
  title: string;
  description: string;
  canonicalPath: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
};

export type PublicOrigins = {
  management: string;
  academy: string;
  shop: string;
};

export type SeoResolution = {
  status: 200 | 404;
  robots: "index, follow" | "noindex, nofollow, noarchive";
  entry: SeoEntry;
};

const MANAGEMENT_PUBLIC_ROUTES: Record<string, SeoEntry> = {
  "/": {
    title: "EquiProfile — Professional Horse Management Platform",
    description:
      "Manage horse records, care schedules, training, stable operations and reporting in one secure EquiProfile workspace.",
    canonicalPath: "/",
  },
  "/features": {
    title: "Horse Management Features | EquiProfile",
    description:
      "Explore EquiProfile tools for horse records, health schedules, training, stable tasks, calendars, documents and reporting.",
    canonicalPath: "/features",
  },
  "/pricing": {
    title: "EquiProfile Plans and Pricing",
    description:
      "Compare the published EquiProfile plans for individual horse owners and professional stable teams.",
    canonicalPath: "/pricing",
  },
  "/about": {
    title: "About EquiProfile",
    description:
      "Learn why EquiProfile brings horse care records, training and stable operations into one connected platform.",
    canonicalPath: "/about",
  },
  "/contact": {
    title: "Contact EquiProfile",
    description:
      "Contact the EquiProfile team with product and account questions.",
    canonicalPath: "/contact",
  },
  "/for-stables": {
    title: "Stable Management Software | EquiProfile",
    description:
      "Coordinate horses, staff, care schedules, tasks, calendars and stable reporting with EquiProfile Management.",
    canonicalPath: "/for-stables",
  },
  "/for-academies": {
    title: "Equestrian Academy Management | EquiProfile",
    description:
      "Connect EquiProfile Management with structured equestrian learning, student progress and authorised teaching workflows.",
    canonicalPath: "/for-academies",
  },
  "/ai-operations": {
    title: "Governed AI Assistance for Horse Management | EquiProfile",
    description:
      "See how EquiProfile assists with approved Management tasks while keeping user confirmation and access controls in place.",
    canonicalPath: "/ai-operations",
  },
  "/terms": {
    title: "Terms of Service | EquiProfile",
    description: "Read the terms that govern use of the EquiProfile platform.",
    canonicalPath: "/terms",
  },
  "/privacy": {
    title: "Privacy Policy | EquiProfile",
    description:
      "Read how EquiProfile handles account, operational and optional measurement data.",
    canonicalPath: "/privacy",
  },
};

const ACADEMY_PUBLIC_ROUTES: Record<string, SeoEntry> = {
  "/academy": {
    title: "EquiProfile Academy — Structured Equestrian Learning",
    description:
      "Explore structured equestrian lessons, progressive pathways, student progress tools and authorised Academy workflows.",
    canonicalPath: "/academy",
  },
  "/academy/features": {
    title: "Equestrian Learning Features | EquiProfile Academy",
    description:
      "Explore reviewed lessons, progressive pathways, assessments, student progress, teaching tools and Academy administration.",
    canonicalPath: "/academy/features",
  },
  "/academy/pricing": {
    title: "Academy Plans and Pricing | EquiProfile",
    description:
      "Review the published EquiProfile Academy plans for learners, teachers and equestrian organisations.",
    canonicalPath: "/academy/pricing",
  },
  "/academy/about": {
    title: "About EquiProfile Academy",
    description:
      "Learn about EquiProfile Academy's structured approach to equestrian learning, progress and authorised teaching workflows.",
    canonicalPath: "/academy/about",
  },
  "/academy/contact": {
    title: "Contact EquiProfile Academy",
    description:
      "Discuss your equestrian organisation's learning and administration needs with the EquiProfile Academy team.",
    canonicalPath: "/academy/contact",
  },
  "/terms": {
    title: "Academy Terms of Service | EquiProfile",
    description: "Read the terms that govern use of EquiProfile Academy.",
    canonicalPath: "/terms",
  },
  "/privacy": {
    title: "Academy Privacy Policy | EquiProfile",
    description:
      "Read how EquiProfile handles Academy account, learning and optional measurement data.",
    canonicalPath: "/privacy",
  },
};

const KNOWN_PRIVATE_PREFIXES = new Set([
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "verify-email",
  "unsubscribe",
  "onboarding",
  "dashboard",
  "horses",
  "health",
  "vaccinations",
  "dental",
  "hoofcare",
  "dewormings",
  "treatments",
  "xrays",
  "pedigree",
  "training",
  "training-templates",
  "breeding",
  "lessons",
  "feeding",
  "nutrition-plans",
  "nutrition-logs",
  "weather",
  "feed-costs",
  "ride-tracking",
  "equine-passport",
  "competitions",
  "documents",
  "tasks",
  "contacts",
  "stable",
  "stable-dashboard",
  "staff",
  "stable-setup",
  "stable-reports",
  "messages",
  "analytics",
  "reports",
  "calendar",
  "appointments",
  "tags",
  "settings",
  "billing",
  "ai-chat",
  "client-portal",
  "admin",
  "qa-check",
  "passport",
  "stable-invite",
  "academy-invite",
  "student-dashboard",
  "teacher-dashboard",
  "academy-dashboard",
  "school-dashboard",
  "404",
]);

const TRACKING_PARAMETER =
  /^(utm_(source|medium|campaign|content|term)|gclid|gbraid|wbraid)$/i;
const GTM_CONTAINER = /^GTM-[A-Z0-9]+$/;
const GOOGLE_VERIFICATION = /^[A-Za-z0-9_-]{6,200}$/;

function normalizeOrigin(value: string): string {
  const parsed = new URL(value);
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error("Public site origins must use HTTP or HTTPS");
  }
  parsed.pathname = "/";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}

function deriveSubdomain(origin: string, subdomain: "academy" | "shop") {
  const parsed = new URL(origin);
  const hostname = parsed.hostname.replace(/^www\./i, "");
  parsed.hostname = `${subdomain}.${hostname}`;
  return normalizeOrigin(parsed.toString());
}

function configuredOrigin(value: string | undefined): string | null {
  const candidate = String(value || "").trim();
  if (!/^https?:\/\//i.test(candidate)) return null;
  return normalizeOrigin(candidate);
}

export function getPublicOrigins(
  env: NodeJS.ProcessEnv = process.env,
): PublicOrigins {
  const management =
    configuredOrigin(env.PUBLIC_SITE_URL) ||
    configuredOrigin(env.BASE_URL) ||
    "https://equiprofile.online";
  return {
    management,
    academy:
      configuredOrigin(env.ACADEMY_PUBLIC_ORIGIN) ||
      deriveSubdomain(management, "academy"),
    shop:
      configuredOrigin(env.SHOP_PUBLIC_ORIGIN) ||
      deriveSubdomain(management, "shop"),
  };
}

export function normalizePath(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0] || "/";
  if (clean === "/") return clean;
  return clean.replace(/\/+$/, "") || "/";
}

function isKnownPrivateRoute(pathname: string): boolean {
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  return KNOWN_PRIVATE_PREFIXES.has(firstSegment);
}

function privateEntry(site: Exclude<PublicSiteMode, "school">): SeoEntry {
  const product =
    site === "academy"
      ? "EquiProfile Academy"
      : site === "shop"
        ? "EquiProfile Store"
        : "EquiProfile Management";
  return {
    title: `${product} — Secure Application`,
    description: `Sign in to access the private ${product} application.`,
    canonicalPath: "/",
  };
}

export function resolveSeo(
  site: Exclude<PublicSiteMode, "school">,
  pathname: string,
): SeoResolution {
  const path = normalizePath(pathname);
  const publicRoutes =
    site === "management"
      ? MANAGEMENT_PUBLIC_ROUTES
      : site === "academy"
        ? ACADEMY_PUBLIC_ROUTES
        : {};
  const publicEntry = publicRoutes[path];
  if (publicEntry) {
    return { status: 200, robots: "index, follow", entry: publicEntry };
  }
  if (site === "shop" && path === "/") {
    return {
      status: 200,
      robots: "noindex, nofollow, noarchive",
      entry: {
        title: "EquiProfile Equestrian Store",
        description:
          "The EquiProfile Store is preserved while its public launch remains deferred.",
        canonicalPath: "/",
      },
    };
  }
  if (isKnownPrivateRoute(path)) {
    return {
      status: 200,
      robots: "noindex, nofollow, noarchive",
      entry: privateEntry(site),
    };
  }
  return {
    status: 404,
    robots: "noindex, nofollow, noarchive",
    entry: {
      title: "Page Not Found | EquiProfile",
      description: "The requested EquiProfile page could not be found.",
      canonicalPath: path,
    },
  };
}

export function resolveCanonicalRedirect(
  site: PublicSiteMode,
  pathname: string,
  origins: PublicOrigins,
): string | null {
  const path = normalizePath(pathname);
  if (site === "management" && path === "/for-schools") {
    return `${origins.academy}/academy`;
  }
  if (site !== "academy") return null;

  const aliases: Record<string, string> = {
    "/": "/academy",
    "/features": "/academy/features",
    "/pricing": "/academy/pricing",
    "/about": "/academy/about",
    "/contact": "/academy/contact",
    "/school": "/academy",
    "/school/features": "/academy/features",
    "/school/pricing": "/academy/pricing",
    "/school/about": "/academy/about",
    "/school/contact": "/academy/contact",
  };
  const canonicalPath = aliases[path];
  return canonicalPath ? `${origins.academy}${canonicalPath}` : null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function structuredData(
  site: Exclude<PublicSiteMode, "school">,
  entry: SeoEntry,
  canonical: string,
  origins: PublicOrigins,
): unknown[] {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EquiProfile",
    url: origins.management,
    logo: `${origins.management}/images/logo.png`,
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site === "academy" ? "EquiProfile Academy" : "EquiProfile",
    url: site === "academy" ? origins.academy : origins.management,
  };
  const crumbs = [
    { name: "Home", path: site === "academy" ? "/academy" : "/" },
    ...(entry.breadcrumbs ??
      (entry.canonicalPath === "/" || entry.canonicalPath === "/academy"
        ? []
        : [
            {
              name: entry.title.split("|")[0].trim(),
              path: entry.canonicalPath,
            },
          ])),
  ];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site === "academy" ? origins.academy : origins.management}${crumb.path}`,
    })),
  };
  return [
    organization,
    website,
    ...(crumbs.length > 1 ? [breadcrumb] : []),
  ].map((item) => ({
    ...item,
    ...(item === website ? { mainEntityOfPage: canonical } : {}),
  }));
}

export function validGtmContainerId(value: string | undefined): string | null {
  const candidate = String(value || "")
    .trim()
    .toUpperCase();
  return GTM_CONTAINER.test(candidate) ? candidate : null;
}

export function buildMeasurementBootstrap(gtmContainerId?: string): string {
  const containerId = validGtmContainerId(gtmContainerId);
  const gtmStart = containerId
    ? `window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`
    : "";
  const external = containerId
    ? `<script id="equiprofile-gtm" async src="https://www.googletagmanager.com/gtm.js?id=${containerId}"></script>`
    : "";
  return `<script id="equiprofile-consent-default">(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});try{var c=localStorage.getItem('equiprofile_cookie_consent');if(c==='accepted'){window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}window.__EQUIPROFILE_MEASUREMENT_BOOTSTRAPPED__=true;${gtmStart}})();</script>${external}`;
}

export function injectSeoHtml(
  html: string,
  site: Exclude<PublicSiteMode, "school">,
  pathname: string,
  env: NodeJS.ProcessEnv = process.env,
): { html: string; resolution: SeoResolution } {
  const origins = getPublicOrigins(env);
  const resolution = resolveSeo(site, pathname);
  const origin = origins[site];
  const canonical = `${origin}${resolution.entry.canonicalPath}`;
  const image = `${origin}/images/hero/image1.jpg`;
  const verification = String(env.GOOGLE_SITE_VERIFICATION || "").trim();
  const verificationTag = GOOGLE_VERIFICATION.test(verification)
    ? `<meta name="google-site-verification" content="${escapeHtml(verification)}" />`
    : "";
  const jsonLd =
    resolution.robots === "index, follow"
      ? structuredData(site, resolution.entry, canonical, origins)
          .map(
            (value) =>
              `<script type="application/ld+json">${safeJson(value)}</script>`,
          )
          .join("\n")
      : "";
  const metadata = `
    <title>${escapeHtml(resolution.entry.title)}</title>
    <meta name="description" content="${escapeHtml(resolution.entry.description)}" />
    <meta name="robots" content="${resolution.robots}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="EquiProfile" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(resolution.entry.title)}" />
    <meta property="og:description" content="${escapeHtml(resolution.entry.description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(canonical)}" />
    <meta name="twitter:title" content="${escapeHtml(resolution.entry.title)}" />
    <meta name="twitter:description" content="${escapeHtml(resolution.entry.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    ${verificationTag}
    ${jsonLd}
    ${buildMeasurementBootstrap(env.VITE_GTM_CONTAINER_ID)}
  `;

  const managedTagPatterns = [
    /<title>[\s\S]*?<\/title>/gi,
    /<meta\s+(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi,
    /<link\s+rel=["']canonical["'][^>]*>/gi,
    /<meta\s+name=["']google-site-verification["'][^>]*>/gi,
    /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    /<script\s+id=["']equiprofile-consent-default["'][^>]*>[\s\S]*?<\/script>/gi,
    /<script\s+(?:id=["']equiprofile-gtm["']\s+)?async\s+src=["']https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=[^"']+["']><\/script>/gi,
  ];
  let clean = html;
  for (const pattern of managedTagPatterns) clean = clean.replace(pattern, "");
  clean = clean.replace("</head>", `${metadata}\n  </head>`);
  return { html: clean, resolution };
}

export function robotsText(
  site: Exclude<PublicSiteMode, "school">,
  origins: PublicOrigins,
): string {
  if (site === "shop") {
    return "User-agent: *\nDisallow: /\n";
  }
  const sitemapOrigin = origins[site];
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /trpc/",
    "Disallow: /admin",
    "Disallow: /dashboard",
    "Disallow: /student-dashboard",
    "Disallow: /teacher-dashboard",
    "Disallow: /academy-dashboard",
    "Disallow: /horses",
    "Disallow: /health",
    "Disallow: /tasks",
    "Disallow: /calendar",
    "Disallow: /messages",
    "Disallow: /settings",
    "Disallow: /passport/",
    "Disallow: /stable-invite",
    "Disallow: /academy-invite",
    `Sitemap: ${sitemapOrigin}/sitemap.xml`,
    "",
  ].join("\n");
}

export function sitemapXml(
  site: Exclude<PublicSiteMode, "school">,
  origins: PublicOrigins,
): string {
  const routes =
    site === "management"
      ? Object.values(MANAGEMENT_PUBLIC_ROUTES)
      : site === "academy"
        ? Object.values(ACADEMY_PUBLIC_ROUTES)
        : [];
  const origin = origins[site];
  const locations = Array.from(
    new Set(routes.map((entry) => `${origin}${entry.canonicalPath}`)),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations
    .map((location) => `  <url><loc>${escapeHtml(location)}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
}

export function sendRobots(
  req: Request,
  res: Response,
  site: Exclude<PublicSiteMode, "school">,
) {
  res.setHeader("Cache-Control", "public, max-age=300");
  return res
    .status(200)
    .type("text/plain")
    .send(robotsText(site, getPublicOrigins()));
}

export function sendSitemap(
  req: Request,
  res: Response,
  site: Exclude<PublicSiteMode, "school">,
) {
  res.setHeader("Cache-Control", "public, max-age=300");
  return res
    .status(200)
    .type("application/xml")
    .send(sitemapXml(site, getPublicOrigins()));
}

export function trackingParameters(url: URL): Record<string, string> {
  return Object.fromEntries(
    Array.from(url.searchParams.entries()).filter(([key]) =>
      TRACKING_PARAMETER.test(key),
    ),
  );
}
