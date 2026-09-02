import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../client/src/pages/management/Pricing.tsx", import.meta.url),
  "utf8",
);

describe("Management upgrade page roadmap", () => {
  it("truthfully presents Academy as live and Shop as the sole deferred product", () => {
    expect(source).toContain("EquiProfile Academy");
    expect(source).toContain("EquiProfile Shop");
    expect(source).toContain('aria-disabled="true"');
    expect(source).toContain('status: "Live"');
    expect(source).toContain('status: "Coming soon"');
    expect(source).toContain("Academy is live");
  });

  it("links Academy and keeps Shop without a checkout action", () => {
    expect(source).toContain("https://academy.equiprofile.online/academy");
    expect(source).not.toMatch(/shop[^\n]*href|href[^\n]*shop/i);
  });
});
