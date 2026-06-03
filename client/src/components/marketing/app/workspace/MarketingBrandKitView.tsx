import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { useMarketingBrandKit } from "../hooks/useMarketingBrandKit";
import type { useMarketingProductProfile } from "../hooks/useMarketingProductProfile";
import { ProductContextPanel } from "./ProductContextPanel";

export function MarketingBrandKitView({
  productIntelligence,
  brandKitState,
  isUploadingLogo,
  onScanProduct,
  onSaveProduct,
  onUseDefaults,
  onConfirmProduct,
  onUploadLogo,
  onRepairLogo,
  onChooseLogo,
}: {
  productIntelligence: ReturnType<typeof useMarketingProductProfile>;
  brandKitState: ReturnType<typeof useMarketingBrandKit>;
  isUploadingLogo: boolean;
  onScanProduct: (draft: { landingPageUrl: string; signupUrl: string; productNotes: string }) => void;
  onSaveProduct: (draft: { landingPageUrl: string; signupUrl: string; productNotes: string }) => void;
  onUseDefaults: (draft: { landingPageUrl: string; signupUrl: string; productNotes: string }) => void;
  onConfirmProduct: () => void;
  onUploadLogo: (file: File) => void;
  onRepairLogo: () => void;
  onChooseLogo: () => void;
}) {
  const { brandKit, setBrandKit, overlayTemplates, upsertBrandKitMutation } = brandKitState;
  const profile = productIntelligence.displayProfile;
  const showUnknownCategory = productIntelligence.isReady && (!profile?.category || profile.category === "unknown");

  return (
    <section className="space-y-5" data-testid="marketing-brand-kit-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Brand Kit</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">Product profile and brand setup</h2>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-stone-600">1) Website URL → 2) Scan website → 3) Review profile → 4) Upload/select logo → 5) Confirm product profile.</p>
      </div>
      <ProductContextPanel
        profile={productIntelligence.displayProfile}
        isReady={productIntelligence.isReady}
        isPending={productIntelligence.isPending || isUploadingLogo}
        usingEquiProfileDefaults={productIntelligence.usingEquiProfileDefaults}
        onScan={onScanProduct}
        onSaveDraft={onSaveProduct}
        onUseDefaults={onUseDefaults}
        onConfirm={onConfirmProduct}
        onChooseLogo={onChooseLogo}
        onUploadLogo={onUploadLogo}
        onRepairLogo={onRepairLogo}
        onOpenSettings={() => undefined}
        onOpenResults={() => undefined}
      />
      {showUnknownCategory ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Category still needs confirmation. Scan once more or save defaults to set a concrete category.</p>
      ) : null}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-stone-900">Brand Kit settings</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-stone-700">
            Brand name
            <Input value={brandKit.brandName} onChange={(event) => setBrandKit((current) => ({ ...current, brandName: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            Domain
            <Input value={brandKit.domain} onChange={(event) => setBrandKit((current) => ({ ...current, domain: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            Primary CTA
            <Input value={brandKit.primaryCta} onChange={(event) => setBrandKit((current) => ({ ...current, primaryCta: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            Tone
            <Input value={brandKit.toneOfVoice} onChange={(event) => setBrandKit((current) => ({ ...current, toneOfVoice: event.target.value }))} />
          </label>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm text-stone-700">
            Primary color
            <Input value={brandKit.primaryColor} onChange={(event) => setBrandKit((current) => ({ ...current, primaryColor: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            Secondary color
            <Input value={brandKit.secondaryColor} onChange={(event) => setBrandKit((current) => ({ ...current, secondaryColor: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            Overlay template
            <select value={brandKit.overlayTemplate} onChange={(event) => setBrandKit((current) => ({ ...current, overlayTemplate: event.target.value as typeof current.overlayTemplate }))} className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm">
              {overlayTemplates.map((template) => <option key={template} value={template}>{template}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <Button type="button" onClick={() => upsertBrandKitMutation.mutate(brandKit)} disabled={upsertBrandKitMutation.isPending}>
            {upsertBrandKitMutation.isPending ? "Saving..." : "Save Brand Kit"}
          </Button>
        </div>
      </section>
    </section>
  );
}
