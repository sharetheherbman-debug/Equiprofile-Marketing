/**
 * Frontend serving for the Management-only release candidate.
 *
 * Production serves only dist/public/management. Academy, Shop and legacy
 * School are deliberately not production dependencies in this release.
 */
import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getGeneratedStorageRoot } from "./storage/runtimeFileStorage";

const PAUSED_PRODUCT_HOSTS = new Set([
  "academy.equiprofile.online",
  "shop.equiprofile.online",
  "school.equiprofile.online",
]);

const SENSITIVE_PATH_PATTERNS = [
  /^\/\.env(?:[./]|$)/i,
  /^\/\.git(?:[./]|$)/i,
  /^\/proc\/self\/environ$/i,
  /terraform\.tfstate/i,
  /^\/config\/(?:database\.yml|master\.key)$/i,
  /^\/(?:graphql|graphiql)$/i,
  /^\/(?:redirect|proxy|fetch)(?:[/?#]|$)/i,
  /^\/(?:phpmyadmin|wp-admin|wp-config|wp-login|xmlrpc\.php)(?:[/?#]|$)/i,
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

function normalizedHostname(hostname: string): string {
  return hostname.toLowerCase().split(":")[0];
}

function isPausedProductHost(hostname: string): boolean {
  return PAUSED_PRODUCT_HOSTS.has(normalizedHostname(hostname));
}

export async function setupVite(app: Express, server: Server) {
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

  app.use(vite.middlewares);

  app.use((req, res, next) => {
    if (isSensitiveProbePath(req.path)) return sendSafeNotFound(req, res);
    if (
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/trpc") ||
      req.originalUrl.startsWith("/assets/") ||
      req.originalUrl.match(/\.[a-z0-9]+$/i)
    ) {
      return next();
    }

    const clientTemplate = path.resolve(
      import.meta.dirname,
      "../..",
      "client",
      "management",
      "index.html",
    );

    (async () => {
      try {
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="./src/main.tsx"`,
          `src="./src/main.tsx?v=${nanoid()}"`,
        );
        const rawPage = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(rawPage);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    })();
  });
}

export function serveStatic(app: Express) {
  const baseDist =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  const mgmtDist = path.resolve(baseDist, "management");

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
    app.use("/media/generated", (_req, res) => res.status(404).end());
  }

  const indexPath = path.resolve(mgmtDist, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error(
      `[vite.ts] Management frontend build missing at ${indexPath}. Run npm run build:management.`,
    );
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
    } else if (filePath.includes("/management-assets/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  };

  app.use((req, _res, next) => {
    if (req.path === "/index.html") req.url = "/";
    next();
  });

  app.use((req, res, next) => {
    if (isSensitiveProbePath(req.path)) return sendSafeNotFound(req, res);
    if (isPausedProductHost(req.hostname || "")) {
      return res.status(404).type("text/plain").send("Product not enabled on this release");
    }
    next();
  });

  app.use(
    express.static(mgmtDist, { index: false, setHeaders: setStaticHeaders }),
  );

  app.use((req, res, next) => {
    if (
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/trpc")
    ) {
      return next();
    }
    if (isSensitiveProbePath(req.path)) return sendSafeNotFound(req, res);
    if (isApiLikeRoute(req.path)) {
      return res.status(404).json({ error: "Not found" });
    }

    const isStaticFile =
      req.originalUrl.startsWith("/management-assets/") ||
      STATIC_FILE_EXTENSIONS.some((ext) => req.originalUrl.endsWith(ext));
    if (isStaticFile) return res.status(404).send("Not Found");

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    if (!fs.existsSync(indexPath)) {
      return res
        .status(503)
        .type("text/plain")
        .send("Management frontend temporarily unavailable");
    }
    return res.sendFile(indexPath);
  });
}
