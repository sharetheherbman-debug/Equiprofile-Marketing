import React from "react";
import type { MarketingStudioPlan } from "@shared/_core/marketingStudioPlan";
import type { MarketingAssetRow } from "../MarketingAppAssetStore";
import { CampaignOutputPanel } from "./CampaignOutputPanel";

type RenderJobPreview = {
  status?: string | null;
  outputPublicUrl?: string | null;
  errorMessage?: string | null;
  warnings?: string[] | null;
};

function assetUrl(asset: MarketingAssetRow | null) {
  return asset?.publicUrl || asset?.localPath || null;
}

export function MarketingPreviewPanel({
  deliverablePackage,
  mediaOutput,
  asset,
  renderJob,
  studioPlan,
  signupUrl,
}: {
  deliverablePackage: Record<string, unknown> | null;
  mediaOutput: Record<string, unknown> | null;
  asset: MarketingAssetRow | null;
  renderJob: RenderJobPreview | null;
  studioPlan: MarketingStudioPlan | null;
  signupUrl?: string | null;
}) {
  const outputUrl = typeof mediaOutput?.publicUrl === "string"
    ? mediaOutput.publicUrl
    : renderJob?.outputPublicUrl || assetUrl(asset);
  const mimeType = typeof mediaOutput?.mimeType === "string" ? mediaOutput.mimeType : asset?.mimeType ?? "";
  const status = renderJob?.status || (typeof mediaOutput?.status === "string" ? mediaOutput.status : asset?.status);
  const isVideo = Boolean(outputUrl && (/video/i.test(mimeType) || /\.(mp4|webm|mov)(?:\?|$)/i.test(outputUrl)));
  const isAudio = Boolean(outputUrl && (/audio/i.test(mimeType) || /\.(mp3|wav|ogg|m4a)(?:\?|$)/i.test(outputUrl)));
  const isImage = Boolean(outputUrl && !isVideo && !isAudio);
  const failure = renderJob?.errorMessage || (typeof mediaOutput?.errorMessage === "string" ? mediaOutput.errorMessage : asset?.errorMessage);

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="marketing-preview-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Preview</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-950">Latest output</h2>
        </div>
        {status ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{status}</span> : null}
      </div>
      {isImage ? <img src={outputUrl!} alt="Generated marketing asset" className="mt-4 max-h-[460px] w-full rounded-2xl border border-stone-100 bg-stone-50 object-contain" /> : null}
      {isVideo ? <video src={outputUrl!} controls className="mt-4 max-h-[520px] w-full rounded-2xl border border-stone-100 bg-black" /> : null}
      {isAudio ? <audio src={outputUrl!} controls className="mt-4 w-full" /> : null}
      {outputUrl ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <a href={outputUrl} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 px-3 py-2 text-white">Open output</a>
          <a href={outputUrl} download className="rounded-full border border-stone-200 px-3 py-2 text-stone-700">Download</a>
        </div>
      ) : null}
      {studioPlan && !outputUrl ? (
        <p className="mt-4 rounded-2xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
          {studioPlan.durationTargetSeconds}s {studioPlan.platform || "video"} plan created. Follow the guided Studio steps while the render job is prepared.
        </p>
      ) : null}
      {status && !outputUrl && !failure ? <p className="mt-4 text-sm text-stone-500">Output is {status}. A playable URL will appear here when it is ready.</p> : null}
      {failure ? <p className="mt-4 rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{failure}</p> : null}
      {renderJob?.warnings?.length ? <ul className="mt-3 space-y-1 text-xs text-amber-700">{renderJob.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}
      {deliverablePackage ? <div className="mt-5"><CampaignOutputPanel deliverablePackage={deliverablePackage} signupUrl={signupUrl} /></div> : null}
      {!deliverablePackage && !studioPlan && !mediaOutput && !asset ? <p className="mt-4 text-sm text-stone-500">Your latest image, video, audio, or campaign package will appear here.</p> : null}
      {asset?.provider ? <p className="mt-4 text-xs text-stone-400">Source: {asset.provider}</p> : null}
    </section>
  );
}
