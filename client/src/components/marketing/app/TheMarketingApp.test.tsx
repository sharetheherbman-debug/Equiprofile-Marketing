import fs from "node:fs";
import path from "node:path";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatResultCard } from "./ChatResultCard";
import { MarketingDeliverablePackageViewer } from "./MarketingDeliverablePackageViewer";
import { normalizeSocialConnections } from "./MarketingAppSettings";
import { inferCreateBadge, inferPrimaryCampaignPackage, shouldQueueRawMediaJob } from "./TheMarketingApp";
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
    expect(read("client/src/components/marketing/app/workspace/MarketingWorkspaceShell.tsx")).toContain("marketing-create-grid");
    expect(read("client/src/components/marketing/app/workspace/MarketingWorkspaceShell.tsx")).toContain("marketing-preview-rail");
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
    expect(read("client/src/components/marketing/app/workspace/CampaignPromptPanel.tsx")).toContain("What are we marketing today?");
    expect(read("client/src/components/marketing/app/workspace/CampaignPromptPanel.tsx")).toContain("Plan output");
    expect(read("client/src/components/marketing/app/workspace/MarketingPreviewPanel.tsx")).toContain("Latest output");
    expect(read("client/src/components/marketing/app/workspace/CampaignOutputPanel.tsx")).toContain("Day-by-day schedule");
    expect(read("client/src/components/marketing/app/workspace/MarketingConnectionsView.tsx")).toContain("Posting stays blocked until a connector is truly ready.");
  });

  it("keeps diagnostics and legacy workbench out of the primary tools panel", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    const drawer = read("client/src/components/marketing/app/workspace/AdvancedMarketingDrawer.tsx");
    expect(app).not.toContain("Campaign inspector");
    expect(app).not.toContain("Media Studio / Advanced tools");
    expect(app).not.toContain("<StudioHome");
    expect(drawer).toContain("<details");
    expect(drawer).not.toContain("open={true}");
  });

  it("renders required top menu sections", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(app).toContain('label: "Create"');
    expect(app).toContain('label: "Campaigns"');
    expect(app).toContain('label: "Media Library"');
    expect(app).toContain('label: "Calendar"');
    expect(app).toContain('label: "Results"');
    expect(app).toContain('label: "Brand Kit"');
    expect(app).toContain('label: "Connections"');
    expect(app).toContain('label: "Settings"');
  });

  it("keeps create flow guided and preview visible near top", () => {
    const app = read("client/src/components/marketing/app/workspace/CampaignPromptPanel.tsx");
    expect(app).toContain("What are we marketing today?");
    expect(app).toContain("Quick actions");
    expect(app).toContain("Image Ad");
    expect(app).toContain("Facebook Reel");
    expect(app).toContain("7-Day Signup Campaign");
    expect(app).toContain("Email Campaign");
    expect(app).toContain("Social Post");
  });

  it("keeps result badge truth states for fallback and missing audio", () => {
    expect(inferCreateBadge({ hasOutput: false, qualityPassed: false, hasTextCardFallback: false, missingAudio: false, scheduledCount: 0, publishedPlatformId: null })).toBe("Draft generated");
    expect(inferCreateBadge({ hasOutput: true, qualityPassed: false, hasTextCardFallback: true, missingAudio: false, scheduledCount: 0, publishedPlatformId: null })).toBe("Needs media upgrade");
    expect(inferCreateBadge({ hasOutput: true, qualityPassed: false, hasTextCardFallback: false, missingAudio: true, scheduledCount: 0, publishedPlatformId: null })).toBe("Needs audio upgrade");
    expect(inferCreateBadge({ hasOutput: true, qualityPassed: true, hasTextCardFallback: false, missingAudio: false, scheduledCount: 0, publishedPlatformId: "fb_123" })).toBe("Published");
  });

  it("ensures product setup collapses after confirmation state", () => {
    const product = read("client/src/components/marketing/app/workspace/ProductContextPanel.tsx");
    expect(product).toContain("isReady && !showEditor");
  });

  it("includes all platform cards in Connections", () => {
    const connections = read("client/src/components/marketing/app/workspace/MarketingConnectionsView.tsx");
    expect(connections).toContain('"Facebook"');
    expect(connections).toContain('"Instagram"');
    expect(connections).toContain('"TikTok"');
    expect(connections).toContain('"YouTube"');
    expect(connections).toContain('"LinkedIn"');
    expect(connections).toContain('"Email"');
  });

  it("requires real platform post/upload IDs for posted state", () => {
    const routers = read("server/routers.ts");
    expect(routers).toContain("const hasRealPostId = Boolean(result.platformPostId ?? result.uploadId)");
  });

  it("keeps settings sectioned and admin support gated", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(settings).toContain("1. Product Profile");
    expect(settings).toContain("2. Brand Kit");
    expect(settings).toContain("3. AI Providers");
    expect(settings).toContain("4. Stock Media");
    expect(settings).toContain("5. Social / Email Connections");
    expect(settings).toContain("6. Tracking");
    expect(settings).toContain("7. Export / Schedule");
    expect(settings).toContain("8. Admin Support");
    expect(settings).toContain("supportModeEnabled && showAdminSupport");
  });

  it("keeps calendar, results, and media library user-facing", () => {
    expect(read("client/src/components/marketing/app/workspace/MarketingCalendarView.tsx")).toContain("marketing-calendar-view");
    expect(read("client/src/components/marketing/app/workspace/MarketingResultsView.tsx")).toContain("Not enough data yet.");
    expect(read("client/src/components/marketing/app/workspace/MarketingLibraryView.tsx")).toContain("Generated media, uploads, stock, and audio");
  });
});
