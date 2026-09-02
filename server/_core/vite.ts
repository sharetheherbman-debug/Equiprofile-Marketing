/**
 * Frontend Serving — True 2-Frontend Architecture
 *
 * Production:
 *   dist/public/management/  →  served on equiprofile.online
 *     management-assets/     →  /management-assets/ URL namespace
 *   dist/public/school/      →  served on school.equiprofile.online
 *     school-assets/         →  /school-assets/ URL namespace
 *
 * Each frontend has its own isolated asset directory.  URL namespaces never
 * overlap, so cross-site asset collisions are impossible — no merge step needed.
 *
 * Development:
 *   Uses Vite dev server for the site set by VITE_SITE env var
 *   (defaults to "management"). Switch with: VITE_SITE=school npm run dev
 */
import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getGeneratedStorageRoot } from "./storage/runtimeFileStorage";
import {
  getPublicOrigins,
  injectSeoHtml,
  resolveCanonicalRedirect,
  sendRobots,
  sendSitemap,
} from "./acquisitionSeo";

// ── Hostname detection ─────────────────────────────────────────────────────

export type CoreSiteMode = "management" | "academy" | "shop" | "school";
type CanonicalFrontendMode = Exclude<CoreSiteMode, "school">;

/**
 * Resolve a requested host to exactly one Core product. Legacy School is kept
 * as a compatibility mode only; production redirects it to Academy rather than
 * serving a separate frontend. The prefix matching intentionally supports
 * local development hosts such as academy.localhost and shop.localhost.
 */
export function getSiteModeFromRequest(hostname: string): CoreSiteMode {
  const lower = hostname.toLowerCase().split(":")[0].replace(/\.$/, "");
  if (lower === "academy.equiprofile.online" || lower.startsWith("academy.")) {
    return "academy";
  }
  if (lower === "shop.equiprofile.online" || lower.startsWith("shop.")) {
    return "shop";
  }
  if (lower === "school.equiprofile.online" || lower.startsWith("school.")) {
    return "school";
  }
  return "management";
}

/**
 * Vite uses one configured client root in development. This helper makes the
 * requested host mode observable in tests while preserving an explicit
 * VITE_SITE override for local development of a chosen product.
 */
export function getDevelopmentFrontendMode(
  hostname: string,
  configuredSite = process.env.VITE_SITE,
): CanonicalFrontendMode {
  const explicit = configuredSite?.trim().toLowerCase();
  if (explicit === "management" || explicit === "academy" || explicit === "shop") {
    return explicit;
  }
  const detected = getSiteModeFromRequest(hostname);
  return detected === "school" ? "academy" : detected;
}

// ── Development (Vite dev server) ──────────────────────────────────────────

