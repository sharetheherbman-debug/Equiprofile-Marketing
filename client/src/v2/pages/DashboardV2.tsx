import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useRecentVisits } from "@/hooks/useRecentVisits";
import {
  Activity,
  AlertCircle,
  Apple,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CalendarDays,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Clock,
  Cloud,
  DollarSign,
  Dumbbell,
  FileText,
  GitBranch,
  Heart,
  Navigation,
  Pill,
  Plus,
  Scissors,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Syringe,
  Tag,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

const BRAND = "#167cc1";
const BRAND_HOVER = "#1069a7";
const NAVY = "#052b57";
const PAGE = "#f5f8fc";
const BORDER = "#d7e0ea";
const TEXT = "#10263b";
const MUTED = "#5f7184";
const SOFT = "#eef3f8";

const dashboardModuleGroups: Array<{
  label: string;
  description: string;
  items: Array<{ icon: LucideIcon; label: string; path: string }>;
}> = [
  {
    label: "Horse & Daily Management",
    description: "The core records and day-to-day tools for your horses.",
    items: [
      { icon: CircleDot, label: "My Horses", path: "/horses" },
      { icon: Brain, label: "AI Assistant", path: "/ai-chat" },
      { icon: Cloud, label: "Weather", path: "/weather" },
      { icon: Users, label: "Contacts", path: "/contacts" },
      { icon: Clock, label: "Appointments", path: "/appointments" },
      { icon: Calendar, label: "Calendar", path: "/calendar" },
      { icon: ClipboardList, label: "Tasks", path: "/tasks" },
    ],
  },
  {
    label: "Health & Care",
    description: "Keep clinical, preventative and routine care records together.",
    items: [
      { icon: Stethoscope, label: "Health Hub", path: "/health" },
      { icon: Syringe, label: "Vaccinations", path: "/vaccinations" },
      { icon: Scissors, label: "Dental Care", path: "/dental" },
      { icon: Activity, label: "Hoof Care", path: "/hoofcare" },
      { icon: Pill, label: "Dewormings", path: "/dewormings" },
      { icon: Heart, label: "Treatments", path: "/treatments" },
      { icon: XCircle, label: "X-Rays", path: "/xrays" },
    ],
  },
  {
    label: "Training & Performance",
    description: "Track work, movement, competition and training history.",
    items: [
      { icon: Dumbbell, label: "Training Log", path: "/training" },
      { icon: BookOpen, label: "Training Templates", path: "/training-templates" },
      { icon: Navigation, label: "GPS Tracking", path: "/ride-tracking" },
      { icon: TrendingUp, label: "Competitions", path: "/competitions" },
    ],
  },
  {
    label: "Nutrition",
    description: "Plan feeding, record nutrition and understand feed costs.",
    items: [
      { icon: Apple, label: "Feeding Plans", path: "/feeding" },
      { icon: FileText, label: "Nutrition Plans", path: "/nutrition-plans" },
      { icon: BarChart3, label: "Nutrition Logs", path: "/nutrition-logs" },
      { icon: ShoppingCart, label: "Feed Costs", path: "/feed-costs" },
    ],
  },
  {
    label: "Records, Insights & Account",
    description: "Documents, ownership records, reporting and workspace settings.",
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: FileText, label: "Reports", path: "/reports" },
      { icon: Tag, label: "Tags", path: "/tags" },
      { icon: GitBranch, label: "Pedigree", path: "/pedigree" },
      { icon: Shield, label: "Equine Passport", path: "/equine-passport" },
      { icon: DollarSign, label: "Billing", path: "/billing" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

const quickActions = [
  { icon: Plus, label: "Add Horse", path: "/horses/new", description: "Register a new horse" },
  { icon: Dumbbell, label: "Log Training", path: "/training", description: "Record today's work" },
  { icon: Stethoscope, label: "Record Health", path: "/health", description: "Add a health observation" },
  { icon: Calendar, label: "Open Calendar", path: "/calendar", description: "Review appointments and events" },
  { icon: Apple, label: "Feeding Plans", path: "/feeding", description: "Manage daily nutrition" },
  { icon: FileText, label: "Documents", path: "/documents", description: "Open horse and business files" },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#e8eef5] ${className}`} aria-hidden="true" />;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
  attention = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  href: string;
  attention?: boolean;
}) {
  const animatedValue = useCountUp(value);
  return (
    <Link href={href} className="group rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(5,43,87,.04),0_10px_28px_rgba(5,43,87,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(5,43,87,.10)]" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: attention ? "#fff4e5" : "#eef7fd", color: attention ? "#9a6700" : BRAND }}>
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color: "#9aabba" }} />
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight" style={{ color: NAVY }}>{animatedValue}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[.08em]" style={{ color: MUTED }}>{label}</p>
    </Link>
  );
}

