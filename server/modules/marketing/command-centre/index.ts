import { getMarketingBackendReadiness } from "../backend-readiness";
import { getMarketingConnectorReadiness } from "../connector-readiness";
import { getMarketingMediaJobResolverStatus } from "../media-job-resolver";
import { getMarketingLearningInsights, recommendNextMarketingActions } from "../result-learning";

export async function getMarketingCommandCentreState(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  campaignId?: number;
  goalHint?: string;
  audienceHint?: string;
  platformsHint?: string[];
}) {
  const [backend, connectors, mediaResolver, learning] = await Promise.all([
    getMarketingBackendReadiness({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      qualityMode: input.qualityMode,
    }),
    getMarketingConnectorReadiness({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
    }),
    getMarketingMediaJobResolverStatus({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
    }),
    getMarketingLearningInsights({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId: input.campaignId,
    }),
  ]);

  const nextActions = input.goalHint && input.audienceHint && input.campaignId
    ? await recommendNextMarketingActions({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId: input.campaignId,
    })
    : {
      status: "insufficient_data" as const,
      steps: ["Provide a campaignId with baseline data to generate next-best actions."],
      sourcesUsed: ["generic playbook"],
    };

  return {
    status: backend.status,
    readiness: backend,
    connectors,
    mediaResolver,
    learning,
    nextActions,
  };
}
