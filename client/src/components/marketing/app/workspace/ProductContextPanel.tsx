import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductMarketingProfile } from "../ProductMarketingProfileCard";

type ProductDraft = {
  landingPageUrl: string;
  signupUrl: string;
  productNotes: string;
};

export function ProductContextPanel({
  profile,
  isReady,
  isPending,
  usingEquiProfileDefaults,
  onScan,
  onSaveDraft,
  onUseDefaults,
  onConfirm,
  onChooseLogo,
  onUploadLogo,
  onOpenSettings,
  onOpenResults,
}: {
  profile: ProductMarketingProfile | null;
  isReady: boolean;
  isPending: boolean;
  usingEquiProfileDefaults: boolean;
  onScan: (draft: ProductDraft) => void;
  onSaveDraft: (draft: ProductDraft) => void;
  onUseDefaults: (draft: ProductDraft) => void;
  onConfirm: () => void;
  onChooseLogo: () => void;
  onUploadLogo: (file: File) => void;
  onOpenSettings: () => void;
  onOpenResults: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>({
    landingPageUrl: profile?.landingPageUrl ?? "",
    signupUrl: profile?.signupUrl ?? "",
    productNotes: "",
  });
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      landingPageUrl: profile?.landingPageUrl ?? "",
      signupUrl: profile?.signupUrl ?? "",
    }));
  }, [profile?.landingPageUrl, profile?.signupUrl]);

  const logoUrl = profile?.candidateLogoUrls?.[0] ?? null;
  const needsReview = !isReady;

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" data-testid="product-context-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Product Context</p>
          <h2 className="mt-1 text-base font-semibold text-stone-900">{usingEquiProfileDefaults ? "Let’s learn what we’re marketing." : profile?.appName ?? "Let’s learn what we’re marketing."}</h2>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">
          {profile?.confidenceScore ?? 0}%
        </Badge>
      </div>

      {needsReview ? (
        <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          Profile needs review, but draft campaigns can still be generated.
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => setShowEditor((current) => !current)}>Edit product</Button>
        <Button type="button" size="sm" variant="outline" onClick={onChooseLogo}>Brand Kit</Button>
        <Button type="button" size="sm" variant="outline" onClick={onOpenSettings}>Connections</Button>
        <Button type="button" size="sm" variant="outline" onClick={onOpenResults}>Results</Button>
      </div>

      {showEditor ? <div className="mt-4 space-y-3">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-stone-700">Website URL</span>
          <Input
            value={draft.landingPageUrl}
            onChange={(event) => setDraft((current) => ({ ...current, landingPageUrl: event.target.value }))}
            placeholder="https://equiprofile.com"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-stone-700">Signup URL</span>
          <Input
            value={draft.signupUrl}
            onChange={(event) => setDraft((current) => ({ ...current, signupUrl: event.target.value }))}
            placeholder="https://.../signup"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-stone-700">Product notes</span>
          <textarea
            value={draft.productNotes}
            onChange={(event) => setDraft((current) => ({ ...current, productNotes: event.target.value }))}
            className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="What should campaigns emphasize?"
          />
        </label>
      <div className="mt-4 grid gap-2">
        <Button type="button" disabled={isPending || !draft.landingPageUrl.trim()} onClick={() => onScan(draft)}>
          {isPending ? "Working..." : "Scan site"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={() => onSaveDraft(draft)}>Save draft</Button>
        {usingEquiProfileDefaults ? (
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onUseDefaults(draft)}>Use EquiProfile defaults</Button>
        ) : null}
        {profile ? <Button type="button" variant="ghost" disabled={isPending} onClick={onConfirm}>Confirm profile</Button> : null}
      </div>
      </div> : null}

      <div className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
        <p><span className="font-semibold text-stone-800">Product:</span> {profile?.appName || "Add product name"}</p>
        <p><span className="font-semibold text-stone-800">Category:</span> {profile?.category?.replace(/_/g, " ") || "Add category"}</p>
        <p><span className="font-semibold text-stone-800">Audience:</span> {profile?.targetAudiences?.slice(0, 3).join(", ") || "Add audience notes"}</p>
        <p><span className="font-semibold text-stone-800">Offer:</span> {profile?.primaryOffer || "Add offer details"}</p>
        <p><span className="font-semibold text-stone-800">CTA:</span> {profile?.ctaLibrary?.[0] || profile?.signupUrl || "Add a signup URL"}</p>
        <p><span className="font-semibold text-stone-800">Top benefits:</span> {profile?.benefits?.slice(0, 3).join(", ") || "Add benefits"}</p>
        {profile?.missingInfo?.length ? <p className="text-amber-700">Missing: {profile.missingInfo.join(", ")}</p> : null}
      </div>

      <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 p-3">
        {logoUrl ? <img src={logoUrl} alt={`${profile?.appName ?? "Product"} logo`} className="h-16 w-full object-contain" /> : <p className="text-xs text-stone-500">Logo not confirmed yet.</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700">
            Upload logo
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUploadLogo(file);
              event.target.value = "";
            }} />
          </label>
          <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={onChooseLogo}>Choose from Assets</Button>
        </div>
      </div>
    </section>
  );
}
