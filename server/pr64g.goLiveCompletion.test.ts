import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  crawlMarketingProductSite,
  extractMarketingProductProfileFromHtml,
  inferMarketingProductCategory,
  validateMarketingProductWebsiteUrl,
} from "./modules/marketing/product-intelligence";
import { validateMarketingCampaignQuality } from "./modules/marketing/campaign-quality-gate";
import { buildMarketingStockQuery } from "./modules/marketing/media-factory/marketingStockMediaService";
import { classifyHuggingFaceFailure } from "./_core/ai/providers/huggingFaceProvider";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PR64G product truth and public crawler", () => {
  it("rejects Qwen chat URLs before profile mutation", () => {
    expect(() => validateMarketingProductWebsiteUrl("https://chat.qwen.ai/c/secret")).toThrow(/public product website/i);
    const source = read("server/modules/marketing/product-intelligence/index.ts");
    expect(source.indexOf("validateMarketingProductWebsiteUrl(input.landingPageUrl)")).toBeLessThan(source.indexOf("if (!input.forceRefresh"));
  });

  it("classifies product categories without EquiProfile host leakage", () => {
    expect(inferMarketingProductCategory({ text: "BMW dealership vehicle test drive" })).toBe("automotive");
    expect(inferMarketingProductCategory({ text: "Property listings and homes for sale" })).toBe("property_real_estate");
    expect(inferMarketingProductCategory({ text: "Stable management platform for horse owners" })).toBe("equine_stable_management");
    expect(inferMarketingProductCategory({ text: "Workflow software dashboard free trial" })).toBe("saas_app");
  });

  it("extracts property truth from public HTML", () => {
    const result = extractMarketingProductProfileFromHtml({
      landingPageUrl: "https://homes.example.com",
      hostAppId: "property-demo",
      html: `<html><head><title>HomeScout</title></head><body>
        <h1>Find your next property</h1>
        <p>Built for real estate agents and home buyers.</p>
        <p>Manage property listings in one central dashboard and simplify viewings.</p>
        <a href="/signup">Book a demo</a>
      </body></html>`,
    });
    expect(result.profile.category).toBe("property_real_estate");
    expect(result.profile.appName).toBe("HomeScout");
    expect(result.profile.signupUrl).toBe("https://homes.example.com/signup");
    expect(result.profile.benefits.join(" ")).toMatch(/central|simplify/i);
    expect(result.profile.coreFeatures.join(" ")).toMatch(/manage/i);
  });

  it("extracts automotive truth without horse defaults", () => {
    const result = extractMarketingProductProfileFromHtml({
      landingPageUrl: "https://bmw.example.com",
      hostAppId: "automotive-demo",
      html: `<html><head><title>BMW Select</title></head><body>
        <h1>Premium BMW vehicles</h1>
        <p>Built for drivers comparing cars and booking a test drive.</p>
        <p>Manage your shortlist in one dashboard and simplify dealership visits.</p>
        <a href="/trial">Book a test drive</a>
      </body></html>`,
    });
    expect(result.profile.category).toBe("automotive");
    expect(result.profile.benefits.join(" ")).not.toMatch(/horse|stable/i);
    expect(result.profile.targetAudiences.join(" ")).not.toMatch(/stable owner/i);
  });

  it("crawls same-origin public HTML without Firecrawl", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/sitemap.xml")) {
        return new Response("<urlset><url><loc>https://acme.example.com/features</loc></url></urlset>", { status: 200 });
      }
      if (url === "https://acme.example.com/" || url === "https://acme.example.com") {
        return new Response('<html><body><a href="/features">Features</a><a href="/pricing">Pricing</a></body></html>', { status: 200, headers: { "content-type": "text/html" } });
      }
      if (url === "https://acme.example.com/features") {
        return new Response("<html><body><h1>Features</h1><p>Central workflow dashboard</p></body></html>", { status: 200, headers: { "content-type": "text/html" } });
      }
      if (url === "https://acme.example.com/pricing") {
        return new Response("<html><body><h1>Pricing</h1><p>Start a free trial</p></body></html>", { status: 200, headers: { "content-type": "text/html" } });
      }
      return new Response("missing", { status: 404, headers: { "content-type": "text/html" } });
    }));
    const result = await crawlMarketingProductSite({ landingPageUrl: "https://acme.example.com", maxPages: 4 });
    expect(result.extractedSourceUrls).toContain("https://acme.example.com/features");
    expect(result.combinedHtml).toContain("Central workflow dashboard");
    expect(result.combinedHtml).toContain("Start a free trial");
  });
});

describe("PR64G campaign quality gate", () => {
  const valid = {
    productCategory: "saas_app",
    sourcePrompt: "Create a signup campaign",
    cta: "Start your free trial",
    benefits: ["keep work organized"],
    features: ["shared dashboard"],
  };

  it("fails internal labels and template scaffolding", () => {
    const result = validateMarketingCampaignQuality({ ...valid, copyBlocks: ["signup_campaign day_1 social_post variant for teams"] });
    expect(result.status).toBe("failed");
    expect(result.exportReady).toBe(false);
  });

  it("fails copied prompts and wrong-category language", () => {
    expect(validateMarketingCampaignQuality({ ...valid, copyBlocks: ["Create a signup campaign"] }).status).toBe("failed");
    expect(validateMarketingCampaignQuality({ ...valid, copyBlocks: ["Keep work organized for every horse stable. Start your free trial."] }).status).toBe("failed");
  });

  it("passes product-specific campaign copy", () => {
    const result = validateMarketingCampaignQuality({ ...valid, copyBlocks: ["Keep work organized with one shared dashboard. Start your free trial."] });
    expect(result.status).toBe("passed");
    expect(result.exportReady).toBe(true);
  });
});

describe("PR64G provider and stock routing truth", () => {
  const scene = { requiredSubject: "campaign background", visualPrompt: "bright lifestyle visual", narration: "clear benefits" };

  it("adds category-aware stock terms only", () => {
    const property = buildMarketingStockQuery({ scene, originalUserPrompt: "Create an ad", productCategory: "property_real_estate" });
    const automotive = buildMarketingStockQuery({ scene, originalUserPrompt: "Create an ad", productCategory: "automotive" });
    expect(property).toMatch(/property|real estate|home/i);
    expect(property).not.toMatch(/horse|equine|stable/i);
    expect(automotive).toMatch(/automotive|car|vehicle/i);
    expect(automotive).not.toMatch(/horse|equine|stable/i);
  });

  it("classifies actionable Hugging Face failures", () => {
    expect(classifyHuggingFaceFailure(new Error("401 Unauthorized")).classification).toBe("invalid_token");
    expect(classifyHuggingFaceFailure(new Error("403 Forbidden")).classification).toBe("missing_permission");
    expect(classifyHuggingFaceFailure(new Error("404 model not found")).classification).toBe("model_unavailable");
    expect(classifyHuggingFaceFailure(new Error("429 too many requests")).classification).toBe("rate_limited");
    expect(classifyHuggingFaceFailure(new Error("fetch failed ENOTFOUND")).classification).toBe("network_dns_tls_fetch");
  });

  it("keeps the embedded shell and normal settings clean", () => {
    const shell = read("client/src/components/marketing/app/workspace/MarketingWorkspaceShell.tsx");
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(shell).toContain("marketing-product-strip");
    expect(shell).toContain("Product");
    expect(shell).toContain("Results");
    expect(app).not.toContain("<StudioHome");
    expect(settings).not.toContain("Output guarantee truth");
    expect(settings).not.toContain("raw route map");
    expect(settings).toContain("Admin Support");
  });
});
