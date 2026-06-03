import React from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { MarketingWorkspaceConfig } from "../hooks/useMarketingWorkspaceConfig.types";

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 text-2xl font-semibold text-stone-950">{value}</p></div>;
}

export function MarketingResultsView({ workspace, onCreateWithLearning }: { workspace: MarketingWorkspaceConfig; onCreateWithLearning?: () => void }) {
  const input = { tenantId: workspace.tenantId, workspaceId: workspace.marketing_workspace_id, hostAppId: workspace.host_app_id };
  const scoreQuery = trpc.admin.getMarketingPerformanceScore.useQuery(input);
  const patternsQuery = trpc.admin.getMarketingWinningPatterns.useQuery(input);
  const learningQuery = trpc.admin.getMarketingLearningInsights.useQuery(input);
  const score = scoreQuery.data;
  const patterns = patternsQuery.data;
  const learning = learningQuery.data;
  const insufficient = !score || score.status === "insufficient_data";
  const nextAction = patterns?.winningPlatforms?.length
    ? `Shift the next reviewed draft toward ${patterns.winningPlatforms.join(", ")} and keep the winning CTA style visible.`
    : "Collect tracked clicks and conversions before making high-confidence strategy changes.";

  return (
    <section className="space-y-5" data-testid="marketing-results-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Results & Learning</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">What the Marketing App is learning</h2>
      </div>
      {insufficient ? <p className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Not enough data yet. Add a signup URL, post or export campaigns with tracking links, and record clicks or conversions.</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Clicks" value={score?.totals.clicks ?? 0} />
        <Metric label="Conversions" value={score?.totals.conversions ?? 0} />
        <Metric label="Conversion rate" value={`${Math.round((score?.totals.conversionRate ?? 0) * 100)}%`} />
        <Metric label="CTA signals" value={score?.totals.ctaPerformance ?? 0} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">Performance patterns</h3>
          <p className="mt-3 text-sm text-stone-600">Platforms: {patterns?.winningPlatforms?.join(", ") || "Collect more data"}</p>
          <p className="mt-2 text-sm text-stone-600">Hooks: {patterns?.winningHooks?.join(", ") || "Collect more data"}</p>
          <p className="mt-2 text-sm text-stone-600">CTA styles: {patterns?.winningCtaStyles?.join(", ") || "Collect more data"}</p>
          <p className="mt-2 text-sm text-stone-600">Audience angles: {patterns?.winningContentFormats?.join(", ") || "Collect more data"}</p>
        </article>
        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">AI learning notes</h3>
          {learning?.insights?.length ? <ul className="mt-3 space-y-2 text-sm text-stone-600">{learning.insights.slice(0, 6).map((insight: Record<string, unknown>, index: number) => <li key={String(insight.id ?? index)}>{String(insight.summary ?? insight.insightType ?? "Saved learning insight")}</li>)}</ul> : <p className="mt-3 text-sm text-stone-600">No learned winners or losers yet. The next recommendation is to gather enough tracked events before changing strategy.</p>}
        </article>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <p><span className="font-semibold">Next recommended action:</span> {nextAction}</p>
        {onCreateWithLearning ? <Button type="button" size="sm" onClick={onCreateWithLearning}>Create with learning</Button> : null}
      </div>
    </section>
  );
}
