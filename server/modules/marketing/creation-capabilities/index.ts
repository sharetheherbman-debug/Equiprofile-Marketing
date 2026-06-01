import { getMarketingBackendReadiness } from "../backend-readiness";
import {
  defaultWorkspaceBudgetPolicy,
  resolveMarketingProviderRoute,
  type MarketingTask,
} from "../provider-capabilities";

type CapabilityStatus = "ready" | "setup_needed" | "planned_only" | "not_wired" | "broken";
type ExpectedOutput =
  | "image_asset"
  | "campaign_package"
  | "video_plan"
  | "rendered_video"
  | "avatar_video"
  | "voice_preview"
  | "audio_bed"
  | "export_pack"
  | "unknown";
type OutputGuarantee =
  | "playable_media"
  | "package_only"
  | "plan_only"
  | "queued_media"
  | "setup_needed"
  | "not_wired"
  | "broken";
type ViewerContractViewer =
  | "image_asset"
  | "deliverable_package"
  | "video_plan"
  | "media_job"
  | "setup_blocker"
  | "not_wired"
  | "results_summary";
type DeliverableKind =
  | "social"
  | "email"
  | "signup_campaign"
  | "image"
  | "video_plan"
  | "rendered_video"
  | "avatar"
  | "voice"
  | "music"
  | "analytics"
  | "unknown";
type ExecutionLevel = "first_class" | "partial" | "queued_only" | "future" | "blocked";

export type MarketingCreationCapability = {
  id: string;
  label: string;
  description: string;
  status: CapabilityStatus;
  primaryProcedure: string | null;
  requiredTasks: MarketingTask[];
  expectedOutput: ExpectedOutput;
  outputGuarantee: OutputGuarantee;
  viewerContract: {
    viewer: ViewerContractViewer;
    schemaVersion: "v1";
    primaryDataPath: string;
    emptyState: string;
    successState: string;
    blockerState: string;
  };
  deliverableKind: DeliverableKind;
  executionLevel: ExecutionLevel;
  proofRequired: string[];
  canGenerate: boolean;
  canPreview: boolean;
  canExport: boolean;
  canSchedule: boolean;
  missingSetup: string[];
  blockers: string[];
  notes: string[];
  routeSummary: Array<{
    task: MarketingTask;
    status: string;
    provider: string | null;
    modelId: string | null;
    reason: string | null;
  }>;
};

type Definition = {
  id: MarketingCreationCapability["id"];
  label: string;
  description: string;
  primaryProcedure: string | null;
  requiredTasks: MarketingTask[];
  expectedOutput: ExpectedOutput;
  deliverableKind: DeliverableKind;
  proofRequired: string[];
  supportLevel: "first_class" | "route_only" | "not_wired";
};

