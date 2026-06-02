import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export const PROVIDER_FIELDS = [
  { id: "genx", key: "marketing_genx_api_key", label: "GenX", group: "Provider keys", canTest: true },
  { id: "qwen", key: "marketing_qwen_api_key", label: "Qwen", group: "Provider keys", canTest: true },
  { id: "huggingface", key: "marketing_huggingface_api_key", label: "Hugging Face", group: "Provider keys", canTest: true },
  { id: "pexels", key: "marketing_pexels_api_key", label: "Pexels", group: "Stock media", canTest: false },
  { id: "pixabay", key: "marketing_pixabay_api_key", label: "Pixabay", group: "Stock media", canTest: false },
] as const;

type SocialConnection = { platform: string; status: string; accountName?: string | null };
type ProviderSettingsApiEntry = { configured: boolean; keyMasked: string | null };
type ProviderSettingsApiResponse = Record<string, ProviderSettingsApiEntry>;

export function normalizeSocialConnections(value: unknown): SocialConnection[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      platform: typeof item.platform === "string" ? item.platform : "Unknown",
      status: typeof item.status === "string" ? item.status : "not_connected",
      accountName: typeof item.accountName === "string" ? item.accountName : null,
    }));
}

function connectionLabel(status: string) {
  if (status === "ready_for_posting" || status === "ready_for_approval_posting") return "Connected";
  if (status === "token_expired") return "Token expired";
  if (status === "permission_missing") return "Scopes missing";
  return "Connect required";
}

