import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import type { QualityMode } from "@/components/marketing/studio/types";
import { MarketingAppSettings } from "./MarketingAppSettings";
import { MarketingAppAssetsPanel, MarketingAppBrandPanel, MarketingAppCalendarPanel, MarketingAppCampaignsPanel } from "./MarketingAppPanels";
import { getAssetTitle } from "./marketingAppHelpers";
import { StudioHome } from "./studio/StudioHome";
import { MarketingDeliverablePackageViewer } from "./MarketingDeliverablePackageViewer";
import { useMarketingAssets } from "./hooks/useMarketingAssets";
import { useMarketingBrandKit } from "./hooks/useMarketingBrandKit";
import { useMarketingCalendar } from "./hooks/useMarketingCalendar";
import { useMarketingCampaigns } from "./hooks/useMarketingCampaigns";
import { useMarketingReviewActions } from "./hooks/useMarketingReviewActions";
import { useMarketingWorkspaceConfig } from "./hooks/useMarketingWorkspaceConfig";

type MediaTask = "text_to_image" | "text_to_video";

const RAW_VIDEO_THRESHOLD_SECONDS = 15;
type RawMediaDecision = {
  allowRaw: boolean;
  requestedDurationSeconds: number;
  reason?: string;
};

type WorkspaceTab =
  | "strategy"
  | "creative"
  | "media_studio"
  | "review_qa"
  | "schedule_export"
  | "results_learning"
  | "settings_readiness";

type CommandQualityMode = "standard" | "elite";
type MarketingPlatformOption = "Facebook" | "Instagram" | "LinkedIn" | "TikTok" | "YouTube Shorts" | "Email" | "Blog / SEO";
type ContentTypeOption =
  | "Reel / Short"
  | "Social Post"
  | "Ad Creative"
  | "Email Campaign"
  | "Blog / SEO Article"
  | "YouTube Script"
  | "Launch Campaign"
  | "Weekly Content Pack"
  | "Avatar Video"
  | "7-Day Growth Plan"
  | "1-Minute Social Video";

type CommandFormState = {
  goal: string;
  audience: string;
  hostAppId: string;
  platforms: MarketingPlatformOption[];
  contentTypes: ContentTypeOption[];
  qualityMode: CommandQualityMode;
  exportOnly: boolean;
  requireApproval: boolean;
  durationDays: number;
};

type ImageGenerationResult = {
  status: "completed" | "processing" | "queued" | "setup_needed" | "failed";
  assetId: number | null;
  jobId: string | null;
  publicUrl: string | null;
  mimeType: string | null;
  provider: string | null;
  model: string | null;
  reason: string | null;
  setupNeeded: string[];
  errorMessage: string | null;
};

const MARKETING_PLATFORM_OPTIONS: MarketingPlatformOption[] = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "TikTok",
  "YouTube Shorts",
  "Email",
  "Blog / SEO",
];

const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  "Reel / Short",
  "Social Post",
  "Ad Creative",
  "Email Campaign",
  "Blog / SEO Article",
  "YouTube Script",
  "Launch Campaign",
  "Weekly Content Pack",
  "Avatar Video",
  "7-Day Growth Plan",
  "1-Minute Social Video",
];

const CONTENT_TYPE_TO_BACKEND: Record<ContentTypeOption, string> = {
  "Reel / Short": "short_video",
  "Social Post": "social_post",
  "Ad Creative": "ad_creative",
  "Email Campaign": "email_campaign",
  "Blog / SEO Article": "blog_seo_article",
  "YouTube Script": "youtube_script",
  "Launch Campaign": "launch_campaign",
  "Weekly Content Pack": "weekly_content_pack",
  "Avatar Video": "avatar_video",
  "7-Day Growth Plan": "seven_day_growth_plan",
  "1-Minute Social Video": "assembled_video_60s",
};

const QUICK_ACTIONS: Array<{
  id: string;
  label: string;
  goal: string;
  audience: string;
  platforms: MarketingPlatformOption[];
  contentTypes: ContentTypeOption[];
  durationDays: number;
}> = [
  {
    id: "equiprofile-launch-campaign",
    label: "EquiProfile launch campaign",
    goal: "Relaunch EquiProfile to stable owners and increase trial starts",
    audience: "stable owners",
    platforms: ["Facebook", "Instagram", "LinkedIn"],
    contentTypes: ["Launch Campaign", "Social Post", "Ad Creative"],
    durationDays: 21,
  },
  {
    id: "fifty-signups",
    label: "Get 50 signups this month",
    goal: "Get me 50 signups this month from stable owners",
    audience: "stable owners",
    platforms: ["Facebook", "Instagram", "LinkedIn", "Email"],
    contentTypes: ["7-Day Growth Plan", "Social Post", "Email Campaign"],
    durationDays: 30,
  },
  {
    id: "youtube-shorts-7day",
    label: "7-day YouTube Shorts plan",
    goal: "Create a 7-day YouTube Shorts campaign focused on stable-owner onboarding",
    audience: "stable owners and riding schools",
    platforms: ["YouTube Shorts"],
    contentTypes: ["Reel / Short", "YouTube Script", "Weekly Content Pack"],
    durationDays: 7,
  },
  {
    id: "linkedin-authority",
    label: "LinkedIn authority post",
    goal: "Publish an authority-led LinkedIn campaign for EquiProfile operations credibility",
    audience: "livery yards and instructors",
    platforms: ["LinkedIn"],
    contentTypes: ["Social Post", "Blog / SEO Article"],
    durationDays: 14,
  },
  {
    id: "inactive-trial-email",
    label: "Inactive trial email campaign",
    goal: "Reactivate inactive EquiProfile trials with a focused email sequence",
    audience: "inactive trial users",
    platforms: ["Email"],
    contentTypes: ["Email Campaign", "7-Day Growth Plan"],
    durationDays: 10,
  },
  {
    id: "facebook-relaunch",
    label: "Facebook relaunch campaign",
    goal: "Run a Facebook relaunch campaign to recover sign-up momentum",
    audience: "stable owners and livery managers",
    platforms: ["Facebook", "Instagram"],
    contentTypes: ["Ad Creative", "Social Post", "Reel / Short"],
    durationDays: 14,
  },
  {
    id: "weekly-content-pack",
    label: "Weekly content pack",
    goal: "Produce a weekly multi-platform content pack for EquiProfile growth",
    audience: "stable owners and riding schools",
    platforms: ["Facebook", "Instagram", "LinkedIn", "YouTube Shorts"],
    contentTypes: ["Weekly Content Pack", "Social Post", "Reel / Short"],
    durationDays: 7,
  },
  {
    id: "avatar-intro-video",
    label: "Avatar intro video",
    goal: "Create an avatar-led product introduction for EquiProfile",
    audience: "new trial users",
    platforms: ["Instagram", "TikTok", "YouTube Shorts"],
    contentTypes: ["Avatar Video", "Reel / Short"],
    durationDays: 7,
  },
  {
    id: "one-minute-stable-owner-video",
    label: "1-minute stable-owner video ad",
    goal: "Create a 1-minute social video ad for stable owners",
    audience: "stable owners",
    platforms: ["Facebook", "Instagram", "YouTube Shorts"],
    contentTypes: ["1-Minute Social Video", "Ad Creative"],
    durationDays: 14,
  },
];
function inferRequestedDurationSeconds(prompt: string): number {
  const lower = prompt.toLowerCase();
  const minuteMatch = lower.match(/(\d{1,2})[\s-]*(minute|minutes|min)\b/);
  if (minuteMatch) return Number(minuteMatch[1]) * 60;
  const secondMatch = lower.match(/(\d{1,3})[\s-]*(second|seconds|sec|secs|s)\b/);
  if (secondMatch) return Number(secondMatch[1]);
  if (/youtube/.test(lower) && /(video|long)/.test(lower)) return 180;
  if (/reel|shorts?|facebook.*ad|instagram|tiktok/.test(lower)) return 30;
  return 10;
}

function requiresAssembly(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    /3-minute|3 minute|youtube/.test(lower) ||
    /assembled|scene plan|campaign/.test(lower) ||
    /(facebook ad|instagram reel|tiktok|shorts?)/.test(lower)
  );
}

