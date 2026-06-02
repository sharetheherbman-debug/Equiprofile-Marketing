import React from "react";
import { Button } from "@/components/ui/button";
import type { ReturnTypeOfUseMarketingCalendar } from "./workspaceTypes";

export function MarketingCalendarView({ calendarState, tenantId, workspaceId }: { calendarState: ReturnTypeOfUseMarketingCalendar; tenantId: string; workspaceId: string }) {
  return (
    <section className="space-y-4" data-testid="marketing-calendar-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Calendar</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">What is running on what dates?</h2>
      </div>
      {!calendarState.mappedScheduleDrafts.length ? <p className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">No schedule drafts yet. Generate a campaign, review it, then add schedule drafts.</p> : null}
      <div className="space-y-3">
        {calendarState.mappedScheduleDrafts.map((draft) => (
          <article key={draft.id} className="grid gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[180px_1fr_auto] md:items-center">
            <div className="text-sm text-stone-700">
              <p className="font-semibold text-stone-900">{new Date(draft.scheduledFor).toLocaleDateString()}</p>
              <p className="text-xs">{new Date(draft.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">{draft.title}</p>
              <p className="mt-1 text-xs text-stone-500">{draft.platform} · {draft.reviewStatus} · {draft.status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => calendarState.rescheduleScheduleDraftMutation.mutate({ id: draft.id, tenantId, workspaceId, scheduledFor: new Date(Date.parse(draft.scheduledFor) + 86_400_000).toISOString() })}>Move +1 day</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => calendarState.cancelScheduleDraftMutation.mutate({ id: draft.id, tenantId, workspaceId })}>Cancel</Button>
            </div>
          </article>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => calendarState.exportScheduleDraftPackMutation.mutate({ tenantId, workspaceId })}>Export schedule pack</Button>
    </section>
  );
}
