function asRows(value: unknown) {
  return Array.isArray(value) ? value.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object") : [];
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function CampaignOutputPanel({
  deliverablePackage,
  signupUrl,
}: {
  deliverablePackage: Record<string, unknown> | null;
  signupUrl?: string | null;
}) {
  if (!deliverablePackage) {
    return (
      <section className="rounded-3xl border border-dashed border-stone-300 bg-white p-6" data-testid="campaign-output-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Campaign Output</p>
        <p className="mt-3 text-sm text-stone-500">Generate a campaign to review the summary, schedule, posts, ads, email sequence, and export state here.</p>
      </section>
    );
  }

  const captionPlan = (deliverablePackage.captionPlan as Record<string, unknown> | undefined) ?? {};
  const dayPlan = asRows(captionPlan.dayPlan);
  const posts = asRows(captionPlan.socialPosts).length ? asRows(captionPlan.socialPosts) : asRows(captionPlan.posts);
  const emails = asRows(captionPlan.emailSequence).length ? asRows(captionPlan.emailSequence) : asRows(captionPlan.emails);
  const adVariants = asRows(captionPlan.adVariants);
  const fallbackAds = Array.isArray(deliverablePackage.adCopy) ? deliverablePackage.adCopy.map((body, index) => ({ headline: `Ad variant ${index + 1}`, primaryText: body })) : [];
  const ads = adVariants.length ? adVariants : fallbackAds.slice(0, 3);
  const fallbackUsed = deliverablePackage.fallbackUsed === true;

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm" data-testid="campaign-output-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Campaign Output</p>
          <h2 className="mt-2 text-xl font-semibold text-stone-950">Campaign summary</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">Export-first draft</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-700">{text(deliverablePackage.strategy, "Campaign material is ready for review.")}</p>
      {fallbackUsed ? <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">Draft campaign generated from saved product defaults. Scan your website or sync providers for stronger AI copy.</p> : null}

      <div className="mt-6 grid gap-5">
        <OutputGroup title="Day-by-day schedule" rows={dayPlan} render={(row) => `Day ${row.day ?? "—"} · ${row.platform ?? row.channel ?? "Channel"} — ${text(row.body, text(row.hook, "Draft item"))}`} />
        <OutputGroup title="Facebook posts" rows={posts} render={(row) => `${text(row.hook, "Post")}: ${text(row.body, text(row.caption, "Draft copy"))}`} />
        <OutputGroup title="Ad variants" rows={ads} render={(row) => `${text(row.headline, "Ad variant")}: ${text(row.primaryText, text(row.body, "Draft ad copy"))}`} />
        <OutputGroup title="Email sequence" rows={emails} render={(row) => `${text(row.subject, "Email")}: ${text(row.body, "Draft email copy")}`} />
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700 sm:grid-cols-2">
        <p><span className="font-semibold text-stone-900">CTA / tracking:</span> {signupUrl || text(deliverablePackage.cta, "Add a signup URL to create tracking links.")}</p>
        <p><span className="font-semibold text-stone-900">Export status:</span> Draft pack ready for review and export.</p>
      </div>
    </section>
  );
}

function OutputGroup({
  title,
  rows,
  render,
}: {
  title: string;
  rows: Array<Record<string, unknown>>;
  render: (row: Record<string, unknown>) => string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      {rows.length ? (
        <ul className="mt-2 space-y-2">
          {rows.map((row, index) => <li key={`${title}-${index}`} className="rounded-2xl border border-stone-100 bg-stone-50 px-3 py-2 text-sm leading-6 text-stone-700">{render(row)}</li>)}
        </ul>
      ) : <p className="mt-2 text-xs text-stone-500">Not included in this campaign draft.</p>}
    </div>
  );
}
