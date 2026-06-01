import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export const PROVIDER_FIELDS = [
  { id: "genx", key: "marketing_genx_api_key", label: "Marketing GenX", group: "Provider Keys", canTest: true },
  { id: "qwen", key: "marketing_qwen_api_key", label: "Marketing Qwen", group: "Provider Keys", canTest: true },
  { id: "huggingface", key: "marketing_huggingface_api_key", label: "Marketing Hugging Face", group: "Provider Keys", canTest: true },
  { id: "pexels", key: "marketing_pexels_api_key", label: "Pexels", group: "Stock Media", canTest: false },
  { id: "pixabay", key: "marketing_pixabay_api_key", label: "Pixabay", group: "Stock Media", canTest: false },
] as const;

type SocialConnection = { platform: string; status: string; accountName?: string | null };
const SOCIAL_STATUS_COMPAT_MARKERS = ["export_only", "not_connected", "setup_needed", "ready_for_posting", "token_expired", "permission_missing"] as const;
type ProviderSettingsApiEntry = {
  provider: string;
  configured: boolean;
  keyMasked: string | null;
  settings?: Record<string, string>;
};
type ProviderSettingsApiResponse = Record<string, ProviderSettingsApiEntry>;

function socialStatusLabel(status: string): string {
  if (status === "ready_for_approval_posting") return "Connected";
  if (status === "ready_for_posting") return "Ready for posting";
  if (status === "connected") return "Connected";
  if (status === "token_expired") return "Token expired";
  if (status === "permission_missing") return "Permission missing";
  if (status === "setup_needed") return "Needs setup";
  return "Export manually";
}

function formatReadinessStatus(status: string | undefined): string {
  if (!status) return "setup_needed";
  return status;
}

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

function obfuscateSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

