import fs from "node:fs";
import path from "node:path";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatResultCard } from "./ChatResultCard";
import { normalizeSocialConnections } from "./MarketingAppSettings";
import { StudioHome } from "./studio/StudioHome";
import { buildScenePlanFromPrompt } from "./studio/StudioWorkbench";
import { shouldQueueRawMediaJob } from "./TheMarketingApp";
import { MarketingDeliverablePackageViewer } from "./MarketingDeliverablePackageViewer";

vi.mock("./studio/useMarketingRenderJob", () => ({
  useMarketingRenderJob: () => ({
    job: null,
    status: null,
    statusLabel: null,
    createRenderJob: async () => undefined,
    cancelRenderJob: async () => undefined,
    isCreating: false,
  }),
}));

vi.mock("./studio/useMarketingSceneMedia", () => ({
  useMarketingSceneMedia: () => ({
    sourceSceneMedia: async (_plan: unknown) => _plan,
    isSourcing: false,
    lastStatus: null,
  }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      admin: {
        getMarketingRenderJob: { invalidate: async () => undefined },
        getMarketingCampaign: { invalidate: async () => undefined },
        listMarketingReviews: { invalidate: async () => undefined },
      },
    }),
    admin: {
      createMarketingVoiceover: {
        useMutation: () => ({
          mutateAsync: async () => ({ status: "setup_needed", voiceAssetId: null, audioUrl: null, provider: null }),
          isPending: false,
        }),
      },
      generateMarketingStudioScript: {
        useMutation: () => ({
          mutateAsync: async () => ({
            status: "setup_needed",
            brief: "",
            script: "",
            voiceoverScript: "",
            scenePlan: [],
            requiredAssets: [],
          }),
          isPending: false,
        }),
      },
      generateMarketingCaptions: {
        useMutation: () => ({
          mutateAsync: async () => ({ status: "generated", srt: "1", vtt: "WEBVTT", mode: "script" }),
          isPending: false,
        }),
      },
      getMarketingBrandKit: {
        useQuery: () => ({ data: null }),
      },
      listMarketingBrandOverlayTemplates: {
        useQuery: () => ({ data: ["lower_third", "corner_logo", "end_card", "social_reel", "youtube_landscape"] }),
      },
      listMediaAssets: {
        useQuery: () => ({ data: [] }),
      },
      upsertMarketingBrandKit: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      selectMarketingBrandLogoAsset: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      runMarketingQaCheck: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      approveMarketingOutput: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      markMarketingOutputExported: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      rejectMarketingOutput: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
      requestMarketingOutputChanges: {
        useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }),
      },
    },
  },
}));

const repoRoot = path.resolve(import.meta.dirname, "../../../../..");

