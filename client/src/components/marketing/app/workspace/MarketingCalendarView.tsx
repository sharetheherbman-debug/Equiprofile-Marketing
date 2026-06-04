import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventDropArg } from "@fullcalendar/core";
import { Button } from "@/components/ui/button";
import type { ReturnTypeOfUseMarketingCalendar } from "./workspaceTypes";

function statusLabel(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("approved")) return "Approved";
  if (normalized.includes("scheduled")) return "Scheduled";
  if (normalized.includes("posted")) return "Posted";
  if (normalized.includes("sent")) return "Sent";
  if (normalized.includes("failed")) return "Failed";
  if (normalized.includes("setup")) return "Needs setup";
  if (normalized.includes("draft")) return "Draft";
  return "Needs setup";
}

export function MarketingCalendarView({ calendarState, tenantId, workspaceId }: { calendarState: ReturnTypeOfUseMarketingCalendar; tenantId: string; workspaceId: string }) {
  const [platform, setPlatform] = useState("All");
  const [status, setStatus] = useState("All");
  const drafts = useMemo(() => calendarState.mappedScheduleDrafts.filter((draft) => {
    return (platform === "All" || draft.platform === platform) && (status === "All" || draft.status === status);
  }), [calendarState.mappedScheduleDrafts, platform, status]);
  const platforms = useMemo(() => ["All", ...new Set(calendarState.mappedScheduleDrafts.map((draft) => draft.platform))], [calendarState.mappedScheduleDrafts]);
  const statuses = useMemo(() => ["All", ...new Set(calendarState.mappedScheduleDrafts.map((draft) => draft.status))], [calendarState.mappedScheduleDrafts]);
  const events = drafts.map((draft) => ({
    id: String(draft.id),
    title: `${draft.platform}: ${draft.title}`,
    start: draft.scheduledFor,
    extendedProps: { reviewStatus: draft.reviewStatus, status: draft.status },
  }));

  function handleDrop(event: EventDropArg) {
    if (!event.event.start) return;
    calendarState.rescheduleScheduleDraftMutation.mutate({
      id: Number(event.event.id),
      tenantId,
      workspaceId,
      scheduledFor: event.event.start.toISOString(),
    });
  }

  return (
    <section className="space-y-4" data-testid="marketing-calendar-view">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Calendar</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">What is running on what dates?</h2>
      </div>
      <div className="flex flex-wrap gap-2 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
        <label className="text-xs text-stone-600">Platform
          <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="ml-2 rounded-lg border border-stone-200 bg-white px-2 py-1">
            {platforms.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-xs text-stone-600">Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="ml-2 rounded-lg border border-stone-200 bg-white px-2 py-1">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {!drafts.length ? <p className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">No schedule drafts match this view. Generate a campaign, review it, then add schedule drafts.</p> : (
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-3 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
            events={events}
            editable
            eventDrop={handleDrop}
            height="auto"
          />
        </div>
      )}
      <div className="space-y-3">
        {drafts.map((draft) => (
          <article key={draft.id} className="grid gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[180px_1fr_auto_auto] md:items-center">
            <div className="text-sm text-stone-700">
              <p className="font-semibold text-stone-900">{new Date(draft.scheduledFor).toLocaleDateString()}</p>
              <p className="text-xs">{new Date(draft.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">{draft.title}</p>
              <p className="mt-1 text-xs text-stone-500">{draft.platform} · {draft.reviewStatus}</p>
            </div>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">{statusLabel(draft.status)}</span>
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
