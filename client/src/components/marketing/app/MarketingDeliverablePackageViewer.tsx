import React from "react";

type DeliverablePackage = Record<string, any>;

function ListBlock({ title, items, emptyLabel = "No items yet" }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">{title}</h4>
      <ul className="mt-2 space-y-1 text-xs text-stone-600">
        {(items.length ? items : [emptyLabel]).map((item, index) => (
          <li key={`${title}-${index}`} className="whitespace-pre-wrap">{item}</li>
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
  const reviewItems = Array.isArray(deliverablePackage.reviewItems) ? deliverablePackage.reviewItems : [];
  const scheduleDrafts = Array.isArray(deliverablePackage.scheduleDrafts) ? deliverablePackage.scheduleDrafts : [];
  const blockers = Array.isArray(deliverablePackage.blockers) ? deliverablePackage.blockers : [];
  const mediaRequirements = Array.isArray(deliverablePackage.mediaRequirements) ? deliverablePackage.mediaRequirements : [];
  const renderStatus = String((deliverablePackage.exportPack as Record<string, unknown> | undefined)?.renderStatus ?? (isAssembled ? "not_rendered" : "not_required"));
  const exportChecklist = Array.isArray((deliverablePackage.exportPack as Record<string, unknown> | undefined)?.checklist)
    ? ((deliverablePackage.exportPack as Record<string, unknown>).checklist as unknown[]).map((item) => String(item))
    : [];
  const nextAction = setupNeeded ? "Resolve setup blockers before approval/export." : "Run human review and export checklist.";

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="marketing-deliverable-package-viewer">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-stone-900">Package summary</h3>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${setupNeeded ? "border-amber-300 bg-amber-50 text-amber-700" : "border-emerald-300 bg-emerald-50 text-emerald-700"}`}>
          {setupNeeded ? "setup_needed" : "ready_for_review"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">Package Summary</h4>
          <p className="mt-2">Type: {String(deliverablePackage.packageType ?? "unknown")}</p>
          <p className="mt-1">Status: {String(deliverablePackage.status ?? "draft")}</p>
          <p className="mt-1">Goal: {String(deliverablePackage.goal ?? "Not provided")}</p>
          <p className="mt-1">Audience: {String(deliverablePackage.audience ?? "Not provided")}</p>
          <p className="mt-1">Platforms: {(Array.isArray(deliverablePackage.platforms) ? deliverablePackage.platforms : []).join(", ") || "Not provided"}</p>
          <p className="mt-1">Next action: {nextAction}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">Strategy</h4>
          <p className="mt-2 whitespace-pre-wrap text-xs text-stone-700">{String(deliverablePackage.strategy ?? "No strategy available.")}</p>
        </article>
        <ListBlock title="Hooks" items={(Array.isArray(deliverablePackage.hooks) ? deliverablePackage.hooks : []).map((item) => String(item))} />
        <ListBlock title="Copy" items={(Array.isArray(deliverablePackage.adCopy) ? deliverablePackage.adCopy : []).map((item) => String(item))} />
        <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">Script</h4>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-stone-700">{String(deliverablePackage.script ?? "No script yet")}</pre>
        </article>
        <ListBlock
          title="Scene Timeline"
          items={scenePlan.map((scene: any) => {
            const index = scene.sceneIndex ?? scene.order ?? "?";
            return `Scene ${index}: ${Number(scene.durationSeconds ?? 0)}s | Narration: ${String(scene.narration ?? "N/A")} | Visual: ${String(scene.visualPrompt ?? "N/A")} | Media slot: ${String(scene.mediaSlot ?? "stock_media")}`;
          })}
        />
        <ListBlock title="Media Requirements" items={mediaRequirements.map((item) => String(item))} />
        <article className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-700">Review / Export</h4>
          <p className="mt-2">Review items: {reviewItems.length}</p>
          <p className="mt-1">Schedule drafts: {scheduleDrafts.length}</p>
          <p className="mt-1">Render status: {renderStatus}</p>
          <p className="mt-1">Export checklist:</p>
          <ul className="mt-1 list-disc pl-4">
            {(exportChecklist.length ? exportChecklist : ["No checklist yet"]).map((item, index) => (
              <li key={`checklist-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
        <ListBlock title="Setup Needed" items={blockers.map((item) => String(item))} emptyLabel="No blockers" />
      </div>

      {isAssembled ? (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
          <h4 className="font-semibold text-stone-800">Assembled video timeline</h4>
          <p className="mt-1">Total scenes: {scenePlan.length}</p>
          <p className="mt-1">Duration planned: {scenePlan.reduce((sum: number, scene: any) => sum + Number(scene.durationSeconds ?? 0), 0)} seconds</p>
          <p className="mt-1">Media slots: {scenePlan.map((scene: any) => scene.mediaSlot ?? "stock_media").join(", ")}</p>
          <p className="mt-1">Render/export status: {renderStatus}</p>
        </div>
      ) : null}

      {isAssembled && (deliverablePackage.exportPack as any)?.renderStatus !== "completed" ? (
        <p className="mt-3 text-xs text-stone-500">No fake video is shown because render output is missing.</p>
      ) : null}
    </section>
  );
}
