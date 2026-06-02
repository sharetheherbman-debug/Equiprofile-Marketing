function StatusRow({ label, detail, ready = false }: { label: string; detail: string; ready?: boolean }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-400"}`} />
        <p className="text-sm font-semibold text-stone-900">{label}</p>
      </div>
      <p className="mt-1 text-xs leading-5 text-stone-600">{detail}</p>
    </div>
  );
}

export function WorkflowStatusPanel({
  productReady,
  fallbackUsed,
  hasOutput,
  signupUrl,
  qualityPassed = false,
}: {
  productReady: boolean;
  fallbackUsed: boolean;
  hasOutput: boolean;
  signupUrl?: string | null;
  qualityPassed?: boolean;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" data-testid="workflow-status-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Workflow Status</p>
      <div className="mt-4 space-y-2">
        <StatusRow label="Product understood" ready={productReady} detail={productReady ? "Confirmed product context is ready." : "Saved EquiProfile defaults are available for draft campaigns."} />
        <StatusRow label={fallbackUsed ? "Fallback copy used" : "AI copy ready"} ready={hasOutput && !fallbackUsed} detail={fallbackUsed ? "Draft copy is available now. Sync providers for AI copy." : hasOutput ? "Campaign copy is ready for review." : "Generate a campaign to create copy."} />
        <StatusRow label="Review needed" detail={hasOutput ? "Review claims, offer details, and creative before export." : "Campaign review starts after generation."} />
        <StatusRow label="Export ready" ready={hasOutput && qualityPassed} detail={hasOutput && qualityPassed ? "Quality-checked draft material is ready to export." : hasOutput ? "Review product details and quality checks before export." : "Generate material to prepare an export pack."} />
        <StatusRow label={signupUrl ? "Tracking link ready" : "Signup URL needed"} ready={Boolean(signupUrl)} detail={signupUrl ? "CTA tracking can use the saved signup URL." : "Add a signup URL to create tracking links."} />
        <StatusRow label="Direct posting" detail="Direct posting needs a connected Facebook account. Export is ready." />
      </div>
    </section>
  );
}
