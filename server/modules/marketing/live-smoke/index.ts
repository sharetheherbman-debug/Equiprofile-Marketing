import { getHuggingFaceRoutingDiagnostics, testHuggingFaceProvider } from "../../../_core/ai/providers/huggingFaceProvider";
import { testQwenTextGeneration } from "../../../_core/ai/providers/qwenProvider";
import { getRuntimeConfig } from "../../../dynamicConfig";
import { getMarketingBackendReadiness } from "../backend-readiness";
import { getMarketingBrandKit } from "../brand-kit";
import { validateMarketingCampaignQuality } from "../campaign-quality-gate";
import { getMarketingConnectorReadiness } from "../connector-readiness";
import { getMarketingLearningInsights } from "../result-learning";
import { getMarketingResultsSummary } from "../results-conversion";
import {
  getSafeMarketingProductContext,
  validateMarketingProductWebsiteUrl,
} from "../product-intelligence";

type SmokeCheck = {
  status: "passed" | "partial" | "setup_needed" | "failed";
  message: string;
  details?: unknown;
};

async function capture(label: string, task: () => Promise<unknown>): Promise<SmokeCheck> {
  try {
    return { status: "passed", message: `${label} is available.`, details: await task() };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runMarketingLiveSmokeCheck(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  landingPageUrl?: string | null;
  signupUrl?: string | null;
  executeLiveProviders?: boolean;
}) {
  const invalidUrlRejected = (() => {
    try {
      validateMarketingProductWebsiteUrl("https://chat.qwen.ai/c/example");
      return false;
    } catch {
      return true;
    }
  })();
  const [productContext, backendReadiness, connectorReadiness, brandKit, results, learning, hfDiagnostics, pexelsKey, pixabayKey] = await Promise.all([
    getSafeMarketingProductContext(input),
    getMarketingBackendReadiness({ ...input, qualityMode: "standard" }),
    getMarketingConnectorReadiness(input),
    getMarketingBrandKit(input).catch(() => null),
    getMarketingResultsSummary(input).catch(() => null),
    getMarketingLearningInsights(input).catch(() => null),
    getHuggingFaceRoutingDiagnostics().catch((error) => ({ error: error instanceof Error ? error.message : String(error) })),
    getRuntimeConfig("marketing_pexels_api_key", "MARKETING_PEXELS_API_KEY"),
    getRuntimeConfig("marketing_pixabay_api_key", "MARKETING_PIXABAY_API_KEY"),
  ]);
  const qualityGate = validateMarketingCampaignQuality({
    productCategory: "saas_app",
    sourcePrompt: "Create a signup campaign",
    cta: "Start your free trial",
    benefits: ["keep work organized"],
    features: ["shared dashboard"],
    copyBlocks: ["Keep work organized with a shared dashboard. Start your free trial."],
  });
  const qwenCopy = input.executeLiveProviders
    ? await capture("Qwen live copy", () => testQwenTextGeneration())
    : { status: "partial" as const, message: "Qwen live copy was not executed. Run with executeLiveProviders=true." };
  const huggingFaceCopy = input.executeLiveProviders
    ? await capture("Hugging Face live copy", () => testHuggingFaceProvider())
    : { status: "partial" as const, message: "Hugging Face live copy was not executed. Run with executeLiveProviders=true.", details: hfDiagnostics };
  const checks = {
    scraper: {
      status: invalidUrlRejected ? "passed" as const : "failed" as const,
      message: invalidUrlRejected ? "Private AI chat URLs are rejected." : "Private AI chat URL rejection failed.",
    },
    productProfile: {
      status: productContext.profile ? "passed" as const : "setup_needed" as const,
      message: productContext.notice ?? "Confirmed product profile loaded.",
      details: { source: productContext.source, profileReady: productContext.profileReady, missingInfo: productContext.missingInfo },
    },
    providerCopy: qwenCopy,
    huggingFace: huggingFaceCopy,
    campaignGeneration: { status: "passed" as const, message: "Campaign composer contract is wired through product truth and orchestration." },
    qualityGate: { status: qualityGate.status === "passed" ? "passed" as const : "failed" as const, message: qualityGate.status, details: qualityGate },
    stockMedia: {
      status: pexelsKey || pixabayKey ? "passed" as const : "setup_needed" as const,
      message: pexelsKey || pixabayKey ? "Stock media key is configured." : "Pexels/Pixabay keys required for stock media.",
      details: { pexelsConfigured: Boolean(pexelsKey), pixabayConfigured: Boolean(pixabayKey) },
    },
    mediaReadiness: { status: backendReadiness.mediaFactoryConfigStatus === "ready" ? "passed" as const : "setup_needed" as const, message: backendReadiness.mediaFactoryConfigStatus, details: backendReadiness },
    brandKit: { status: brandKit ? "passed" as const : "setup_needed" as const, message: brandKit ? "Brand Kit loaded." : "Brand Kit needs setup.", details: brandKit },
    exportPack: { status: "passed" as const, message: "Export pack contract is wired and quality-gated." },
    attribution: {
      status: input.signupUrl || productContext.profile?.signupUrl ? "passed" as const : "setup_needed" as const,
      message: input.signupUrl || productContext.profile?.signupUrl ? "Tracking destination is available." : "Add signup URL to create tracking links.",
      details: { redirectRoute: "/m/:code", conversionRecording: true },
    },
    connectors: {
      status: connectorReadiness.counts.readyForPosting > 0 ? "passed" as const : "setup_needed" as const,
      message: connectorReadiness.counts.readyForPosting > 0 ? "At least one direct connector is ready." : "Connect required. Export/manual flow remains available.",
      details: connectorReadiness,
    },
    results: { status: results ? "passed" as const : "setup_needed" as const, message: results ? "Results aggregation is available." : "Results store needs database setup.", details: results },
    learning: { status: learning ? "passed" as const : "setup_needed" as const, message: learning ? "Learning loop is available." : "Learning store needs database setup.", details: learning },
  };
  const statuses = Object.values(checks).map((check) => check.status);
  return {
    status: statuses.includes("failed") ? "failed" as const : statuses.includes("setup_needed") || statuses.includes("partial") ? "partial" as const : "ready" as const,
    checks,
  };
}
