import React from "react";

type DeliverablePackage = Record<string, any>;

function ListBlock({ title, items }: { title: string; items: unknown[] }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">{title}</h4>
      <ul className="mt-2 space-y-1 text-xs text-stone-600">
        {(items.length ? items : ["No items yet"]).map((item, index) => (
          <li key={`${title}-${index}`} className="whitespace-pre-wrap">{String(typeof item === "object" ? JSON.stringify(item) : item)}</li>
        ))}
      </ul>
    </article>
  );
}

export function MarketingDeliverablePackageViewer({ deliverablePackage }: { deliverablePackage: DeliverablePackage | null }) {
  if (!deliverablePackage) return null;

  const scenePlan = Array.isArray(deliverablePackage.scenePlan) ? deliverablePackage.scenePlan : [];
  const setupNeeded = Boolean(deliverablePackage.setupNeeded);
  const isAssembled = deliverablePackage.packageType === "assembled_video_3m";

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="marketing-deliverable-package-viewer">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-stone-900">Package summary</h3>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${setupNeeded ? "border-amber-300 bg-amber-50 text-amber-700" : "border-emerald-300 bg-emerald-50 text-emerald-700"}`}>
          {setupNeeded ? "setup_needed" : "ready_for_review"}
        </span>
      </div>
      <p className="mt-2 text-xs text-stone-600">{String(deliverablePackage.strategy ?? "No strategy available.")}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ListBlock title="Strategy" items={[deliverablePackage.strategy ?? ""]} />
        <ListBlock title="Hooks" items={Array.isArray(deliverablePackage.hooks) ? deliverablePackage.hooks : []} />
        <ListBlock title="Copy" items={Array.isArray(deliverablePackage.adCopy) ? deliverablePackage.adCopy : []} />
        <ListBlock title="Script" items={[deliverablePackage.script ?? ""]} />
        <ListBlock title="Scene Plan" items={scenePlan.map((scene: any) => `#${scene.sceneIndex ?? scene.order ?? "?"} (${scene.durationSeconds ?? 0}s) ${scene.narration ?? ""}`)} />
        <ListBlock title="Media Requirements" items={Array.isArray(deliverablePackage.mediaRequirements) ? deliverablePackage.mediaRequirements : []} />
        <ListBlock title="Review" items={Array.isArray(deliverablePackage.reviewItems) ? deliverablePackage.reviewItems : []} />
        <ListBlock title="Export / Schedule" items={[
          `export: ${JSON.stringify(deliverablePackage.exportPack ?? {})}`,
          ...((Array.isArray(deliverablePackage.scheduleDrafts) ? deliverablePackage.scheduleDrafts : []).map((draft: any) => JSON.stringify(draft))),
        ]} />
        <ListBlock title="Setup Needed" items={Array.isArray(deliverablePackage.blockers) ? deliverablePackage.blockers : []} />
      </div>

      {isAssembled ? (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
          <h4 className="font-semibold text-stone-800">Assembled video timeline</h4>
          <p className="mt-1">Total scenes: {scenePlan.length}</p>
          <p className="mt-1">Duration planned: {scenePlan.reduce((sum: number, scene: any) => sum + Number(scene.durationSeconds ?? 0), 0)} seconds</p>
          <p className="mt-1">Voiceover plan: {JSON.stringify(deliverablePackage.voiceoverPlan ?? {})}</p>
          <p className="mt-1">Media slots: {scenePlan.map((scene: any) => scene.mediaSlot ?? "stock_media").join(", ")}</p>
          <p className="mt-1">Render/export status: {String((deliverablePackage.exportPack as any)?.renderStatus ?? "not_rendered")}</p>
        </div>
      ) : null}

      {isAssembled && (deliverablePackage.exportPack as any)?.renderStatus !== "completed" ? (
        <p className="mt-3 text-xs text-stone-500">No fake video is shown because render output is missing.</p>
      ) : null}
    </section>
  );
}
