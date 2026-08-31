import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import {
  CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit2,
  Trash2,
  Clock,
  List,
  LayoutGrid,
  ClipboardList,
  CalendarCheck,
  Tag,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useRealtimeModule } from "@/hooks/useRealtime";
import { trackMeasurementEvent } from "@/analytics";
import { PageHeader } from "@/components/PageHeader";

const EVENT_TYPE_COLORS: Record<string, string> = {
  training: "bg-blue-500",
  competition: "bg-green-500",
  veterinary: "bg-purple-500",
  farrier: "bg-yellow-500",
  lesson: "bg-red-500",
  meeting: "bg-gray-500",
  other: "bg-indigo-500",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  training: "Training",
  competition: "Competition",
  veterinary: "Vet Appointment",
  farrier: "Farrier",
  lesson: "Appointment",
  meeting: "Meeting",
  other: "Other",
};

// UI display types (includes "reminder" mapped to "other")
const UI_EVENT_TYPES = [
  { value: "lesson", label: "Appointment" },
  { value: "training", label: "Training" },
  { value: "veterinary", label: "Vet Appointment" },
  { value: "farrier", label: "Farrier" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Reminder / Other" },
  { value: "meeting", label: "Meeting" },
];

type DbEventType =
  | "training"
  | "competition"
  | "veterinary"
  | "farrier"
  | "lesson"
  | "meeting"
  | "other";

interface EventForm {
  title: string;
  eventType: DbEventType;
  startDate: string;
  startTime: string;
  location: string;
  description: string;
  horseId: string;
}

const EMPTY_FORM: EventForm = {
  title: "",
  eventType: "other",
  startDate: new Date().toISOString().slice(0, 10),
  startTime: "",
  location: "",
  description: "",
  horseId: "",
};

function buildStartDate(date: string, time: string): string {
  const t = time || "12:00";
  return new Date(`${date}T${t}:00`).toISOString();
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "agenda">("month");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<any>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([]);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<EventForm>({ ...EMPTY_FORM });
  const [editForm, setEditForm] = useState<EventForm>({ ...EMPTY_FORM });

  const monthStart = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate],
  );
  const monthEnd = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate],
  );

  // Stable query options shared by all calendar data sources — prevents
  // duplicate fetches on window focus and keeps data alive across tab switches.
  const calendarQueryOpts = {
    staleTime: 5 * 60 * 1000,        // 5 min — don't refetch within this window
    gcTime: 10 * 60 * 1000,          // 10 min — keep cached data alive longer
    refetchOnWindowFocus: false,      // prevent focus-triggered duplicate fetches
    refetchOnMount: false as const,   // reuse cached data when remounting
  };

  const { data: eventsData, refetch } = trpc.calendar.getEvents.useQuery({
    startDate: monthStart.toISOString(),
    endDate: monthEnd.toISOString(),
  }, {
    ...calendarQueryOpts,
    // Don't retry on rate-limit or auth errors — retrying worsens the problem
    retry: (failureCount, error: any) => {
      const code = error?.data?.code;
      if (code === "TOO_MANY_REQUESTS" || code === "UNAUTHORIZED") return false;
      return failureCount < 2;
    },
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 10000),
  });

  const { data: horsesData } = trpc.horses.list.useQuery(undefined, calendarQueryOpts);

  const { data: tasksData } = trpc.tasks.list.useQuery(undefined, calendarQueryOpts);
  const { data: appointmentsData } = trpc.appointments.list.useQuery(undefined, calendarQueryOpts);
  const { data: trainingSessionsData } = trpc.training.listAll.useQuery(undefined, calendarQueryOpts);
  // Keep Calendar usable if an older or degraded API returns null instead of
  // the documented empty-array shape for one of its combined data sources.
  const events = eventsData ?? [];
  const horses = horsesData ?? [];
  const tasks = tasksData ?? [];
  const appointments = appointmentsData ?? [];
  const trainingSessions = trainingSessionsData ?? [];

  // Stable SSE callback — passed by identity so useRealtimeModule doesn't
  // re-subscribe on every render.  refetch() is safe to call: TanStack Query
  // deduplicates concurrent fetches for the same query key.
  const handleCalendarEvent = useCallback(() => { refetch(); }, [refetch]);

  // Real-time subscriptions — refresh calendar when events change from other devices/tabs
  useRealtimeModule("calendar", handleCalendarEvent);
  useRealtimeModule("tasks", handleCalendarEvent);
  useRealtimeModule("appointments", handleCalendarEvent);

  const createEvent = trpc.calendar.createEvent.useMutation({
    onSuccess: () => {
      trackMeasurementEvent("management_calendar_item_created", {
        item_type: newEvent.eventType,
      });
      toast.success("Event created");
      setIsAddDialogOpen(false);
      setNewEvent({ ...EMPTY_FORM });
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateEvent = trpc.calendar.updateEvent.useMutation({
    onSuccess: () => {
      toast.success("Event updated");
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteEvent = trpc.calendar.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success("Event deleted");
      setIsDeleteAlertOpen(false);
      setIsEditDialogOpen(false);
      setIsViewDialogOpen(false);
      setSelectedEvent(null);
      setViewItem(null);
      setPendingDeleteItem(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteTrainingSession = trpc.training.delete.useMutation({
    onSuccess: () => {
      toast.success("Training session deleted");
      setIsDeleteAlertOpen(false);
      setIsViewDialogOpen(false);
      setSelectedEvent(null);
      setViewItem(null);
      setPendingDeleteItem(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      toast.success("Task deleted");
      setIsDeleteAlertOpen(false);
      setIsViewDialogOpen(false);
      setSelectedEvent(null);
      setViewItem(null);
      setPendingDeleteItem(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteAppointment = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success("Appointment deleted");
      setIsDeleteAlertOpen(false);
      setIsViewDialogOpen(false);
      setSelectedEvent(null);
      setViewItem(null);
      setPendingDeleteItem(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  interface CalendarItem {
    id: string;
    source: "event" | "task" | "appointment" | "training";
    title: string;
    date: Date;
    type: string;
    colorClass: string;
    isEditable: boolean;
    originalData: any;
  }

  const calendarItems: CalendarItem[] = useMemo(() => {
    const items: CalendarItem[] = [];

    events.forEach((e: any) => {
      items.push({
        id: `evt-${e.id}`,
        source: "event",
        title: e.title,
        date: new Date(e.startDate),
        type: e.eventType,
        colorClass: EVENT_TYPE_COLORS[e.eventType] || "bg-gray-500",
        isEditable: true,
        originalData: e,
      });
    });

    tasks.forEach((t: any) => {
      if (!t.dueDate || t.status === "completed" || t.status === "cancelled") return;
      const d = new Date(t.dueDate + "T00:00:00");
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        items.push({
          id: `task-${t.id}`,
          source: "task",
          title: t.title,
          date: d,
          type: t.taskType,
          colorClass: "bg-orange-500",
          isEditable: true,
          originalData: t,
        });
      }
    });

    appointments.forEach((a: any) => {
      if (a.status === "cancelled" || a.status === "completed") return;
      const d = new Date(a.appointmentDate + "T00:00:00");
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        items.push({
          id: `appt-${a.id}`,
          source: "appointment",
          title: a.title,
          date: d,
          type: a.appointmentType,
          colorClass: "bg-pink-500",
          isEditable: true,
          originalData: a,
        });
      }
    });

    // Training sessions that haven't been mirrored as calendar events (source: "training")
    const calendarEventIds = new Set(
      events
        .filter((e: any) => e.eventType === "training")
        .map((e: any) => e.title.toLowerCase().trim()),
    );
    trainingSessions.forEach((s: any) => {
      if (s.isCompleted) return;
      const sessionDateStr = s.sessionDate
        ? typeof s.sessionDate === "string"
          ? s.sessionDate.slice(0, 10)
          : new Date(s.sessionDate).toISOString().slice(0, 10)
        : null;
      if (!sessionDateStr) return;
      const d = new Date(sessionDateStr + "T00:00:00");
      if (d.getMonth() !== currentDate.getMonth() || d.getFullYear() !== currentDate.getFullYear()) return;
      const sessionTypeLabel =
        (s.sessionType ?? "training").charAt(0).toUpperCase() +
        (s.sessionType ?? "training").slice(1);
      const title = s.location
        ? `${sessionTypeLabel} – ${s.location}`
        : sessionTypeLabel;
      // Avoid duplicates with calendar events created from the same training session
      if (!calendarEventIds.has(title.toLowerCase().trim())) {
        items.push({
          id: `training-${s.id}`,
          source: "training" as const,
          title,
          date: d,
          type: "training",
          colorClass: "bg-blue-700",
          isEditable: true,
          originalData: s,
        });
      }
    });

    return items;
  }, [events, tasks, appointments, trainingSessions, currentDate]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1,
      ),
    );
  };

  const getItemsForDay = (day: number) => {
    return calendarItems.filter((item) => {
      return (
        item.date.getDate() === day &&
        item.date.getMonth() === currentDate.getMonth() &&
        item.date.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const upcomingItems = useMemo(() => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const items: CalendarItem[] = [];

    // Calendar events for the current month window (already fetched)
    events.forEach((e: any) => {
      const d = new Date(e.startDate);
      if (d >= today) {
        items.push({
          id: `evt-${e.id}`,
          source: "event",
          title: e.title,
          date: d,
          type: e.eventType,
          colorClass: EVENT_TYPE_COLORS[e.eventType] || "bg-gray-500",
          isEditable: true,
          originalData: e,
        });
      }
    });

    // Tasks — all future, not month-gated
    tasks.forEach((t: any) => {
      if (!t.dueDate || t.status === "completed" || t.status === "cancelled") return;
      const d = new Date(t.dueDate + "T00:00:00");
      if (d >= today) {
        items.push({
          id: `task-${t.id}`,
          source: "task",
          title: t.title,
          date: d,
          type: t.taskType,
          colorClass: "bg-orange-500",
          isEditable: true,
          originalData: t,
        });
      }
    });

    // Appointments — all future, not month-gated
    appointments.forEach((a: any) => {
      if (a.status === "cancelled" || a.status === "completed") return;
      const d = new Date(a.appointmentDate + "T00:00:00");
      if (d >= today) {
        items.push({
          id: `appt-${a.id}`,
          source: "appointment",
          title: a.title,
          date: d,
          type: a.appointmentType,
          colorClass: "bg-pink-500",
          isEditable: true,
          originalData: a,
        });
      }
    });

    // Training sessions — all future, not month-gated
    const calendarEventTitles = new Set(
      events
        .filter((e: any) => e.eventType === "training")
        .map((e: any) => e.title.toLowerCase().trim()),
    );
    trainingSessions.forEach((s: any) => {
      if (s.isCompleted) return;
      const sessionDateStr = s.sessionDate
        ? typeof s.sessionDate === "string"
          ? s.sessionDate.slice(0, 10)
          : new Date(s.sessionDate).toISOString().slice(0, 10)
        : null;
      if (!sessionDateStr) return;
      const d = new Date(sessionDateStr + "T00:00:00");
      if (d < today) return;
      const sessionTypeLabel =
        (s.sessionType ?? "training").charAt(0).toUpperCase() +
        (s.sessionType ?? "training").slice(1);
      const title = s.location ? `${sessionTypeLabel} – ${s.location}` : sessionTypeLabel;
      if (!calendarEventTitles.has(title.toLowerCase().trim())) {
        items.push({
          id: `training-${s.id}`,
          source: "training" as const,
          title,
          date: d,
          type: "training",
          colorClass: "bg-blue-700",
          isEditable: true,
          originalData: s,
        });
      }
    });

    return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 10);
  }, [events, tasks, appointments, trainingSessions]);

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    createEvent.mutate({
      title: newEvent.title,
      eventType: newEvent.eventType,
      startDate: buildStartDate(newEvent.startDate, newEvent.startTime),
      location: newEvent.location || undefined,
      description: newEvent.description || undefined,
      horseId: newEvent.horseId ? Number(newEvent.horseId) : undefined,
      isAllDay: !newEvent.startTime,
    });
  };

  const handleOpenEdit = (event: any) => {
    const d = new Date(event.startDate);
    const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    setEditForm({
      title: event.title || "",
      eventType: (event.eventType as DbEventType) || "other",
      startDate: d.toISOString().slice(0, 10),
      startTime: timeStr === "12:00" && event.isAllDay ? "" : timeStr,
      location: event.location || "",
      description: event.description || "",
      horseId: event.horseId ? String(event.horseId) : "",
    });
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
    setIsViewDialogOpen(false);
    setIsDayDialogOpen(false);
  };

  const [viewItem, setViewItem] = useState<any>(null);

  const handleOpenView = (item: any) => {
    setViewItem(item);
    if (item.source === "event" && item.isEditable) {
      setSelectedEvent(item.originalData);
    }
    setIsDayDialogOpen(false);
    setIsViewDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    if (!editForm.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    updateEvent.mutate({
      id: selectedEvent.id,
      title: editForm.title,
      description: editForm.description || undefined,
      startDate: buildStartDate(editForm.startDate, editForm.startTime),
    });
  };

  const handleDayClick = (day: number) => {
    const dayItems = getItemsForDay(day);
    if (dayItems.length > 0) {
      setSelectedDayEvents(dayItems);
      setIsDayDialogOpen(true);
    } else {
      setNewEvent({
        ...EMPTY_FORM,
        startDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      });
      setIsAddDialogOpen(true);
    }
  };

  const getHorseName = (horseId: number | null) => {
    if (!horseId) return null;
    const horse = (horses as any[]).find((h: any) => h.id === horseId);
    return horse?.name || null;
  };

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <PageHeader title="Calendar" subtitle="Schedule and manage all your equestrian activities" subtitleClassName="hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* View toggle — hidden on very small screens */}
            <div className="hidden sm:flex border rounded-md overflow-hidden">
              <button
                onClick={() => setCalendarView("month")}
                className={`p-2 text-xs flex items-center gap-1 transition-colors ${calendarView === "month" ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}
                title="Month view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Month</span>
              </button>
              <button
                onClick={() => setCalendarView("agenda")}
                className={`p-2 text-xs flex items-center gap-1 transition-colors ${calendarView === "agenda" ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}
                title="Agenda view"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Agenda</span>
              </button>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setNewEvent({ ...EMPTY_FORM });
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Month navigation bar — always shown */}
        <div className="flex items-center justify-between bg-card border rounded-xl px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="font-semibold text-base">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs h-7">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* MONTH GRID — hidden on mobile (sm:), always visible on tablet+ */}
        <Card className={`${calendarView === "agenda" ? "hidden" : "hidden sm:block"}`}>
          <CardContent className="pt-4">
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-xs text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] p-1" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  currentDate.getMonth() === today.getMonth() &&
                  currentDate.getFullYear() === today.getFullYear();
                const dayItems = getItemsForDay(day);

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] p-1 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors ${
                      isToday ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={`text-xs mb-1 font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`text-[10px] px-1 py-0.5 rounded text-white truncate ${item.colorClass} ${item.source !== "event" ? "opacity-80" : ""}`}
                        >
                          {item.title}
                        </div>
                      ))}
                      {dayItems.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayItems.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
                <div key={type} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${EVENT_TYPE_COLORS[type]}`}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs text-muted-foreground">Task</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-xs text-muted-foreground">Appointment</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AGENDA / LIST VIEW — always shown on mobile, shown on desktop when agenda selected */}
        <Card className={`${calendarView === "month" ? "sm:hidden" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <List className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm font-medium">No upcoming events</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Add events to stay organised
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setNewEvent({ ...EMPTY_FORM });
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingItems.map((item) => {
                  const horseName = item.source === "event" ? getHorseName(item.originalData.horseId) : null;
                  const eventDate = item.date;
                  const isToday = eventDate.toDateString() === new Date().toDateString();
                  const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
                  const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : eventDate.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors cursor-pointer active:scale-[0.99]`}
                      onClick={() => handleOpenView(item)}
                    >
                      {/* Date badge */}
                      <div className={`flex flex-col items-center justify-center min-w-[44px] h-[44px] rounded-lg ${isToday ? "bg-primary text-primary-foreground" : "bg-muted/60"}`}>
                        <p className="text-[10px] font-medium uppercase leading-none">
                          {isToday ? "Today" : eventDate.toLocaleDateString("en-GB", { month: "short" })}
                        </p>
                        {!isToday && (
                          <p className="text-base font-bold leading-none mt-0.5">
                            {eventDate.getDate()}
                          </p>
                        )}
                      </div>

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {item.source === "task" && <ClipboardList className="h-3 w-3 text-orange-500 shrink-0" />}
                          {item.source === "appointment" && <CalendarCheck className="h-3 w-3 text-pink-500 shrink-0" />}
                          <p className="font-medium text-sm truncate">{item.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {!isToday && `${dayLabel} · `}
                          {item.source === "event" || item.source === "training"
                            ? eventDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                            : item.source === "task" ? "Task" : "Appointment"}
                          {(item.source === "event" || item.source === "training") && item.originalData.location ? ` · ${item.originalData.location}` : ""}
                        </p>
                        {horseName && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-0.5 inline-flex items-center gap-1">
                            <Tag className="h-2.5 w-2.5" />{horseName}
                          </span>
                        )}
                      </div>

                      {/* Type badge + edit */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`} />
                        {item.isEditable && item.source === "event" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(item.originalData);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Day Events Dialog */}
      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Items on this day</DialogTitle>
            <DialogDescription>
              Tap any event to view or edit it, or add a new event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {selectedDayEvents.map((item: any) => {
              const horseName = item.source === "event" ? getHorseName(item.originalData.horseId) : null;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border hover:bg-muted/20 cursor-pointer`}
                  onClick={() => handleOpenView(item)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {item.source === "task" && <ClipboardList className="h-3 w-3 text-orange-500 shrink-0" />}
                        {item.source === "appointment" && <CalendarCheck className="h-3 w-3 text-pink-500 shrink-0" />}
                        <p className="font-medium text-sm">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.source === "event" || item.source === "training"
                          ? item.date.toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : item.source === "task" ? "Task" : "Appointment"}
                        {horseName && ` · ${horseName}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.source === "event" || item.source === "training"
                      ? (EVENT_TYPE_LABELS[item.type] || item.type)
                      : item.source === "task" ? "Task" : "Appointment"}
                  </Badge>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsDayDialogOpen(false);
                setNewEvent({ ...EMPTY_FORM });
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event / Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => { setIsViewDialogOpen(open); if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewItem?.title ?? "Event Details"}</DialogTitle>
            <DialogDescription>
              {viewItem?.source === "event"
                ? EVENT_TYPE_LABELS[viewItem?.type] || viewItem?.type || "Calendar event"
                : viewItem?.source === "training"
                ? "Training session"
                : viewItem?.source === "task"
                ? "Task"
                : viewItem?.source === "appointment"
                ? "Appointment"
                : "Event"}
            </DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm py-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${viewItem.colorClass}`} />
                <span className="text-muted-foreground">
                  {viewItem.date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  {(viewItem.source === "event" && !viewItem.originalData?.isAllDay) || viewItem.source === "training" ? (
                    <>
                      {" · "}
                      {viewItem.date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </>
                  ) : null}
                </span>
              </div>
              {(viewItem.source === "event" || viewItem.source === "training") && viewItem.originalData?.location && (
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Location:</span>{" "}
                  {viewItem.originalData.location}
                </div>
              )}
              {viewItem.source === "event" && viewItem.originalData?.horseId && getHorseName(viewItem.originalData.horseId) && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Horse:</span>
                  <Tag className="h-3 w-3" />{getHorseName(viewItem.originalData.horseId)}
                </div>
              )}
              {viewItem.source === "training" && viewItem.originalData?.horseId && getHorseName(viewItem.originalData.horseId) && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Horse:</span>
                  <Tag className="h-3 w-3" />{getHorseName(viewItem.originalData.horseId)}
                </div>
              )}
              {viewItem.source === "training" && viewItem.originalData?.duration && (
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Duration:</span>{" "}
                  {viewItem.originalData.duration} min
                </div>
              )}
              {viewItem.source === "training" && viewItem.originalData?.notes && (
                <div className="text-muted-foreground whitespace-pre-wrap">
                  <span className="font-medium text-foreground">Notes:</span>{" "}
                  {viewItem.originalData.notes}
                </div>
              )}
              {viewItem.source === "event" && viewItem.originalData?.description && (
                <div className="text-muted-foreground whitespace-pre-wrap">
                  <span className="font-medium text-foreground">Notes:</span>{" "}
                  {viewItem.originalData.description}
                </div>
              )}
              {viewItem.source === "task" && viewItem.originalData?.description && (
                <div className="text-muted-foreground whitespace-pre-wrap">
                  <span className="font-medium text-foreground">Description:</span>{" "}
                  {viewItem.originalData.description}
                </div>
              )}
              {viewItem.source === "task" && (
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Priority:</span>{" "}
                  <span className="capitalize">{viewItem.originalData?.priority ?? "normal"}</span>
                </div>
              )}
              {viewItem.source === "appointment" && viewItem.originalData?.notes && (
                <div className="text-muted-foreground whitespace-pre-wrap">
                  <span className="font-medium text-foreground">Notes:</span>{" "}
                  {viewItem.originalData.notes}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            {viewItem?.isEditable && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setPendingDeleteItem(viewItem);
                    if (viewItem.source === "event") setSelectedEvent(viewItem.originalData);
                    setIsViewDialogOpen(false);
                    setIsDeleteAlertOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                {viewItem?.source === "event" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (viewItem?.originalData) handleOpenEdit(viewItem.originalData);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Link
                    href={
                      viewItem?.source === "training"
                        ? "/training"
                        : viewItem?.source === "task"
                        ? "/tasks"
                        : "/appointments"
                    }
                  >
                    <Button size="sm" onClick={() => setIsViewDialogOpen(false)}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {viewItem?.source === "training"
                        ? "Open Training"
                        : viewItem?.source === "task"
                        ? "Open Tasks"
                        : "Open Appointments"}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Schedule a new event for your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-title">Title *</Label>
              <Input
                id="add-title"
                autoComplete="off"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-eventType">Type</Label>
              <Select
                value={newEvent.eventType}
                onValueChange={(v) =>
                  setNewEvent({ ...newEvent, eventType: v as DbEventType })
                }
              >
                <SelectTrigger id="add-eventType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UI_EVENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="add-startDate">Date</Label>
                <Input
                  id="add-startDate"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-startTime" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time
                </Label>
                <Input
                  id="add-startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
              </div>
            </div>
            {(horses as any[]).length > 0 && (
              <div className="space-y-2">
                <Label>Horse (optional)</Label>
                <Select
                  value={newEvent.horseId || "none"}
                  onValueChange={(v) =>
                    setNewEvent({ ...newEvent, horseId: v === "none" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select horse..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific horse</SelectItem>
                    {(horses as any[]).map((h: any) => (
                      <SelectItem key={h.id} value={String(h.id)}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="add-location">Location (optional)</Label>
              <Input
                id="add-location"
                autoComplete="off"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                placeholder="e.g. Main arena"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description (optional)</Label>
              <Textarea
                id="add-description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Notes or details..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={createEvent.isPending}>
              {createEvent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details for this event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                autoComplete="off"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startTime" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time
                </Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Notes or details..."
                rows={2}
              />
            </div>
            {selectedEvent && (
              <div className="text-xs text-muted-foreground">
                Type:{" "}
                <span className="font-medium">
                  {EVENT_TYPE_LABELS[selectedEvent.eventType] ||
                    selectedEvent.eventType}
                </span>
                {selectedEvent.location && (
                  <>
                    {" "}
                    · Location:{" "}
                    <span className="font-medium">
                      {selectedEvent.location}
                    </span>
                  </>
                )}
                {selectedEvent.horseId &&
                  getHorseName(selectedEvent.horseId) && (
                    <>
                      {" "}
                      · Horse:{" "}
                      <span className="font-medium">
                        {getHorseName(selectedEvent.horseId)}
                      </span>
                    </>
                  )}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (selectedEvent) {
                  setPendingDeleteItem({ source: "event", title: selectedEvent.title, originalData: selectedEvent });
                }
                setIsDeleteAlertOpen(true);
              }}
              disabled={deleteEvent.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateEvent}
                disabled={updateEvent.isPending}
              >
                {updateEvent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDeleteItem?.source === "training"
                ? "Delete Training Session?"
                : pendingDeleteItem?.source === "task"
                ? "Delete Task?"
                : pendingDeleteItem?.source === "appointment"
                ? "Delete Appointment?"
                : "Delete Event?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{pendingDeleteItem?.title ?? selectedEvent?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteItem(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const item = pendingDeleteItem;
                if (!item) {
                  // fallback: legacy calendar event delete from edit dialog
                  if (selectedEvent) deleteEvent.mutate({ id: selectedEvent.id });
                  return;
                }
                if (item.source === "training") {
                  deleteTrainingSession.mutate({ id: item.originalData.id });
                } else if (item.source === "task") {
                  deleteTask.mutate({ id: item.originalData.id });
                } else if (item.source === "appointment") {
                  deleteAppointment.mutate({ id: item.originalData.id });
                } else {
                  // calendar event
                  const ev = item.originalData ?? selectedEvent;
                  if (ev) deleteEvent.mutate({ id: ev.id });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
