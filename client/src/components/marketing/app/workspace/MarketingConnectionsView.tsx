import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { normalizeSocialConnections } from "../MarketingAppSettings";

type PlatformSpec = {
  platform: "Facebook" | "Instagram" | "TikTok" | "YouTube" | "LinkedIn" | "Email";
  credentials: string[];
  defaultScopes: string[];
};

const PLATFORM_SPECS: PlatformSpec[] = [
  { platform: "Facebook", credentials: ["App ID", "App Secret", "Page ID", "Page access token"], defaultScopes: ["pages_manage_posts", "pages_read_engagement"] },
  { platform: "Instagram", credentials: ["App ID", "App Secret", "Business account ID", "Access token"], defaultScopes: ["instagram_content_publish", "instagram_basic"] },
  { platform: "TikTok", credentials: ["Client key", "Client secret", "Access token"], defaultScopes: ["video.publish"] },
  { platform: "YouTube", credentials: ["Client ID", "Client secret", "Refresh token", "Channel ID"], defaultScopes: ["youtube.upload"] },
  { platform: "LinkedIn", credentials: ["Client ID", "Client secret", "Access token", "Organization / Person URN"], defaultScopes: ["w_member_social"] },
  { platform: "Email", credentials: ["SMTP host", "SMTP user", "SMTP pass", "From address"], defaultScopes: ["smtp.send"] },
];

function truthLabel(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "ready_for_posting" || normalized === "ready_for_approval_posting") return "Ready to post/send";
  if (normalized === "connected") return "Connected";
  if (normalized === "missing_scopes" || normalized === "permission_missing") return "Missing scopes";
  if (normalized === "missing_token") return "Missing credentials";
  if (normalized === "expired_token" || normalized === "token_expired") return "Token expired";
  if (normalized === "adapter_missing") return "Adapter not implemented";
  if (normalized.includes("failed")) return "Test failed";
  return "Not connected";
}

export function MarketingConnectionsView({
  tenantId,
  workspaceId,
  hostAppId,
}: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const utils = trpc.useUtils();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const socialConnectionsQuery = trpc.admin.listMarketingSocialConnections.useQuery({ tenantId, workspaceId });
  const connectorReadiness = trpc.admin.getMarketingConnectorReadiness.useQuery({ tenantId, workspaceId });
  const connectMutation = trpc.admin.connectMarketingPlatform.useMutation({
    onSuccess: async (result) => {
      toast.success(result.canPublish ? "Connector ready" : "Connector saved", { description: result.readinessStatus === "ready_for_posting" ? "Ready to post/send." : "Still needs credentials or scopes." });
      await Promise.all([utils.admin.listMarketingSocialConnections.invalidate(), utils.admin.getMarketingConnectorReadiness.invalidate()]);
    },
    onError: (error) => toast.error("Could not save connector", { description: error.message }),
  });

  const socialConnections = useMemo(() => normalizeSocialConnections(socialConnectionsQuery.data), [socialConnectionsQuery.data]);
  const readinessByPlatform = useMemo(() => {
    const map = new Map<string, { status: string; reason: string; requiredScopes: string[] }>();
    const rows = (connectorReadiness.data?.platforms ?? []) as Array<{ platform: string; status: string; reason: string; requiredScopes?: string[] }>;
    rows.forEach((row) => map.set(row.platform.toLowerCase(), { status: row.status, reason: row.reason, requiredScopes: row.requiredScopes ?? [] }));
    return map;
  }, [connectorReadiness.data]);

  return (
    <section className="space-y-4" data-testid="marketing-connections-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Connections</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">Social and email account setup</h2>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-600 shadow-sm">
        <p>Posting stays blocked until a connector is truly ready. If not ready, use manual export.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {PLATFORM_SPECS.map((platformSpec) => {
          const platform = platformSpec.platform;
          const saved = socialConnections.find((row) => row.platform.toLowerCase() === platform.toLowerCase());
          const readiness = readinessByPlatform.get(platform.toLowerCase());
          const status = readiness?.status ?? saved?.status ?? "not_connected";
          const requiredScopes = readiness?.requiredScopes?.length ? readiness.requiredScopes : platformSpec.defaultScopes;
          const missingScopes = saved?.missingScopes?.length ? saved.missingScopes : [];
          const tokenRef = inputs[`${platform}.tokenRef`] ?? "";
          const accountId = inputs[`${platform}.accountId`] ?? "";
          const scopesValue = inputs[`${platform}.scopes`] ?? requiredScopes.join(", ");

          return (
            <article key={platform} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-stone-900">{platform}</h3>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">{truthLabel(status)}</span>
              </div>
              <p className="mt-2 text-xs text-stone-500">Required scopes: {requiredScopes.join(", ") || "None listed"}</p>
              <p className="mt-1 text-xs text-stone-500">{missingScopes.length ? `Missing scopes: ${missingScopes.join(", ")}` : readiness?.reason ?? "Use export manually until connected."}</p>
              <div className="mt-3 grid gap-2">
                {platformSpec.credentials.map((field) => (
                  <Input
                    key={`${platform}.${field}`}
                    value={inputs[`${platform}.${field}`] ?? ""}
                    onChange={(event) => setInputs((current) => ({ ...current, [`${platform}.${field}`]: event.target.value }))}
                    placeholder={field}
                  />
                ))}
                <Input value={accountId} onChange={(event) => setInputs((current) => ({ ...current, [`${platform}.accountId`]: event.target.value }))} placeholder={platform === "Email" ? "From identity (optional)" : "Platform account ID"} />
                <Input value={tokenRef} onChange={(event) => setInputs((current) => ({ ...current, [`${platform}.tokenRef`]: event.target.value }))} placeholder={platform === "Email" ? "SMTP token ref (optional)" : "Access token / token ref"} />
                <Input value={scopesValue} onChange={(event) => setInputs((current) => ({ ...current, [`${platform}.scopes`]: event.target.value }))} placeholder="Scopes (comma-separated)" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => connectMutation.mutate({
                    tenantId,
                    workspaceId,
                    hostAppId,
                    platform,
                    status: "connected",
                    accountName: platform,
                    accountId: accountId || null,
                    tokenRef: tokenRef || null,
                    scopes: scopesValue.split(",").map((scope) => scope.trim()).filter(Boolean),
                    metadata: { source: "connections_ui" },
                  })}
                  disabled={connectMutation.isPending}
                >
                  Connect / Test
                </Button>
                <Button type="button" size="sm" variant="outline" disabled={status === "ready_for_posting"}>{status === "ready_for_posting" ? "Ready to post/send" : "Export manually"}</Button>
              </div>
              <p className="mt-2 text-xs text-stone-500">Posted/sent state requires a real platformPostId/platformUploadId or SMTP success.</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
