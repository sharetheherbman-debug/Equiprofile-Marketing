import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { MarketingWorkspaceConfig } from "./useMarketingWorkspaceConfig.types";

export function useMarketingCopyPackages(input: {
  workspace: MarketingWorkspaceConfig;
  onPackage: (payload: Record<string, unknown>) => void;
}) {
  const utils = trpc.useUtils();
  function options(label: string) {
    return {
      onSuccess: async (result: unknown) => {
        input.onPackage((result as Record<string, unknown>) ?? {});
        toast.success(`${label} generated`);
        await Promise.all([utils.admin.getMarketingCampaign.invalidate(), utils.admin.listMarketingCampaigns.invalidate()]);
      },
      onError: (error: { message: string }) => toast.error(`Could not generate ${label.toLowerCase()}`, { description: error.message }),
    };
  }
  const mutations = {
    socialPost: trpc.admin.generateMarketingSocialPostPackage.useMutation(options("Social post package")),
    paidSocialAd: trpc.admin.generateMarketingPaidSocialAdPackage.useMutation(options("Paid social ad package")),
    emailCampaign: trpc.admin.generateMarketingEmailCampaignPackage.useMutation(options("Email campaign package")),
    weeklyContentPack: trpc.admin.generateMarketingWeeklyContentPackPackage.useMutation(options("Weekly content pack")),
  };
  function generate(packageType: "social_post" | "paid_social_ad" | "email_campaign" | "weekly_content_pack", form: {
    goal: string; audience: string; platforms: string[]; durationDays: number; qualityMode: "standard" | "elite"; exportOnly: boolean; requireApproval: boolean;
  }) {
    if (!form.goal.trim() || !form.audience.trim() || !form.platforms.length) {
      toast.error("Add goal, audience, and platform first");
      return;
    }
    const payload = {
      tenantId: input.workspace.tenantId, workspaceId: input.workspace.marketing_workspace_id, hostAppId: input.workspace.host_app_id,
      ...form, platforms: packageType === "email_campaign" ? ["Email"] : form.platforms,
    };
    if (packageType === "social_post") mutations.socialPost.mutate(payload);
    else if (packageType === "paid_social_ad") mutations.paidSocialAd.mutate(payload);
    else if (packageType === "email_campaign") mutations.emailCampaign.mutate(payload);
    else mutations.weeklyContentPack.mutate(payload);
  }
  return { ...mutations, generate };
}