const CREATION_DEFINITIONS: Definition[] = [
  {
    id: "image_ad",
    label: "Image Ad",
    description: "Generate a real image asset when image providers are configured.",
    primaryProcedure: "generateMarketingImageAsset",
    requiredTasks: ["image_generation"],
    expectedOutput: "image_asset",
    deliverableKind: "image",
    proofRequired: ["publicUrl", "mimeType:image/*", "mediaAsset.status=completed"],
    supportLevel: "first_class",
  },
  {
    id: "video_ad_30s",
    label: "30-Second Video Ad",
    description: "Generates package-level strategy/script/scene deliverables, not an auto-rendered video.",
    primaryProcedure: "generateMarketingAdPackage",
    requiredTasks: ["scriptwriting", "scene_planning"],
    expectedOutput: "video_plan",
    deliverableKind: "video_plan",
    proofRequired: [
      "campaignItems.length>0",
      "reviewItems.created",
      "scheduleDrafts.created",
      "exportPack",
      "rendered_video_requires_publicUrl",
    ],
    supportLevel: "first_class",
  },
  {
    id: "assembled_video_3m",
    label: "3-Minute Assembled Video",
    description: "Generates an assembled-video package and scene timeline plan; rendered output needs Media Factory runtime readiness.",
    primaryProcedure: "generateMarketingVideoPackage",
    requiredTasks: ["scriptwriting", "scene_planning"],
    expectedOutput: "video_plan",
    deliverableKind: "video_plan",
    proofRequired: [
      "scenePlan.length>0",
      "mediaRequirements",
      "renderJob.status=completed",
      "mimeType:video/*",
      "publicUrl",
    ],
    supportLevel: "first_class",
  },
  {
    id: "signup_campaign",
    label: "Signup Campaign",
    description: "Generates a campaign package and persists deliverables for review/export scheduling.",
    primaryProcedure: "generateMarketingCampaignPackage",
    requiredTasks: ["campaign_strategy", "platform_copywriting"],
    expectedOutput: "campaign_package",
    deliverableKind: "signup_campaign",
    proofRequired: [
      "campaignItems.length>0",
      "reviewItems.created",
      "scheduleDrafts.created",
      "exportPack",
    ],
    supportLevel: "first_class",
  },
  {
    id: "social_post",
    label: "Social Post",
    description: "No first-class generation contract yet.",
    primaryProcedure: null,
    requiredTasks: ["platform_copywriting"],
    expectedOutput: "unknown",
    deliverableKind: "social",
    proofRequired: ["first_class_procedure", "viewer_contract"],
    supportLevel: "not_wired",
  },
  {
    id: "email_campaign",
    label: "Email Campaign",
    description: "No first-class generation contract yet.",
    primaryProcedure: null,
    requiredTasks: ["email_generation"],
    expectedOutput: "unknown",
    deliverableKind: "email",
    proofRequired: ["first_class_procedure", "viewer_contract"],
    supportLevel: "not_wired",
  },
  {
    id: "blog_seo",
    label: "Blog / SEO Article",
    description: "No first-class generation contract yet.",
    primaryProcedure: null,
    requiredTasks: ["blog_seo_generation"],
    expectedOutput: "unknown",
    deliverableKind: "unknown",
    proofRequired: ["first_class_procedure", "viewer_contract"],
    supportLevel: "not_wired",
  },
  {
    id: "weekly_content_pack",
    label: "Weekly Content Pack",
    description: "No first-class generation contract yet.",
    primaryProcedure: null,
    requiredTasks: ["campaign_strategy", "platform_copywriting"],
    expectedOutput: "unknown",
    deliverableKind: "social",
    proofRequired: ["first_class_procedure", "viewer_contract"],
    supportLevel: "not_wired",
  },
  {
    id: "avatar_video",
    label: "Avatar Video",
    description: "Avatar/voice/music flows can queue jobs, but full end-to-end playable output is not guaranteed yet.",
    primaryProcedure: "createMarketingAvatarAsset",
    requiredTasks: ["avatar_generation", "avatar_lipsync", "voiceover"],
    expectedOutput: "avatar_video",
    deliverableKind: "avatar",
    proofRequired: ["mediaAsset.status=completed", "mimeType:video/*", "publicUrl"],
    supportLevel: "route_only",
  },
];

function buildViewerContract(input: {
  viewer: ViewerContractViewer;
  primaryDataPath: string;
  emptyState: string;
  successState: string;
  blockerState: string;
}): MarketingCreationCapability["viewerContract"] {
  return {
    viewer: input.viewer,
    schemaVersion: "v1",
    primaryDataPath: input.primaryDataPath,
    emptyState: input.emptyState,
    successState: input.successState,
    blockerState: input.blockerState,
  };
}

function routeReasonsToMissingSetup(routeSummary: MarketingCreationCapability["routeSummary"]): string[] {
  return routeSummary
    .filter((route) => route.status !== "ready")
    .map((route) => `${route.task}: ${route.reason ?? route.status}`);
}

