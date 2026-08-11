import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../client/src/pages/management/Pricing.tsx", import.meta.url),
  "utf8",
);

describe("Management upgrade page roadmap", () => {
  it("truthfully presents Academy and Shop as unavailable future products", () => {
    expect(source).toContain("EquiProfile Academy");
    expect(source).toContain("EquiProfile Shop");
    expect(source).toContain('aria-disabled="true"');
    expect(source).toContain("Not available yet");
    expect(source).toContain("are not included or available for purchase yet");
  });

  it("does not create a dead Academy or Shop call-to-action", () => {
    expect(source).not.toMatch(/href=[{\"](?:[^\n]*academy|[^\n]*shop)/i);
  });
});