export function shouldQueueRawMediaJob(input: {
  task: MediaTask;
  prompt: string;
  providerMaxRawSeconds?: number;
}): RawMediaDecision {
  if (input.task !== "text_to_video") return { allowRaw: true, requestedDurationSeconds: 0 };
  const requestedDurationSeconds = inferRequestedDurationSeconds(input.prompt);
  const providerMaxRawSeconds = input.providerMaxRawSeconds;
  if (requiresAssembly(input.prompt)) {
    return {
      allowRaw: false,
      requestedDurationSeconds,
      reason: "This request needs an assembled scene plan instead of a single raw AI clip.",
    };
  }
  if (
    requestedDurationSeconds >= RAW_VIDEO_THRESHOLD_SECONDS &&
    (typeof providerMaxRawSeconds !== "number" || providerMaxRawSeconds < requestedDurationSeconds)
  ) {
    return {
      allowRaw: false,
      requestedDurationSeconds,
      reason:
        typeof providerMaxRawSeconds === "number"
          ? `Raw clip limit is ${providerMaxRawSeconds}s for the active provider.`
          : "Raw clip duration support is not confirmed for this provider.",
    };
  }
  if (
    typeof providerMaxRawSeconds === "number" &&
    requestedDurationSeconds > providerMaxRawSeconds
  ) {
    return {
      allowRaw: false,
      requestedDurationSeconds,
      reason: `Raw clip limit is ${providerMaxRawSeconds}s for the active provider.`,
    };
  }
  return { allowRaw: true, requestedDurationSeconds };
}

