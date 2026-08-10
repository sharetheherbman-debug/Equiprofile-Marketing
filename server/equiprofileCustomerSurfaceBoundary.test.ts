import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const managementApp = readFileSync(
  resolve(process.cwd(), "client/management/src/ManagementApp.tsx"),
  "utf8",
);

describe("EquiProfile customer surface boundary", () => {
  it("does not expose standalone Marketing as a public or customer route", () => {
    expect(managementApp).not.toContain("AIMarketingLanding");
    expect(managementApp).not.toContain('path="/ai-marketing"');
    expect(
      existsSync(
        resolve(process.cwd(), "client/src/pages/management/AIMarketingLanding.tsx"),
      ),
    ).toBe(false);
  });

  it("keeps Stable team messaging behind StableRoute in the customer router", () => {
    expect(managementApp).toContain(
      '<Route path="/messages">\n              <StableRoute>\n                <Messages />',
    );
  });
});
