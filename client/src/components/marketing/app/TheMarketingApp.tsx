import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { MarketingStudioPlan } from "@shared/_core/marketingStudioPlan";
import type { QualityMode } from "@/components/marketing/studio/types";
import { MarketingAppSettings } from "./MarketingAppSettings";
import { inferMarketingWorkspaceIntent } from "./marketingIntentRouter";
import { useMarketingAssets } from "./hooks/useMarketingAssets";
import { useMarketingBrandKit } from "./hooks/useMarketingBrandKit";
import { useMarketingCalendar } from "./hooks/useMarketingCalendar";
import { useMarketingCampaigns } from "./hooks/useMarketingCampaigns";
import { useMarketingCopyPackages } from "./hooks/useMarketingCopyPackages";
import { useMarketingProductProfile } from "./hooks/useMarketingProductProfile";
import { useMarketingReviewActions } from "./hooks/useMarketingReviewActions";
import { useMarketingWorkspaceConfig } from "./hooks/useMarketingWorkspaceConfig";
import { StudioWorkbench } from "./studio/StudioWorkbench";
import { CampaignPlanPanel, type CampaignPlan } from "./workspace/CampaignPlanPanel";
import { CampaignPromptPanel } from "./workspace/CampaignPromptPanel";
import { MarketingCalendarView } from "./workspace/MarketingCalendarView";
import { MarketingLibraryView } from "./workspace/MarketingLibraryView";
import { MarketingPreviewPanel } from "./workspace/MarketingPreviewPanel";
import { MarketingResultsView } from "./workspace/MarketingResultsView";
import { MarketingWorkspaceShell } from "./workspace/MarketingWorkspaceShell";
import { ProductContextPanel } from "./workspace/ProductContextPanel";
import { WorkflowStatusPanel } from "./workspace/WorkflowStatusPanel";

type MediaTask = "text_to_image" | "text_to_video";
type PrimaryPackage = "signup_campaign" | "weekly_content_pack" | "email_campaign" | "social_post" | "paid_social_ad" | "image_ad";
type WorkspaceView = "create" | "library" | "calendar" | "results" | "settings";

const RAW_VIDEO_THRESHOLD_SECONDS = 15;
const WORKSPACE_VIEWS: Array<{ id: WorkspaceView; label: string }> = [
  { id: "create", label: "Create" },
  { id: "library", label: "Library" },
  { id: "calendar", label: "Calendar" },
  { id: "results", label: "Results" },
  { id: "settings", label: "Settings" },
];

function inferRequestedDurationSeconds(prompt: string) {
  const lower = prompt.toLowerCase();
  const minuteMatch = lower.match(/(\d{1,2})[\s-]*(minute|minutes|min)\b/);
  if (minuteMatch) return Number(minuteMatch[1]) * 60;
  const secondMatch = lower.match(/(\d{1,3})[\s-]*(second|seconds|sec|secs|s)\b/);
  if (secondMatch) return Number(secondMatch[1]);
  if (/youtube/.test(lower) && /(video|long)/.test(lower)) return 180;
  if (/reel|shorts?|facebook.*ad|instagram|tiktok/.test(lower)) return 30;
  return 10;
}

function requiresAssembly(prompt: string) {
  return inferMarketingWorkspaceIntent(prompt).workflow === "assembled_video";
}

export function shouldQueueRawMediaJob(input: {
  task: MediaTask;
  prompt: string;
  providerMaxRawSeconds?: number;
}) {
  if (input.task !== "text_to_video") return { allowRaw: true, requestedDurationSeconds: 0 };
  const requestedDurationSeconds = inferRequestedDurationSeconds(input.prompt);
  if (requiresAssembly(input.prompt)) return { allowRaw: false, requestedDurationSeconds, reason: "This request needs an assembled scene plan instead of a single raw AI clip." };
  if (requestedDurationSeconds >= RAW_VIDEO_THRESHOLD_SECONDS && (!input.providerMaxRawSeconds || input.providerMaxRawSeconds < requestedDurationSeconds)) {
    return { allowRaw: false, requestedDurationSeconds, reason: input.providerMaxRawSeconds ? `Raw clip limit is ${input.providerMaxRawSeconds}s for the active provider.` : "Raw clip duration support is not confirmed for this provider." };
  }
  return { allowRaw: true, requestedDurationSeconds };
}

