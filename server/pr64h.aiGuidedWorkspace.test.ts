import fs from "node:fs";
import path from "node:path";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { inferMarketingWorkspaceIntent } from "../client/src/components/marketing/app/marketingIntentRouter";
import { MarketingPreviewPanel } from "../client/src/components/marketing/app/workspace/MarketingPreviewPanel";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("PR64H AI guided intent routing", () => {
  it("routes adverts to image generation instead of a campaign", () => {
    expect(inferMarketingWorkspaceIntent("Create an advert for EquiProfile").workflow).toBe("image_ad");
    expect(inferMarketingWorkspaceIntent("Create a Facebook image advertisement for EquiProfile").workflow).toBe("image_ad");
  });

  it("routes short and long video prompts into assembled Studio workflows", () => {
    expect(inferMarketingWorkspaceIntent("Create me a 30 second Facebook reel for EquiProfile")).toMatchObject({
      workflow: "assembled_video",
      contentType: "facebook_ad",
      durationSeconds: 30,
    });
    expect(inferMarketingWorkspaceIntent("Create a 2 minute video for EquiProfile")).toMatchObject({
      workflow: "assembled_video",
      durationSeconds: 120,
    });
    expect(inferMarketingWorkspaceIntent("Create a 3 minute YouTube video for EquiProfile")).toMatchObject({
      workflow: "assembled_video",
      contentType: "youtube_3min_video",
      durationSeconds: 180,
    });
  });

  it("keeps signup requests on the campaign composer", () => {
    expect(inferMarketingWorkspaceIntent("Create a 7 day Facebook signup campaign for EquiProfile")).toMatchObject({
      workflow: "campaign",
      packageType: "signup_campaign",
    });
  });

  it("asks one concise question for unclear prompts", () => {
    const result = inferMarketingWorkspaceIntent("Help me market this");
    expect(result.workflow).toBe("clarify");
    expect(result).toHaveProperty("question");
  });
});

describe("PR64H active workspace wiring", () => {
  it("uses a top menu without adding a left sidebar", () => {
    const source = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    for (const label of ["Create", "Campaigns", "Media Library", "Calendar", "Results", "Brand Kit", "Connections", "Settings"]) {
      expect(source).toContain(`label: "${label}"`);
    }
    expect(source).toContain('aria-label="Marketing workspace"');
    expect(source).not.toContain("MarketingSidebar");
  });

  it("uses Settings as a workspace view instead of a dialog-only modal", () => {
    const source = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(source).toContain('view === "settings"');
    expect(source).not.toContain("<Dialog");
  });

  it("connects inferred video plans to the existing Workbench and render queue", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    const workbench = read("client/src/components/marketing/app/studio/StudioWorkbench.tsx");
    const router = read("server/routers.ts");
    expect(app).toContain("<StudioWorkbench");
    expect(app).toContain("createMarketingStudioPlan.mutateAsync");
    expect(workbench).toContain("autoStartRender");
    expect(workbench).toContain("renderJob.createRenderJob");
    expect(router).toContain("createMarketingRenderJob");
    expect(router).toContain("listMarketingRenderJobs");
    expect(router).toContain("getMarketingRenderJob");
    expect(router).toContain("cancelMarketingRenderJob");
  });

  it("reuses existing asset, calendar, results, and learning sources", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(app).toContain("useMarketingAssets");
    expect(app).toContain("useMarketingCalendar");
    expect(read("client/src/components/marketing/app/workspace/MarketingLibraryView.tsx")).toContain("assetStore.visibleAssets");
    expect(read("client/src/components/marketing/app/workspace/MarketingCalendarView.tsx")).toContain("mappedScheduleDrafts");
    const results = read("client/src/components/marketing/app/workspace/MarketingResultsView.tsx");
    expect(results).toContain("getMarketingPerformanceScore");
    expect(results).toContain("getMarketingWinningPatterns");
    expect(results).toContain("getMarketingLearningInsights");
  });

  it("keeps diagnostics collapsed under Admin Support", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(settings).toContain("Admin Support");
    expect(settings).toContain("enabled: supportModeEnabled && showAdminSupport");
  });
});

describe("PR64H shared preview", () => {
  it("renders image, video, audio, and campaign preview states", () => {
    const image = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: { status: "completed", publicUrl: "https://example.com/ad.png", mimeType: "image/png" }, asset: null, renderJob: null, studioPlan: null }));
    const video = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: { status: "completed", publicUrl: "https://example.com/reel.mp4", mimeType: "video/mp4" }, asset: null, renderJob: null, studioPlan: null }));
    const audio = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: { status: "completed", publicUrl: "https://example.com/voice.mp3", mimeType: "audio/mpeg" }, asset: null, renderJob: null, studioPlan: null }));
    const campaign = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: { strategy: "Campaign summary" }, mediaOutput: null, asset: null, renderJob: null, studioPlan: null }));
    expect(image).toContain("<img");
    expect(video).toContain("<video");
    expect(audio).toContain("<audio");
    expect(campaign).toContain("Campaign summary");
  });
});

describe("PR64H universal fallback cleanup", () => {
  it("does not hardcode EquiProfile in reusable weekly composer fallback", () => {
    const composer = read("server/modules/marketing/deliverable-composer/index.ts");
    expect(composer).not.toContain("Check out EquiProfile and start your free trial today.");
    expect(read("server/modules/marketing/studio-generation/index.ts")).not.toContain('hostAppId: input.hostAppId ?? "equiprofile"');
    expect(read("server/modules/marketing/product-intelligence/index.ts")).not.toContain('hostAppId: input.hostAppId ?? "equiprofile"');
  });

  it("keeps stock setup isolated from text and Studio planning", () => {
    const stock = read("server/modules/marketing/media-factory/marketingStockMediaService.ts");
    const studio = read("server/modules/marketing/studio-generation/index.ts");
    expect(stock).toContain("setup_needed");
    expect(studio).toContain("scene_planning");
  });
});
