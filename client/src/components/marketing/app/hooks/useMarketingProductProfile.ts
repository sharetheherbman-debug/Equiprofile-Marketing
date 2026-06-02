import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { MarketingWorkspaceConfig } from "./useMarketingWorkspaceConfig.types";
import type { ProductMarketingProfile } from "../ProductMarketingProfileCard";

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
  return {
    query,
    scan,
    update,
    confirm,
    profile: response?.profile ?? null,
    isReady: response?.status === "ok",
    isPending: scan.isPending || update.isPending || confirm.isPending,
  };
}