function SettingsCard({ title, status, action, children }: { title: string; status: string; action: string; children?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">{action}</p>
        </div>
        <Badge variant="outline" className="rounded-full bg-stone-50 text-xs">{status}</Badge>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export function MarketingAppSettings({
  quality,
  onQualityChange,
  tenantId,
  workspaceId,
  hostAppId,
}: {
  quality: "standard" | "elite";
  onQualityChange: (value: "standard" | "elite") => void;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const utils = trpc.useUtils();
  const [showAdminSupport, setShowAdminSupport] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const providerSettingsQuery = trpc.admin.listAIProviderSettings.useQuery();
  const socialConnectionsQuery = trpc.admin.listMarketingSocialConnections.useQuery({ tenantId, workspaceId });
  const backendReadinessQuery = trpc.admin.getMarketingBackendReadiness.useQuery({ tenantId, workspaceId, hostAppId, qualityMode: quality });
  const toolingQuery = trpc.admin.getMarketingProviderToolingTruth.useQuery({ tenantId, workspaceId, hostAppId, mode: quality });
  const diagnosticsQuery = trpc.admin.getAIDiagnostics.useQuery(undefined, { enabled: showAdminSupport });
  const saveProviderSettings = trpc.admin.saveAIProviderSettings.useMutation({
    onSuccess: async () => {
      toast.success("Marketing settings saved");
      await Promise.all([
        utils.admin.listAIProviderSettings.invalidate(),
        utils.admin.getMarketingBackendReadiness.invalidate(),
      ]);
    },
    onError: (error) => toast.error("Could not save settings", { description: error.message }),
  });
  const testProviderConnection = trpc.admin.testAIProviderConnection.useMutation({
    onError: (error) => toast.error("Connection test failed", { description: error.message }),
  });

  const providerSettings = (providerSettingsQuery.data ?? {}) as ProviderSettingsApiResponse;
  const settingsById = useMemo(() => Object.fromEntries(Object.entries(providerSettings).map(([key, value]) => [key.toLowerCase(), value])), [providerSettings]);
  const socialConnections = useMemo(() => normalizeSocialConnections(socialConnectionsQuery.data), [socialConnectionsQuery.data]);
  const backend = (backendReadinessQuery.data ?? {}) as Record<string, unknown>;
  const tooling = (toolingQuery.data ?? {}) as { attribution?: { redirectRouteAvailable?: boolean; clickTrackingAvailable?: boolean; conversionRecordingAvailable?: boolean; manualMetricsAvailable?: boolean } };

  useEffect(() => {
    setValues(Object.fromEntries(PROVIDER_FIELDS.map((field) => [field.key, ""])));
  }, [providerSettingsQuery.data]);

  function saveSettings() {
    saveProviderSettings.mutate({ settings: values });
  }

  function testConnection(provider: "genx" | "qwen" | "huggingface") {
    testProviderConnection.mutate({ provider }, {
      onSuccess: (result) => {
        const liveReady = Boolean((result as { liveReady?: boolean }).liveReady);
        toast[liveReady ? "success" : "error"](liveReady ? "Live generation passed" : "Provider needs attention", {
          description: liveReady ? `${provider} completed a real live test.` : "Review the provider response and update the key or compatible model.",
        });
      },
    });
  }

  const providers = PROVIDER_FIELDS.filter((field) => field.group === "Provider keys");
  const stock = PROVIDER_FIELDS.filter((field) => field.group === "Stock media");
  const configuredProviderCount = providers.filter((field) => settingsById[field.id]?.configured).length;
  const configuredStockCount = stock.filter((field) => settingsById[field.id]?.configured).length;
  const attributionReady = Boolean(tooling.attribution?.redirectRouteAvailable && tooling.attribution?.clickTrackingAvailable && tooling.attribution?.conversionRecordingAvailable);
  const mediaReady = backend.mediaFactoryConfigStatus === "ready";
  const socialPlatforms = ["Facebook", "Instagram", "TikTok", "YouTube", "LinkedIn"];

  return (
    <div className="space-y-4" aria-label="Settings">
      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Marketing App settings</h2>
            <p className="mt-1 text-sm text-stone-500">Connect what you use. Draft campaigns and export remain available while optional connections are missing.</p>
          </div>
          <Button type="button" onClick={saveSettings} disabled={saveProviderSettings.isPending}>
            {saveProviderSettings.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Save settings
          </Button>
        </div>
        <div className="mt-4 flex gap-2">
          {(["standard", "elite"] as const).map((mode) => (
            <Button key={mode} type="button" variant={quality === mode ? "default" : "outline"} size="sm" onClick={() => onQualityChange(mode)}>
              {mode === "standard" ? "Standard" : "Elite"}
            </Button>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsCard title="1. Product profile" status="Managed in workspace" action="Use Edit product in the top strip to scan, review, and confirm product truth." />
        <SettingsCard title="2. Brand Kit" status="Managed in workspace" action="Use Brand Kit in the top strip to upload a logo, choose colors, set tone, CTA, and signup URL." />
        <SettingsCard title="3. Provider keys" status={configuredProviderCount ? `${configuredProviderCount}/3 saved` : "Add a key"} action="Standard uses Qwen first. Hugging Face is fallback only after a real live pass. Elite uses GenX first.">
          <div className="grid gap-3">
            {providers.map((field) => <ProviderField key={field.key} field={field} entry={settingsById[field.id]} value={values[field.key] ?? ""} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} onTest={() => testConnection(field.id as "genx" | "qwen" | "huggingface")} testing={testProviderConnection.isPending} />)}
          </div>
        </SettingsCard>
        <SettingsCard title="4. Stock media" status={configuredStockCount ? `${configuredStockCount}/2 saved` : "Keys required"} action="Add Pexels or Pixabay keys for stock image and video sourcing. Text campaigns keep working without them.">
          <div className="grid gap-3">
            {stock.map((field) => <ProviderField key={field.key} field={field} entry={settingsById[field.id]} value={values[field.key] ?? ""} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} />)}
          </div>
        </SettingsCard>
        <SettingsCard title="5. Social connections" status={socialConnections.some((connection) => connection.status === "ready_for_posting") ? "Connected" : "Connect required"} action="Connect each account with the required OAuth scopes. Export/manual posting remains available.">
          {socialConnectionsQuery.isError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p>Could not load social connections right now.</p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => void socialConnectionsQuery.refetch()}>Retry</Button>
            </div>
          ) : (
            <div className="grid gap-2">
              {socialPlatforms.map((platform) => {
                const connection = socialConnections.find((item) => item.platform.toLowerCase() === platform.toLowerCase());
                return <div key={platform} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs"><span>{platform}</span><span>{connectionLabel(connection?.status ?? "not_connected")}</span></div>;
              })}
            </div>
          )}
        </SettingsCard>
        <SettingsCard title="6. Email / SMTP" status="Configure server credentials" action="Add valid SMTP credentials and use a test send before sending campaign email." />
        <SettingsCard title="7. Tracking & Results" status={attributionReady ? "Ready" : "Needs setup"} action={attributionReady ? "Attribution redirects, click tracking, conversion recording, and manual metrics are available." : "Add a signup URL and verify tracking storage."} />
        <SettingsCard title="8. Export / Schedule" status="Export-first" action="Review quality-checked drafts, export packs, and schedule drafts. Direct posting unlocks only after connector tests pass." />
        <SettingsCard title="9. Media Studio readiness" status={mediaReady ? "Ready" : "Needs setup"} action={mediaReady ? "Media jobs can run when their provider route is executable and output is playable." : "Verify FFmpeg, storage, and model routes for optional media jobs."} />
      </div>

      <details className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" open={showAdminSupport} onToggle={(event) => setShowAdminSupport(event.currentTarget.open)}>
        <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-stone-900">Admin Support <ChevronDown className={`size-4 transition ${showAdminSupport ? "rotate-180" : ""}`} /></summary>
        {showAdminSupport ? (
          <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
            <p className="text-xs text-stone-500">Developer Diagnostics are available here only for admin/support troubleshooting.</p>
            <pre className="max-h-80 overflow-auto rounded-2xl bg-stone-950 p-4 text-xs text-stone-100">{JSON.stringify({ backend, diagnostics: diagnosticsQuery.data ?? {} }, null, 2)}</pre>
          </div>
        ) : null}
      </details>
    </div>
  );
}

function ProviderField({
  field,
  entry,
  value,
  onChange,
  onTest,
  testing,
}: {
  field: (typeof PROVIDER_FIELDS)[number];
  entry?: ProviderSettingsApiEntry;
  value: string;
  onChange: (value: string) => void;
  onTest?: () => void;
  testing?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-stone-900">{field.label}</p><span className="text-xs text-stone-500">{entry?.configured ? "Saved" : "Missing"}</span></div>
      <Input type="password" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Add ${field.label} key`} className="mt-2" />
      {onTest ? <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onTest} disabled={testing}>{testing ? "Testing..." : "Test live generation"}</Button> : null}
    </div>
  );
}
