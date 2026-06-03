export type CampaignPlan = {
  outputType: string;
  goal: string;
  audience: string;
  channels: string[];
  duration: string;
  cadence: string;
  deliverables: string[];
};

export function CampaignPlanPanel({ plan }: { plan: CampaignPlan | null }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" data-testid="campaign-plan-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Plan</p>
      {plan ? (
        <div className="mt-3 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
          <p><span className="font-semibold text-stone-900">Output:</span> {plan.outputType}</p>
          <p><span className="font-semibold text-stone-900">Goal:</span> {plan.goal}</p>
          <p><span className="font-semibold text-stone-900">Audience:</span> {plan.audience}</p>
          <p><span className="font-semibold text-stone-900">Channels:</span> {plan.channels.join(", ")}</p>
          <p><span className="font-semibold text-stone-900">Duration:</span> {plan.duration}</p>
          <p><span className="font-semibold text-stone-900">Cadence:</span> {plan.cadence}</p>
          <p><span className="font-semibold text-stone-900">Deliverables:</span> {plan.deliverables.join(", ")}</p>
        </div>
      ) : <p className="mt-3 text-sm text-stone-500">Plan the output to see the inferred image, video, or campaign workflow before generation.</p>}
    </section>
  );
}