export async function getMarketingCreationCapabilities(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode?: "standard" | "elite";
}): Promise<{ qualityMode: "standard" | "elite"; capabilities: MarketingCreationCapability[] }> {
  const qualityMode = input.qualityMode ?? "standard";
  const policy = defaultWorkspaceBudgetPolicy(qualityMode);
  const backendReadiness = await getMarketingBackendReadiness({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    qualityMode,
  });

  const capabilities: MarketingCreationCapability[] = [];

  for (const definition of CREATION_DEFINITIONS) {
    const routeSummary = await Promise.all(
      definition.requiredTasks.map(async (task) => {
        const route = await resolveMarketingProviderRoute({
          tenantId: input.tenantId,
          workspaceId: input.workspaceId,
          task,
          policy,
        });
        return {
          task,
          status: route.status,
          provider: route.selected?.provider ?? null,
          modelId: route.selected?.modelId ?? null,
          reason: route.reason,
        };
      }),
    );

    const missingSetup = routeReasonsToMissingSetup(routeSummary);
    const allRoutesReady = routeSummary.length > 0 && routeSummary.every((route) => route.status === "ready");
    const blockers: string[] = [];
    const notes: string[] = [];

    if (definition.supportLevel === "not_wired") {
      capabilities.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        status: "not_wired",
        primaryProcedure: definition.primaryProcedure,
        requiredTasks: definition.requiredTasks,
        expectedOutput: definition.expectedOutput,
        outputGuarantee: "not_wired",
        viewerContract: buildViewerContract({
          viewer: "not_wired",
          primaryDataPath: "creationStatusNotice",
          emptyState: "No first-class output available.",
          successState: "n/a",
          blockerState: "Creation type is not wired yet.",
        }),
        deliverableKind: definition.deliverableKind,
        executionLevel: "future",
        proofRequired: definition.proofRequired,
        canGenerate: false,
        canPreview: false,
        canExport: false,
        canSchedule: false,
        missingSetup,
        blockers: ["No first-class procedure and viewer contract for this creation type yet."],
        notes: ["Autonomous fallback must not be treated as first-class generation readiness."],
        routeSummary,
      });
      continue;
    }

    if (definition.id === "image_ad") {
      const ready = allRoutesReady;
      if (!ready && !missingSetup.length) {
        missingSetup.push("No ready image_generation route found.");
      }
      capabilities.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        status: ready ? "ready" : "setup_needed",
        primaryProcedure: definition.primaryProcedure,
        requiredTasks: definition.requiredTasks,
        expectedOutput: definition.expectedOutput,
        outputGuarantee: ready ? "playable_media" : "setup_needed",
        viewerContract: buildViewerContract({
          viewer: ready ? "image_asset" : "setup_blocker",
          primaryDataPath: ready ? "imageGenerationResult" : "creationStatusNotice",
          emptyState: "No image generated yet.",
          successState: "Playable image URL is available.",
          blockerState: "Image provider route is not ready.",
        }),
        deliverableKind: definition.deliverableKind,
        executionLevel: ready ? "first_class" : "blocked",
        proofRequired: definition.proofRequired,
        canGenerate: ready,
        canPreview: ready,
        canExport: false,
        canSchedule: false,
        missingSetup,
        blockers,
        notes: ready
          ? ["Returns playable image asset when provider returns real media output."]
          : ["Image generation is not ready until a real image_generation route is ready."],
        routeSummary,
      });
      continue;
    }

    if (definition.id === "video_ad_30s") {
      const status: CapabilityStatus = allRoutesReady ? "planned_only" : "setup_needed";
      if (!allRoutesReady && !missingSetup.length) {
        missingSetup.push("scriptwriting and scene_planning routes are required.");
      }
      notes.push("This flow produces a package/plan. It does not guarantee a rendered playable video.");
      capabilities.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        status,
        primaryProcedure: definition.primaryProcedure,
        requiredTasks: definition.requiredTasks,
        expectedOutput: definition.expectedOutput,
        outputGuarantee: allRoutesReady ? "package_only" : "setup_needed",
        viewerContract: buildViewerContract({
          viewer: allRoutesReady ? "deliverable_package" : "setup_blocker",
          primaryDataPath: allRoutesReady ? "lastDeliverablePackage" : "creationStatusNotice",
          emptyState: "No ad package generated yet.",
          successState: "Package includes script, scene plan, and review/export metadata.",
          blockerState: "Script and scene routes are required.",
        }),
        deliverableKind: definition.deliverableKind,
        executionLevel: allRoutesReady ? "partial" : "blocked",
        proofRequired: definition.proofRequired,
        canGenerate: allRoutesReady,
        canPreview: allRoutesReady,
        canExport: allRoutesReady,
        canSchedule: allRoutesReady,
        missingSetup,
        blockers,
        notes,
        routeSummary,
      });
      continue;
    }

    if (definition.id === "assembled_video_3m") {
      const mediaFactoryReady = backendReadiness.mediaFactoryConfigStatus === "ready";
      const status: CapabilityStatus = allRoutesReady ? "planned_only" : "setup_needed";
      if (!allRoutesReady && !missingSetup.length) {
        missingSetup.push("scriptwriting and scene_planning routes are required.");
      }
      if (!mediaFactoryReady) {
        missingSetup.push("Media Factory runtime dependencies (FFmpeg/Remotion) are not ready for rendering.");
      }
      notes.push("This flow generates assembled-video package outputs. Rendered video requires a separate real render job/output.");
      capabilities.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        status,
        primaryProcedure: definition.primaryProcedure,
        requiredTasks: definition.requiredTasks,
        expectedOutput: definition.expectedOutput,
        outputGuarantee: allRoutesReady ? "plan_only" : "setup_needed",
        viewerContract: buildViewerContract({
          viewer: allRoutesReady ? "video_plan" : "setup_blocker",
          primaryDataPath: allRoutesReady ? "lastDeliverablePackage" : "creationStatusNotice",
          emptyState: "No assembled-video plan generated yet.",
          successState: "Scene plan and media requirements are generated.",
          blockerState: "Render dependencies or planning routes are missing.",
        }),
        deliverableKind: definition.deliverableKind,
        executionLevel: allRoutesReady ? "partial" : "blocked",
        proofRequired: definition.proofRequired,
        canGenerate: allRoutesReady,
        canPreview: allRoutesReady,
        canExport: allRoutesReady,
        canSchedule: allRoutesReady,
        missingSetup,
        blockers,
        notes,
        routeSummary,
      });
      continue;
    }

    if (definition.id === "signup_campaign") {
      if (!allRoutesReady && !missingSetup.length) {
        missingSetup.push("campaign_strategy and platform_copywriting routes are required.");
      }
      const scheduleStorageBroken = backendReadiness.schedulingExportReadiness === "failed";
      if (scheduleStorageBroken) {
        blockers.push("Schedule/export persistence is failing.");
      }
      capabilities.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        status: scheduleStorageBroken ? "broken" : allRoutesReady ? "ready" : "setup_needed",
        primaryProcedure: definition.primaryProcedure,
        requiredTasks: definition.requiredTasks,
        expectedOutput: definition.expectedOutput,
        outputGuarantee: scheduleStorageBroken
          ? "broken"
          : allRoutesReady
            ? "package_only"
            : "setup_needed",
        viewerContract: buildViewerContract({
          viewer: scheduleStorageBroken
            ? "setup_blocker"
            : allRoutesReady
              ? "deliverable_package"
              : "setup_blocker",
          primaryDataPath: allRoutesReady ? "lastDeliverablePackage" : "creationStatusNotice",
          emptyState: "No campaign package generated yet.",
          successState: "Campaign items + review/export/schedule package is persisted.",
          blockerState: "Campaign strategy/copy routes or schedule storage are not ready.",
        }),
        deliverableKind: definition.deliverableKind,
        executionLevel: scheduleStorageBroken
          ? "blocked"
          : allRoutesReady
            ? "first_class"
            : "blocked",
        proofRequired: definition.proofRequired,
        canGenerate: allRoutesReady && !scheduleStorageBroken,
        canPreview: allRoutesReady && !scheduleStorageBroken,
        canExport: allRoutesReady && !scheduleStorageBroken,
        canSchedule: allRoutesReady && !scheduleStorageBroken,
        missingSetup,
        blockers,
        notes: [
          "Campaign package readiness requires text generation routes and stable schedule/export persistence.",
        ],
        routeSummary,
      });
      continue;
    }

    // avatar_video (route-only)
    if (!allRoutesReady && !missingSetup.length) {
      missingSetup.push("avatar_generation, avatar_lipsync and voiceover routes are required.");
    }
    notes.push("Current avatar flow may queue jobs, but must not be treated as ready without proven playable outputs.");
    capabilities.push({
      id: definition.id,
      label: definition.label,
      description: definition.description,
      status: allRoutesReady ? "planned_only" : "setup_needed",
      primaryProcedure: definition.primaryProcedure,
      requiredTasks: definition.requiredTasks,
      expectedOutput: definition.expectedOutput,
      outputGuarantee: allRoutesReady ? "queued_media" : "setup_needed",
      viewerContract: buildViewerContract({
        viewer: allRoutesReady ? "media_job" : "setup_blocker",
        primaryDataPath: allRoutesReady ? "mediaJobs" : "creationStatusNotice",
        emptyState: "No avatar media job queued yet.",
        successState: "Avatar job is queued and must resolve to playable media.",
        blockerState: "Avatar/lipsync/voice routes are missing.",
      }),
      deliverableKind: definition.deliverableKind,
      executionLevel: allRoutesReady ? "queued_only" : "blocked",
      proofRequired: definition.proofRequired,
      canGenerate: false,
      canPreview: false,
      canExport: false,
      canSchedule: false,
      missingSetup,
      blockers,
      notes,
      routeSummary,
    });
  }

  return { qualityMode, capabilities };
}

