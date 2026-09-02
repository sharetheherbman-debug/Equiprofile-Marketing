import express from "express";
import http, { type Server } from "http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import {
  getDevelopmentFrontendMode,
  getSiteModeFromRequest,
  serveStatic,
} from "./_core/vite";

interface HttpResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

function request(server: Server, hostname: string, requestPath: string): Promise<HttpResult> {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server is not listening");
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port: address.port,
        path: requestPath,
        headers: { Host: hostname },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        }));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

describe("production host serving", () => {
  const fixtureRoot = mkdtempSync(path.join(tmpdir(), "equiprofile-static-hosts-"));
  let server: Server;

  beforeAll(async () => {
    for (const site of ["management", "academy", "shop"] as const) {
      const directory = path.join(fixtureRoot, site, `${site}-assets`);
      mkdirSync(directory, { recursive: true });
      writeFileSync(path.join(fixtureRoot, site, "index.html"), `<html><body>${site}-index</body></html>`);
      writeFileSync(path.join(directory, `${site}.js`), `console.log(${JSON.stringify(site)});`);
    }

    const app = express();
    // Mirrors the final Core bootstrap ordering: unknown API routes receive
    // JSON before static serving is registered, so they cannot fall through
    // to any product SPA shell.
    app.all(/^\/api\/.*/, (_req, res) => res.status(404).json({ error: "Not found" }));
    serveStatic(app, {
      baseDist: fixtureRoot,
      academyPublicOrigin: "https://academy.example.test",
    });
    server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    rmSync(fixtureRoot, { recursive: true, force: true });
  });

  it("maps canonical and local product hosts deterministically", () => {
    expect(getSiteModeFromRequest("equiprofile.online")).toBe("management");
    expect(getSiteModeFromRequest("www.equiprofile.online")).toBe("management");
    expect(getSiteModeFromRequest("academy.equiprofile.online")).toBe("academy");
    expect(getSiteModeFromRequest("shop.equiprofile.online:443")).toBe("shop");
    expect(getSiteModeFromRequest("school.localhost")).toBe("school");
    expect(getDevelopmentFrontendMode("academy.localhost", "")).toBe("academy");
    expect(getDevelopmentFrontendMode("shop.localhost", "")).toBe("shop");
    expect(getDevelopmentFrontendMode("academy.localhost", "management")).toBe("management");
  });

  it("serves the correct product shell for each canonical host", async () => {
    await expect(request(server, "equiprofile.online", "/dashboard"))
      .resolves.toMatchObject({ status: 200, body: expect.stringContaining("management-index") });
    await expect(request(server, "academy.equiprofile.online", "/student-dashboard"))
      .resolves.toMatchObject({ status: 200, body: expect.stringContaining("academy-index") });
    await expect(request(server, "shop.equiprofile.online", "/"))
      .resolves.toMatchObject({ status: 200, body: expect.stringContaining("shop-index") });
  });

  it("returns crawler-safe status and X-Robots behaviour", async () => {
    const privateRoute = await request(server, "equiprofile.online", "/horses/42");
    expect(privateRoute.status).toBe(200);
    expect(privateRoute.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive");

    const unknownRoute = await request(server, "equiprofile.online", "/not-a-real-page");
    expect(unknownRoute.status).toBe(404);
    expect(unknownRoute.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
  });

  it("keeps static assets isolated to the selected host build", async () => {
    await expect(request(server, "academy.equiprofile.online", "/academy-assets/academy.js"))
      .resolves.toMatchObject({ status: 200, body: expect.stringContaining("academy") });
    await expect(request(server, "shop.equiprofile.online", "/shop-assets/shop.js"))
      .resolves.toMatchObject({ status: 200, body: expect.stringContaining("shop") });
    await expect(request(server, "academy.equiprofile.online", "/management-assets/management.js"))
      .resolves.toMatchObject({ status: 404 });
    await expect(request(server, "shop.equiprofile.online", "/academy-assets/academy.js"))
      .resolves.toMatchObject({ status: 404 });
  });

  it("serves dynamic host-aware robots and sitemap endpoints", async () => {
    const robots = await request(server, "equiprofile.online", "/robots.txt");
    expect(robots.status).toBe(200);
    expect(robots.headers["content-type"]).toContain("text/plain");
    expect(robots.body).toContain("Disallow: /dashboard");

    const sitemap = await request(server, "academy.equiprofile.online", "/sitemap.xml");
    expect(sitemap.status).toBe(200);
    expect(sitemap.headers["content-type"]).toContain("application/xml");
    expect(sitemap.body).toContain("https://academy.equiprofile.online/academy");
    expect(sitemap.body).not.toContain("student-dashboard");
    expect(sitemap.body).not.toContain("/school");
  });

  it("redirects legacy School to canonical Academy without a fourth frontend", async () => {
    const response = await request(server, "school.equiprofile.online", "/legacy/path?lesson=1");
    expect(response.status).toBe(308);
    expect(response.headers.location).toBe("https://academy.example.test/legacy/path?lesson=1");
  });

  it("does not turn missing assets or API routes into SPA HTML", async () => {
    const asset = await request(server, "academy.equiprofile.online", "/academy-assets/missing.js");
    expect(asset.status).toBe(404);
    expect(asset.body).not.toContain("academy-index");

    const api = await request(server, "shop.equiprofile.online", "/api/missing");
    expect(api.status).toBe(404);
    expect(api.headers["content-type"]).toContain("application/json");
    expect(api.body).toContain('"error":"Not found"');
  });

  it.each([
    "/wp-config.php",
    "/config.php",
    "/admin.php",
    "/.env",
    "/.git/config",
    "/config/database.yml",
    "/random-export.csv",
  ])("returns a hard non-HTML 404 for file and sensitive probes: %s", async (probe) => {
    const response = await request(server, "equiprofile.online", probe);
    expect(response.status).toBe(404);
    expect(response.body).not.toContain("management-index");
    expect(response.headers["content-type"]).not.toContain("text/html");
  });
});
