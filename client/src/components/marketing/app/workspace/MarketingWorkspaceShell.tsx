import type { ReactNode } from "react";

export function MarketingWorkspaceShell({
  productPanel,
  workflow,
  previewRail,
}: {
  productPanel: ReactNode;
  workflow: ReactNode;
  previewRail: ReactNode;
}) {
  return (
    <div
      className="mx-auto min-w-0 max-w-[1440px] space-y-5 px-4 py-5 lg:px-6"
      data-testid="marketing-workspace-shell"
    >
      <aside className="min-w-0" data-testid="marketing-product-strip">{productPanel}</aside>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-medium text-stone-600 shadow-sm" data-testid="marketing-workflow-stepper">
        {["Product", "Plan", "Generate", "Review", "Schedule", "Results"].map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">{step}</span>
            {index < 5 ? <span className="text-stone-300">→</span> : null}
          </span>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]" data-testid="marketing-create-grid">
        <main className="min-w-0 space-y-5">{workflow}</main>
        <aside className="min-w-0 xl:sticky xl:top-5 xl:self-start" data-testid="marketing-preview-rail">{previewRail}</aside>
      </div>
    </div>
  );
}
