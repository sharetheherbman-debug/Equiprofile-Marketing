import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { MarketingWorkspaceConfig } from "./useMarketingWorkspaceConfig.types";
import type { ProductMarketingProfile } from "../ProductMarketingProfileCard";

const EQUI_PROFILE_DEFAULTS = {
  appName: "EquiProfile",
  domain: "equiprofile.com",
  targetAudiences: ["stable owners", "horse owners", "riding schools", "trainers", "yards", "equestrian businesses"],
  primaryOffer: "Free-trial signup offer; add the signup URL before export.",
  pricingDetails: "Free-trial details should be confirmed before publishing.",
  coreFeatures: ["horse health records", "document tracking", "stable management", "scheduling", "staff visibility", "operational growth support"],
  benefits: ["keep stable operations organized", "keep horse health records visible", "track important horse and stable documents", "coordinate schedules and staff", "support operational growth"],
  painPointsSolved: ["scattered stable admin", "limited visibility across horse records, documents, schedules, and staff"],
  differentiators: ["equine and stable management context in one operational platform"],
  forbiddenClaims: ["Do not invent customer counts, time savings, revenue gains, or testimonials.", "Do not claim publishing or analytics unless a configured connector proves it."],
  toneOfVoice: ["professional", "helpful", "practical equestrian software"],
  ctaLibrary: ["Start your free trial"],
  platformPositioning: {
    Facebook: "Show practical stable-management relief and a free-trial CTA.",
    Instagram: "Use equestrian operations visuals with one concrete benefit.",
    LinkedIn: "Position operational visibility and growth support for equestrian businesses.",
    Email: "Use benefit-led education and the configured signup or free-trial CTA.",
  },
};

export function useMarketingProductProfile(workspace: MarketingWorkspaceConfig) {
  const utils = trpc.useUtils();
  const query = trpc.admin.getMarketingProductProfile.useQuery({
    tenantId: workspace.tenantId,
    workspaceId: workspace.marketing_workspace_id,
    hostAppId: workspace.host_app_id,
  });
  const scan = trpc.admin.scanMarketingProductSite.useMutation({
    onSuccess: async () => {
      toast.success("Product profile extracted", { description: "Review the product truth before generating campaigns." });
      await query.refetch();
      await utils.admin.getMarketingProductProfile.invalidate();
    },
    onError: (error) => toast.error("Could not scan product site", { description: error.message }),
  });
  const update = trpc.admin.updateMarketingProductProfile.useMutation({
    onSuccess: async () => {
      toast.success("Product profile updated");
      await query.refetch();
    },
    onError: (error) => toast.error("Could not update product profile", { description: error.message }),
  });
  const confirm = trpc.admin.confirmMarketingProductProfile.useMutation({
    onSuccess: async () => {
      toast.success("Product profile confirmed");
      await query.refetch();
    },
    onError: (error) => toast.error("Could not confirm product profile", { description: error.message }),
  });
  const response = (query.data as { status?: string; profile?: ProductMarketingProfile | null } | undefined) ?? undefined;
  const profile = response?.profile ?? null;
  const isEquiProfile = workspace.host_app_id.toLowerCase() === "equiprofile";
  const defaultProfile: ProductMarketingProfile | null = isEquiProfile ? {
    ...EQUI_PROFILE_DEFAULTS,
    landingPageUrl: null,
    signupUrl: null,
    confidenceScore: 56,
    missingInfo: ["website or landing page URL", "signup URL for tracking links"],
  } : null;
  function saveDraft(input: { landingPageUrl: string; signupUrl: string; productNotes: string }) {
    const signupUrl = input.signupUrl.trim() || null;
    const differentiators = input.productNotes.trim()
      ? [...(isEquiProfile ? EQUI_PROFILE_DEFAULTS.differentiators : []), input.productNotes.trim()]
      : isEquiProfile ? EQUI_PROFILE_DEFAULTS.differentiators : [];
    update.mutate({
      tenantId: workspace.tenantId,
      workspaceId: workspace.marketing_workspace_id,
      hostAppId: workspace.host_app_id,
      ...(isEquiProfile ? EQUI_PROFILE_DEFAULTS : { appName: workspace.host_app_name, domain: workspace.host_app_domain }),
      landingPageUrl: input.landingPageUrl.trim() || null,
      signupUrl,
      primaryOffer: signupUrl ? (isEquiProfile ? "Start a free EquiProfile trial" : "Signup offer available") : isEquiProfile ? EQUI_PROFILE_DEFAULTS.primaryOffer : null,
      ctaLibrary: signupUrl ? [`${isEquiProfile ? "Start your free trial" : "Learn more"}: ${signupUrl}`] : isEquiProfile ? EQUI_PROFILE_DEFAULTS.ctaLibrary : ["Learn more"],
      differentiators,
    });
  }
  return {
    query,
    scan,
    update,
    confirm,
    profile,
    displayProfile: profile ?? defaultProfile,
    usingEquiProfileDefaults: isEquiProfile && !profile,
    saveDraft,
    useEquiProfileDefaults: saveDraft,
    isReady: response?.status === "ok",
    isPending: scan.isPending || update.isPending || confirm.isPending,
  };
}
