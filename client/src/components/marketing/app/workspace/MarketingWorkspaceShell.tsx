import type { ReactNode } from "react";

export function MarketingWorkspaceShell({
  productPanel,
  workflow,
  statusRail,
}: {
  productPanel: ReactNode;
  workflow: ReactNode;
  statusRail: ReactNode;
}) {
  return (
    <div
      className="mx-auto grid min-w-0 max-w-[1600px] gap-5 px-5 py-6 xl:grid-cols-[280px_minmax(640px,1fr)_340px]"
      data-testid="marketing-workspace-shell"
    >
      <aside className="min-w-0">{productPanel}</aside>
      <main className="min-w-0 space-y-5">{workflow}</main>
      <aside className="min-w-0 xl:sticky xl:top-5 xl:h-fit">{statusRail}</aside>
    </div>
  );
}