describe("PR42A marketing app stabilization", () => {
  it("uses workspace tenant/workspace ids in settings social query input", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/MarketingAppSettings.tsx"),
      "utf8",
    );
    expect(source).toContain("useQuery({ tenantId, workspaceId })");
    expect(source).not.toContain('tenantId: "global", workspaceId: "default"');
  });

  it("normalizes invalid social query responses without crashing", () => {
    expect(normalizeSocialConnections(undefined)).toEqual([]);
    expect(normalizeSocialConnections({})).toEqual([]);
    expect(normalizeSocialConnections([{ platform: 1, status: null }])).toEqual([
      { platform: "Unknown", status: "not_connected", accountName: null },
    ]);
  });

  it("shows guided Studio Workbench only in Create", () => {
    const html = renderToStaticMarkup(
      <StudioHome tenantId="global" workspaceId="equiprofile-global" hostAppId="equiprofile" />,
    );
    expect(html).toContain("studio-workbench");
    expect(html).not.toContain("Free-form chat");
    expect(html).not.toContain("AI chat-first flow");
  });

  it("does not render compiled prompt or provider metadata in result card", () => {
    const html = renderToStaticMarkup(
      <ChatResultCard
        result={{
          assetId: 1,
          status: "completed",
          publicUrl: "https://example.com/image.png",
          mimeType: "image/png",
          title: "Horse ad",
          summary: "Short horse campaign preview",
          prompt: "compiled provider prompt",
          provider: "genx",
          model: "v1",
        }}
      />,
    );
    expect(html).toContain("Short horse campaign preview");
    expect(html).toContain("Open");
    expect(html).toContain("Download");
    expect(html).toContain("Delete permanently");
    expect(html).not.toContain("compiled provider prompt");
    expect(html).not.toContain("Provider:");
    expect(html).not.toContain("Model:");
  });

  it("blocks raw media jobs for assembled long-form requests", () => {
    expect(shouldQueueRawMediaJob({
      task: "text_to_video",
      prompt: "Create a 3-minute YouTube video for EquiProfile",
    }).allowRaw).toBe(false);

    expect(shouldQueueRawMediaJob({
      task: "text_to_video",
      prompt: "Create a 30-second Facebook video ad for stable owners",
    }).allowRaw).toBe(false);
  });

  it("blocks 15-second raw request unless provider supports it", () => {
    expect(shouldQueueRawMediaJob({
      task: "text_to_video",
      prompt: "Create a 15-second horse video",
    }).allowRaw).toBe(false);

    expect(shouldQueueRawMediaJob({
      task: "text_to_video",
      prompt: "Create a 15-second horse clip",
      providerMaxRawSeconds: 20,
    }).allowRaw).toBe(true);
  });

  it("builds horse/equestrian scene plans without forbidden office terms", () => {
    const scenes = buildScenePlanFromPrompt("Create a horse video ad for stable owners and equestrian teams");
    const combined = scenes.map((scene) => `${scene.narration} ${scene.visualPrompt} ${scene.negativePrompt}`).join(" ").toLowerCase();
    expect(combined).toContain("horse");
    expect(combined).toContain("stable");
    expect(combined).not.toContain("office");
    expect(combined).not.toContain("laptop");
    expect(combined).not.toContain("gibberish");
  });

  it("renders section-level retry error cards for failed queries", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("SectionErrorCard");
    expect(source).toContain("Something failed to load. Please retry.");
  });

  it("keeps Academy untouched and MarketingStudioV2 inactive", () => {
    const files = [
      "client/src/components/marketing/app/TheMarketingApp.tsx",
      "client/src/components/marketing/app/MarketingAppPanels.tsx",
      "client/src/components/marketing/app/MarketingAppSettings.tsx",
      "client/src/components/marketing/app/studio/StudioHome.tsx",
    ];
    for (const file of files) {
      const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
      expect(source).not.toContain("Academy");
    }

    const adminCampaignsSource = fs.readFileSync(
      path.join(repoRoot, "client/src/pages/AdminCampaigns.tsx"),
      "utf8",
    );
    expect(adminCampaignsSource).not.toContain("MarketingStudioV2");
  });
});

