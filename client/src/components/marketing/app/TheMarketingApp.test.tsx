import fs from "node:fs";
import path from "node:path";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatResultCard } from "./ChatResultCard";
import { MarketingDeliverablePackageViewer } from "./MarketingDeliverablePackageViewer";
import { normalizeSocialConnections } from "./MarketingAppSettings";
import { inferPrimaryCampaignPackage, shouldQueueRawMediaJob } from "./TheMarketingApp";
import { StudioHome } from "./studio/StudioHome";
import { buildScenePlanFromPrompt } from "./studio/StudioWorkbench";

vi.mock("./studio/useMarketingRenderJob", () => ({
  useMarketingRenderJob: () => ({ job: null, status: null, statusLabel: null, createRenderJob: async () => undefined, cancelRenderJob: async () => undefined, isCreating: false }),
}));

vi.mock("./studio/useMarketingSceneMedia", () => ({
  useMarketingSceneMedia: () => ({ sourceSceneMedia: async (_plan: unknown) => _plan, isSourcing: false, lastStatus: null }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ admin: { getMarketingRenderJob: { invalidate: async () => undefined }, getMarketingCampaign: { invalidate: async () => undefined }, listMarketingReviews: { invalidate: async () => undefined } } }),
    admin: {
      createMarketingVoiceover: { useMutation: () => ({ mutateAsync: async () => ({ status: "setup_needed" }), isPending: false }) },
      generateMarketingStudioScript: { useMutation: () => ({ mutateAsync: async () => ({ status: "setup_needed", brief: "", script: "", voiceoverScript: "", scenePlan: [], requiredAssets: [] }), isPending: false }) },
      generateMarketingCaptions: { useMutation: () => ({ mutateAsync: async () => ({ status: "generated", srt: "1", vtt: "WEBVTT", mode: "script" }), isPending: false }) },
      getMarketingBrandKit: { useQuery: () => ({ data: null }) },
      listMarketingBrandOverlayTemplates: { useQuery: () => ({ data: ["lower_third"] }) },
      listMediaAssets: { useQuery: () => ({ data: [] }) },
      upsertMarketingBrandKit: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      selectMarketingBrandLogoAsset: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      runMarketingQaCheck: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      approveMarketingOutput: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      markMarketingOutputExported: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      rejectMarketingOutput: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
      requestMarketingOutputChanges: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
    },
  },
}));

const repoRoot = path.resolve(import.meta.dirname, "../../../../..");
const read = (file: string) => fs.readFileSync(path.join(repoRoot, file), "utf8");

describe("Marketing app stable contracts", () => {
  it("normalizes invalid social query responses without crashing", () => {
    expect(normalizeSocialConnections(undefined)).toEqual([]);
    expect(normalizeSocialConnections({})).toEqual([]);
    expect(normalizeSocialConnections([{ platform: 1, status: null }])).toEqual([{ platform: "Unknown", status: "not_connected", accountName: null, scopes: [], requiredScopes: [], missingScopes: [], reason: null }]);
  });

  it("keeps StudioHome guided-only", () => {
    const html = renderToStaticMarkup(<StudioHome tenantId="global" workspaceId="equiprofile-global" hostAppId="equiprofile" />);
    expect(html).toContain("studio-workbench");
    expect(html).not.toContain("Free-form chat");
  });

  it("keeps result cards compact and user-facing", () => {
    const html = renderToStaticMarkup(<ChatResultCard result={{ assetId: 1, status: "completed", publicUrl: "https://example.com/image.png", mimeType: "image/png", title: "Horse ad", summary: "Short horse campaign preview", prompt: "provider prompt", provider: "genx", model: "v1" }} />);
    expect(html).toContain("Short horse campaign preview");
    expect(html).toContain("Download");
    expect(html).not.toContain("provider prompt");
    expect(html).not.toContain("Provider:");
  });

  it("blocks raw media jobs for assembled long-form requests", () => {
    expect(shouldQueueRawMediaJob({ task: "text_to_video", prompt: "Create a 3-minute YouTube video for EquiProfile" }).allowRaw).toBe(false);
    expect(shouldQueueRawMediaJob({ task: "text_to_video", prompt: "Create a 15-second horse video" }).allowRaw).toBe(false);
    expect(shouldQueueRawMediaJob({ task: "text_to_video", prompt: "Create a 15-second horse clip", providerMaxRawSeconds: 20 }).allowRaw).toBe(true);
  });

  it("builds equestrian scene plans without office terms", () => {
    const combined = buildScenePlanFromPrompt("Create a horse video ad for stable owners and equestrian teams", { hostAppId: "equiprofile", productCategory: "equine_stable_management" }).map((scene) => `${scene.narration} ${scene.visualPrompt} ${scene.negativePrompt}`).join(" ").toLowerCase();
    expect(combined).toContain("horse");
    expect(combined).toContain("stable");
    expect(combined).not.toContain("office");
    expect(combined).not.toContain("laptop");
  });

  it("keeps package viewer readable without raw JSON", () => {
    const html = renderToStaticMarkup(<MarketingDeliverablePackageViewer deliverablePackage={{ packageType: "video_ad_30s", status: "draft", goal: "Get signups", audience: "stable owners", platforms: ["Facebook"], strategy: "Strategy text", hooks: ["hook1"], adCopy: ["copy1"], script: "script", scenePlan: [], mediaRequirements: [], reviewItems: [], exportPack: {}, scheduleDrafts: [], blockers: [], setupNeeded: false }} />);
    expect(html).toContain("Package summary");
    expect(html).not.toContain("{&quot;");
  });
});

describe("PR64F rescued workspace", () => {
  it("renders an embedded desktop-first shell", () => {
    expect(read("client/src/components/marketing/app/TheMarketingApp.tsx")).toContain("<MarketingWorkspaceShell");
    expect(read("client/src/components/marketing/app/workspace/MarketingWorkspaceShell.tsx")).toContain("marketing-product-strip");
  });

  it("makes campaign generation primary and image creative explicit-only", () => {
    expect(inferPrimaryCampaignPackage("Create a 7-day Facebook signup campaign for EquiProfile")).toBe("signup_campaign");
    expect(inferPrimaryCampaignPackage("Create an image ad creative")).toBe("image_ad");
    expect(inferPrimaryCampaignPackage("Write a Facebook post")).toBe("social_post");
  });

  it("keeps product setup friendly without blocking draft generation", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    const product = read("client/src/components/marketing/app/workspace/ProductContextPanel.tsx");
    expect(app).toContain("const selectedCreationBlocked = !prompt.trim() || isAnyGenerationPending");
    expect(product).toContain("Use EquiProfile defaults");
    expect(product).toContain("Profile needs review, but draft campaigns can still be generated.");
  });

  it("renders clear prompt, output, and workflow panels", () => {
    expect(read("client/src/components/marketing/app/workspace/CampaignPromptPanel.tsx")).toContain("What would you like to create?");
    expect(read("client/src/components/marketing/app/workspace/CampaignOutputPanel.tsx")).toContain("Day-by-day schedule");
    expect(read("client/src/components/marketing/app/workspace/WorkflowStatusPanel.tsx")).toContain("Direct posting needs a connected Facebook account. Export is ready.");
  });

  it("keeps diagnostics and legacy workbench out of the primary tools panel", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    const drawer = read("client/src/components/marketing/app/workspace/AdvancedMarketingDrawer.tsx");
    expect(app).toContain("Media Studio / Advanced tools");
    expect(app).not.toContain("<StudioHome");
    expect(drawer).toContain("<details");
    expect(drawer).not.toContain("open={true}");
  });
});