export function inferPrimaryCampaignPackage(prompt: string): PrimaryPackage {
  const intent = inferMarketingWorkspaceIntent(prompt);
  if (intent.workflow === "image_ad" || intent.workflow === "assembled_video") return "image_ad";
  return intent.workflow === "campaign" ? intent.packageType : "social_post";
}

function buildCampaignPlan(prompt: string, audience: string, channels: string[]): CampaignPlan {
  const lower = prompt.toLowerCase();
  const durationDays = lower.match(/(\d+)[-\s]?day/)?.[1] ?? "7";
  const intent = inferMarketingWorkspaceIntent(prompt);
  if (intent.workflow === "image_ad") {
    return {
      outputType: "Image advert",
      goal: prompt,
      audience,
      channels: [intent.platform],
      duration: "Single asset",
      cadence: "Generate, review, then export or schedule",
      deliverables: ["Image advert", "Preview", "Library asset", "Export state"],
    };
  }
  if (intent.workflow === "assembled_video") {
    return {
      outputType: intent.label,
      goal: prompt,
      audience,
      channels: [intent.platform],
      duration: `${intent.durationSeconds} seconds`,
      cadence: "Script, scenes, media, render, export",
      deliverables: ["Script", "Scene plan", "Branded captions", "Playable MP4", "Library asset"],
    };
  }
  return {
    outputType: intent.workflow === "campaign" ? intent.label : "Needs clarification",
    goal: prompt,
    audience,
    channels,
    duration: `${durationDays} days`,
    cadence: Number(durationDays) <= 7 ? "Daily campaign touchpoints" : "Three to five touchpoints weekly",
    deliverables: ["Campaign summary", "Schedule", "Posts", "Ad variants", "Export pack", "Tracking state"],
  };
}

