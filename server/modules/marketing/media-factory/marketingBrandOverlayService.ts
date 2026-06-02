import {
  buildMarketingRenderOverlayConfig,
  resolveDefaultMarketingBrandKit,
  type MarketingOverlayTemplate,
} from "../brand-kit";
import type { MarketingBrandOverlay } from "./renderJobTypes";

export async function buildMarketingBrandOverlay(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  brandKitId?: number | null;
  brandKit?: {
    brandName?: string;
    domain?: string;
    cta?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    overlayTemplate?: MarketingOverlayTemplate;
  };
}): Promise<MarketingBrandOverlay> {
  const isEquiProfile = input.hostAppId.trim().toLowerCase() === "equiprofile";
  const fallbackBrandName = isEquiProfile ? "EquiProfile" : input.hostAppId.trim().replace(/[-_]+/g, " ") || "Workspace brand";
  const fallbackDomain = isEquiProfile ? "equiprofile.online" : "your-product.example";
  const fallbackCta = isEquiProfile ? "Start your free trial" : "Learn more";
  let resolved: Awaited<ReturnType<typeof buildMarketingRenderOverlayConfig>>;
  try {
    resolved = await buildMarketingRenderOverlayConfig({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      brandKitId: input.brandKitId,
      ctaOverride: input.brandKit?.cta,
    });
  } catch {
    resolved = {
      brandKitId: null,
      overlayTemplate: "lower_third",
      brandName: fallbackBrandName,
      domain: fallbackDomain,
      cta: fallbackCta,
      primaryColor: isEquiProfile ? "#1e3a5f" : "#1f2937",
      secondaryColor: isEquiProfile ? "#c5a55a" : "#0ea5e9",
      placements: {
        logo: "top_right",
        brandDomain: "top_left",
        cta: "bottom_right",
      },
      safeArea: { top: 40, right: 40, bottom: 40, left: 40 },
      endCard: {
        enabled: true,
        title: fallbackBrandName,
        cta: fallbackCta,
        domain: fallbackDomain,
      },
    };
  }

  return {
    brandKitId: resolved.brandKitId,
    overlayTemplate: input.brandKit?.overlayTemplate ?? resolved.overlayTemplate,
    brandName: input.brandKit?.brandName || resolved.brandName,
    domain: input.brandKit?.domain || resolved.domain,
    cta: input.brandKit?.cta || resolved.cta,
    primaryColor: input.brandKit?.primaryColor || resolved.primaryColor,
    secondaryColor: input.brandKit?.secondaryColor || resolved.secondaryColor,
    ...(resolved.accentColor ? { accentColor: resolved.accentColor } : {}),
    ...(input.brandKit?.logoUrl || resolved.logoUrl ? { logoUrl: input.brandKit?.logoUrl || resolved.logoUrl! } : {}),
    ...(resolved.logoAssetId ? { logoAssetId: resolved.logoAssetId } : {}),
    placements: resolved.placements,
    safeArea: resolved.safeArea,
    endCard: resolved.endCard,
  };
}

export async function resolveMarketingBrandDefaults(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  return resolveDefaultMarketingBrandKit(input);
}
