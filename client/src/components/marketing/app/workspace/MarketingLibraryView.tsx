import React from "react";
import { Button } from "@/components/ui/button";
import type { ReturnTypeOfUseMarketingAssets } from "./workspaceTypes";

export function MarketingLibraryView({ assetsState, onUseAsLogo }: { assetsState: ReturnTypeOfUseMarketingAssets; onUseAsLogo: (assetId: number) => void }) {
  const assets = assetsState.assetStore.visibleAssets;
  return (
    <section className="space-y-4" data-testid="marketing-library-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Library</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">Generated assets and imports</h2>
      </div>
      {!assets.length ? <p className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">No assets yet. Generate an image or render a video and it will appear here.</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => {
          const url = asset.publicUrl || asset.localPath || null;
          return (
            <article key={asset.id} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              {url && /image/i.test(asset.mimeType ?? asset.type ?? "") ? <img src={url} alt="Marketing asset" className="h-40 w-full rounded-2xl bg-stone-50 object-contain" /> : null}
              {url && /video/i.test(asset.mimeType ?? asset.type ?? "") ? <video src={url} controls className="h-40 w-full rounded-2xl bg-black" /> : null}
              {url && /audio/i.test(asset.mimeType ?? asset.type ?? "") ? <audio src={url} controls className="mt-2 w-full" /> : null}
              <p className="mt-3 text-sm font-semibold text-stone-900">{asset.type || "Asset"} #{asset.id}</p>
              <p className="mt-1 text-xs text-stone-500">{asset.status || "saved"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {url ? <a href={url} target="_blank" rel="noreferrer" className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Open</a> : null}
                {url ? <a href={url} download className="rounded-full border border-stone-200 px-3 py-1.5 text-xs">Download</a> : null}
                {url ? <Button type="button" variant="outline" size="sm" onClick={() => void navigator.clipboard?.writeText(url)}>Copy URL</Button> : null}
                {asset.type === "image" ? <Button type="button" variant="outline" size="sm" onClick={() => onUseAsLogo(asset.id)}>Use as logo</Button> : null}
                <Button type="button" variant="ghost" size="sm" onClick={() => assetsState.deleteMediaAsset.mutate({ id: asset.id })}>Delete permanently</Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
