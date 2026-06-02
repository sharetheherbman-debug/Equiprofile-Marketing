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
  return {
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
      toast.success("Campaign package generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => toast.error("Could not generate campaign", { description: error.message }),
  });
  const generateImageAdMutation = trpc.admin.generateMarketingImageAsset.useMutation({
    onSuccess: async (result) => {
      const image = (result as Record<string, unknown>) ?? {};
      setLastMediaOutput(image);
      setLastDeliverablePackage(null);
      setStudioOpen(false);
      toast[image.publicUrl ? "success" : "info"](image.publicUrl ? "Image advert generated" : "Image advert queued or needs setup");
      await utils.admin.listMediaAssets.invalidate();
    },
    onError: (error) => toast.error("Image generation needs attention", { description: error.message }),
  });
  const uploadMarketingBrandLogoMutation = trpc.admin.uploadMarketingBrandLogo.useMutation({
    onSuccess: async () => {
      toast.success("Brand Kit logo uploaded");
      await Promise.all([utils.admin.getMarketingBrandKit.invalidate(), utils.admin.getMarketingProductProfile.invalidate(), utils.admin.listMediaAssets.invalidate()]);
    },
    onError: (error) => toast.error("Could not upload logo", { description: error.message }),
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
      return;
    }
    if (intent.workflow === "assembled_video") {
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
      });
      setLatestStudioPlan(result.plan as MarketingStudioPlan);
      setLatestRenderJob(null);
      setLastDeliverablePackage(null);
      setLastMediaOutput(null);
      setStudioOpen(true);
      toast.success(`${intent.label} workflow started`);
      return;
    }
    if (intent.workflow === "image_ad") {
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
              {clarifyingQuestion ? <p className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{clarifyingQuestion}</p> : null}
              <CampaignPlanPanel plan={campaignPlan} />
              <MarketingPreviewPanel deliverablePackage={lastDeliverablePackage} mediaOutput={lastMediaOutput} asset={assetsState.assetStore.resolvedPreviewAsset} renderJob={latestRenderJob} studioPlan={latestStudioPlan} signupUrl={signupUrl} />
              {studioOpen ? (
                <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="ai-guided-studio">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Guided Studio</p>
                    <h2 className="mt-1 text-xl font-semibold text-stone-950">Script → Scenes → Media → Render → Export</h2>
                  </div>
                  <StudioWorkbench tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} hostAppId={workspace.host_app_id} initialPrompt={prompt} initialPlan={latestStudioPlan} autoStartRender onPlanChange={setLatestStudioPlan} onRenderJobChange={(job) => setLatestRenderJob((job as unknown as Record<string, unknown> | null) ?? null)} onDone={setLatestStudioPlan} />
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
          statusRail={<WorkflowStatusPanel productReady={productIntelligence.isReady} fallbackUsed={lastDeliverablePackage?.fallbackUsed === true} hasOutput={Boolean(lastDeliverablePackage || lastMediaOutput || latestStudioPlan)} signupUrl={signupUrl} qualityPassed={(lastDeliverablePackage?.qualityGate as { status?: string } | undefined)?.status === "passed"} />}
        />
      ) : (
        <main className="mx-auto min-w-0 max-w-[1440px] px-4 py-5 lg:px-6">
          {view === "library" ? <MarketingLibraryView assetsState={assetsState} onUseAsLogo={(mediaAssetId) => brandKitState.selectBrandLogoMutation.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id, mediaAssetId })} /> : null}
          {view === "calendar" ? <MarketingCalendarView calendarState={calendarState} tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} /> : null}
          {view === "results" ? <MarketingResultsView workspace={workspace} /> : null}
          {view === "settings" ? <div className="space-y-5">{productPanel}<MarketingAppSettings quality={quality} onQualityChange={setQuality} tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} hostAppId={workspace.host_app_id} /></div> : null}
        </main>
      )}
    </div>
  );
}