describe("PR61 desktop marketing command centre frontend", () => {
  it("renders a desktop-first creation-first Studio shell", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // PR62D: creation-first Studio header replaces legacy command centre
    expect(source).toContain("creation-first-studio");
    expect(source).toContain("The Marketing App");
    expect(source).toContain("Studio —");
    expect(source).toContain("CREATION_TYPES");
    expect(source).toContain("creation-menu");
  });

  it("keeps active route wired to TheMarketingApp -> StudioHome -> StudioWorkbench", () => {
    const adminCampaigns = fs.readFileSync(
      path.join(repoRoot, "client/src/pages/AdminCampaigns.tsx"),
      "utf8",
    );
    const appShell = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    const studioHome = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/studio/StudioHome.tsx"),
      "utf8",
    );

    expect(adminCampaigns).toContain("TheMarketingApp");
    expect(appShell).toContain("StudioHome");
    expect(studioHome).toContain("StudioWorkbench");
  });

  it("includes quick actions that populate the command form and includes 1-minute video", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("function applyQuickAction");
    expect(source).toContain("setCommandForm");
    expect(source).toContain("1-minute stable-owner video ad");
    expect(source).toContain("Assembled video workflow");
  });

  it("renders readiness strip and truthful backend state labels", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Readiness / Capability Strip");
    expect(source).toContain("setup_needed");
    expect(source).toContain("waiting_for_backend");
    expect(source).toContain("insufficient_data");
  });

  it("renders required Studio workspace tabs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // PR62D: post-generation tabs replace old command-centre tabs
    for (const tab of [
      "Preview",
      "Plan",
      "Creative",
      "Media",
      "Review",
      "Schedule / Export",
      "Details",
    ]) {
      expect(source).toContain(tab);
    }
  });

  it("renders desktop right-side large preview panel with sticky layout", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Preview / Intelligence");
    // PR62D: 3-column layout with left creation menu
    expect(source).toContain("lg:grid-cols-[220px_minmax(0,1fr)_500px]");
    expect(source).toContain("sticky top-4 h-fit");
  });

  it("renders agent timeline and approval queue panels", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Agent Mission Timeline");
    expect(source).toContain("Approval queue");
    expect(source).toContain("review required");
  });

  it("keeps settings masked and resilient, without exposing raw provider secrets", () => {
    const settingsSource = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/MarketingAppSettings.tsx"),
      "utf8",
    );
    expect(settingsSource).toContain("keyMasked");
    expect(settingsSource).toContain("obfuscateSecret");
    expect(settingsSource).toContain("setup_needed");
    expect(settingsSource).not.toContain("value={settingsEntry?.keyMasked}");
  });

  it("does not reactivate legacy marketing routes", () => {
    const appSource = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    const adminCampaigns = fs.readFileSync(
      path.join(repoRoot, "client/src/pages/AdminCampaigns.tsx"),
      "utf8",
    );
    expect(appSource).not.toContain("MarketingStudioV2");
    expect(appSource).not.toContain("MarketingAppChat");
    expect(appSource).not.toContain("MarketingAppPreview");
    expect(adminCampaigns).not.toContain("MarketingStudioV2");
  });

  it("uses a min-w-0 desktop workspace container to reduce horizontal overflow risk", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("max-w-[1600px]");
    expect(source).toContain("min-w-0");
  });
});

