import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketingAssetRow } from "../MarketingAppAssetStore";
import type { ReturnTypeOfUseMarketingAssets } from "./workspaceTypes";

const FILTERS = ["All", "Images", "Videos", "Audio", "Logos", "Stock", "Exports"] as const;
type LibraryFilter = (typeof FILTERS)[number];

function metadataFor(asset: MarketingAssetRow) {
  return { ...(asset.metadata ?? {}), ...(asset.outputs ?? {}), ...(asset.outputMetadata ?? {}) };
}

function matchesFilter(asset: MarketingAssetRow, filter: LibraryFilter) {
  if (filter === "All") return true;
  const value = `${asset.type ?? ""} ${asset.mimeType ?? ""}`.toLowerCase();
  const metadata = metadataFor(asset);
  if (filter === "Images") return value.includes("image");
  if (filter === "Videos") return value.includes("video");
  if (filter === "Audio") return value.includes("audio");
  if (filter === "Logos") return value.includes("logo") || metadata.assetRole === "logo";
  if (filter === "Stock") return ["pexels", "pixabay"].includes(String(asset.provider ?? metadata.source ?? "").toLowerCase());
  return value.includes("export") || metadata.source === "campaign_export" || metadata.versionType === "campaign_export";
}

export function MarketingLibraryView({
  assetsState,
  onUseAsLogo,
  onUseAsReference,
}: {
  assetsState: ReturnTypeOfUseMarketingAssets;
  onUseAsLogo: (assetId: number) => void;
  onUseAsReference?: (asset: MarketingAssetRow) => void;
}) {
  const assets = assetsState.assetStore.visibleAssets;
  const [filter, setFilter] = useState<LibraryFilter>("All");
  const [search, setSearch] = useState("");
  const visibleAssets = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return assets.filter((asset) => {
      if (!matchesFilter(asset, filter)) return false;
      if (!needle) return true;
      return `${asset.id} ${asset.type ?? ""} ${asset.provider ?? ""} ${asset.model ?? ""} ${asset.status ?? ""} ${asset.generationPrompt ?? ""} ${JSON.stringify(metadataFor(asset))}`.toLowerCase().includes(needle);
    });
  }, [assets, filter, search]);

  return (
    <section className="space-y-4" data-testid="marketing-library-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Library</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">Generated assets and imports</h2>
      </div>
      <div className="flex flex-wrap gap-2 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
        {FILTERS.map((item) => <Button key={item} type="button" size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>{item}</Button>)}
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search prompt, type, provider, or status" className="min-w-[240px] flex-1" />
      </div>
      {!visibleAssets.length ? <p className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">{assets.length ? "No assets match this filter yet." : "No assets yet. Generate an image or render a video and it will appear here."}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleAssets.map((asset) => {
          const url = asset.publicUrl || asset.localPath || null;
          const metadata = metadataFor(asset);
          const source = asset.provider ?? metadata.source;
          const license = metadata.license;
          const attribution = metadata.photographer ?? metadata.userName ?? metadata.user;
          return (
            <article key={asset.id} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              {url && /image/i.test(asset.mimeType ?? asset.type ?? "") ? <img src={url} alt="Marketing asset" className="h-40 w-full rounded-2xl bg-stone-50 object-contain" /> : null}
              {url && /video/i.test(asset.mimeType ?? asset.type ?? "") ? <video src={url} controls className="h-40 w-full rounded-2xl bg-black" /> : null}
              {url && /audio/i.test(asset.mimeType ?? asset.type ?? "") ? <audio src={url} controls className="mt-2 w-full" /> : null}
              <p className="mt-3 text-sm font-semibold text-stone-900">{asset.type || "Asset"} #{asset.id}</p>
              <p className="mt-1 text-xs text-stone-500">{asset.status || "saved"}{source ? ` · ${String(source)}` : ""}{asset.model ? ` · ${asset.model}` : ""}</p>
              {license || attribution ? <p className="mt-1 text-xs text-stone-400">{license ? String(license) : "Source metadata saved"}{attribution ? ` · ${String(attribution)}` : ""}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {url ? <a href={url} target="_blank" rel="noreferrer" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Open</a> : null}
                {url ? <a href={url} download className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Download</a> : null}
                {url ? <Button type="button" variant="outline" size="sm" onClick={() => void navigator.clipboard?.writeText(url)}>Copy URL</Button> : null}
                {onUseAsReference ? <Button type="button" variant="outline" size="sm" onClick={() => onUseAsReference(asset)}>Use as reference</Button> : null}
                {asset.type === "image" ? <Button type="button" variant="outline" size="sm" onClick={() => onUseAsLogo(asset.id)}>Use as logo</Button> : null}
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                  if (window.confirm("Delete this asset permanently? This cannot be undone.")) assetsState.deleteMediaAsset.mutate({ id: asset.id });
                }}>Delete permanently</Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
