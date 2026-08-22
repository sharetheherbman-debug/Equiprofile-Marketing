import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { isApiLikeRoute, isSensitiveProbePath } from "./_core/vite";

const viteSource = readFileSync(resolve(process.cwd(), "server/_core/vite.ts"), "utf8");

describe("static route hardening", () => {
  it("classifies sensitive probe paths before SPA fallback", () => {
    for (const path of [
      "/.env",
      "/proc/self/environ",
      "/terraform.tfstate",
      "/config/database.yml",
      "/config/master.key",
      "/graphql",
      "/graphiql",
      "/redirect",
      "/proxy",
      "/fetch",
    ]) {
      expect(isSensitiveProbePath(path)).toBe(true);
    }
  });

  it("keeps unknown API-like routes in JSON 404 handling instead of SPA fallback", () => {
    for (const path of ["/api/missing", "/trpc/nope", "/admin.unknown", "/graphql"]) {
      expect(isApiLikeRoute(path)).toBe(true);
    }
  });

  it("returns a safe Management-specific 503 when the built index is missing", () => {
    expect(viteSource).toContain(".status(503)");
    expect(viteSource).toContain('.type("text/plain")');
    expect(viteSource).toContain('.send("Management frontend temporarily unavailable")');
    expect(viteSource).not.toContain('res.status(500).send("Frontend build not found")');
  });
});
