import { describe, expect, it } from "vitest";
import { getPublicOrigins, resolveSeo, robotsText } from "./_core/acquisitionSeo";

const env = {
  PUBLIC_SITE_URL: "https://equiprofile.example",
  ACADEMY_PUBLIC_ORIGIN: "https://academy.equiprofile.example",
  SHOP_PUBLIC_ORIGIN: "https://shop.equiprofile.example",
} as NodeJS.ProcessEnv;

describe("Shop crawler policy", () => {
  it("allows only the first-party Marketing knowledge crawler while blocking generic crawlers", () => {
    const robots = robotsText("shop", getPublicOrigins(env));

    expect(robots).toContain("User-agent: AmarktAI-Marketing-KnowledgeBot\nAllow: /");
    expect(robots).toContain("User-agent: *\nDisallow: /");
    expect(robots.indexOf("User-agent: AmarktAI-Marketing-KnowledgeBot")).toBeLessThan(
      robots.indexOf("User-agent: *"),
    );
  });

  it("keeps the Shop landing page explicitly non-indexable", () => {
    expect(resolveSeo("shop", "/")).toMatchObject({
      status: 200,
      robots: "noindex, nofollow, noarchive",
    });
  });
});
