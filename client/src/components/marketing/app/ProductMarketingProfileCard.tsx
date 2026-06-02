import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ProductMarketingProfile = {
  appName?: string;
  category?: string;
  landingPageUrl?: string | null;
  signupUrl?: string | null;
  targetAudiences?: string[];
  primaryOffer?: string | null;
  benefits?: string[];
  ctaLibrary?: string[];
  missingInfo?: string[];
  confidenceScore?: number;
  candidateLogoUrls?: string[];
  logoAssetId?: number | null;
  confirmedAt?: string | null;
};

export function ProductMarketingProfileCard({
  profile,
  isReady,
  isPending,
  onScan,
  onEdit,
  onConfirm,
  onChooseLogo,
}: {
  profile: ProductMarketingProfile | null;
  isReady: boolean;
  isPending: boolean;
  onScan: (input: { landingPageUrl: string; signupUrl?: string; productNotes?: string }) => void;
  onEdit: (input: { landingPageUrl?: string | null; signupUrl?: string | null; primaryOffer?: string | null }) => void;
  onConfirm: () => void;
  onChooseLogo: () => void;
}) {
  const [landingPageUrl, setLandingPageUrl] = useState(profile?.landingPageUrl ?? "");
  const [signupUrl, setSignupUrl] = useState(profile?.signupUrl ?? "");
  const [productNotes, setProductNotes] = useState("");
  const [editing, setEditing] = useState(!isReady);

  useEffect(() => {
    setLandingPageUrl(profile?.landingPageUrl ?? "");
    setSignupUrl(profile?.signupUrl ?? "");
  }, [profile?.landingPageUrl, profile?.signupUrl]);

  const logoUrl = profile?.candidateLogoUrls?.[0] ?? null;

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm" data-testid="product-marketing-profile-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Product Intelligence</p>
          <h2 className="mt-1 text-lg font-semibold text-stone-900">Let&apos;s learn what we&apos;re marketing first.</h2>
          <p className="mt-1 text-xs text-stone-600">Scan the product site, review the extracted truth, then generate campaigns from confirmed context.</p>
        </div>
        <Badge className={`rounded-full border ${isReady ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-white text-amber-700"}`}>
          Confidence {profile?.confidenceScore ?? 0}%
        </Badge>
      </div>

      {editing || !profile ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-stone-700">Website / landing page URL</span>
            <Input value={landingPageUrl} onChange={(event) => setLandingPageUrl(event.target.value)} placeholder="https://example.com" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-stone-700">Signup URL</span>
            <Input value={signupUrl} onChange={(event) => setSignupUrl(event.target.value)} placeholder="https://example.com/signup" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-stone-700">Short product notes</span>
            <textarea
              value={productNotes}
              onChange={(event) => setProductNotes(event.target.value)}
              className="min-h-20 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-400"
              placeholder="What does the product do, who is it for, and what offer should campaigns use?"
            />
          </label>
        </div>
      ) : null}

      {profile ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="rounded-2xl border border-amber-100 bg-white p-4">
            <p className="text-sm font-semibold text-stone-900">{profile.appName ?? "Product profile"}</p>
            <p className="mt-2 text-xs text-stone-600">Audience: {profile.targetAudiences?.join(", ") || "Needs confirmation"}</p>
            <p className="mt-1 text-xs text-stone-600">Offer: {profile.primaryOffer || "Needs confirmation"}</p>
            <p className="mt-1 text-xs text-stone-600">CTA: {profile.ctaLibrary?.[0] || profile.signupUrl || "Needs confirmation"}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-stone-500">Top benefits</p>
            <ul className="mt-1 space-y-1 text-xs text-stone-700">
              {(profile.benefits ?? []).slice(0, 4).map((benefit) => <li key={benefit}>- {benefit}</li>)}
            </ul>
            {profile.missingInfo?.length ? (
              <p className="mt-3 text-xs text-amber-700">Missing info: {profile.missingInfo.join(", ")}</p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-3">
            {logoUrl ? <img src={logoUrl} alt={`${profile.appName ?? "Product"} logo candidate`} className="h-20 w-full object-contain" /> : <div className="flex h-20 items-center justify-center text-xs text-stone-500">No logo found</div>}
            <p className="mt-2 text-[11px] text-stone-500">{profile.logoAssetId ? "Brand Kit logo selected" : "Confirm a logo in Brand Kit"}</p>
            <Button type="button" variant="outline" size="sm" className="mt-2 w-full rounded-full text-xs" onClick={onChooseLogo}>
              {logoUrl ? "Choose from Assets" : "Upload logo / Choose from Assets"}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          className="rounded-full"
          disabled={isPending || !landingPageUrl.trim()}
          onClick={() => onScan({ landingPageUrl: landingPageUrl.trim(), signupUrl: signupUrl.trim() || undefined, productNotes: productNotes.trim() || undefined })}
        >
          {isPending ? "Scanning..." : "Scan product"}
        </Button>
        {profile ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={isPending}
            onClick={() => {
              if (editing) onEdit({ landingPageUrl: landingPageUrl.trim() || null, signupUrl: signupUrl.trim() || null });
              setEditing((current) => !current);
            }}
          >
            {editing ? "Save profile" : "Edit profile"}
          </Button>
        ) : null}
        {profile ? <Button type="button" variant="outline" className="rounded-full" disabled={isPending} onClick={onConfirm}>Confirm profile</Button> : null}
      </div>
    </section>
  );
}
