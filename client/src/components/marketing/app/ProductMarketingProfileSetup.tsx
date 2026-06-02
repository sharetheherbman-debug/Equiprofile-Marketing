import { ProductMarketingProfileCard } from "./ProductMarketingProfileCard";
import type { useMarketingProductProfile } from "./hooks/useMarketingProductProfile";
import type { MarketingWorkspaceConfig } from "./hooks/useMarketingWorkspaceConfig.types";

export function ProductMarketingProfileSetup({
  workspace,
  intelligence,
  onChooseLogo,
}: {
  workspace: MarketingWorkspaceConfig;
  intelligence: ReturnType<typeof useMarketingProductProfile>;
  onChooseLogo: () => void;
}) {
  return (
    <ProductMarketingProfileCard
      profile={intelligence.profile}
      isReady={intelligence.isReady}
      isPending={intelligence.isPending}
      onScan={(input) => intelligence.scan.mutate({
        tenantId: workspace.tenantId,
        workspaceId: workspace.marketing_workspace_id,
        hostAppId: workspace.host_app_id,
        ...input,
      })}
      onEdit={(input) => intelligence.update.mutate({
        tenantId: workspace.tenantId,
        workspaceId: workspace.marketing_workspace_id,
        hostAppId: workspace.host_app_id,
        ...input,
      })}
      onConfirm={() => intelligence.confirm.mutate({
        tenantId: workspace.tenantId,
        workspaceId: workspace.marketing_workspace_id,
        hostAppId: workspace.host_app_id,
      })}
      onChooseLogo={onChooseLogo}
    />
  );
}
