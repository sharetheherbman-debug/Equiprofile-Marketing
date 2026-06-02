import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import type { QualityMode } from "@/components/marketing/studio/types";
import { MarketingAppSettings } from "./MarketingAppSettings";
import { useMarketingAssets } from "./hooks/useMarketingAssets";
import { useMarketingBrandKit } from "./hooks/useMarketingBrandKit";
import { useMarketingCalendar } from "./hooks/useMarketingCalendar";
import { useMarketingCampaigns } from "./hooks/useMarketingCampaigns";
import { useMarketingCopyPackages } from "./hooks/useMarketingCopyPackages";
import { useMarketingProductProfile } from "./hooks/useMarketingProductProfile";
import { useMarketingReviewActions } from "./hooks/useMarketingReviewActions";
import { useMarketingWorkspaceConfig } from "./hooks/useMarketingWorkspaceConfig";
import { AdvancedMarketingDrawer } from "./workspace/AdvancedMarketingDrawer";
import { CampaignOutputPanel } from "./workspace/CampaignOutputPanel";
import { CampaignPlanPanel, type CampaignPlan } from "./workspace/CampaignPlanPanel";
import { CampaignPromptPanel } from "./workspace/CampaignPromptPanel";
import { MarketingWorkspaceShell } from "./workspace/MarketingWorkspaceShell";
import { ProductContextPanel } from "./workspace/ProductContextPanel";
import { WorkflowStatusPanel } from "./workspace/WorkflowStatusPanel";

type MediaTask = "text_to_image" | "text_to_video";
type PrimaryPackage = "signup_campaign" | "weekly_content_pack" | "email_campaign" | "social_post" | "paid_social_ad" | "image_ad";

const RAW_VIDEO_THRESHOLD_SECONDS = 15;

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
  const lower = prompt.toLowerCase();
  return /3-minute|3 minute|youtube|assembled|scene plan|campaign|facebook ad|instagram reel|tiktok|shorts?/.test(lower);
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
  const lower = prompt.toLowerCase();
  if (/(image|graphic|banner|visual|creative asset)/.test(lower)) return "image_ad";
  if (/email|newsletter/.test(lower)) return "email_campaign";
  if (/signup|sign up|sign-up|trial|growth|relaunch|campaign/.test(lower)) return "signup_campaign";
  if (/weekly|7[-\s]?day content|content plan/.test(lower)) return "weekly_content_pack";
  if (/paid social|\bad\b|advert/.test(lower)) return "paid_social_ad";
  return "social_post";
}

function buildCampaignPlan(prompt: string, audience: string, channels: string[]): CampaignPlan {
  const lower = prompt.toLowerCase();
  const durationDays = lower.match(/(\d+)[-\s]?day/)?.[1] ?? "7";
  const deliverables = ["Campaign summary", "Day-by-day schedule", "Facebook posts", "Ad variants", "Export pack", "Tracking state"];
  if (channels.includes("Email") || /email/.test(lower)) deliverables.push("Email sequence");
  return {
    goal: prompt,
    audience,
    channels,
    duration: `${durationDays} days`,
    cadence: Number(durationDays) <= 7 ? "Daily campaign touchpoints" : "Three to five touchpoints weekly",
    deliverables,
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
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <p className="text-sm font-medium">Something failed to load. Please retry.</p>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>Retry</Button>
    </div>
  );
}