function FocusItem({ icon: Icon, text, href, tone = "normal" }: { icon: LucideIcon; text: string; href: string; tone?: "normal" | "warning" | "danger" }) {
  const palette = tone === "danger"
    ? { bg: "#fff2f0", fg: "#b42318", border: "#edc2bd" }
    : tone === "warning"
      ? { bg: "#fff8e6", fg: "#9a6700", border: "#ead7a2" }
      : { bg: "#eef7fd", fg: BRAND, border: "#d4e8f6" };
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border bg-white p-4 transition hover:shadow-sm" style={{ borderColor: palette.border }}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: palette.bg, color: palette.fg }}><Icon className="h-4 w-4" /></span>
      <span className="min-w-0 flex-1 text-sm font-semibold" style={{ color: TEXT }}>{text}</span>
      <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" style={{ color: "#9aabba" }} />
    </Link>
  );
}

function ModuleGroup({ group, onVisit }: { group: (typeof dashboardModuleGroups)[number]; onVisit: (path: string) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(5,43,87,.04)]" style={{ borderColor: BORDER }}>
      <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: BORDER }}>
        <h3 className="text-base font-extrabold" style={{ color: NAVY }}>{group.label}</h3>
        <p className="mt-1 text-xs leading-5" style={{ color: MUTED }}>{group.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#e7edf4] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {group.items.map(({ icon: Icon, label, path }) => (
          <Link key={path} href={path} onClick={() => onVisit(path)} className="group flex min-h-28 flex-col justify-between bg-white p-4 transition hover:bg-[#f4f9fd]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7fd]" style={{ color: BRAND }}><Icon className="h-4 w-4" /></span>
            <div className="mt-4 flex items-end justify-between gap-2"><span className="text-xs font-bold leading-4" style={{ color: TEXT }}>{label}</span><ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: BRAND }} /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { recentPaths, trackVisit } = useRecentVisits();
  const { data: horses, isLoading: horsesLoading } = trpc.horses.list.useQuery();
  const { data: healthAlerts } = trpc.timeline.getHealthAlerts.useQuery({});
  const { data: tasks } = trpc.tasks.list.useQuery();
  const { data: appointments } = trpc.appointments.list.useQuery();

  const today = useMemo(() => formatDate(new Date()), []);
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const horseCount = horses?.length ?? 0;
  const alertCount = Array.isArray(healthAlerts) ? healthAlerts.length : 0;
  const activeTaskCount = useMemo(() => Array.isArray(tasks) ? tasks.filter((task: any) => task.status !== "completed" && task.status !== "done").length : 0, [tasks]);
  const todayAppointments = useMemo(() => Array.isArray(appointments) ? appointments.filter((appointment: any) => {
    const date = appointment.date ?? appointment.appointmentDate ?? appointment.scheduledDate;
    return date && String(date).slice(0, 10) === todayKey;
  }) : [], [appointments, todayKey]);

  const focusItems = useMemo(() => {
    const items: Array<{ icon: LucideIcon; text: string; href: string; tone: "normal" | "warning" | "danger" }> = [];
    if (Array.isArray(healthAlerts)) {
      healthAlerts.slice(0, 3).forEach((alert: any) => items.push({
        icon: AlertCircle,
        text: `${alert.horseName ?? alert.horse?.name ?? "Horse"}: ${alert.message ?? alert.description ?? "needs attention"}`,
        href: "/health",
        tone: "danger",
      }));
    }
    if (Array.isArray(tasks)) {
      tasks.filter((task: any) => task.status !== "completed" && task.status !== "done" && task.dueDate && String(task.dueDate).slice(0, 10) <= todayKey).slice(0, 3).forEach((task: any) => {
        const overdue = String(task.dueDate).slice(0, 10) < todayKey;
        items.push({ icon: ClipboardList, text: `${overdue ? "Overdue" : "Due today"}: ${task.title ?? task.name ?? "Task"}`, href: "/tasks", tone: overdue ? "warning" : "normal" });
      });
    }
    todayAppointments.slice(0, 2).forEach((appointment: any) => items.push({ icon: Clock, text: `Appointment: ${appointment.title ?? appointment.type ?? "Scheduled today"}`, href: "/appointments", tone: "normal" }));
    return items;
  }, [healthAlerts, tasks, todayAppointments, todayKey]);

  const pathLabels = useMemo(() => {
    const map: Record<string, string> = {};
    dashboardModuleGroups.forEach((group) => group.items.forEach((item) => { map[item.path] = item.label; }));
    quickActions.forEach((item) => { map[item.path] = item.label; });
    return map;
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const loading = horsesLoading;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[24px] border bg-white p-6 shadow-[0_14px_40px_rgba(5,43,87,.06)] sm:p-8" style={{ borderColor: BORDER }}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.16em]" style={{ color: BRAND }}>EquiProfile Management</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: NAVY }}>Welcome back, {firstName}.</h1>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>{today}</p>
              {!loading && <p className="mt-1 text-xs" style={{ color: "#8190a0" }}>{horseCount} horse{horseCount === 1 ? "" : "s"} · {activeTaskCount} active task{activeTaskCount === 1 ? "" : "s"}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/horses/new" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px" style={{ backgroundColor: BRAND }}><Plus className="h-4 w-4" /> Add horse</Link>
              <Link href="/calendar" className="inline-flex min-h-10 items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-[#eef7fd]" style={{ borderColor: BORDER, color: NAVY }}><Calendar className="h-4 w-4" /> Calendar</Link>
            </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Key management metrics">
          {loading ? <><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></> : <>
            <MetricCard icon={CircleDot} label="Total horses" value={horseCount} href="/horses" />
            <MetricCard icon={AlertCircle} label="Health alerts" value={alertCount} href="/health" attention={alertCount > 0} />
            <MetricCard icon={ClipboardList} label="Active tasks" value={activeTaskCount} href="/tasks" attention={activeTaskCount > 0} />
            <MetricCard icon={CalendarDays} label="Today's appointments" value={todayAppointments.length} href="/appointments" />
          </>}
        </section>

        {focusItems.length > 0 && <section className="mt-7"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em]" style={{ color: BRAND }}>Needs attention</p><h2 className="mt-1 font-serif text-xl font-semibold" style={{ color: NAVY }}>Today&apos;s focus</h2></div><Link href="/tasks" className="text-xs font-bold" style={{ color: BRAND }}>View tasks →</Link></div><div className="space-y-2">{focusItems.map((item, index) => <FocusItem key={`${item.href}-${index}`} {...item} />)}</div></section>}

        <section className="mt-7">
          <div className="mb-3"><p className="text-[10px] font-extrabold uppercase tracking-[.14em]" style={{ color: BRAND }}>Quick actions</p><h2 className="mt-1 font-serif text-xl font-semibold" style={{ color: NAVY }}>Common work</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quickActions.map(({ icon: Icon, label, path, description }) => <Link key={path} href={path} onClick={() => trackVisit(path)} className="group flex items-center gap-4 rounded-2xl border bg-white p-4 transition hover:-translate-y-px hover:shadow-md" style={{ borderColor: BORDER }}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7fd]" style={{ color: BRAND }}><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold" style={{ color: TEXT }}>{label}</span><span className="mt-0.5 block text-xs" style={{ color: MUTED }}>{description}</span></span><ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" style={{ color: "#9aabba" }} /></Link>)}</div>
          {recentPaths.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs" style={{ color: MUTED }}>Recent:</span>{recentPaths.map((path) => <Link key={path} href={path} onClick={() => trackVisit(path)} className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-[#eef7fd]" style={{ borderColor: BORDER, color: MUTED }}>{pathLabels[path] ?? path}</Link>)}</div>}
        </section>

        {horseCount === 0 && !loading && <section className="mt-7 rounded-2xl border border-dashed bg-white p-8 text-center sm:p-12" style={{ borderColor: "#b9c9d8" }}><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef7fd]" style={{ color: BRAND }}><Sparkles className="h-7 w-7" /></div><h2 className="mt-4 font-serif text-xl font-semibold" style={{ color: NAVY }}>Build your EquiProfile workspace</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6" style={{ color: MUTED }}>Add your first horse to start using the health, training, nutrition, documents, calendar and reporting tools already available in your account.</p><Link href="/horses/new" className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: BRAND }}><Plus className="h-4 w-4" /> Add your first horse</Link></section>}

        <section className="mt-8 pb-8" aria-label="EquiProfile modules">
          <div className="mb-4"><p className="text-[10px] font-extrabold uppercase tracking-[.14em]" style={{ color: BRAND }}>Your EquiProfile tools</p><h2 className="mt-1 font-serif text-xl font-semibold" style={{ color: NAVY }}>Everything in your management workspace</h2><p className="mt-1 text-sm" style={{ color: MUTED }}>The dashboard no longer hides modules behind different colour-coded visual systems.</p></div>
          <div className="space-y-4">{dashboardModuleGroups.map((group) => <ModuleGroup key={group.label} group={group} onVisit={trackVisit} />)}</div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardV2() {
  const { loading, user } = useAuth({ redirectOnUnauthenticated: true });
  const { data: subscription } = trpc.user.getSubscriptionStatus.useQuery();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user?.role === "admin") return;
    if (subscription?.planTier === "stable" && !subscription?.bothDashboardsUnlocked) {
      setLocation("/stable-dashboard");
    } else if (subscription?.planTier === "student") {
      setLocation("/student-dashboard");
    } else if (subscription?.planTier === "teacher") {
      setLocation("/teacher-dashboard");
    } else if (subscription?.planTier === "school_owner") {
      setLocation("/school-dashboard");
    }
  }, [user?.role, subscription?.planTier, subscription?.bothDashboardsUnlocked, setLocation]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8" style={{ backgroundColor: PAGE }}>
          <div className="mx-auto max-w-7xl"><Skeleton className="h-48" /><div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4"><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div></div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout><DashboardContent /></DashboardLayout>;
}