function triggerDownload(value: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(value)}`;
  anchor.download = filename;
  anchor.click();
}

type CreateBadgeLabel =
  | "Draft generated"
  | "Needs media upgrade"
  | "Needs audio upgrade"
  | "Ready for review"
  | "Ready to export"
  | "Scheduled"
  | "Published";

function inferCreateBadge(input: {
  hasOutput: boolean;
  qualityPassed: boolean;
  hasTextCardFallback: boolean;
  missingAudio: boolean;
  scheduledCount: number;
  publishedPlatformId: string | null;
}): CreateBadgeLabel {
  if (input.publishedPlatformId) return "Published";
  if (input.scheduledCount > 0) return "Scheduled";
  if (input.hasTextCardFallback) return "Needs media upgrade";
  if (input.missingAudio) return "Needs audio upgrade";
  if (input.hasOutput && input.qualityPassed) return "Ready to export";
  if (input.hasOutput) return "Ready for review";
  return "Draft generated";
}

function SectionErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mx-auto mt-4 max-w-[1440px] rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p>Something failed to load. Please retry.</p>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onRetry}>Retry</Button>
    </section>
  );
}

export function TheMarketingApp({ onBack }: { onBack?: () => void }) {
  const utils = trpc.useUtils();
  const workspace = useMarketingWorkspaceConfig();
  const [view, setView] = useState<WorkspaceView>("create");
  const [quality, setQuality] = useState<QualityMode>("standard");
  const [prompt, setPrompt] = useState("Create an advert for EquiProfile");
  const [channels, setChannels] = useState<string[]>(["Facebook"]);
  const [campaignPlan, setCampaignPlan] = useState<CampaignPlan | null>(null);
  const [lastDeliverablePackage, setLastDeliverablePackage] = useState<Record<string, unknown> | null>(null);
  const [lastMediaOutput, setLastMediaOutput] = useState<Record<string, unknown> | null>(null);
  const [latestStudioPlan, setLatestStudioPlan] = useState<MarketingStudioPlan | null>(null);
  const [latestRenderJob, setLatestRenderJob] = useState<Record<string, unknown> | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
  const [latestOutcome, setLatestOutcome] = useState<{ route: string; status: string; detail: string; nextAction: string } | null>(null);

  const productIntelligence = useMarketingProductProfile(workspace);
  const brandKitState = useMarketingBrandKit(workspace);
  const assetsState = useMarketingAssets(workspace);
  const campaignState = useMarketingCampaigns(workspace);
  const calendarState = useMarketingCalendar(workspace);
  const reviewActions = useMarketingReviewActions(workspace);

  const createMarketingStudioPlan = trpc.admin.createMarketingStudioPlan.useMutation({
    onError: (error) => toast.error("Could not prepare the Studio workflow", { description: error.message }),
  });
  const generateCampaignPackageMutation = trpc.admin.generateMarketingCampaignPackage.useMutation({
    onSuccess: async (result) => {
      setLastDeliverablePackage((result as Record<string, unknown>) ?? null);
      setLastMediaOutput(null);
      setStudioOpen(false);
      setLatestOutcome({ route: "Campaign package", status: "ready", detail: "Campaign package generated for review and export.", nextAction: "Review the package, then export or create schedule drafts." });
      toast.success("Campaign package generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => {
      setLatestOutcome({ route: "Campaign package", status: "failed", detail: error.message, nextAction: "Check product details and provider setup, then try Generate again." });
      toast.error("Could not generate campaign", { description: error.message });
    },
  });
  const generateImageAdMutation = trpc.admin.generateMarketingImageAsset.useMutation({
    onSuccess: async (result) => {
      const image = (result as Record<string, unknown>) ?? {};
      setLastMediaOutput(image);
      setLastDeliverablePackage(null);
      setStudioOpen(false);
      setLatestOutcome({ route: "Image advert", status: image.publicUrl ? "ready" : String(image.status ?? "queued"), detail: image.publicUrl ? "Image preview is ready." : String(image.errorMessage ?? "Image advert queued or needs provider setup."), nextAction: image.publicUrl ? "Preview the image and use it from Library." : "Open Settings and test the image provider route." });
      toast[image.publicUrl ? "success" : "info"](image.publicUrl ? "Image advert generated" : "Image advert queued or needs setup");
      await utils.admin.listMediaAssets.invalidate();
    },
    onError: (error) => {
      setLatestOutcome({ route: "Image advert", status: "failed", detail: error.message, nextAction: "Open Settings and test GenX/Hugging Face image routes." });
      toast.error("Image generation needs attention", { description: error.message });
    },
  });
  const uploadMarketingBrandLogoMutation = trpc.admin.uploadMarketingBrandLogo.useMutation({
    onSuccess: async () => {
      toast.success("Brand Kit logo uploaded");
      await Promise.all([utils.admin.getMarketingBrandKit.invalidate(), utils.admin.getMarketingProductProfile.invalidate(), utils.admin.listMediaAssets.invalidate()]);
    },
    onError: (error) => toast.error("Could not upload logo", { description: error.message }),
  });
  const repairMarketingBrandLogoMutation = trpc.admin.repairMarketingBrandLogo.useMutation({
    onSuccess: async (result) => {
      toast[result.status === "cleared_missing_logo" ? "info" : "success"](
        result.status === "cleared_missing_logo" ? "Logo file missing" : "Logo link checked",
        { description: result.message ?? "Brand Kit logo path is valid." },
      );
      await Promise.all([utils.admin.getMarketingBrandKit.invalidate(), utils.admin.getMarketingProductProfile.invalidate(), utils.admin.listMediaAssets.invalidate()]);
    },
    onError: (error) => toast.error("Could not repair logo", { description: error.message }),
  });
  const copyPackages = useMarketingCopyPackages({ workspace, onPackage: (value) => {
    setLastDeliverablePackage(value);
    setLastMediaOutput(null);
    setStudioOpen(false);
  } });

  const isAnyGenerationPending = generateCampaignPackageMutation.isPending
    || generateImageAdMutation.isPending
    || createMarketingStudioPlan.isPending
    || copyPackages.socialPost.isPending
    || copyPackages.paidSocialAd.isPending
    || copyPackages.emailCampaign.isPending
    || copyPackages.weeklyContentPack.isPending;
  const selectedCreationBlocked = !prompt.trim() || isAnyGenerationPending;
  const audience = productIntelligence.displayProfile?.targetAudiences?.[0] ?? workspace.defaultAudience;
  const signupUrl = productIntelligence.displayProfile?.signupUrl;
  const renderTimelineScenes = Array.isArray((latestRenderJob as { timeline?: { scenes?: unknown[] } } | null)?.timeline?.scenes)
    ? ((latestRenderJob as { timeline?: { scenes?: Array<{ sourceType?: string }> } }).timeline?.scenes ?? [])
    : [];
  const hasTextCardFallback = renderTimelineScenes.some((scene) => scene?.sourceType === "text_card");
  const renderAudio = (latestRenderJob as { audio?: { status?: string } } | null)?.audio;
  const audioRequired = (latestStudioPlan?.voiceoverRequired ?? false)
    || Boolean((latestRenderJob as { timeline?: { render?: { audioRequired?: boolean } } } | null)?.timeline?.render?.audioRequired);
  const missingAudio = audioRequired && renderAudio?.status !== "completed";
  const qualityPassed = (lastDeliverablePackage?.qualityGate as { status?: string } | undefined)?.status === "passed";
  const hasOutput = Boolean(lastDeliverablePackage || lastMediaOutput || latestStudioPlan);
  const publishedPlatformId = [lastDeliverablePackage?.platformPostId, lastDeliverablePackage?.uploadId, lastDeliverablePackage?.platformId, lastDeliverablePackage?.smtpMessageId]
    .find((value): value is string => typeof value === "string" && Boolean(value.trim()));
  const createBadge = inferCreateBadge({
    hasOutput,
    qualityPassed,
    hasTextCardFallback,
    missingAudio,
    scheduledCount: calendarState.mappedScheduleDrafts.length,
    publishedPlatformId: publishedPlatformId ?? null,
  });

  function toggleChannel(channel: string) {
    setChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]);
  }

  function handlePlanCampaign() {
    if (!prompt.trim()) return;
    setCampaignPlan(buildCampaignPlan(prompt.trim(), audience, channels.length ? channels : ["Facebook"]));
  }

  async function handleGenerate() {
    const goal = prompt.trim();
    if (!goal || isAnyGenerationPending) return;
    const intent = inferMarketingWorkspaceIntent(goal);
    setClarifyingQuestion(null);
    if (intent.workflow === "clarify") {
      setClarifyingQuestion(intent.question);
      setLatestOutcome({ route: "Needs clarification", status: "waiting", detail: intent.question, nextAction: "Answer the question in the prompt and Generate again." });
      return;
    }
    if (intent.workflow === "assembled_video") {
      setLatestOutcome({ route: `${intent.label} assembled video`, status: "generating", detail: "Preparing script, scenes, fallback media, and render job.", nextAction: "Preview will show render status and playable output when ready." });
      const result = await createMarketingStudioPlan.mutateAsync({
          tenantId: workspace.tenantId,
          workspaceId: workspace.marketing_workspace_id,
          hostAppId: workspace.host_app_id,
          originalUserPrompt: goal,
          contentType: intent.contentType,
          platform: intent.platform,
          requestedDurationSeconds: intent.durationSeconds,
          qualityMode: quality,
          audience,
          goal,
        }).catch((error: Error) => {
          setLatestOutcome({ route: `${intent.label} assembled video`, status: "failed", detail: error.message, nextAction: "Check product setup and provider routes, then try Generate again." });
          throw error;
        });
      setLatestStudioPlan(result.plan as MarketingStudioPlan);
      setLatestRenderJob(null);
      setLastDeliverablePackage(null);
      setLastMediaOutput(null);
      setStudioOpen(true);
      setLatestOutcome({ route: `${intent.label} assembled video`, status: "rendering", detail: "Studio workflow started. Fallback caption video can render without stock media.", nextAction: "Watch render status in Preview." });
      toast.success(`${intent.label} workflow started`);
      return;
    }
    if (intent.workflow === "image_ad") {
      setLatestOutcome({ route: "Image advert", status: "generating", detail: "Routing to image generation.", nextAction: "Preview will show the image URL or exact setup failure." });
      generateImageAdMutation.mutate({
        tenantId: workspace.tenantId,
        workspaceId: workspace.marketing_workspace_id,
        hostAppId: workspace.host_app_id,
        prompt: goal,
        platform: intent.platform,
        aspectRatio: "1:1",
        qualityMode: quality,
      });
      return;
    }
    const form = {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal,
      audience,
      platforms: channels.length ? channels : ["Facebook"],
      qualityMode: quality,
      exportOnly: true,
      requireApproval: true,
      durationDays: 7,
    };
    if (!campaignPlan) setCampaignPlan(buildCampaignPlan(goal, audience, form.platforms));
    setLatestOutcome({ route: intent.packageType, status: "generating", detail: "Generating product-aware campaign copy and export package.", nextAction: "Review the package, then export or schedule." });
    if (intent.packageType === "signup_campaign") generateCampaignPackageMutation.mutate({ ...form, targetOutcome: "signup growth" });
    else copyPackages.generate(intent.packageType, form);
  }

  function handleUploadLogo(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      uploadMarketingBrandLogoMutation.mutate({
        tenantId: workspace.tenantId,
        workspaceId: workspace.marketing_workspace_id,
        hostAppId: workspace.host_app_id,
        fileName: file.name,
        fileType: file.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
        fileSize: file.size,
        fileData: value.includes(",") ? value.split(",")[1] : value,
      });
    };
    reader.readAsDataURL(file);
  }

  function exportCampaign() {
    const campaignId = Number(lastDeliverablePackage?.campaignId ?? campaignState.selectedCampaignId);
    if (!campaignId) return toast.info("Generate a campaign before exporting.");
    void utils.admin.exportCampaignPack.fetch({ campaignId, tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, includeMarkdown: true }).then((pack) => {
      const output = typeof (pack as { markdown?: unknown }).markdown === "string" ? (pack as { markdown: string }).markdown : JSON.stringify(pack, null, 2);
      triggerDownload(output, `campaign-${campaignId}.txt`);
    });
  }

  function createScheduleDraftsFromCampaign() {
    const campaignId = Number(lastDeliverablePackage?.campaignId ?? campaignState.selectedCampaignId);
    if (!campaignId) return toast.info("Generate a campaign before creating schedule drafts.");
    campaignState.createScheduleDraftsFromCampaignMutation.mutate({
      campaignId,
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
    });
  }

  function exportBeastModePack() {
    const runId = Number(campaignState.selectedBeastModeRunData?.id);
    if (!runId) return toast.info("Generate advanced variants before exporting.");
    void utils.admin.exportBeastModePack.fetch({
      runId,
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      includeRejected: false,
    }).then((pack) => triggerDownload(JSON.stringify(pack, null, 2), `advanced-variants-${runId}.json`));
  }

  const productPanel = (
    <ProductContextPanel
      profile={productIntelligence.displayProfile}
      isReady={productIntelligence.isReady}
      isPending={productIntelligence.isPending}
      usingEquiProfileDefaults={productIntelligence.usingEquiProfileDefaults}
      onScan={(draft) => productIntelligence.scan.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, landingPageUrl: draft.landingPageUrl.trim(), signupUrl: draft.signupUrl.trim() || undefined, productNotes: draft.productNotes.trim() || undefined })}
      onSaveDraft={productIntelligence.saveDraft}
      onUseDefaults={productIntelligence.useEquiProfileDefaults}
      onConfirm={() => productIntelligence.confirm.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id })}
      onChooseLogo={() => setView("library")}
      onUploadLogo={handleUploadLogo}
      onRepairLogo={() => repairMarketingBrandLogoMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id })}
      onOpenSettings={() => setView("settings")}
      onOpenResults={() => setView("results")}
    />
  );

  return (
    <div className="min-w-0 overflow-x-hidden bg-stone-50" data-testid="ai-guided-marketing-workspace" aria-busy={reviewActions.runQaMutation.isPending}>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">EquiProfile</p>
              <h1 className="text-xl font-semibold text-stone-950">The Marketing App</h1>
            </div>
            {onBack ? <Button type="button" variant="ghost" onClick={onBack}>Back</Button> : null}
          </div>
          <nav className="mt-4 flex flex-wrap gap-2" aria-label="Marketing workspace">
            {WORKSPACE_VIEWS.map((item) => <Button key={item.id} type="button" size="sm" variant={view === item.id ? "default" : "ghost"} onClick={() => setView(item.id)}>{item.label}</Button>)}
          </nav>
        </div>
      </header>

      {productIntelligence.query.isError ? <SectionErrorCard onRetry={() => void productIntelligence.query.refetch()} /> : null}
      {view === "library" && assetsState.assets.isError ? <SectionErrorCard onRetry={() => void assetsState.assets.refetch()} /> : null}
      {view === "calendar" && calendarState.scheduleDrafts.isError ? <SectionErrorCard onRetry={() => void calendarState.scheduleDrafts.refetch()} /> : null}

      {view === "create" ? (
        <MarketingWorkspaceShell
          productPanel={productPanel}
          workflow={(
            <>
              <CampaignPromptPanel prompt={prompt} channels={channels} isGenerating={isAnyGenerationPending} generateDisabled={selectedCreationBlocked} onPromptChange={setPrompt} onToggleChannel={toggleChannel} onPlan={handlePlanCampaign} onGenerate={() => void handleGenerate()} />
              <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" data-testid="create-primary-actions">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">Next actions</p>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700">{createBadge}</span>
                </div>
                {/* Upgrade hints — friendly messages shown when media or audio needs improvement */}
                {(hasTextCardFallback || missingAudio) && (
                  <div className="mt-2 space-y-1">
                    {hasTextCardFallback && (
                      <p className="text-xs text-amber-700" data-testid="media-scenes-need-upgrade">Media scenes need upgrade — real images or video clips not yet attached.</p>
                    )}
                    {missingAudio && (
                      <p className="text-xs text-amber-700" data-testid="audio-music-missing">Audio/music missing — add a voiceover or background track before exporting.</p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setView("settings")}>Edit</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setStudioOpen(true)}>Improve</Button>
                  {hasTextCardFallback && (
                    <Button type="button" size="sm" variant="outline" onClick={() => setStudioOpen(true)} data-testid="improve-media-btn">Improve media</Button>
                  )}
                  {missingAudio && (
                    <Button type="button" size="sm" variant="outline" onClick={() => toast.info("Add a voiceover or background music track in Studio settings.")} data-testid="add-music-voice-btn">Add music/voice</Button>
                  )}
                  <Button type="button" size="sm" variant="outline" onClick={() => toast.info("Approval is available after review checks.")}>Approve</Button>
                  <Button type="button" size="sm" variant="outline" onClick={createScheduleDraftsFromCampaign}>Schedule</Button>
                  <Button type="button" size="sm" variant="outline" onClick={exportCampaign}>Export</Button>
                </div>
              </section>
              {clarifyingQuestion ? <p className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{clarifyingQuestion}</p> : null}
              {latestOutcome ? (
                <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" data-testid="latest-outcome-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Latest outcome</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-stone-950">{latestOutcome.route}</h2>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">{latestOutcome.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{latestOutcome.detail}</p>
                  <p className="mt-1 text-xs text-stone-500">Next action: {latestOutcome.nextAction}</p>
                </section>
              ) : null}
              <CampaignPlanPanel plan={campaignPlan} />
              <MarketingPreviewPanel deliverablePackage={lastDeliverablePackage} mediaOutput={lastMediaOutput} asset={assetsState.assetStore.resolvedPreviewAsset} renderJob={latestRenderJob} studioPlan={latestStudioPlan} signupUrl={signupUrl} />
              {studioOpen ? (
                <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="ai-guided-studio">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Guided Studio</p>
                    <h2 className="mt-1 text-xl font-semibold text-stone-950">Script → Scenes → Media → Render → Export</h2>
                  </div>
                  <StudioWorkbench tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} hostAppId={workspace.host_app_id} productCategory={productIntelligence.displayProfile?.category} productName={productIntelligence.displayProfile?.appName} productProfileConfirmed={productIntelligence.isReady} initialPrompt={prompt} initialPlan={latestStudioPlan} autoStartRender onPlanChange={setLatestStudioPlan} onRenderJobChange={(job) => {
                    const nextJob = (job as unknown as Record<string, unknown> | null) ?? null;
                    setLatestRenderJob(nextJob);
                    if (nextJob?.status === "completed") setLatestOutcome({ route: "Assembled video", status: "ready", detail: String(nextJob.outputPublicUrl ? "Playable MP4 is ready." : "Render completed but no playable URL was returned."), nextAction: nextJob.outputPublicUrl ? "Preview the video, then export or schedule." : "Treat as render failure and check runtime storage." });
                    if (nextJob?.status === "failed" || nextJob?.status === "setup_needed") setLatestOutcome({ route: "Assembled video", status: String(nextJob.status), detail: String(nextJob.errorMessage ?? "Render needs runtime setup."), nextAction: "Open Settings and verify FFmpeg/storage readiness." });
                  }} onDone={setLatestStudioPlan} />
                </section>
              ) : null}
              <details className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-stone-900">Media Studio / Advanced tools</summary>
                <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                  <p className="text-sm text-stone-600">Choose manually only when you want to override the AI-guided workflow.</p>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setLatestStudioPlan(null); setStudioOpen(true); }}>Choose manually</Button>
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={exportCampaign}>Export campaign</Button>
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={createScheduleDraftsFromCampaign}>Create schedule drafts</Button>
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={exportBeastModePack}>Export advanced variants</Button>
                </div>
              </details>
            </>
          )}
          statusRail={<WorkflowStatusPanel productReady={productIntelligence.isReady} fallbackUsed={lastDeliverablePackage?.fallbackUsed === true} hasOutput={hasOutput} signupUrl={signupUrl} qualityPassed={qualityPassed} />}
        />
      ) : (
        <main className="mx-auto min-w-0 max-w-[1440px] px-4 py-5 lg:px-6">
          {view === "library" ? <MarketingLibraryView assetsState={assetsState} onUseAsLogo={(mediaAssetId) => brandKitState.selectBrandLogoMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, mediaAssetId })} onUseAsReference={(asset) => { setPrompt(`Use Library asset #${asset.id} as a visual reference. ${prompt}`); setView("create"); }} /> : null}
          {view === "calendar" ? <MarketingCalendarView calendarState={calendarState} tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} /> : null}
          {view === "results" ? <MarketingResultsView workspace={workspace} onCreateWithLearning={() => setView("create")} /> : null}
          {view === "settings" ? <div className="space-y-5">{productPanel}<MarketingAppSettings quality={quality} onQualityChange={setQuality} tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} hostAppId={workspace.host_app_id} /></div> : null}
        </main>
      )}
    </div>
  );
}