const SENSITIVE_PATH_PATTERNS = [
  /^\/\.env(?:[./]|$)/i,
  /^\/\.git(?:[./]|$)/i,
  /^\/proc\/self\/environ$/i,
  /terraform\.tfstate/i,
  /^\/config\/(?:database\.yml|master\.key)$/i,
  /^\/(?:graphql|graphiql)$/i,
  /^\/(?:redirect|proxy|fetch)(?:[/?#]|$)/i,
  /^\/(?:phpmyadmin|wp-admin|wp-config(?:\.php)?|wp-login|xmlrpc\.php)(?:[/?#]|$)/i,
  /^\/(?:cgi-bin|actuator|_profiler|solr|shell)(?:[/?#]|$)/i,
  /^\/(?:admin\.php|config\.php|info\.php|phpinfo|test\.php)(?:[/?#]|$)/i,
];

export function isSensitiveProbePath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(lower));
}

export function isApiLikeRoute(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return (
    lower.startsWith("/api/") ||
    lower.startsWith("/trpc") ||
    lower.startsWith("/admin.") ||
    lower === "/graphql" ||
    lower === "/graphiql"
  );
}

function sendSafeNotFound(req: express.Request, res: express.Response) {
  if (isApiLikeRoute(req.path) || req.headers.accept?.includes("application/json")) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(404).type("text/plain").send("Not Found");
}

export async function setupVite(app: Express, server: Server) {
  // Serve generated media assets at /media/generated/* in dev mode too
  const storageRoot = getGeneratedStorageRoot();
  fs.mkdirSync(storageRoot, { recursive: true });
  app.use(
    "/media/generated",
    express.static(storageRoot, { index: false, dotfiles: "deny" }),
  );

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };
  const resolvedViteConfig =
    typeof viteConfig === "function"
      ? await viteConfig({
          command: "serve",
          mode: process.env.NODE_ENV || "development",
          isSsrBuild: false,
          isPreview: false,
        })
      : viteConfig;

  const vite = await createViteServer({
    ...resolvedViteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.get(["/robots.txt", "/sitemap.xml"], (req, res) => {
    const detected = getSiteModeFromRequest(req.hostname || "");
    const origins = getPublicOrigins();
    if (detected === "school") {
      return res.redirect(308, `${origins.academy}${req.path}`);
    }
    return req.path === "/robots.txt"
      ? sendRobots(req, res, detected)
      : sendSitemap(req, res, detected);
  });

  app.use(vite.middlewares);

  // SPA fallback for development — serve index.html for non-static routes
  app.use((req, res, next) => {
    if (isSensitiveProbePath(req.path)) {
      return sendSafeNotFound(req, res);
    }
    if (
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/trpc") ||
      req.originalUrl.startsWith("/assets/") ||
      req.originalUrl.match(/\.[a-z0-9]+$/i)
    ) {
      return next();
    }

    const url = req.originalUrl;

    // Vite is configured for one client root at a time. VITE_SITE explicitly
    // selects that root; without it, host detection makes local product modes
    // observable and testable. Legacy School maps to Academy compatibility.
    const devSite = getDevelopmentFrontendMode(req.hostname || "");
    const detectedSite = getSiteModeFromRequest(req.hostname || "");
    const redirect = resolveCanonicalRedirect(
      detectedSite,
      req.path,
      getPublicOrigins(),
    );
    if (redirect) return res.redirect(308, redirect);
    const clientTemplate = path.resolve(
      import.meta.dirname,
      "../..",
      "client",
      devSite,
      "index.html",
    );

    (async () => {
      try {
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="./src/main.tsx"`,
          `src="./src/main.tsx?v=${nanoid()}"`,
        );

        const rawPage = await vite.transformIndexHtml(url, template);
        const rendered = injectSeoHtml(rawPage, devSite, req.path);
        res
          .status(rendered.resolution.status)
          .set({
            "Content-Type": "text/html",
            "X-Robots-Tag": rendered.resolution.robots,
          })
          .end(rendered.html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    })();
  });
}

// ── Production (static files) ──────────────────────────────────────────────

export interface StaticServingOptions {
  /** Test-only fixture root. Production callers intentionally omit this. */
  baseDist?: string;
  /** Test-only canonical Academy origin for legacy School redirects. */
  academyPublicOrigin?: string;
}

export function serveStatic(app: Express, options: StaticServingOptions = {}) {
  const baseDist =
    options.baseDist ||
    (process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public"));

  const siteBuildDirectories: Record<CanonicalFrontendMode, string> = {
    management: path.resolve(baseDist, "management"),
    academy: path.resolve(baseDist, "academy"),
    shop: path.resolve(baseDist, "shop"),
  };
  const publicOrigins = getPublicOrigins();
  const academyPublicOrigin = (
    options.academyPublicOrigin ||
    process.env.ACADEMY_PUBLIC_ORIGIN ||
    publicOrigins.academy
  ).replace(/\/$/, "");

  app.get(["/robots.txt", "/sitemap.xml"], (req, res) => {
    const siteMode = getSiteModeFromRequest(req.hostname || "");
    if (siteMode === "school") {
      return res.redirect(308, `${academyPublicOrigin}${req.path}`);
    }
    return req.path === "/robots.txt"
      ? sendRobots(req, res, siteMode)
      : sendSitemap(req, res, siteMode);
  });

  // Serve generated media assets at /media/generated/*
  // STORAGE_ROOT defaults to /var/equiprofile/storage (override: EQUIPROFILE_STORAGE_ROOT)
  const storageRoot = getGeneratedStorageRoot();
  if (fs.existsSync(storageRoot)) {
    app.use(
      "/media/generated",
      express.static(storageRoot, {
        index: false,
        dotfiles: "deny",
        setHeaders: (res) => {
          res.setHeader("Cache-Control", "public, max-age=3600");
          res.setHeader("X-Content-Type-Options", "nosniff");
        },
      }),
    );
  } else {
    // Register route anyway — will 404 until storage root is created
    app.use("/media/generated", (_req, res) => res.status(404).end());
  }

  // Verify all canonical product builds exist. School is a redirect-only
  // compatibility host and deliberately has no independent build output.
  for (const [name, dir] of Object.entries(siteBuildDirectories)) {
    if (!fs.existsSync(dir)) {
      console.warn(
        `⚠️  ${name} frontend build not found at ${dir} — run "npm run build:${name}"`,
      );
    }
  }

  const STATIC_FILE_EXTENSIONS = [
    ".js",
    ".css",
    ".json",
    ".map",
    ".woff",
    ".woff2",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".txt",
    ".webm",
  ];

  const setStaticHeaders = (res: express.Response, filePath: string) => {
    if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (filePath.endsWith(".json")) {
      res.setHeader("Content-Type", "application/json");
    } else if (filePath.endsWith(".woff")) {
      res.setHeader("Content-Type", "font/woff");
    } else if (filePath.endsWith(".woff2")) {
      res.setHeader("Content-Type", "font/woff2");
    } else if (filePath.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
    }

    if (filePath.endsWith("service-worker.js")) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Content-Type", "application/javascript");
      res.setHeader("Service-Worker-Allowed", "/");
    } else if (
      filePath.includes("/management-assets/") ||
      filePath.includes("/academy-assets/") ||
      filePath.includes("/shop-assets/")
    ) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  };

  // Redirect /index.html → / so it goes through the SPA fallback
  app.use((req, _res, next) => {
    if (req.path === "/index.html") {
      req.url = "/";
    }
    next();
  });

  app.use((req, res, next) => {
    if (isSensitiveProbePath(req.path)) {
      return sendSafeNotFound(req, res);
    }
    next();
  });

  const staticFrontends: Record<CanonicalFrontendMode, express.RequestHandler> = {
    management: express.static(siteBuildDirectories.management, { index: false, setHeaders: setStaticHeaders }),
    academy: express.static(siteBuildDirectories.academy, { index: false, setHeaders: setStaticHeaders }),
    shop: express.static(siteBuildDirectories.shop, { index: false, setHeaders: setStaticHeaders }),
  };

  // Select exactly one product build per host. This prevents Academy or Shop
  // asset paths from resolving from Management (or any other product build).
  app.use((req, res, next) => {
    const siteMode = getSiteModeFromRequest(req.hostname || "");
    if (siteMode === "school") {
      return res.redirect(308, `${academyPublicOrigin}${req.originalUrl || "/"}`);
    }
    const canonicalRedirect = resolveCanonicalRedirect(
      siteMode,
      req.path,
      publicOrigins,
    );
    if (canonicalRedirect) return res.redirect(308, canonicalRedirect);
    return staticFrontends[siteMode](req, res, next);
  });

  // Known scanner / exploit probe paths — 404 immediately
  // SPA fallback — hostname-aware: serves the correct index.html per domain
  app.use((req, res, next) => {
    // Skip API / tRPC routes
    if (
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/trpc")
    ) {
      return next();
    }

    // Block probes
    if (isSensitiveProbePath(req.path)) {
      return sendSafeNotFound(req, res);
    }

    if (isApiLikeRoute(req.path)) {
      return res.status(404).json({ error: "Not found" });
    }

    // Don't serve index.html for real asset requests
    const isStaticFile =
      req.originalUrl.startsWith("/management-assets/") ||
      req.originalUrl.startsWith("/academy-assets/") ||
      req.originalUrl.startsWith("/shop-assets/") ||
      STATIC_FILE_EXTENSIONS.some((ext) => req.originalUrl.endsWith(ext));
    if (isStaticFile || isFileLikePath(req.path)) {
      return res.status(404).type("text/plain").send("Not Found");
    }

    // Determine which canonical frontend to serve based on hostname. School
    // was already redirected above, so it can never become a fourth SPA shell.
    const siteMode = getSiteModeFromRequest(req.hostname || "");
    if (siteMode === "school") {
      return res.redirect(308, `${academyPublicOrigin}${req.originalUrl || "/"}`);
    }
    const indexPath = path.resolve(siteBuildDirectories[siteMode], "index.html");

    // No-cache for HTML shell (users always get latest)
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    if (!fs.existsSync(indexPath)) {
      console.error(
        `[vite.ts] index.html not found for ${siteMode}: ${indexPath}`,
      );
      return res.status(503).type("text/plain").send("Frontend temporarily unavailable");
    }

    fs.promises
      .readFile(indexPath, "utf8")
      .then((template) => {
        const rendered = injectSeoHtml(template, siteMode, req.path);
        res.setHeader("X-Robots-Tag", rendered.resolution.robots);
        res.status(rendered.resolution.status).type("html").send(rendered.html);
      })
      .catch((error) => next(error));
  });
}

export function isFileLikePath(pathname: string): boolean {
  return /\/(?:[^/]+\.)[a-z0-9]{1,12}$/i.test(pathname);
}