describe("PR62D frontend Studio creation flow", () => {
  it("main screen renders creation-first Studio", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("creation-first-studio");
    expect(source).toContain("creation-menu");
    expect(source).toContain("CREATION_TYPES");
    expect(source).toContain("selectedCreationType");
  });

  it("creation menu includes Image Ad, 30-Second Video Ad, 3-Minute Assembled Video, and Signup Campaign", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Image Ad");
    expect(source).toContain("30-Second Video Ad");
    expect(source).toContain("3-Minute Assembled Video");
    expect(source).toContain("Signup Campaign");
  });

  it("Image Ad creation type calls generateMarketingImageAsset", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("case \"image_ad\": handleGenerateImageAd()");
    expect(source).toContain("generateMarketingImageAsset");
  });

  it("30-Second Video Ad creation type calls generateMarketingAdPackage", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("case \"video_ad_30s\": handleGenerateThirtySecondAdPackage()");
    expect(source).toContain("generateMarketingAdPackage");
  });

  it("3-Minute Assembled Video creation type calls generateMarketingVideoPackage", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("case \"assembled_video_3m\": handleGenerateAssembledVideoPackage()");
    expect(source).toContain("generateMarketingVideoPackage");
  });

  it("Signup Campaign creation type calls generateMarketingCampaignPackage", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("case \"signup_campaign\": handleGenerateSignupCampaignPackage()");
    expect(source).toContain("generateMarketingCampaignPackage");
  });

  it("package viewer shows user-facing sections without raw JSON", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "video_ad_30s",
          status: "draft",
          goal: "Get signups",
          audience: "stable owners",
          platforms: ["Facebook"],
          strategy: "Strategy text",
          hooks: ["hook1"],
          adCopy: ["copy1"],
          script: "30-second script",
          scenePlan: [{ order: 1, durationSeconds: 10, narration: "scene", visualPrompt: "visual" }],
          mediaRequirements: ["b-roll"],
          reviewItems: [],
          exportPack: { renderStatus: "not_required", checklist: [] },
          scheduleDrafts: [],
          blockers: [],
          setupNeeded: false,
        }}
      />,
    );
    expect(html).toContain("Package summary");
    expect(html).toContain("Strategy");
    expect(html).not.toContain("{&quot;");
    expect(html).not.toContain("JSON.stringify");
  });

  it("package viewer does not show raw JSON in main view", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "assembled_video_3m",
          strategy: "plan",
          hooks: [],
          adCopy: [],
          script: "script",
          scenePlan: [],
          mediaRequirements: [],
          reviewItems: [{ id: 1, status: "needs_review" }],
          exportPack: { renderStatus: "not_rendered" },
          scheduleDrafts: [],
          blockers: [],
          setupNeeded: false,
        }}
      />,
    );
    // review items should not be raw JSON
    expect(html).not.toContain("{&quot;id&quot;:1");
  });

  it("main screen does not show empty agent cards before generation", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // Agent timeline must be conditional — gated on isAnyGenerationPending or having run data
    expect(source).toContain("isAnyGenerationPending || autonomousRunSummaries.length > 0");
  });

  it("diagnostics are not shown first on the main screen", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // Readiness grid is inside a <details> element (collapsed by default)
    expect(source).toContain("Advanced Diagnostics");
    expect(source).toContain("Readiness / Capability Strip");
    // The creation menu appears before the diagnostics section
    const creationMenuPos = source.indexOf("creation-menu");
    const diagnosticsPos = source.indexOf("Advanced Diagnostics");
    expect(creationMenuPos).toBeGreaterThan(0);
    expect(creationMenuPos).toBeLessThan(diagnosticsPos);
  });

  it("settings setup wizard renders provider checklist items", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/MarketingAppSettings.tsx"),
      "utf8",
    );
    expect(source).toContain("setup_needed");
    expect(source).toContain("keyMasked");
  });

  it("assembled-video package clearly shows not_rendered and no fake video", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "assembled_video_3m",
          strategy: "strategy",
          hooks: [],
          adCopy: [],
          script: "script",
          scenePlan: [],
          mediaRequirements: [],
          reviewItems: [],
          exportPack: { renderStatus: "not_rendered" },
          scheduleDrafts: [],
          blockers: ["render setup"],
          setupNeeded: true,
        }}
      />,
    );
    expect(html).toContain("not_rendered");
    expect(html).toContain("No fake video is shown because render output is missing");
  });

  it("preview panel is large and positioned on the right side on desktop", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // 3-column layout with 500px right preview
    expect(source).toContain("lg:grid-cols-[220px_minmax(0,1fr)_500px]");
    expect(source).toContain("data-testid=\"preview-panel\"");
    expect(source).toContain("sticky top-4 h-fit");
  });

  it("diagnostic/intelligence queries are lazy-loaded behind lazyDiagnosticsEnabled", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // Lazy condition variables must be defined
    expect(source).toContain("lazyDiagnosticsEnabled");
    expect(source).toContain("lazyCreativeEnabled");
    expect(source).toContain("lazyMediaEnabled");
    // Each non-essential query must carry an enabled guard
    expect(source).toContain("enabled: lazyDiagnosticsEnabled");
    expect(source).toContain("enabled: lazyCreativeEnabled || lazyDiagnosticsEnabled");
    expect(source).toContain("enabled: lazyDiagnosticsEnabled || lazyMediaEnabled");
    // The lazy guard must reference Settings dialog and details tab
    expect(source).toContain("showSettingsDialog || workspaceTab === \"details\"");
  });

  it("main creation screen does not depend on diagnostics queries for its initial render", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    // Creation menu and generate button are present
    expect(source).toContain("creation-menu");
    expect(source).toContain("data-testid=\"generate-button\"");
    // The lazy conditions are declared before the creation menu in the file
    const lazyIdx = source.indexOf("lazyDiagnosticsEnabled");
    const creationMenuIdx = source.indexOf("creation-menu");
    expect(lazyIdx).toBeGreaterThan(0);
    expect(lazyIdx).toBeLessThan(creationMenuIdx);
  });

  it("details tab shows diagnostic loading placeholder when data is not yet available", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Open diagnostics to load advanced readiness data.");
  });

  it("details tab still contains Advanced Diagnostics and readiness strip sections", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("Advanced Diagnostics");
    expect(source).toContain("Readiness / Capability Strip");
    expect(source).toContain("Strategy context");
    // Details tab content is inside the workspace tabs section
    const detailsTabIdx = source.indexOf('value="details"');
    const diagnosticsIdx = source.indexOf("Advanced Diagnostics");
    expect(detailsTabIdx).toBeGreaterThan(0);
    expect(diagnosticsIdx).toBeGreaterThan(detailsTabIdx);
  });
});
