import React from "react";
import { Button } from "@/components/ui/button";
import type { useMarketingCampaigns } from "../hooks/useMarketingCampaigns";

function statusLabel(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("approved")) return "Approved";
  if (normalized.includes("scheduled")) return "Scheduled";
  if (normalized.includes("posted")) return "Posted";
  if (normalized.includes("export")) return "Ready to export";
  if (normalized.includes("failed")) return "Failed";
  return "Draft";
}

function nextAction(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("approved")) return "Schedule";
  if (normalized.includes("scheduled")) return "Post / Connect account";
  if (normalized.includes("posted")) return "Review results";
  if (normalized.includes("failed")) return "Fix setup";
  return "Approve";
}

export function MarketingCampaignsView({
  campaignState,
  onExport,
  onSchedule,
}: {
  campaignState: ReturnType<typeof useMarketingCampaigns>;
  onExport: () => void;
  onSchedule: () => void;
}) {
  const campaigns = campaignState.campaigns;
  const selected = campaignState.selectedCampaign;

  return (
    <section className="space-y-4" data-testid="marketing-campaigns-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Campaigns</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">Campaign packages and drafts</h2>
      </div>

      {!campaigns.length ? (
        <p className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">No campaigns yet. Generate a 7-day campaign from Create to manage it here.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {campaigns.map((campaign) => {
            const isSelected = campaignState.selectedCampaignId === campaign.id;
            return (
              <article key={campaign.id} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{campaign.name || "Untitled campaign"}</h3>
                    <p className="mt-1 text-xs text-stone-500">{campaign.channels.join(", ") || "General"} · {campaign.planItems.length} items</p>
                  </div>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">{statusLabel(campaign.status)}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">{campaign.summary || campaign.goal || "Campaign package ready for review."}</p>
                <p className="mt-2 text-xs text-stone-500">Next action: {nextAction(campaign.status)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => campaignState.setSelectedCampaignId(campaign.id)}>Open campaign detail</Button>
                  <Button type="button" size="sm" variant="outline" onClick={onSchedule}>Schedule</Button>
                  <Button type="button" size="sm" variant="outline" onClick={onExport}>Export</Button>
                  <Button type="button" size="sm" disabled>Post / Connect account</Button>
                </div>
                {isSelected ? <p className="mt-2 text-xs text-emerald-700">Campaign detail is open below.</p> : null}
              </article>
            );
          })}
        </div>
      )}

      {selected ? (
        <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" data-testid="marketing-campaign-detail">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-950">{selected.name} · Detail</h3>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">{statusLabel(selected.status)}</span>
          </div>
          <p className="mt-2 text-sm text-stone-600">{selected.goal}</p>
          <div className="mt-4 space-y-2">
            {selected.planItems.length ? selected.planItems.map((item, index) => (
              <article key={item.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
                <p className="text-sm font-medium text-stone-900">Day {index + 1}: {item.title}</p>
                <p className="mt-1 text-xs text-stone-500">{item.channel} · {item.format} · {statusLabel(item.status)}</p>
                <p className="mt-1 text-xs text-stone-600">{item.objective}</p>
              </article>
            )) : <p className="text-sm text-stone-500">No campaign items yet.</p>}
          </div>
        </section>
      ) : null}
    </section>
  );
}