function SectionErrorCard({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs">Something failed to load. Please retry.</p>
      <Button type="button" variant="outline" size="sm" className="mt-3 rounded-full" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function triggerDownload(url: string, filename = "marketing-asset") {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function statusPillClass(status: string | undefined): string {
  if (!status) return "border-stone-300 bg-stone-100 text-stone-600";
  if (status === "ready" || status === "completed" || status === "active") return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (status === "partial" || status === "processing" || status === "queued" || status === "insufficient_data") return "border-amber-300 bg-amber-50 text-amber-700";
  if (status === "blocked" || status === "failed" || status === "provider_unavailable" || status === "connector_unavailable") return "border-red-300 bg-red-50 text-red-700";
  if (status === "setup_needed" || status === "waiting_for_backend" || status === "no_results_yet") return "border-stone-300 bg-stone-100 text-stone-700";
  return "border-stone-300 bg-stone-100 text-stone-700";
}

function formatStatusLabel(status: string | undefined): string {
  if (!status) return "waiting_for_backend";
  return status.replace(/_/g, " ");
}

function firstLine(value: unknown, fallback = "No details yet."): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const [line] = trimmed.split(/\r?\n/, 1);
  return line || fallback;
}

export function TheMarketingApp({ onBack }: { onBack?: () => void }) {
  const utils = trpc.useUtils();
  const workspace = useMarketingWorkspaceConfig();

  const [quality, setQuality] = useState<QualityMode>("elite");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("strategy");
  const [approvalReasonDraft, setApprovalReasonDraft] = useState<Record<string, string>>({});
  const [lastAutonomousRun, setLastAutonomousRun] = useState<Record<string, unknown> | null>(null);
  const [lastDeliverablePackage, setLastDeliverablePackage] = useState<Record<string, unknown> | null>(null);
  const [imageGenerationResult, setImageGenerationResult] = useState<ImageGenerationResult | null>(null);
  const [commandForm, setCommandForm] = useState<CommandFormState>({
    goal: "Get me 50 signups this month from stable owners.",
    audience: workspace.defaultAudience,
    hostAppId: workspace.host_app_id,
    platforms: ["Facebook", "Instagram", "LinkedIn"],
    contentTypes: ["7-Day Growth Plan", "Social Post", "Reel / Short"],
    qualityMode: "elite",
    exportOnly: true,
    requireApproval: true,
    durationDays: 30,
  });

  const { brandKit, setBrandKit, overlayTemplates, upsertBrandKitMutation, selectBrandLogoMutation } = useMarketingBrandKit(workspace);
  const {
    assets,
    allAssets,
    selectedAsset,
    selectedAssetId,
    setSelectedAssetId,
    assetFilter,
    setAssetFilter,
    assetSearch,
    setAssetSearch,
    assetModalOpen,
    setAssetModalOpen,
    logoAssets,
    deleteMediaAsset,
    createBrandedMedia,
    canApplyBrand,
  } = useMarketingAssets(workspace);
  const {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    campaignForm,
    setCampaignForm,
    beastModeForm,
    setBeastModeForm,
    marketingCampaigns,
    selectedCampaignDetails,
    createCampaignMutation,
    generateCampaignPlanMutation,
    generateWeeklyContentPackMutation,
    attachAssetMutation,
    detachAssetMutation,
    selectedCampaign,
    beastModeRunList,
    selectedBeastModeRunData,
    createBeastModeRunMutation,
    generateBeastModeVariantsMutation,
    createBeastModeBatchRenderJobsMutation,
    createScheduleDraftsFromCampaignMutation,
  } = useMarketingCampaigns(workspace);
  const {
    runQaMutation,
    approveOutputMutation,
    rejectOutputMutation,
    requestChangesMutation,
    markExportedMutation,
    approveBeastModeVariantMutation,
    rejectBeastModeVariantMutation,
    requestBeastModeVariantChangesMutation,
  } = useMarketingReviewActions(workspace);
  const {
    scheduleDrafts,
    mappedScheduleDrafts,
    rescheduleScheduleDraftMutation,
    cancelScheduleDraftMutation,
    exportScheduleDraftPackMutation,
  } = useMarketingCalendar(workspace);
  const approvals = trpc.admin.listApprovalQueue.useQuery({ tenantId: workspace.tenantId });
  const diagnostics = trpc.admin.getAIDiagnostics.useQuery(undefined, { refetchInterval: 30_000 });
  const createMarketingStudioPlan = trpc.admin.createMarketingStudioPlan.useMutation({
    onSuccess: async (data) => {
      const result = data as { capability?: { finalDeliveryMode?: string } };
      const mode = result.capability?.finalDeliveryMode;
      if (mode === "assembled_video") {
        toast.success("Plan created", { description: "This request will be assembled in the media factory." });
      } else {
        toast.success("Plan created");
      }
      await utils.admin.listApprovalQueue.invalidate();
    },
    onError: (error) => {
      toast.error("Could not create studio plan", { description: error.message });
    },
  });

  const backendReadinessQuery = trpc.admin.getMarketingBackendReadiness.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      qualityMode: quality,
    },
    { refetchInterval: 30_000 },
  );
  const connectorReadinessQuery = trpc.admin.getMarketingConnectorReadiness.useQuery(
    { tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id },
    { refetchInterval: 30_000 },
  );
  const mediaResolverStatusQuery = trpc.admin.getMarketingMediaJobResolverStatus.useQuery(
    { tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id },
    { refetchInterval: 30_000 },
  );
  const resolveQueuedMediaMutation = trpc.admin.resolveQueuedMarketingMediaJobs.useMutation({
    onSuccess: async () => {
      toast.success("Media resolver run complete");
      await mediaResolverStatusQuery.refetch();
      await utils.admin.getMarketingBackendReadiness.invalidate();
    },
    onError: (error) => toast.error("Could not resolve queued media jobs", { description: error.message }),
  });
  const commandCentreQuery = trpc.admin.getMarketingCommandCentreState.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      qualityMode: quality,
      campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
      goalHint: commandForm.goal,
      audienceHint: commandForm.audience,
      platformsHint: commandForm.platforms,
    },
    { refetchInterval: 30_000 },
  );
  const performanceContextQuery = trpc.admin.getMarketingPerformanceContext.useQuery({
    tenantId: workspace.tenantId,
    workspaceId: workspace.marketing_workspace_id,
    hostAppId: workspace.host_app_id,
    campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
  });
  const winningPatternsQuery = trpc.admin.getMarketingWinningPatterns.useQuery({
    tenantId: workspace.tenantId,
    workspaceId: workspace.marketing_workspace_id,
    hostAppId: workspace.host_app_id,
    campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
  });
  const learningInsightsQuery = trpc.admin.getMarketingLearningInsights.useQuery({
    tenantId: workspace.tenantId,
    workspaceId: workspace.marketing_workspace_id,
    hostAppId: workspace.host_app_id,
    campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
  });
  const playbookQuery = trpc.admin.recommendMarketingPlaybook.useQuery(
    {
      platform: commandForm.platforms[0] ?? "LinkedIn",
      goal: commandForm.goal || "Campaign growth",
      audience: commandForm.audience || workspace.defaultAudience,
    },
    { enabled: Boolean(commandForm.goal.trim() && commandForm.platforms.length) },
  );
  const specialistsQuery = trpc.admin.listMarketingPlatformSpecialists.useQuery();
  const recommendedSpecialistsQuery = trpc.admin.recommendMarketingPlatformSpecialists.useQuery(
    {
      platforms: commandForm.platforms,
      goal: commandForm.goal || "Campaign growth",
      contentTypes: commandForm.contentTypes.map((contentType) => CONTENT_TYPE_TO_BACKEND[contentType]),
    },
    { enabled: Boolean(commandForm.goal.trim() && commandForm.platforms.length) },
  );
  const brandMemoryQuery = trpc.admin.getMarketingBrandMemory.useQuery({
    tenantId: workspace.tenantId,
    workspaceId: workspace.marketing_workspace_id,
    hostAppId: workspace.host_app_id,
  });
  const trendContextQuery = trpc.admin.getMarketingTrendContext.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      platform: commandForm.platforms[0],
      lookbackDays: 30,
    },
    { enabled: Boolean(commandForm.platforms.length) },
  );
  const competitorContextQuery = trpc.admin.getMarketingCompetitorContext.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      platform: commandForm.platforms[0],
      lookbackDays: 30,
    },
    { enabled: Boolean(commandForm.platforms.length) },
  );
  const contentGapQuery = trpc.admin.detectMarketingContentGaps.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      platform: commandForm.platforms[0] ?? "LinkedIn",
    },
    { enabled: Boolean(commandForm.platforms.length) },
  );
  const managerGuidanceQuery = trpc.admin.generateMarketingManagerGuidance.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal: commandForm.goal || "Campaign growth",
      audience: commandForm.audience || workspace.defaultAudience,
      platforms: commandForm.platforms,
    },
    { enabled: Boolean(commandForm.goal.trim() && commandForm.audience.trim() && commandForm.platforms.length) },
  );
  const managerNextStepsQuery = trpc.admin.recommendMarketingNextSteps.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
      goal: commandForm.goal || "Campaign growth",
      audience: commandForm.audience || workspace.defaultAudience,
      platforms: commandForm.platforms,
    },
    { enabled: Boolean(commandForm.goal.trim() && commandForm.audience.trim() && commandForm.platforms.length) },
  );
  const creativeScoreQuery = trpc.admin.scoreMarketingCreative.useQuery(
    {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      platform: commandForm.platforms[0] ?? "LinkedIn",
      contentType: CONTENT_TYPE_TO_BACKEND[commandForm.contentTypes[0] ?? "Social Post"],
      goal: commandForm.goal || "Campaign growth",
      hook: commandForm.goal,
      body: managerGuidanceQuery.data?.guidance?.join(" ") ?? "",
      cta: brandKit.primaryCta,
      claims: [],
      proofPoints: [],
      hasVisualAsset: false,
    },
    { enabled: Boolean(commandForm.goal.trim() && commandForm.platforms.length) },
  );
  const runAutonomousCampaignMutation = trpc.admin.runAutonomousMarketingCampaign.useMutation({
    onSuccess: async (result) => {
      const payload = (result as Record<string, unknown>) ?? null;
      setLastAutonomousRun(payload);
      setLastDeliverablePackage((payload?.deliverablePackage as Record<string, unknown> | undefined) ?? null);
      toast.success("Autonomous campaign run created");
      if (typeof payload?.campaignId === "number") {
        setSelectedCampaignId(String(payload.campaignId));
      }
      await Promise.all([
        commandCentreQuery.refetch(),
        performanceContextQuery.refetch(),
        winningPatternsQuery.refetch(),
        learningInsightsQuery.refetch(),
        mediaResolverStatusQuery.refetch(),
        utils.admin.listApprovalQueue.invalidate(),
      ]);
    },
    onError: (error) => {
      toast.error("Could not run autonomous campaign", { description: error.message });
    },
  });
  const generateAdPackageMutation = trpc.admin.generateMarketingAdPackage.useMutation({
    onSuccess: async (result) => {
      const payload = (result as Record<string, unknown>) ?? null;
      setLastDeliverablePackage(payload);
      if (typeof payload?.campaignId === "number") setSelectedCampaignId(String(payload.campaignId));
      toast.success("30-second ad package generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => toast.error("Could not generate ad package", { description: error.message }),
  });
  const generateVideoPackageMutation = trpc.admin.generateMarketingVideoPackage.useMutation({
    onSuccess: async (result) => {
      const payload = (result as Record<string, unknown>) ?? null;
      setLastDeliverablePackage(payload);
      if (typeof payload?.campaignId === "number") setSelectedCampaignId(String(payload.campaignId));
      toast.success("3-minute assembled video package generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => toast.error("Could not generate video package", { description: error.message }),
  });
  const generateCampaignPackageMutation = trpc.admin.generateMarketingCampaignPackage.useMutation({
    onSuccess: async (result) => {
      const payload = (result as Record<string, unknown>) ?? null;
      setLastDeliverablePackage(payload);
      if (typeof payload?.campaignId === "number") setSelectedCampaignId(String(payload.campaignId));
      toast.success("Signup campaign package generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => toast.error("Could not generate campaign package", { description: error.message }),
  });
  const generateImageAdMutation = trpc.admin.generateMarketingImageAsset.useMutation({
    onSuccess: async (data) => {
      const result = data as ImageGenerationResult;
      setImageGenerationResult(result);
      if (typeof result.assetId === "number") {
        setSelectedAssetId(result.assetId);
      }
      await utils.admin.listMediaAssets.invalidate();
      if (result.status === "completed") {
        toast.success("Image ad generated");
      } else if (result.status === "setup_needed") {
        toast.error("Image generation setup needed", { description: result.reason ?? result.setupNeeded[0] ?? "Configure an image provider first." });
      } else if (result.status === "failed") {
        toast.error("Image generation failed", { description: result.errorMessage ?? result.reason ?? "No playable image output was returned." });
      } else {
        toast.success("Image generation queued");
      }
    },
    onError: (error) => {
      setImageGenerationResult({
        status: "failed",
        assetId: null,
        jobId: null,
        publicUrl: null,
        mimeType: null,
        provider: null,
        model: null,
        reason: error.message,
        setupNeeded: [],
        errorMessage: error.message,
      });
      toast.error("Image generation failed", { description: error.message });
    },
  });

  const createSectionHasError = createMarketingStudioPlan.isError || diagnostics.isError;
  const assetsSectionHasError = assets.isError;
  const campaignsSectionHasError = marketingCampaigns.isError || selectedCampaignDetails.isError;
  const calendarSectionHasError = scheduleDrafts.isError;

  function handleDeleteAsset(assetId: number) {
    if (!window.confirm("Delete this asset permanently? This cannot be undone.")) return;
    deleteMediaAsset.mutate({ id: assetId });
  }

  function handleRegenerateAsset() {
    toast.info("Regeneration is disabled for this flow. Use guided Studio planning.");
  }

  function handleCopyUrl(url: string) {
    void navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  function handleCreateCampaign() {
    if (!campaignForm.name.trim() || !campaignForm.goal.trim() || !campaignForm.audience.trim()) {
      toast.error("Complete the campaign brief first");
      return;
    }

    createCampaignMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      name: campaignForm.name.trim(),
      goal: campaignForm.goal.trim(),
      audience: campaignForm.audience.trim(),
      channels: campaignForm.channels.split(",").map((value) => value.trim()).filter(Boolean),
      startDate: campaignForm.startDate,
      durationDays: campaignForm.durationDays,
    });
  }

  function handleGenerateSevenDayPlan(campaignId: string) {
    generateCampaignPlanMutation.mutate({
      campaignId: Number(campaignId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
    });
  }

  function handleGenerateWeeklyPack(campaignId: string) {
    generateWeeklyContentPackMutation.mutate({
      campaignId: Number(campaignId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
    });
  }

  function handleToggleAttachedAsset(campaignId: string, assetId: number) {
    if (!selectedCampaign) return;
    const attached = selectedCampaign.attachedAssetIds.includes(assetId);
    if (attached) {
      detachAssetMutation.mutate({ campaignId: Number(campaignId), mediaAssetId: assetId });
      return;
    }
    attachAssetMutation.mutate({ campaignId: Number(campaignId), mediaAssetId: assetId });
  }

  function handleExportCampaign(campaignId: string) {
    utils.admin.exportCampaignPack.fetch({
      campaignId: Number(campaignId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      includeMarkdown: true,
    }).then((pack) => {
      const data = typeof (pack as any).markdown === "string"
        ? (pack as any).markdown
        : JSON.stringify(pack, null, 2);
      triggerDownload(`data:text/plain;charset=utf-8,${encodeURIComponent(data)}`, `campaign-${campaignId}.txt`);
      toast.success("Campaign plan ready to export");
    }).catch((error) => {
      toast.error("Could not export campaign", { description: error instanceof Error ? error.message : String(error) });
    });
  }

  function handleRunCampaignItemQa(campaignItemId: string) {
    runQaMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      targetType: "campaign_item",
      targetId: campaignItemId,
    });
  }

  function handleApproveCampaignItem(campaignItemId: string) {
    approveOutputMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      targetType: "campaign_item",
      targetId: campaignItemId,
    });
  }

  function handleRejectCampaignItem(campaignItemId: string, reason: string) {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    rejectOutputMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      targetType: "campaign_item",
      targetId: campaignItemId,
      reason,
    });
  }

  function handleRequestCampaignItemChanges(campaignItemId: string, reason: string) {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    requestChangesMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      targetType: "campaign_item",
      targetId: campaignItemId,
      reason,
    });
  }

  function parseCommaSeparatedValues(value: string) {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  function handleGenerateBeastMode(campaignId: string) {
    const requestedPlatforms = parseCommaSeparatedValues(beastModeForm.requestedPlatforms);
    const requestedLanguages = parseCommaSeparatedValues(beastModeForm.requestedLanguages);
    if (!requestedPlatforms.length || !requestedLanguages.length) {
      toast.error("Select Beast Mode platforms and languages first");
      return;
    }
    createBeastModeRunMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      campaignId: Number(campaignId),
      name: `${selectedCampaign?.name ?? campaignForm.name} Beast Mode`,
      goal: selectedCampaign?.goal ?? campaignForm.goal,
      audience: selectedCampaign?.audience ?? campaignForm.audience,
      mode: beastModeForm.mode,
      requestedVariantCount: beastModeForm.requestedVariantCount,
      requestedPlatforms: requestedPlatforms as Array<"Facebook" | "Instagram" | "TikTok" | "LinkedIn" | "YouTube" | "Email" | "Blog / SEO">,
      requestedLanguages: requestedLanguages as Array<"English" | "Afrikaans" | "Zulu" | "French" | "Spanish" | "German" | "Portuguese">,
    }, {
      onSuccess: (data) => {
        generateBeastModeVariantsMutation.mutate({
          runId: Number((data as any).id),
          tenantId: workspace.tenantId,
          workspaceId: workspace.marketing_workspace_id,
          hostAppId: workspace.host_app_id,
        });
      },
    });
  }

  function handleApproveBeastModeVariant(variantId: string) {
    approveBeastModeVariantMutation.mutate({
      id: Number(variantId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
    });
  }

  function handleRejectBeastModeVariant(variantId: string, reason: string) {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    rejectBeastModeVariantMutation.mutate({
      id: Number(variantId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      reason,
    });
  }

  function handleRequestBeastModeVariantChanges(variantId: string, reason: string) {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    requestBeastModeVariantChangesMutation.mutate({
      id: Number(variantId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      reason,
    });
  }

  function handleCreateBeastModeRenderJobs(runId: string, variantIds: string[]) {
    createBeastModeBatchRenderJobsMutation.mutate({
      runId: Number(runId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      maxRenderJobs: 5,
      variantIds: variantIds.map((id) => Number(id)).filter((id) => Number.isFinite(id)),
    });
  }

  function handleExportBeastModePack(runId: string) {
    utils.admin.exportBeastModePack.fetch({
      runId: Number(runId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      includeRejected: false,
    }).then((pack) => {
      const data = typeof (pack as any).markdown === "string"
        ? (pack as any).markdown
        : JSON.stringify(pack, null, 2);
      triggerDownload(`data:text/plain;charset=utf-8,${encodeURIComponent(data)}`, `beast-mode-${runId}.md`);
      toast.success("Beast Mode pack ready to export");
    }).catch((error) => {
      toast.error("Could not export Beast Mode pack", { description: error instanceof Error ? error.message : String(error) });
    });
  }

  function handleSaveBrandKit() {
    upsertBrandKitMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      brandName: brandKit.brandName,
      domain: brandKit.domain,
      primaryCta: brandKit.primaryCta,
      toneOfVoice: brandKit.toneOfVoice,
      primaryColor: brandKit.primaryColor,
      secondaryColor: brandKit.secondaryColor,
      overlayTemplate: brandKit.overlayTemplate,
      logoAssetId: brandKit.logoAssetId ?? null,
      logoUrl: brandKit.logoUrl ?? null,
    });
  }

  function handleSelectLogoAsset(mediaAssetId: number) {
    selectBrandLogoMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      mediaAssetId,
    });
  }

  function handleApplyBrand() {
    if (!canApplyBrand || typeof selectedAsset?.id !== "number") return;
    createBrandedMedia.mutate({
      rawAssetId: selectedAsset.id,
      domainText: brandKit.domain,
      ctaText: brandKit.primaryCta,
      watermarkText: brandKit.brandName,
      aspectRatio: "16:9",
    });
  }

  function handleMarkCampaignItemExported(campaignItemId: string) {
    markExportedMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      targetType: "campaign_item",
      targetId: campaignItemId,
    });
  }

  function applyQuickAction(actionId: string) {
    const action = QUICK_ACTIONS.find((item) => item.id === actionId);
    if (!action) return;
    setCommandForm((current) => ({
      ...current,
      goal: action.goal,
      audience: action.audience,
      platforms: action.platforms,
      contentTypes: action.contentTypes,
      durationDays: action.durationDays,
    }));
    setActiveTab("strategy");
  }

  function togglePlatform(platform: MarketingPlatformOption) {
    setCommandForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((value) => value !== platform)
        : [...current.platforms, platform],
    }));
  }

  function toggleContentType(contentType: ContentTypeOption) {
    setCommandForm((current) => ({
      ...current,
      contentTypes: current.contentTypes.includes(contentType)
        ? current.contentTypes.filter((value) => value !== contentType)
        : [...current.contentTypes, contentType],
    }));
  }

  function handleRunAutonomousCampaign() {
    if (!commandForm.goal.trim() || !commandForm.audience.trim() || !commandForm.platforms.length || !commandForm.contentTypes.length) {
      toast.error("Complete goal, audience, platform and content type first");
      return;
    }
    if (backendReadinessQuery.isLoading) {
      toast.info("waiting_for_backend", { description: "Readiness is still loading. Please retry in a moment." });
      return;
    }
    setQuality(commandForm.qualityMode);
    runAutonomousCampaignMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      qualityMode: commandForm.qualityMode,
      goal: commandForm.goal,
      audience: commandForm.audience,
      platforms: commandForm.platforms,
      durationDays: commandForm.durationDays,
      contentTypes: commandForm.contentTypes.map((contentType) => CONTENT_TYPE_TO_BACKEND[contentType]),
      exportOnly: commandForm.exportOnly,
      requireApproval: commandForm.requireApproval,
    });
  }

  function handleGenerateImageAd() {
    if (!commandForm.goal.trim()) {
      toast.error("Add an image ad prompt first");
      return;
    }
    generateImageAdMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      prompt: commandForm.goal.trim(),
      platform: commandForm.platforms[0],
      aspectRatio: "1:1",
      qualityMode: commandForm.qualityMode,
      campaignId: selectedCampaignId ? Number(selectedCampaignId) : null,
    });
  }

  function handleGenerateThirtySecondAdPackage() {
    if (!commandForm.goal.trim() || !commandForm.audience.trim() || !commandForm.platforms.length) {
      toast.error("Add goal, audience, and platform first");
      return;
    }
    generateAdPackageMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal: commandForm.goal,
      audience: commandForm.audience,
      platforms: commandForm.platforms,
      durationSeconds: 30,
      qualityMode: commandForm.qualityMode,
      exportOnly: commandForm.exportOnly,
      requireApproval: commandForm.requireApproval,
    });
  }

  function handleGenerateAssembledVideoPackage() {
    if (!commandForm.goal.trim() || !commandForm.audience.trim() || !commandForm.platforms.length) {
      toast.error("Add goal, audience, and platform first");
      return;
    }
    generateVideoPackageMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal: commandForm.goal,
      audience: commandForm.audience,
      platform: commandForm.platforms[0],
      durationSeconds: 180,
      qualityMode: commandForm.qualityMode,
      exportOnly: commandForm.exportOnly,
      requireApproval: commandForm.requireApproval,
    });
  }

  function handleGenerateSignupCampaignPackage() {
    if (!commandForm.goal.trim() || !commandForm.audience.trim() || !commandForm.platforms.length) {
      toast.error("Add goal, audience, and platform first");
      return;
    }
    generateCampaignPackageMutation.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal: commandForm.goal,
      audience: commandForm.audience,
      platforms: commandForm.platforms,
      durationDays: commandForm.durationDays,
      qualityMode: commandForm.qualityMode,
      exportOnly: commandForm.exportOnly,
      requireApproval: commandForm.requireApproval,
      targetOutcome: "50 monthly signups",
    });
  }

  const backendReadiness = (backendReadinessQuery.data as Record<string, any> | undefined) ?? undefined;
  const connectorReadiness = (connectorReadinessQuery.data as Record<string, any> | undefined) ?? undefined;
  const commandCentre = (commandCentreQuery.data as Record<string, any> | undefined) ?? undefined;
  const autonomousRun = (lastAutonomousRun ?? null) as Record<string, any> | null;
  const autonomousRunSummaries = (autonomousRun?.runSummaries as Array<Record<string, any>> | undefined) ?? [];
  const approvalQueueRows = ((approvals.data as Array<Record<string, any>> | undefined) ?? []);
  const guidanceRows = ((managerGuidanceQuery.data as { guidance?: string[] } | undefined)?.guidance ?? []);
  const campaignTargetIsOneMinute = commandForm.contentTypes.includes("1-Minute Social Video")
    || /\b1[-\s]?minute\b|\b60[-\s]?second/.test(commandForm.goal.toLowerCase());

  const readinessCards = [
    {
      id: "providers",
      title: "AI Providers",
      status: backendReadiness?.providerCapabilityReadiness?.status ?? "waiting_for_backend",
      reason: firstLine(backendReadiness?.providerCapabilityReadiness?.providers?.[0]?.reason ?? backendReadiness?.providerCapabilityReadiness?.status, "Provider capability status pending."),
    },
    {
      id: "stock-media",
      title: "Stock Media",
      status: backendReadiness?.stockMediaConfigStatus ?? "waiting_for_backend",
      reason: backendReadiness?.stockMediaConfigStatus === "ready" ? "Pexels/Pixabay config detected." : "setup_needed when no stock provider key exists.",
    },
    {
      id: "media-factory",
      title: "Media Factory",
      status: backendReadiness?.mediaFactoryConfigStatus ?? "waiting_for_backend",
      reason: backendReadiness?.ffmpegAvailability && backendReadiness?.remotionAvailability ? "FFmpeg + Remotion available." : "setup_needed when FFmpeg/Remotion is missing.",
    },
    {
      id: "avatar-voice-music",
      title: "Avatar / Voice / Music",
      status: backendReadiness?.avatarReadiness ?? "waiting_for_backend",
      reason: `Voice ${formatStatusLabel(backendReadiness?.voiceReadiness)} | Music ${formatStatusLabel(backendReadiness?.musicReadiness)}`,
    },
    {
      id: "qa",
      title: "QA / Visual QA",
      status: backendReadiness?.visualQaReadiness ?? "waiting_for_backend",
      reason: `Deterministic QA ${formatStatusLabel(backendReadiness?.qaReadiness)}.`,
    },
    {
      id: "results",
      title: "Results Tracking",
      status: backendReadiness?.resultsConversionReadiness ?? "waiting_for_backend",
      reason: `Performance context: ${formatStatusLabel((performanceContextQuery.data as any)?.status)}.`,
    },
    {
      id: "connectors",
      title: "Connectors",
      status: connectorReadiness?.status ?? "waiting_for_backend",
      reason: connectorReadiness?.counts?.readyForPosting
        ? `${connectorReadiness.counts.readyForPosting} platform(s) ready for posting.`
        : "connector_unavailable until token/scopes are configured.",
    },
    {
      id: "publishing",
      title: "Publishing",
      status: backendReadiness?.publishingReadiness ?? "waiting_for_backend",
      reason: commandForm.exportOnly ? "Export-first enabled by default." : "Direct publish requires real connector readiness.",
    },
    {
      id: "brand-memory",
      title: "Brand Memory",
      status: (brandMemoryQuery.data as Record<string, unknown> | undefined)?.status ?? "setup_needed",
      reason: firstLine((brandMemoryQuery.data as Record<string, any> | undefined)?.sourceLabelsJson, "No brand memory records yet."),
    },
    {
      id: "market-intel",
      title: "Market Intelligence",
      status: (trendContextQuery.data as Record<string, unknown> | undefined)?.status ?? "setup_needed",
      reason: `Trend ${formatStatusLabel((trendContextQuery.data as any)?.status)} | Competitor ${formatStatusLabel((competitorContextQuery.data as any)?.status)}`,
    },
    {
      id: "learning",
      title: "Learning",
      status: (learningInsightsQuery.data as Record<string, unknown> | undefined)?.status ?? "insufficient_data",
      reason: `Winning patterns: ${formatStatusLabel((winningPatternsQuery.data as any)?.status)}.`,
    },
    {
      id: "creative-scoring",
      title: "Creative Scoring",
      status: (creativeScoreQuery.data as Record<string, unknown> | undefined)?.status ?? "waiting_for_backend",
      reason: `Score ${String((creativeScoreQuery.data as any)?.totalScore ?? "n/a")}.`,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1116] via-[#151925] to-[#f5f6f8] px-3 py-4 md:px-6 md:py-6" aria-label="The Marketing App">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
          >
            Back
          </button>
        ) : null}

        <section className="rounded-3xl border border-white/15 bg-[#111520]/90 p-5 text-white shadow-2xl backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">The Marketing App</p>
              <h1 className="mt-1 text-2xl font-semibold">Desktop Marketing Command Centre</h1>
              <p className="mt-1 text-sm text-white/70">Autonomous campaign studio for your app fleet.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge className="rounded-full border border-white/25 bg-white/10 text-white">Host app: {workspace.host_app_name}</Badge>
              <Badge className="rounded-full border border-white/25 bg-white/10 text-white">Workspace: {workspace.marketing_workspace_id}</Badge>
              <Badge className="rounded-full border border-white/25 bg-white/10 text-white">Fleet-ready</Badge>
              <Badge className={`rounded-full border ${statusPillClass(backendReadiness?.status ?? "waiting_for_backend")}`}>
                Backend: {formatStatusLabel(backendReadiness?.status ?? "waiting_for_backend")}
              </Badge>
              <Badge className={`rounded-full border ${commandForm.exportOnly ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-700"}`}>
                {commandForm.exportOnly ? "Export-first" : "Direct publish requested"}
              </Badge>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Campaign Command Box</h2>
                <p className="text-sm text-stone-500">Plan campaigns, scripts, scenes, media jobs and export-first schedules.</p>
              </div>
              <Badge className={`rounded-full border ${statusPillClass(commandCentre?.status ?? "waiting_for_backend")}`}>
                {formatStatusLabel(commandCentre?.status ?? "waiting_for_backend")}
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Campaign goal</span>
                <Input
                  value={commandForm.goal}
                  onChange={(event) => setCommandForm((current) => ({ ...current, goal: event.target.value }))}
                  placeholder="Get me 50 signups this month"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Audience</span>
                <Input
                  value={commandForm.audience}
                  onChange={(event) => setCommandForm((current) => ({ ...current, audience: event.target.value }))}
                  placeholder="stable owners"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Host app / brand</span>
                <Input value={workspace.host_app_name} readOnly />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Duration days</span>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={String(commandForm.durationDays)}
                  onChange={(event) => setCommandForm((current) => ({ ...current, durationDays: Math.max(1, Number(event.target.value) || 30) }))}
                />
              </label>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-stone-600">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {MARKETING_PLATFORM_OPTIONS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      commandForm.platforms.includes(platform)
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-stone-50 text-stone-700"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-stone-600">Content types</p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPE_OPTIONS.map((contentType) => (
                  <button
                    key={contentType}
                    type="button"
                    onClick={() => toggleContentType(contentType)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      commandForm.contentTypes.includes(contentType)
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-stone-50 text-stone-700"
                    }`}
                  >
                    {contentType}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1">
                {(["standard", "elite"] as CommandQualityMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setCommandForm((current) => ({ ...current, qualityMode: mode }));
                      setQuality(mode);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${commandForm.qualityMode === mode ? "bg-stone-900 text-white" : "text-stone-600"}`}
                  >
                    {mode === "standard" ? "Standard" : "Elite"}
                  </button>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={commandForm.exportOnly}
                  onChange={(event) => setCommandForm((current) => ({ ...current, exportOnly: event.target.checked }))}
                />
                Export-only
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={commandForm.requireApproval}
                  onChange={(event) => setCommandForm((current) => ({ ...current, requireApproval: event.target.checked }))}
                />
                Require approval
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" className="rounded-2xl" onClick={handleRunAutonomousCampaign} disabled={runAutonomousCampaignMutation.isPending}>
                {runAutonomousCampaignMutation.isPending ? "Running autonomous campaign..." : "Run autonomous campaign"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={handleGenerateImageAd} disabled={generateImageAdMutation.isPending}>
                {generateImageAdMutation.isPending ? "Generating image ad..." : "Generate Image Ad"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={handleGenerateThirtySecondAdPackage} disabled={generateAdPackageMutation.isPending}>
                {generateAdPackageMutation.isPending ? "Building 30s ad package..." : "Generate 30-second ad package"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={handleGenerateAssembledVideoPackage} disabled={generateVideoPackageMutation.isPending}>
                {generateVideoPackageMutation.isPending ? "Building 3-minute video package..." : "Generate 3-minute video package"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={handleGenerateSignupCampaignPackage} disabled={generateCampaignPackageMutation.isPending}>
                {generateCampaignPackageMutation.isPending ? "Building signup campaign package..." : "Generate signup campaign package"}
              </Button>
              {backendReadiness?.status === "setup_needed" ? (
                <Badge className="rounded-full border border-amber-300 bg-amber-50 text-amber-700">setup_needed</Badge>
              ) : null}
              {backendReadinessQuery.isError ? (
                <Badge className="rounded-full border border-stone-300 bg-stone-100 text-stone-700">waiting_for_backend</Badge>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900">Quick Actions</h3>
            <p className="mt-1 text-xs text-stone-500">Click to populate the command form.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100"
                  onClick={() => applyQuickAction(action.id)}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
              <p className="font-medium text-stone-700">Run status</p>
              <p className="mt-1">{formatStatusLabel(autonomousRun?.status as string | undefined)}</p>
              <p className="mt-1">Campaign: {String(autonomousRun?.campaignId ?? "no_results_yet")}</p>
            </div>
          </div>
        </section>

        <MarketingDeliverablePackageViewer deliverablePackage={lastDeliverablePackage ?? ((autonomousRun?.deliverablePackage as Record<string, unknown> | null) ?? null)} />

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">Readiness / Capability Strip</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => void backendReadinessQuery.refetch()}>
              Refresh
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {readinessCards.map((card) => (
              <details key={card.id} className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-800">{card.title}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPillClass(card.status)}`}>
                    {formatStatusLabel(card.status)}
                  </span>
                </summary>
                <p className="mt-2 text-xs text-stone-600">{card.reason}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Agent Mission Timeline</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(["StrategyAgent", "CopyAgent", "MediaAgent", "AvatarVoiceAgent", "QaAgent", "SchedulerAgent", "ResultsAgent"] as const).map((role) => {
              const summary = autonomousRunSummaries.find((item) => item.role === role) ?? null;
              const status = (summary?.status as string | undefined) ?? "waiting_for_backend";
              return (
                <article key={role} className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-stone-800">{role}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPillClass(status)}`}>
                      {formatStatusLabel(status)}
                    </span>
                  </div>
                  <p className="mt-2 text-stone-600">Task: {String(summary?.taskType ?? "waiting_for_backend")}</p>
                  <p className="mt-1 text-stone-500">Reason: {firstLine(summary?.reason, "No blocker recorded yet.")}</p>
                  <Badge className="mt-2 rounded-full border border-amber-300 bg-amber-50 text-amber-700">review required</Badge>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_500px]">
          <div className="min-w-0 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WorkspaceTab)} className="w-full">
              <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                <TabsTrigger value="strategy" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Strategy</TabsTrigger>
                <TabsTrigger value="creative" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Creative</TabsTrigger>
                <TabsTrigger value="media_studio" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Media Studio</TabsTrigger>
                <TabsTrigger value="review_qa" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Review / QA</TabsTrigger>
                <TabsTrigger value="schedule_export" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Schedule / Export</TabsTrigger>
                <TabsTrigger value="results_learning" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Results / Learning</TabsTrigger>
                <TabsTrigger value="settings_readiness" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Settings / Readiness</TabsTrigger>
              </TabsList>

              <TabsContent value="strategy" className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h4 className="text-sm font-semibold text-stone-900">Selected playbook</h4>
                    <p className="mt-2 text-xs text-stone-600">{firstLine((playbookQuery.data as any)?.playbook?.name, "setup_needed")}</p>
                    <p className="mt-1 text-xs text-stone-500">{firstLine((playbookQuery.data as any)?.playbook?.whenToUse, "No playbook guidance yet.")}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h4 className="text-sm font-semibold text-stone-900">Platform specialists</h4>
                    <p className="mt-2 text-xs text-stone-600">{((recommendedSpecialistsQuery.data as any)?.specialists ?? []).map((item: any) => item.name).slice(0, 3).join(", ") || "setup_needed"}</p>
                    <p className="mt-1 text-xs text-stone-500">{firstLine((recommendedSpecialistsQuery.data as any)?.notes?.[0], "Specialist mapping available once platform hints are set.")}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Brand memory + manager guidance</h4>
                  <p className="mt-2 text-xs text-stone-600">Brand: {String((brandMemoryQuery.data as any)?.brandName ?? workspace.brandName)}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-stone-600">
                    {guidanceRows.length ? guidanceRows.slice(0, 5).map((line) => <li key={line}>{line}</li>) : <li>setup_needed</li>}
                  </ul>
                </div>
                {campaignsSectionHasError ? (
                  <SectionErrorCard
                    title="Campaign strategy panel unavailable."
                    onRetry={() => {
                      void marketingCampaigns.refetch();
                      if (selectedCampaignId) void selectedCampaignDetails.refetch();
                    }}
                  />
                ) : (
                  <MarketingAppCampaignsPanel
                    form={campaignForm}
                    campaigns={campaigns}
                    selectedCampaign={selectedCampaign}
                    assets={allAssets}
                    beastMode={{
                      form: beastModeForm,
                      selectedRun: selectedBeastModeRunData,
                      runs: beastModeRunList,
                      onFormChange: (patch) => setBeastModeForm((current) => ({ ...current, ...patch })),
                      onGenerate: handleGenerateBeastMode,
                      onApproveVariant: handleApproveBeastModeVariant,
                      onRejectVariant: handleRejectBeastModeVariant,
                      onRequestVariantChanges: handleRequestBeastModeVariantChanges,
                      onCreateRenderJobs: handleCreateBeastModeRenderJobs,
                      onExportPack: handleExportBeastModePack,
                    }}
                    onFormChange={(patch) => setCampaignForm((current) => ({ ...current, ...patch }))}
                    onCreateCampaign={handleCreateCampaign}
                    onSelectCampaign={setSelectedCampaignId}
                    onGenerateSevenDayPlan={handleGenerateSevenDayPlan}
                    onGenerateWeeklyPack={handleGenerateWeeklyPack}
                    onToggleAttachedAsset={handleToggleAttachedAsset}
                    onExportCampaign={handleExportCampaign}
                    onRunQa={handleRunCampaignItemQa}
                    onApproveItem={handleApproveCampaignItem}
                    onRejectItem={handleRejectCampaignItem}
                    onRequestChanges={handleRequestCampaignItemChanges}
                    onMarkItemExported={handleMarkCampaignItemExported}
                    onCreateScheduleFromCampaign={(campaignId) => {
                      createScheduleDraftsFromCampaignMutation.mutate({
                        tenantId: workspace.tenantId,
                        workspaceId: workspace.marketing_workspace_id,
                        campaignId: Number(campaignId),
                      });
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="creative" className="space-y-4">
                {createSectionHasError ? (
                  <SectionErrorCard
                    title="Studio creative flow is temporarily unavailable."
                    onRetry={() => {
                      void diagnostics.refetch();
                      void utils.admin.listApprovalQueue.invalidate();
                    }}
                  />
                ) : (
                  <StudioHome
                    tenantId={workspace.tenantId}
                    workspaceId={workspace.marketing_workspace_id}
                    hostAppId={workspace.host_app_id}
                    onWorkbenchDone={(plan) => {
                      createMarketingStudioPlan.mutate({
                        tenantId: workspace.tenantId,
                        workspaceId: workspace.marketing_workspace_id,
                        hostAppId: workspace.host_app_id,
                        originalUserPrompt: plan.originalUserPrompt || `${plan.contentType} for ${plan.platform}`,
                        contentType: plan.contentType,
                        platform: plan.platform,
                        requestedDurationSeconds: plan.durationTargetSeconds,
                        qualityMode: quality,
                        brief: plan.brief,
                        audience: plan.audience,
                        goal: plan.goal,
                        script: plan.script,
                        scenes: plan.scenes,
                      });
                    }}
                  />
                )}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Creative scoring + improvements</h4>
                  <p className="mt-2 text-xs text-stone-600">Total score: {String((creativeScoreQuery.data as any)?.totalScore ?? "setup_needed")}</p>
                  <p className="mt-1 text-xs text-stone-500">{((creativeScoreQuery.data as any)?.warnings ?? []).slice(0, 3).join(" | ") || "No warnings yet."}</p>
                </div>
              </TabsContent>

              <TabsContent value="media_studio" className="space-y-4">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-stone-900">Media resolver status</h4>
                    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => resolveQueuedMediaMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id })}>
                      Resolve queued media jobs
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-stone-600">Status: {formatStatusLabel((mediaResolverStatusQuery.data as any)?.status ?? "waiting_for_backend")}</p>
                  <p className="mt-1 text-xs text-stone-500">{firstLine((mediaResolverStatusQuery.data as any)?.reason, "No resolver reason reported.")}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">1-minute assembled-video workflow</h4>
                  <p className="mt-2 text-xs text-stone-600">
                    {campaignTargetIsOneMinute
                      ? "Assembled video workflow active: scene plan, required media, captions, voice/music, render and QA states are tracked."
                      : "Select a 1-minute content type to force assembled-video workflow."}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">Raw AI clips stay short. 1-minute output requires assembled_video workflow.</p>
                </div>
                {assetsSectionHasError ? (
                  <SectionErrorCard title="Media assets failed to load." onRetry={() => void assets.refetch()} />
                ) : (
                  <MarketingAppAssetsPanel
                    assets={allAssets}
                    activeFilter={assetFilter}
                    searchTerm={assetSearch}
                    selectedAssetId={selectedAssetId}
                    onFilterChange={setAssetFilter}
                    onSearchChange={setAssetSearch}
                    onSelectAsset={(assetId) => {
                      setSelectedAssetId(assetId);
                      setAssetModalOpen(true);
                    }}
                    onDeleteAsset={handleDeleteAsset}
                    onRegenerateAsset={handleRegenerateAsset}
                    onDownloadAsset={(url) => triggerDownload(url, "marketing-asset")}
                    onCreateBrandedAsset={(assetId) =>
                      createBrandedMedia.mutate({
                        rawAssetId: assetId,
                        domainText: brandKit.domain,
                        ctaText: brandKit.primaryCta,
                        watermarkText: brandKit.brandName,
                        aspectRatio: "16:9",
                      })
                    }
                    onCopyUrl={handleCopyUrl}
                    canRegenerate={false}
                    canCreateBranded={false}
                  />
                )}
              </TabsContent>

              <TabsContent value="review_qa" className="space-y-4">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Approval queue</h4>
                  <p className="mt-1 text-xs text-stone-500">No auto-approval. Every output must stay review-gated.</p>
                  <div className="mt-3 space-y-3">
                    {approvalQueueRows.length ? approvalQueueRows.map((item) => {
                      const payload = (item.payload as Record<string, any> | undefined) ?? {};
                      const allowedTargetTypes = ["campaign_item", "media_asset", "render_job", "schedule_draft", "export_pack", "beast_mode_variant", "beast_mode_pack"] as const;
                      const payloadTargetType = String(payload.targetType ?? "campaign_item");
                      const targetType = (allowedTargetTypes.find((value) => value === payloadTargetType) ?? "campaign_item") as typeof allowedTargetTypes[number];
                      const targetId = String(payload.targetId ?? "");
                      const reason = approvalReasonDraft[item.id as string] ?? "";
                      const disabled = !targetId;
                      return (
                        <div key={String(item.id)} className="rounded-2xl border border-stone-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-stone-800">{String(item.task ?? "needs_review")}</p>
                            <Badge className={`rounded-full border ${statusPillClass(String(item.status ?? "needs_review"))}`}>
                              {formatStatusLabel(String(item.status ?? "needs_review"))}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-stone-500">Target: {targetType} / {targetId || "waiting_for_backend"}</p>
                          <Input
                            value={reason}
                            onChange={(event) => setApprovalReasonDraft((current) => ({ ...current, [String(item.id)]: event.target.value }))}
                            placeholder="Reason for reject / request changes"
                            className="mt-2"
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" className="rounded-full text-xs" disabled={disabled} onClick={() => approveOutputMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, targetType, targetId })}>
                              Approve
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="rounded-full text-xs" disabled={disabled || !reason.trim()} onClick={() => rejectOutputMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, targetType, targetId, reason })}>
                              Reject
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="rounded-full text-xs" disabled={disabled || !reason.trim()} onClick={() => requestChangesMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, targetType, targetId, reason })}>
                              Request changes
                            </Button>
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-xs text-stone-500">No approvals pending yet.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Deterministic + visual QA</h4>
                  <p className="mt-2 text-xs text-stone-600">Deterministic QA status: {formatStatusLabel(backendReadiness?.qaReadiness)}</p>
                  <p className="mt-1 text-xs text-stone-500">Visual QA status: {formatStatusLabel(backendReadiness?.visualQaReadiness)}</p>
                </div>
              </TabsContent>

              <TabsContent value="schedule_export" className="space-y-4">
                {calendarSectionHasError ? (
                  <SectionErrorCard title="Schedule/export panel unavailable." onRetry={() => void scheduleDrafts.refetch()} />
                ) : (
                  <MarketingAppCalendarPanel
                    campaigns={campaigns}
                    scheduleDrafts={mappedScheduleDrafts}
                    onReschedule={(draftId, newDate) => {
                      rescheduleScheduleDraftMutation.mutate({
                        id: draftId,
                        tenantId: workspace.tenantId,
                        scheduledFor: newDate,
                        reason: "Manual reschedule via command centre",
                      });
                    }}
                    onCancel={(draftId) => {
                      cancelScheduleDraftMutation.mutate({ id: draftId, tenantId: workspace.tenantId });
                    }}
                    onExportPack={() => {
                      exportScheduleDraftPackMutation.mutate({
                        tenantId: workspace.tenantId,
                        workspaceId: workspace.marketing_workspace_id,
                      });
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="results_learning" className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h4 className="text-sm font-semibold text-stone-900">Performance context</h4>
                    <p className="mt-2 text-xs text-stone-600">Status: {formatStatusLabel((performanceContextQuery.data as any)?.status)}</p>
                    <p className="mt-1 text-xs text-stone-500">Confidence: {String((performanceContextQuery.data as any)?.confidence ?? "no_results_yet")}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h4 className="text-sm font-semibold text-stone-900">Winning patterns</h4>
                    <p className="mt-2 text-xs text-stone-600">Hooks: {((winningPatternsQuery.data as any)?.winningHooks ?? []).slice(0, 3).join(", ") || "insufficient_data"}</p>
                    <p className="mt-1 text-xs text-stone-500">CTAs: {((winningPatternsQuery.data as any)?.winningCtaStyles ?? []).slice(0, 3).join(", ") || "insufficient_data"}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Trend + competitor + content gaps</h4>
                  <p className="mt-2 text-xs text-stone-600">Trend: {formatStatusLabel((trendContextQuery.data as any)?.status)}</p>
                  <p className="mt-1 text-xs text-stone-600">Competitor: {formatStatusLabel((competitorContextQuery.data as any)?.status)}</p>
                  <p className="mt-1 text-xs text-stone-600">Content gaps: {formatStatusLabel((contentGapQuery.data as any)?.status)}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-sm font-semibold text-stone-900">Learning insights + next best action</h4>
                  <p className="mt-2 text-xs text-stone-600">Insights status: {formatStatusLabel((learningInsightsQuery.data as any)?.status)}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-stone-600">
                    {((managerNextStepsQuery.data as any)?.nextSteps ?? (managerNextStepsQuery.data as any)?.actions ?? []).slice(0, 5).map((step: string) => (
                      <li key={step}>{step}</li>
                    ))}
                    {!((managerNextStepsQuery.data as any)?.nextSteps ?? (managerNextStepsQuery.data as any)?.actions ?? []).length ? <li>no_results_yet</li> : null}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="settings_readiness" className="space-y-4">
                <MarketingAppSettings
                  quality={quality}
                  onQualityChange={(mode) => {
                    setQuality(mode);
                    setCommandForm((current) => ({ ...current, qualityMode: mode }));
                  }}
                  tenantId={workspace.tenantId}
                  workspaceId={workspace.marketing_workspace_id}
                />
                <MarketingAppBrandPanel
                  brandKit={brandKit}
                  canApplyBrand={canApplyBrand}
                  selectedAssetName={selectedAsset ? getAssetTitle(selectedAsset) : null}
                  logoAssets={logoAssets}
                  overlayTemplates={overlayTemplates}
                  selectedLogoAssetId={brandKit.logoAssetId ?? null}
                  isSaving={upsertBrandKitMutation.isPending || selectBrandLogoMutation.isPending}
                  onBrandKitChange={(patch) => setBrandKit((current) => ({ ...current, ...patch }))}
                  onSaveBrandKit={handleSaveBrandKit}
                  onSelectLogoAsset={handleSelectLogoAsset}
                  onApplyBrand={handleApplyBrand}
                />
              </TabsContent>
            </Tabs>
          </div>

          <aside className="sticky top-4 h-fit rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900">Preview / Intelligence</h3>
            <p className="mt-1 text-xs text-stone-500">Large desktop preview panel with concise intelligence.</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium text-stone-800">Selected output</p>
                <p className="mt-1 text-sm text-stone-700">{commandForm.goal || "No command goal set."}</p>
                <p className="mt-1 text-xs text-stone-500">Audience: {commandForm.audience || "not set"}</p>
                <p className="mt-1 text-xs text-stone-500">Platforms: {commandForm.platforms.join(", ") || "not set"}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium text-stone-800">Image ad generation</p>
                <p className="mt-1 text-xs text-stone-600">
                  Status: {formatStatusLabel(imageGenerationResult?.status ?? "waiting_for_backend")}
                </p>
                {imageGenerationResult?.publicUrl && imageGenerationResult.mimeType?.startsWith("image/") ? (
                  <div className="mt-2 overflow-hidden rounded-xl border border-stone-200 bg-white">
                    <img src={imageGenerationResult.publicUrl} alt="Generated image ad" className="h-44 w-full object-cover" />
                  </div>
                ) : null}
                {imageGenerationResult?.status === "setup_needed" ? (
                  <p className="mt-1 text-xs text-amber-700">{imageGenerationResult.reason ?? imageGenerationResult.setupNeeded[0] ?? "Image provider setup is required."}</p>
                ) : null}
                {imageGenerationResult?.status === "failed" ? (
                  <p className="mt-1 text-xs text-red-700">{imageGenerationResult.errorMessage ?? imageGenerationResult.reason ?? "No playable output returned."}</p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium text-stone-800">Assembled video workflow</p>
                <p className="mt-1 text-xs text-stone-600">
                  {campaignTargetIsOneMinute ? "Assembled video workflow for 1-minute output is enabled." : "No 1-minute request selected yet."}
                </p>
                <p className="mt-1 text-xs text-stone-500">Render: {formatStatusLabel((mediaResolverStatusQuery.data as any)?.status)}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium text-stone-800">Creative + QA snapshot</p>
                <p className="mt-1 text-xs text-stone-600">Creative score: {String((creativeScoreQuery.data as any)?.totalScore ?? "setup_needed")}</p>
                <p className="mt-1 text-xs text-stone-600">QA: {formatStatusLabel(backendReadiness?.qaReadiness)}</p>
                <p className="mt-1 text-xs text-stone-600">Visual QA: {formatStatusLabel(backendReadiness?.visualQaReadiness)}</p>
                <p className="mt-1 text-xs text-stone-600">Publishing: {formatStatusLabel(backendReadiness?.publishingReadiness)}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium text-stone-800">Next action</p>
                <p className="mt-1 text-xs text-stone-600">
                  {firstLine(((managerNextStepsQuery.data as any)?.nextSteps ?? (managerNextStepsQuery.data as any)?.actions ?? [])[0], "no_results_yet")}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Dialog open={assetModalOpen} onOpenChange={setAssetModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedAsset ? getAssetTitle(selectedAsset) : "Asset preview"}</DialogTitle>
          </DialogHeader>
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 p-3">
                {selectedAsset.publicUrl && String(selectedAsset.mimeType ?? "").startsWith("image/") ? (
                  <img src={selectedAsset.publicUrl} alt={getAssetTitle(selectedAsset)} className="w-full object-contain" />
                ) : selectedAsset.publicUrl && String(selectedAsset.mimeType ?? "").startsWith("video/") ? (
                  <video src={selectedAsset.publicUrl} className="w-full object-contain" controls aria-label={getAssetTitle(selectedAsset)} />
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center text-sm text-stone-500">
                    Preview unavailable for this asset type.
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.publicUrl ? (
                  <a href={selectedAsset.publicUrl} target="_blank" rel="noreferrer" className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
                    Open
                  </a>
                ) : null}
                {selectedAsset.publicUrl ? (
                  <button type="button" className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50" onClick={() => triggerDownload(selectedAsset.publicUrl!, `asset-${selectedAsset.id ?? "export"}`)}>
                    Download
                  </button>
                ) : null}
                {typeof selectedAsset.id === "number" ? (
                  <button type="button" className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50" onClick={() => handleDeleteAsset(selectedAsset.id)}>
                    Delete permanently
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
