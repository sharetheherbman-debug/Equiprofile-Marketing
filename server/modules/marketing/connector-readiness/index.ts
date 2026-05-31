import { getRuntimeConfig } from "../../../dynamicConfig";
import { listMarketingSocialConnectionRecords } from "../../growth-engine";
import { getSocialPublisher } from "../social-publishing/socialPublisherRegistry";
import type { SocialConnectionState, SocialPublisherPlatform } from "../social-publishing/socialPublisherTypes";

export type MarketingConnectorReadinessStatus =
  | "connected"
  | "missing_token"
  | "missing_scopes"
  | "expired_token"
  | "adapter_missing"
  | "setup_needed"
  | "ready_for_posting";

type ConnectorReadinessItem = {
  platform: SocialPublisherPlatform;
  status: MarketingConnectorReadinessStatus;
  reason: string;
  requiredScopes: string[];
  scopes: string[];
  tokenRef: string | null;
  expiresAt: string | null;
  canPublish: boolean;
};

function toConnectionState(input: {
  status?: string | null;
  scopes?: string[];
  requiredScopes?: string[];
  expiresAt?: string | null;
  tokenRef?: string | null;
  accountId?: string | null;
}): SocialConnectionState {
  return {
    status: (input.status ?? "setup_needed") as SocialConnectionState["status"],
    scopes: input.scopes ?? [],
    requiredScopes: input.requiredScopes ?? [],
    expiresAt: input.expiresAt ?? null,
    tokenRef: input.tokenRef ?? null,
    accountId: input.accountId ?? null,
  };
}

export async function getMarketingConnectorReadiness(input: {
  tenantId: string;
  workspaceId: string;
}) {
  let connections: Awaited<ReturnType<typeof listMarketingSocialConnectionRecords>> = [];
  try {
    connections = await listMarketingSocialConnectionRecords({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
    });
  } catch (error) {
    return {
      status: "setup_needed" as const,
      counts: {
        readyForPosting: 0,
        blocked: 7,
      },
      platforms: (["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok", "Email", "Blog / SEO"] as SocialPublisherPlatform[]).map((platform) => ({
        platform,
        status: "setup_needed" as const,
        reason: `connector_state_unavailable:${error instanceof Error ? error.message : String(error)}`,
        requiredScopes: [],
        scopes: [],
        tokenRef: null,
        expiresAt: null,
        canPublish: false,
      })),
    };
  }

  const platforms: SocialPublisherPlatform[] = [
    "Facebook",
    "Instagram",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "Email",
    "Blog / SEO",
  ];

  const smtpHost = await getRuntimeConfig("smtp_host", "SMTP_HOST");
  const blogProviderUrl = await getRuntimeConfig("blog_provider_url", "BLOG_PROVIDER_URL");

  const items: ConnectorReadinessItem[] = [];
  for (const platform of platforms) {
    const adapter = (() => {
      try {
        return getSocialPublisher(platform);
      } catch {
        return null;
      }
    })();

    if (!adapter) {
      items.push({
        platform,
        status: "adapter_missing",
        reason: "adapter_missing",
        requiredScopes: [],
        scopes: [],
        tokenRef: null,
        expiresAt: null,
        canPublish: false,
      });
      continue;
    }

    const connection = connections.find((row) => row.platform === platform) ?? null;
    const requiredScopes = adapter.getRequiredScopes();
    const scopes = connection?.scopes ?? [];
    const missingScopes = requiredScopes.filter((scope) => !scopes.includes(scope));
    const expiresAt = connection?.expiresAt ?? null;
    const expiresMs = expiresAt ? Date.parse(expiresAt) : null;
    const expired = typeof expiresMs === "number" && Number.isFinite(expiresMs) && expiresMs < Date.now();
    const tokenRef = connection?.tokenRef ?? null;
    const baseConnection = toConnectionState({
      status: connection?.status ?? "setup_needed",
      scopes,
      requiredScopes,
      expiresAt,
      tokenRef,
      accountId: connection?.accountId ?? null,
    });
    const validated = adapter.validateConnection(baseConnection);

    const requiresLocalConfig = platform === "Email" || platform === "Blog / SEO";
    const missingLocalConfig = platform === "Email"
      ? !smtpHost
      : platform === "Blog / SEO"
        ? !blogProviderUrl
        : false;

    let status: MarketingConnectorReadinessStatus = "setup_needed";
    let reason = validated.reason || "setup_needed";

    if (validated.readinessStatus === "ready_for_posting" && !missingScopes.length && !expired && !missingLocalConfig) {
      status = "ready_for_posting";
      reason = "ready_for_posting";
    } else if (expired || validated.readinessStatus === "token_expired") {
      status = "expired_token";
      reason = "expired_token";
    } else if (missingScopes.length > 0 || validated.readinessStatus === "permission_missing") {
      status = "missing_scopes";
      reason = missingScopes.length > 0 ? `missing_scopes:${missingScopes.join(",")}` : "missing_scopes";
    } else if (!tokenRef && !requiresLocalConfig) {
      status = "missing_token";
      reason = "missing_token";
    } else if (missingLocalConfig) {
      status = "setup_needed";
      reason = platform === "Email" ? "smtp_not_configured" : "blog_provider_not_configured";
    } else if (connection?.status === "connected") {
      status = "connected";
      reason = "connected_but_not_ready";
    } else {
      status = "setup_needed";
      reason = reason || "setup_needed";
    }

    items.push({
      platform,
      status,
      reason,
      requiredScopes,
      scopes,
      tokenRef,
      expiresAt,
      canPublish: status === "ready_for_posting" && adapter.canPublishWithConnection(baseConnection),
    });
  }

  const readyCount = items.filter((item) => item.status === "ready_for_posting").length;
  const blockedCount = items.filter((item) => item.status !== "ready_for_posting").length;

  return {
    status: readyCount > 0 && blockedCount > 0
      ? "partial"
      : readyCount > 0
        ? "ready"
        : "setup_needed",
    counts: {
      readyForPosting: readyCount,
      blocked: blockedCount,
    },
    platforms: items,
  };
}