export function TheMarketingApp({ onBack }: { onBack?: () => void }) {
  const utils = trpc.useUtils();
  const workspace = useMarketingWorkspaceConfig();
  const [quality, setQuality] = useState<QualityMode>("standard");
  const [prompt, setPrompt] = useState("Create a 7-day Facebook signup campaign for EquiProfile");
  const [channels, setChannels] = useState<string[]>(["Facebook"]);
  const [campaignPlan, setCampaignPlan] = useState<CampaignPlan | null>(null);
  const [lastDeliverablePackage, setLastDeliverablePackage] = useState<Record<string, unknown> | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const productIntelligence = useMarketingProductProfile(workspace);
  const brandKitState = useMarketingBrandKit(workspace);
  const assetsState = useMarketingAssets(workspace);
  const campaignState = useMarketingCampaigns(workspace);
  const reviewActions = useMarketingReviewActions(workspace);
  const calendarState = useMarketingCalendar(workspace);

  const createMarketingStudioPlan = trpc.admin.createMarketingStudioPlan.useMutation({
    onError: (error) => toast.error("Could not enrich the plan", { description: error.message }),
  });
  const generateCampaignPackageMutation = trpc.admin.generateMarketingCampaignPackage.useMutation({
    onSuccess: async (result) => {
      setLastDeliverablePackage((result as Record<string, unknown>) ?? null);
      toast.success("Signup campaign generated");
      await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
    },
    onError: (error) => toast.error("Could not generate campaign", { description: error.message }),
  });
  const generateImageAdMutation = trpc.admin.generateMarketingImageAsset.useMutation({
    onSuccess: async (result) => {
      const image = (result as Record<string, unknown>) ?? {};
      setLastDeliverablePackage({
        packageType: "image_ad",
        strategy: "Image creative generated for review. Full campaign generation remains the primary workspace path.",
        fallbackUsed: false,
        captionPlan: {},
        adCopy: [],
        cta: productIntelligence.displayProfile?.ctaLibrary?.[0] ?? "Start your free trial",
        mediaJobs: [image],
      });
      toast.success("Image creative generated");
      await utils.admin.listMediaAssets.invalidate();
    },
    onError: (error) => toast.error("Image generation needs a ready image model.", { description: error.message }),
  });
  const uploadMarketingBrandLogoMutation = trpc.admin.uploadMarketingBrandLogo.useMutation({
    onSuccess: async () => {
      toast.success("Brand Kit logo uploaded");
      await Promise.all([
        utils.admin.getMarketingBrandKit.invalidate(),
        utils.admin.getMarketingProductProfile.invalidate(),
        utils.admin.listMediaAssets.invalidate(),
      ]);
    },
    onError: (error) => toast.error("Could not upload logo", { description: error.message }),
  });
  const copyPackages = useMarketingCopyPackages({
    workspace,
    onPackage: setLastDeliverablePackage,
  });

  const isAnyGenerationPending = generateCampaignPackageMutation.isPending
    || generateImageAdMutation.isPending
    || copyPackages.socialPost.isPending
    || copyPackages.paidSocialAd.isPending
    || copyPackages.emailCampaign.isPending
    || copyPackages.weeklyContentPack.isPending;
  const selectedCreationBlocked = !prompt.trim() || !channels.length || isAnyGenerationPending;
  const audience = productIntelligence.displayProfile?.targetAudiences?.[0] ?? workspace.defaultAudience;
  const fallbackUsed = lastDeliverablePackage?.fallbackUsed === true;
  const signupUrl = productIntelligence.displayProfile?.signupUrl;

  function toggleChannel(channel: string) {
    setChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]);
  }

  function handlePlanCampaign() {
    if (!prompt.trim()) return;
    const nextPlan = buildCampaignPlan(prompt.trim(), audience, channels.length ? channels : ["Facebook"]);
    setCampaignPlan(nextPlan);
    createMarketingStudioPlan.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      originalUserPrompt: prompt.trim(),
      platform: channels[0] ?? "Facebook",
      audience,
      goal: prompt.trim(),
      qualityMode: quality,
    });
  }

  function handleGenerate() {
    if (selectedCreationBlocked) return;
    const packageType = inferPrimaryCampaignPackage(prompt);
    const form = {
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      goal: prompt.trim(),
      audience,
      platforms: channels,
      qualityMode: quality,
      exportOnly: true,
      requireApproval: true,
      durationDays: 7,
    };
    if (!campaignPlan) setCampaignPlan(buildCampaignPlan(prompt.trim(), audience, channels));
    if (packageType === "signup_campaign") generateCampaignPackageMutation.mutate({ ...form, targetOutcome: "signup growth" });
    else if (packageType === "image_ad") generateImageAdMutation.mutate({ tenantId: form.tenantId, workspaceId: form.workspaceId, hostAppId: form.hostAppId, prompt: form.goal, platform: channels[0], aspectRatio: "1:1", qualityMode: quality });
    else copyPackages.generate(packageType, form);
  }

  function handleExportCampaign() {
    const campaignId = Number(lastDeliverablePackage?.campaignId ?? campaignState.selectedCampaignId);
    if (!campaignId) {
      toast.info("Generate a campaign before exporting.");
      return;
    }
    utils.admin.exportCampaignPack.fetch({
      campaignId,
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      includeMarkdown: true,
    }).then((pack) => {
      const output = typeof (pack as { markdown?: unknown }).markdown === "string" ? (pack as { markdown: string }).markdown : JSON.stringify(pack, null, 2);
      triggerDownload(output, `campaign-${campaignId}.txt`);
      toast.success("Campaign export downloaded");
    }).catch((error) => toast.error("Could not export campaign", { description: error instanceof Error ? error.message : String(error) }));
  }

  function handleCreateScheduleDraftsFromCampaign() {
    const campaignId = Number(lastDeliverablePackage?.campaignId ?? campaignState.selectedCampaignId);
    if (!campaignId) return;
    campaignState.createScheduleDraftsFromCampaignMutation.mutate({
      campaignId,
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
    });
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

  function handleExportBeastModePack() {
    const runId = campaignState.selectedBeastModeRunData?.id;
    if (!runId) return;
    utils.admin.exportBeastModePack.fetch({
      runId: Number(runId),
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      includeRejected: false,
    }).then((pack) => triggerDownload(JSON.stringify(pack, null, 2), `beast-mode-${runId}.json`));
  }

  const productPanel = productIntelligence.query.isError
    ? <SectionErrorCard onRetry={() => void productIntelligence.query.refetch()} />
    : (
      <ProductContextPanel
        profile={productIntelligence.displayProfile}
        isReady={productIntelligence.isReady}
        isPending={productIntelligence.isPending}
        usingEquiProfileDefaults={productIntelligence.usingEquiProfileDefaults}
        onScan={(draft) => productIntelligence.scan.mutate({
          tenantId: workspace.tenantId,
          workspaceId: workspace.marketing_workspace_id,
          hostAppId: workspace.host_app_id,
          landingPageUrl: draft.landingPageUrl.trim(),
          signupUrl: draft.signupUrl.trim() || undefined,
          productNotes: draft.productNotes.trim() || undefined,
        })}
        onSaveDraft={productIntelligence.saveDraft}
        onUseDefaults={productIntelligence.useEquiProfileDefaults}
        onConfirm={() => productIntelligence.confirm.mutate({ tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id })}
        onChooseLogo={() => setAdvancedOpen(true)}
        onUploadLogo={handleUploadLogo}
        onOpenSettings={() => setShowSettingsDialog(true)}
      />
    );

  return (
    <div className="min-w-0 overflow-x-hidden bg-stone-50" data-testid="creation-first-studio">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">EquiProfile</p>
            <h1 className="text-xl font-semibold text-stone-950">The Marketing App</h1>
          </div>
          <div className="flex gap-2">
            {onBack ? <Button type="button" variant="ghost" onClick={onBack}>Back</Button> : null}
            <Button type="button" variant="outline" onClick={() => setShowSettingsDialog(true)}>Settings</Button>
          </div>
        </div>
      </header>

      <MarketingWorkspaceShell
        productPanel={productPanel}
        workflow={(
          <>
            <CampaignPromptPanel
              prompt={prompt}
              channels={channels}
              isGenerating={isAnyGenerationPending}
              generateDisabled={selectedCreationBlocked}
              onPromptChange={setPrompt}
              onToggleChannel={toggleChannel}
              onPlan={handlePlanCampaign}
              onGenerate={handleGenerate}
            />
            <CampaignPlanPanel plan={campaignPlan} />
            <CampaignOutputPanel deliverablePackage={lastDeliverablePackage} signupUrl={signupUrl} />
            <AdvancedMarketingDrawer open={advancedOpen} onOpenChange={setAdvancedOpen} onOpenSettings={() => setShowSettingsDialog(true)}>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={handleExportCampaign}>Export campaign</Button>
                <Button type="button" size="sm" variant="outline" onClick={handleCreateScheduleDraftsFromCampaign}>Create schedule drafts</Button>
                <Button type="button" size="sm" variant="outline" onClick={handleExportBeastModePack}>Export advanced variants</Button>
              </div>
              <p className="text-xs text-stone-500">Delete permanently remains available from Assets. Review actions remain available after export.</p>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                <p className="font-semibold text-stone-900">Media Studio</p>
                <p className="mt-1 text-xs leading-5 text-stone-600">Image ads remain optional. Avatar, voice, music, short-video, assembled-video, and stock-media jobs stay truthful to their provider readiness and playable output state.</p>
              </div>
            </AdvancedMarketingDrawer>
          </>
        )}
        statusRail={<WorkflowStatusPanel productReady={productIntelligence.isReady} fallbackUsed={fallbackUsed} hasOutput={Boolean(lastDeliverablePackage)} signupUrl={signupUrl} qualityPassed={(lastDeliverablePackage?.qualityGate as { status?: string } | undefined)?.status === "passed"} />}
      />

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader><DialogTitle>Marketing App settings</DialogTitle></DialogHeader>
          <MarketingAppSettings quality={quality} onQualityChange={setQuality} tenantId={workspace.tenantId} workspaceId={workspace.marketing_workspace_id} hostAppId={workspace.host_app_id} />
        </DialogContent>
      </Dialog>

      <span className="hidden">{brandKitState.brandKit.brandName}{assetsState.allAssets.length}{reviewActions.runQaMutation.isPending ? "reviewing" : ""}{calendarState.mappedScheduleDrafts.length}</span>
    </div>
  );
}
