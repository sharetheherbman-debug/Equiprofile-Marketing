import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { inferPrimaryCampaignPackage } from "../client/src/components/marketing/app/TheMarketingApp";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");
const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
const shell = read("client/src/components/marketing/app/workspace/MarketingWorkspaceShell.tsx");
const product = read("client/src/components/marketing/app/workspace/ProductContextPanel.tsx");
const prompt = read("client/src/components/marketing/app/workspace/CampaignPromptPanel.tsx");
const output = read("client/src/components/marketing/app/workspace/CampaignOutputPanel.tsx");
const status = read("client/src/components/marketing/app/workspace/WorkflowStatusPanel.tsx");

describe("PR64F desktop campaign workspace", () => {
  it("renders an embedded campaign workspace", () => {
    expect(app).toContain("<MarketingWorkspaceShell");
    expect(shell).toContain("marketing-product-strip");
    expect(shell).toContain("Product");
    expect(shell).toContain("Results");
  });

  it("puts the campaign prompt first", () => {
    expect(prompt).toContain("What would you like to create?");
    expect(prompt).toContain("Plan campaign");
    expect(prompt).toContain("Generate");
  });

  it("does not disable generation because product profile readiness is false", () => {
    const blocker = app.slice(app.indexOf("const selectedCreationBlocked"), app.indexOf("const audience"));
    expect(blocker).not.toContain("productProfileReady");
    expect(blocker).toContain("!prompt.trim()");
  });

  it("shows one friendly setup card with EquiProfile defaults", () => {
    expect(product).toContain("Let’s learn what we’re marketing.");
    expect(product).toContain("Use EquiProfile defaults");
    expect(product).toContain("Profile needs review, but draft campaigns can still be generated.");
  });

  it("keeps raw internal blocker labels out of primary workspace components", () => {
    const primary = [shell, product, prompt, output, status].join("\n");
    for (const label of [
      "setup_needed",
      "not_wired",
      "budget_blocked",
      "waiting_for_backend",
      "connector_unavailable",
      "campaign_strategy",
      "platform_copywriting",
      "image_generation",
      "avatar_generation",
    ]) {
      expect(primary).not.toContain(label);
    }
  });

  it("removes the old top-level tab wall from the primary workspace", () => {
    const primary = [shell, product, prompt, output, status].join("\n");
    for (const tab of ["Creative", "Media", "Details"]) expect(primary).not.toContain(`>${tab}<`);
  });

  it("routes full campaign generation ahead of image creative", () => {
    expect(inferPrimaryCampaignPackage("Create a 7-day Facebook signup campaign for EquiProfile")).toBe("signup_campaign");
    expect(inferPrimaryCampaignPackage("Create a weekly content plan for EquiProfile")).toBe("weekly_content_pack");
    expect(inferPrimaryCampaignPackage("Create an email sequence for inactive trials")).toBe("email_campaign");
    expect(inferPrimaryCampaignPackage("Create an image ad creative for Facebook")).toBe("image_ad");
  });

  it("renders reviewable output and truthful workflow states", () => {
    for (const label of ["Campaign summary", "Day-by-day schedule", "Facebook posts", "Ad variants", "Email sequence", "Export status"]) {
      expect(output).toContain(label);
    }
    for (const label of ["Product understood", "Fallback copy used", "Review needed", "Export ready", "Signup URL needed", "Direct posting"]) {
      expect(status).toContain(label);
    }
  });
});