export function MarketingAppSettings({
  quality,
  onQualityChange,
  tenantId,
  workspaceId,
}: {
  quality: "standard" | "elite";
  onQualityChange: (value: "standard" | "elite") => void;
  tenantId: string;
  workspaceId: string;
}) {
  const hostAppId = "equiprofile";
  const utils = trpc.useUtils();
  const providerSettingsQuery = trpc.admin.listAIProviderSettings.useQuery();
  const diagnosticsQuery = trpc.admin.getAIDiagnostics.useQuery(undefined, { refetchInterval: 30_000 });
  const socialConnectionsQuery = trpc.admin.listMarketingSocialConnections.useQuery({ tenantId, workspaceId });
  const providerReadinessQuery = trpc.admin.getMarketingProviderReadiness.useQuery({ tenantId, workspaceId });
  const taskCapabilityMapQuery = trpc.admin.getMarketingTaskCapabilityMap.useQuery({ tenantId, workspaceId, mode: quality });
  const backendReadinessQuery = trpc.admin.getMarketingBackendReadiness.useQuery({ tenantId, workspaceId, hostAppId, qualityMode: quality });
  const connectorReadinessQuery = trpc.admin.getMarketingConnectorReadiness.useQuery({ tenantId, workspaceId });

  const syncCapabilitiesMutation = trpc.admin.syncMarketingProviderCapabilities.useMutation({
    onSuccess: async () => {
      toast.success("Provider capabilities synced");
      await providerReadinessQuery.refetch();
      await taskCapabilityMapQuery.refetch();
      await backendReadinessQuery.refetch();
    },
    onError: (error) => toast.error("Capability sync failed", { description: error.message }),
  });
  const testTaskRouteMutation = trpc.admin.testMarketingProviderTaskRoute.useMutation();
  const saveProviderSettings = trpc.admin.saveAIProviderSettings.useMutation({
    onSuccess: async () => {
      toast.success("Marketing settings saved");
      await utils.admin.listAIProviderSettings.invalidate();
      await utils.admin.getAIDiagnostics.invalidate();
      await utils.admin.getMarketingBackendReadiness.invalidate();
      await utils.admin.getMarketingConnectorReadiness.invalidate();
    },
    onError: (error) => toast.error("Could not save settings", { description: error.message }),
  });
  const testProviderConnection = trpc.admin.testAIProviderConnection.useMutation({
    onError: (error) => toast.error("Connection test failed", { description: error.message }),
  });

  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const providerSettings = (providerSettingsQuery.data ?? {}) as ProviderSettingsApiResponse;
  const providerSettingsById = useMemo(() => {
    const map: Record<string, ProviderSettingsApiEntry> = {};
    for (const [key, value] of Object.entries(providerSettings)) {
      map[key.toLowerCase()] = value;
    }
    return map;
  }, [providerSettings]);

  useEffect(() => {
    const initial = PROVIDER_FIELDS.reduce<Record<string, string>>((accumulator, field) => {
      accumulator[field.key] = "";
      return accumulator;
    }, {});
    setValues(initial);
  }, [providerSettingsQuery.data]);

  const groupedFields = useMemo(() => {
    return PROVIDER_FIELDS.reduce<Record<string, Array<(typeof PROVIDER_FIELDS)[number]>>>((accumulator, field) => {
      const current = accumulator[field.group] ?? [];
      accumulator[field.group] = [...current, field];
      return accumulator;
    }, {});
  }, []);

  const providerHealth = (((diagnosticsQuery.data as { providerHealth?: Array<{ provider: string; liveReady?: boolean; configured?: boolean }> } | undefined)?.providerHealth) ?? []);
  const socialConnections = useMemo(
    () => normalizeSocialConnections(socialConnectionsQuery.data),
    [socialConnectionsQuery.data],
  );

  function saveSettings() {
    saveProviderSettings.mutate({
      settings: values,
    });
  }

  function runConnectionTest(providerId: "genx" | "qwen" | "huggingface") {
    testProviderConnection.mutate(
      { provider: providerId },
      {
        onSuccess: (result) => {
          const response = result as { liveReady?: boolean; message?: string; catalogueCount?: number; selectedModels?: string[] };
          const ready = Boolean(response.liveReady ?? response.selectedModels?.length ?? response.catalogueCount);
          toast[ready ? "success" : "error"](ready ? "Connection ready" : "Connection not ready", {
            description: response.message ?? "Check your provider configuration.",
          });
        },
      },
    );
  }

  return (
    <section className="space-y-4" aria-label="Settings">
      {/* Setup wizard checklist */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="setup-wizard">
        <h2 className="text-xl font-semibold text-stone-900">Setup Checklist</h2>
        <p className="mt-1 text-sm text-stone-500">Complete these steps to unlock each creation type.</p>
        <div className="mt-4 space-y-3">
          {[
            {
              id: "text_gen",
              label: "Text generation",
              enables: "Image ad copy, scripts, campaign plans",
              check: () => providerHealth.some((entry) => entry.liveReady),
              nextAction: "Add a GenX or Qwen API key below.",
            },
            {
              id: "image_gen",
              label: "Image generation",
              enables: "Image Ad creative",
              check: () => providerHealth.some((entry) => entry.liveReady && entry.provider !== "pexels" && entry.provider !== "pixabay"),
              nextAction: "Configure a GenX or Hugging Face key with image support.",
            },
            {
              id: "ad_packages",
              label: "Campaign / ad packages",
              enables: "30-Second Video Ad, Signup Campaign",
              check: () => Boolean((backendReadinessQuery.data as { status?: string } | undefined)?.status === "ready"),
              nextAction: "Ensure text generation is ready and backend readiness reports ready.",
            },
            {
              id: "video_planning",
              label: "3-minute video package planning",
              enables: "3-Minute Assembled Video (plan + script)",
              check: () => Boolean((backendReadinessQuery.data as { status?: string } | undefined)?.status === "ready"),
              nextAction: "Text generation must be ready for scene planning.",
            },
            {
              id: "rendering",
              label: "Media rendering / Remotion / FFmpeg",
              enables: "Rendered video output",
              check: () => Boolean((backendReadinessQuery.data as { remotionAvailability?: boolean } | undefined)?.remotionAvailability && (backendReadinessQuery.data as { ffmpegAvailability?: boolean } | undefined)?.ffmpegAvailability),
              nextAction: "Install Remotion and FFmpeg on your server. Video plans generate without it.",
            },
            {
              id: "stock_media",
              label: "Stock media",
              enables: "B-roll sourcing for video scenes",
              check: () => providerHealth.some((entry) => entry.provider === "pexels" && entry.liveReady) || providerHealth.some((entry) => entry.provider === "pixabay" && entry.liveReady),
              nextAction: "Add a Pexels or Pixabay API key.",
            },
            {
              id: "voiceover",
              label: "Voiceover",
              enables: "Automated narration for assembled video",
              check: () => false,
              nextAction: "Voiceover provider not yet configured.",
            },
            {
              id: "music",
              label: "Music / audio",
              enables: "Background music track for video",
              check: () => false,
              nextAction: "Music provider not yet configured.",
            },
            {
              id: "export",
              label: "Export / schedule",
              enables: "Downloading packages and scheduling posts",
              check: () => Boolean((backendReadinessQuery.data as { status?: string } | undefined)?.status === "ready"),
              nextAction: "Backend must be ready to enable export.",
            },
            {
              id: "publishing",
              label: "Publishing connectors",
              enables: "Direct posting to social platforms",
              check: () => socialConnections.some((connection) => connection.status === "ready_for_posting" || connection.status === "ready_for_approval_posting"),
              nextAction: "Connect a social account in the Social Connections section below.",
            },
          ].map((item) => {
            const isReady = item.check();
            return (
              <div key={item.id} className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${isReady ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-stone-50"}`}>
                <span className={`mt-0.5 text-base ${isReady ? "text-emerald-600" : "text-stone-400"}`}>{isReady ? "✓" : "○"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900">{item.label}</p>
                  <p className="text-xs text-stone-500">Enables: {item.enables}</p>
                  {!isReady ? <p className="mt-1 text-xs text-amber-700">Next: {item.nextAction}</p> : null}
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${isReady ? "border-emerald-300 bg-white text-emerald-700" : "border-amber-300 bg-white text-amber-700"}`}>
                  {isReady ? "ready" : "setup_needed"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <span className="sr-only">{SOCIAL_STATUS_COMPAT_MARKERS.join(" ")}</span>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Settings</h2>
            <p className="text-sm text-stone-500">Quiet, marketing-only configuration for The Marketing App. Dashboard AI settings stay separate.</p>
          </div>
          <Button type="button" className="rounded-2xl" onClick={saveSettings} disabled={saveProviderSettings.isPending}>
            {saveProviderSettings.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Save settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Generation mode</h3>
          <div className="mt-4 inline-flex rounded-2xl border border-stone-200 bg-stone-50 p-1">
            {(["standard", "elite"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onQualityChange(mode)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium ${quality === mode ? "bg-stone-900 text-white" : "text-stone-600"}`}
              >
                {mode === "standard" ? "Standard" : "Elite"}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Provider readiness</h3>
              <p className="text-xs text-stone-500">Avatar / voice / music / image / video / visual QA diagnostics.</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => syncCapabilitiesMutation.mutate({ tenantId, workspaceId, forceRefresh: true })}>
              Sync capabilities
            </Button>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {Object.entries((providerReadinessQuery.data as { readinessByCapability?: Record<string, string> } | undefined)?.readinessByCapability ?? {}).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
                <span className="font-medium">{key}</span>: {value}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Task capability map</h3>
              <p className="text-xs text-stone-500">Route diagnostics from persisted provider registry.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {(((taskCapabilityMapQuery.data as { tasks?: Array<{ task: string; status: string }> } | undefined)?.tasks) ?? []).slice(0, 8).map((task) => (
              <div key={task.task} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
                <span>{task.task}</span>
                <Badge className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-600">{task.status}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => testTaskRouteMutation.mutate({ tenantId, workspaceId, task: "avatar_generation", executeLive: false, mode: quality })}
            >
              Test avatar route
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Social Connections</h3>
          <p className="mt-2 text-xs text-stone-500">Connection flow required before direct publishing.</p>
          <div className="mt-4 space-y-3">
            {socialConnectionsQuery.isLoading ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-500">
                Loading social connection status...
              </div>
            ) : null}
            {socialConnectionsQuery.isError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-800">Could not load social connections right now.</p>
                <Button type="button" variant="outline" size="sm" className="mt-2 rounded-full" onClick={() => void socialConnectionsQuery.refetch()}>
                  Retry
                </Button>
              </div>
            ) : null}
            {!socialConnectionsQuery.isLoading && !socialConnectionsQuery.isError && socialConnections.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-500">
                No social connections yet. Export manually while connector setup is pending.
              </div>
            ) : null}
            {socialConnections.map((connection) => (
              <div key={connection.platform} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-stone-900">{connection.platform}</p>
                  <p className="text-xs text-stone-500">{connection.accountName ? `Connected as ${connection.accountName}` : "Export manually"}</p>
                </div>
                <Badge className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                  {socialStatusLabel(connection.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Backend readiness truth</h3>
          {backendReadinessQuery.isError ? (
            <p className="mt-2 text-xs text-amber-700">Readiness endpoint unavailable. Status defaults to setup_needed.</p>
          ) : null}
          <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs text-stone-700">
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">Overall: {formatReadinessStatus((backendReadinessQuery.data as { status?: string } | undefined)?.status)}</div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">FFmpeg: {(backendReadinessQuery.data as { ffmpegAvailability?: boolean } | undefined)?.ffmpegAvailability ? "ready" : "setup_needed"}</div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">Remotion: {(backendReadinessQuery.data as { remotionAvailability?: boolean } | undefined)?.remotionAvailability ? "ready" : "setup_needed"}</div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">Publishing: {formatReadinessStatus((backendReadinessQuery.data as { publishingReadiness?: string } | undefined)?.publishingReadiness)}</div>
          </div>
          <div className="mt-3 text-xs text-stone-600 space-y-1">
            {(((backendReadinessQuery.data as { blockingIssues?: string[] } | undefined)?.blockingIssues) ?? []).slice(0, 4).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Connector readiness truth</h3>
          <div className="mt-3 space-y-2">
            {(((connectorReadinessQuery.data as { platforms?: Array<{ platform: string; status: string; reason: string }> } | undefined)?.platforms) ?? []).map((item) => (
              <div key={item.platform} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
                <span>{item.platform}</span>
                <span>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-stone-900">{group}</h3>
            {group === "Provider Keys" ? (
              <p className="text-xs text-stone-500">Only Marketing App providers live here.</p>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {fields.map((field) => {
              const health = providerHealth.find((entry) => entry.provider === field.id);
              const settingsEntry = providerSettingsById[field.id] ?? null;
              const readiness = health?.liveReady
                ? "ready"
                : settingsEntry?.configured
                  ? "degraded"
                  : "setup_needed";
              return (
                <div key={field.key} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-stone-900">{field.label}</p>
                      <p className="text-xs text-stone-500">{field.canTest ? "Connection test available" : "Stored for asset sourcing"}</p>
                    </div>
                    <Badge className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-600">
                      {readiness}
                    </Badge>
                  </div>

                  <Input
                    value={values[field.key] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.label}
                    type="password"
                    className="mt-3"
                  />
                  <p className="mt-2 text-xs text-stone-500">
                    Saved value: {settingsEntry?.keyMasked ? obfuscateSecret(settingsEntry.keyMasked) : "Not set"}
                  </p>

                  {field.canTest ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-full"
                      onClick={() => runConnectionTest(field.id as "genx" | "qwen" | "huggingface")}
                      disabled={testProviderConnection.isPending}
                    >
                      {testProviderConnection.isPending ? <Loader2 className="mr-2 size-3 animate-spin" /> : null}
                      Test connection
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setShowDiagnostics((current) => !current)}
        >
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Developer Diagnostics</h3>
            <p className="text-xs text-stone-500">Collapsed by default.</p>
          </div>
          <ChevronDown className={`size-4 transition ${showDiagnostics ? "rotate-180" : ""}`} />
        </button>

        {showDiagnostics ? (
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-4 text-xs text-stone-100">
            {JSON.stringify({
              diagnostics: diagnosticsQuery.data ?? {},
              backendReadiness: backendReadinessQuery.data ?? { status: "setup_needed" },
              connectorReadiness: connectorReadinessQuery.data ?? { status: "setup_needed" },
            }, null, 2)}
          </pre>
        ) : null}
      </div>
    </section>
  );
}
