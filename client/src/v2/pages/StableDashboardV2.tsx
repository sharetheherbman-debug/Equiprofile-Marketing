import { useAuth } from "@/_core/hooks/useAuth";
import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Users,
  Calendar,
  Dumbbell,
  Stethoscope,
  ChevronRight,
  Plus,
  Shield,
  Building2,
  UserCog,
  FolderOpen,
  Settings,
  ClipboardList,
  DollarSign,
  Loader2,
  Wrench,
  BarChart3,
  MessageSquare,
  Baby,
  Activity,
  Clock,
  Brain,
  AlertCircle,
  Navigation,
  GitBranch,
  Tag,
  FileText,
  Apple,
  ShoppingCart,
  BookOpen,
  TrendingUp,
  Syringe,
  Pill,
  Scissors,
  XCircle,
  Home,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────────

const ACCENT = "#4f5fd6";

// ─── Stable Module Navigation Data ──────────────────────────────────────────

const stableModuleGroups = [
  {
    label: "Operations",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    items: [
      { icon: Heart, label: "Horses", path: "/horses" },
      { icon: UserCog, label: "Staff", path: "/staff" },
      { icon: Users, label: "Contacts", path: "/contacts" },
      { icon: Calendar, label: "Calendar", path: "/calendar" },
      { icon: ClipboardList, label: "Tasks", path: "/tasks" },
      { icon: Clock, label: "Appointments", path: "/appointments" },
    ],
  },
  {
    label: "Health",
    color: "#f43f5e",
    gradient: "from-rose-500 to-red-600",
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
    label: "Training & Activity",
    color: "#10b981",
    gradient: "from-emerald-500 to-green-600",
    items: [
      { icon: Dumbbell, label: "Training Log", path: "/training" },
      { icon: BookOpen, label: "Templates", path: "/training-templates" },
      { icon: Navigation, label: "GPS Tracking", path: "/ride-tracking" },
      { icon: Activity, label: "Lessons", path: "/lessons" },
      { icon: Baby, label: "Breeding", path: "/breeding" },
    ],
  },
  {
    label: "Nutrition",
    color: "#84cc16",
    gradient: "from-lime-500 to-green-600",
    items: [
      { icon: Apple, label: "Feeding Plans", path: "/feeding" },
      { icon: FileText, label: "Nutrition Plans", path: "/nutrition-plans" },
      { icon: BarChart3, label: "Nutrition Logs", path: "/nutrition-logs" },
      { icon: ShoppingCart, label: "Feed Costs", path: "/feed-costs" },
    ],
  },
  {
    label: "Stable Management",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-600",
    items: [
      { icon: Building2, label: "Stable", path: "/stable" },
      { icon: Wrench, label: "Stable Setup", path: "/stable-setup" },
      { icon: FileText, label: "Stable Reports", path: "/stable-reports" },
      { icon: MessageSquare, label: "Messages", path: "/messages" },
    ],
  },
  {
    label: "Reports & Settings",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: Tag, label: "Tags", path: "/tags" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: FileText, label: "Reports", path: "/reports" },
      { icon: GitBranch, label: "Pedigree", path: "/pedigree" },
      { icon: Shield, label: "Equine Passport", path: "/equine-passport" },
      { icon: TrendingUp, label: "Competitions", path: "/competitions" },
      { icon: Brain, label: "AI Assistant", path: "/ai-chat" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

// ─── Quick Actions ───────────────────────────────────────────────────────────

const stableQuickActions = [
  { icon: Plus, label: "Add Horse", description: "Register a new horse", path: "/horses/new" },
  { icon: UserCog, label: "Manage Staff", description: "View and manage staff", path: "/staff" },
  { icon: Calendar, label: "Schedule Appointment", description: "Book a new appointment", path: "/appointments" },
  { icon: BarChart3, label: "View Reports", description: "Stable analytics & reports", path: "/reports" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton Components ─────────────────────────────────────────────────────

function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-[#242a38] ${className}`}
      aria-hidden="true"
    />
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-11 w-11 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-7 w-12" />
        </div>
      </div>
    </div>
  );
}

function AlertListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-4"
        >
          <SkeletonPulse className="h-5 w-5 shrink-0 rounded" />
          <SkeletonPulse className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
  color = ACCENT,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href?: string;
  color?: string;
}) {
  const card = (
    <div className={`rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5 transition-all duration-200 hover:shadow-md ${href ? "cursor-pointer" : ""}`}>
      <div className="flex items-center gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370] dark:text-[#9ca3b0]">
            {label}
          </p>
          <p className="mt-0.5 text-2xl font-bold text-[#1a1d24] dark:text-[#e8eaef]">
            {value}
          </p>
        </div>
        {href && <ChevronRight className="h-4 w-4 shrink-0 text-[#5c6370]/40" />}
      </div>
    </div>
  );
  if (href) return <Link href={href}>{card}</Link>;
  return card;
}

// ─── Alert Item ──────────────────────────────────────────────────────────────

function AlertItem({
  icon: Icon,
  text,
  variant = "info",
  href,
}: {
  icon: LucideIcon;
  text: string;
  variant?: "alert" | "warning" | "info";
  href?: string;
}) {
  const colors = {
    alert: "text-red-500 bg-red-50 dark:bg-red-950/30",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    info: "text-[#4f5fd6] bg-[#4f5fd6]/10",
  };
  const iconBg = colors[variant];

  const content = (
    <div className={`flex items-center gap-3 rounded-lg border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-4 transition-colors duration-200 hover:border-[#4f5fd6]/30 ${href ? "cursor-pointer" : ""}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-[#1a1d24] dark:text-[#e8eaef] flex-1">{text}</p>
      {href && <ChevronRight className="h-4 w-4 shrink-0 text-[#5c6370]/40" />}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ─── Quick Action Card ───────────────────────────────────────────────────────

function QuickActionCard({
  icon: Icon,
  label,
  description,
  path,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      className="group flex items-center gap-4 rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-4 transition-all duration-200 hover:border-[#4f5fd6]/40 hover:shadow-md"
      aria-label={label}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 group-hover:bg-[#4f5fd6] group-hover:text-white"
        style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#1a1d24] dark:text-[#e8eaef]">{label}</p>
        <p className="text-xs text-[#5c6370] dark:text-[#9ca3b0]">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#5c6370]/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#4f5fd6]" />
    </Link>
  );
}

// ─── Module Group Card ───────────────────────────────────────────────────────

function ModuleGroupCard({
  label,
  items,
  color = ACCENT,
  gradient,
}: {
  label: string;
  items: { icon: LucideIcon; label: string; path: string }[];
  color?: string;
  gradient?: string;
}) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] overflow-hidden">
      {gradient && (
        <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} aria-hidden="true" />
      )}
      <div className="p-5">
        <h3
          className="mb-4 text-xs font-bold uppercase tracking-[0.15em]"
          style={{ color }}
        >
          {label}
        </h3>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="group flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-all duration-200 hover:bg-[#f7f8fa] dark:hover:bg-[#242a38]"
                aria-label={item.label}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <ItemIcon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-[#1a1d24] dark:text-[#e8eaef] leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Section Heading ─────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-base font-semibold text-[#1a1d24] dark:text-[#e8eaef] tracking-tight">
      {children}
    </h2>
  );
}

// ─── Stable Dashboard Content ────────────────────────────────────────────────

function StableDashboardContent() {
  const { user } = useAuth();

  const { data: horses, isLoading: horsesLoading } = trpc.horses.list.useQuery();
  const { data: healthAlerts } = trpc.timeline.getHealthAlerts.useQuery({});
  const { data: tasks } = trpc.tasks.list.useQuery();
  const { data: upcomingAppointments } = trpc.appointments.list.useQuery();
  const { data: recentTraining } = trpc.training.listAll.useQuery();
  const { data: stableList } = trpc.stables.list.useQuery();
  const currentStableId = stableList?.[0]?.id;
  const { data: stableMembers } = trpc.stables.getMembers.useQuery(
    { stableId: currentStableId ?? 0 },
    { enabled: !!currentStableId },
  );

  const today = useMemo(() => formatDate(new Date()), []);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const horseCount = horses?.length ?? 0;
  const alertCount = Array.isArray(healthAlerts) ? healthAlerts.length : 0;

  const pendingTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(
      (t: any) => t.status !== "completed" && t.status !== "done"
    );
  }, [tasks]);

  const todayAppointments = useMemo(() => {
    if (!Array.isArray(upcomingAppointments)) return [];
    return upcomingAppointments.filter((a: any) => {
      const d = a.date ?? a.appointmentDate ?? a.scheduledDate;
      if (!d) return false;
      return String(d).slice(0, 10) === todayStr;
    });
  }, [upcomingAppointments, todayStr]);

  const weekTrainingCount = useMemo(() => {
    if (!Array.isArray(recentTraining)) return 0;
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return recentTraining.filter((s: any) => {
      const d = s.sessionDate ?? s.date ?? s.createdAt;
      if (!d) return false;
      return new Date(d) >= weekAgo;
    }).length;
  }, [recentTraining]);

  // Health alerts list
  const healthAlertItems = useMemo(() => {
    if (!Array.isArray(healthAlerts)) return [];
    return healthAlerts.slice(0, 5).map((alert: any) => {
      const name = alert.horseName ?? alert.horse?.name ?? "A horse";
      const message = alert.message ?? alert.description ?? "needs attention";
      return { icon: AlertCircle as LucideIcon, text: `${name}: ${message}`, variant: "alert" as const, href: "/health" };
    });
  }, [healthAlerts]);

  // Upcoming tasks & appointments — limited to today + tomorrow
  const upcomingItems = useMemo(() => {
    const items: { icon: LucideIcon; text: string; variant: "alert" | "warning" | "info"; href: string }[] = [];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);

    if (Array.isArray(tasks)) {
      tasks
        .filter((t: any) => {
          if (t.status === "completed" || t.status === "done") return false;
          if (!t.dueDate) return false;
          const due = String(t.dueDate).slice(0, 10);
          return due <= tomorrowStr;
        })
        .slice(0, 4)
        .forEach((t: any) => {
          const overdue =
            t.dueDate && String(t.dueDate).slice(0, 10) < todayStr;
          items.push({
            icon: ClipboardList,
            text: `${overdue ? "Overdue: " : ""}${t.title ?? t.name ?? "Task"}`,
            variant: overdue ? "warning" : "info",
            href: "/tasks",
          });
        });
    }

    if (Array.isArray(upcomingAppointments)) {
      upcomingAppointments
        .filter((a: any) => {
          const d = a.date ?? a.appointmentDate ?? a.scheduledDate;
          if (!d) return false;
          const dateStr = String(d).slice(0, 10);
          return dateStr >= todayStr && dateStr <= tomorrowStr;
        })
        .slice(0, 3)
        .forEach((a: any) => {
          items.push({
            icon: Clock,
            text: `Appointment: ${a.title ?? a.type ?? "Scheduled"}`,
            variant: "info",
            href: "/appointments",
          });
        });
    }

    return items;
  }, [tasks, upcomingAppointments, todayStr]);

  const isLoading = horsesLoading;
  const stableName = user?.name ? `${user.name.split(" ")[0]}'s Stable` : "Stable";

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#0f1219] relative">
      {/* ── Subtle Premium Background Depth ────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#4f5fd6]/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-64 w-64 rounded-full bg-[#3b7dd8]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-56 w-56 rounded-full bg-[#2d8a56]/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Stable Overview Header ─────────────────────────────── */}
        <header className="mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ACCENT}14` }}
                >
                  <Building2 className="h-5 w-5" style={{ color: ACCENT }} />
                </div>
                <h1 className="font-serif text-2xl font-semibold text-[#1a1d24] dark:text-[#e8eaef] sm:text-3xl">
                  Stable Dashboard
                </h1>
              </div>
              <p className="mt-1 pl-[3.25rem] text-sm text-[#5c6370] dark:text-[#9ca3b0]">
                {today}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#5c6370] dark:text-[#9ca3b0]">
              <Home className="h-4 w-4" />
              <span>{stableName}</span>
            </div>
          </div>
        </header>

        {/* ── Operational Summary (6 metrics) ────────────────────── */}
        <section aria-label="Operational summary" className="mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {isLoading ? (
              <>
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </>
            ) : (
              <>
                <MetricCard icon={Heart} label="Total Horses" value={horseCount} href="/horses" color="#f43f5e" />
                <MetricCard icon={Users} label="Active Staff" value={stableMembers?.length ?? "—"} href="/staff" color="#3b82f6" />
                <MetricCard icon={AlertCircle} label="Health Alerts" value={alertCount} href="/health" color="#f59e0b" />
                <MetricCard icon={ClipboardList} label="Tasks Due" value={pendingTasks.length} href="/tasks" color="#8b5cf6" />
                <MetricCard icon={Calendar} label="Appointments Today" value={todayAppointments.length} href="/appointments" color="#0ea5e9" />
                <MetricCard icon={Dumbbell} label="Training This Week" value={weekTrainingCount} href="/training" color="#10b981" />
              </>
            )}
          </div>
        </section>

        {/* ── Activity & Alerts Panel ────────────────────────────── */}
        <section aria-label="Activity and alerts" className="mb-8">
          <SectionHeading>Activity &amp; Alerts</SectionHeading>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Left: Health Alerts */}
            <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1a1d24] dark:text-[#e8eaef]">
                  <Stethoscope className="h-4 w-4" style={{ color: ACCENT }} />
                  Health Alerts
                </h3>
                <Link
                  href="/health"
                  className="text-xs font-medium transition-colors duration-200 hover:underline"
                  style={{ color: ACCENT }}
                  aria-label="View all health alerts"
                >
                  View all
                </Link>
              </div>
              {isLoading ? (
                <AlertListSkeleton />
              ) : healthAlertItems.length > 0 ? (
                <div className="space-y-2">
                  {healthAlertItems.map((item, i) => (
                    <AlertItem key={i} icon={item.icon} text={item.text} variant={item.variant} href={item.href} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#e4e7ec] dark:border-[#2a3040] p-4">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${ACCENT}10` }}
                  >
                    <Shield className="h-4 w-4" style={{ color: ACCENT }} />
                  </div>
                  <p className="text-sm text-[#5c6370] dark:text-[#9ca3b0]">
                    No health alerts — all horses are doing well.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Upcoming Tasks & Appointments */}
            <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1a1d24] dark:text-[#e8eaef]">
                  <ClipboardList className="h-4 w-4" style={{ color: ACCENT }} />
                  Today &amp; Tomorrow
                </h3>
                <Link
                  href="/tasks"
                  className="text-xs font-medium transition-colors duration-200 hover:underline"
                  style={{ color: ACCENT }}
                  aria-label="View all tasks"
                >
                  View all
                </Link>
              </div>
              {isLoading ? (
                <AlertListSkeleton />
              ) : upcomingItems.length > 0 ? (
                <div className="space-y-2">
                  {upcomingItems.map((item, i) => (
                    <AlertItem key={i} icon={item.icon} text={item.text} variant={item.variant} href={item.href} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#e4e7ec] dark:border-[#2a3040] p-4">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${ACCENT}10` }}
                  >
                    <FolderOpen className="h-4 w-4" style={{ color: ACCENT }} />
                  </div>
                  <p className="text-sm text-[#5c6370] dark:text-[#9ca3b0]">
                    No upcoming tasks or appointments scheduled.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Quick Actions Bar ───────────────────────────────────── */}
        <section aria-label="Quick actions" className="mb-8">
          <SectionHeading>Quick Actions</SectionHeading>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stableQuickActions.map((action) => (
              <QuickActionCard key={action.path} {...action} />
            ))}
          </div>
        </section>

        {/* ── Stable Module Groups — desktop only ────────────────── */}
        <section aria-label="Stable modules" className="mb-8 hidden md:block">
          <SectionHeading>Modules</SectionHeading>
          <div className="mt-4 space-y-4">
            {stableModuleGroups.map((group) => (
              <ModuleGroupCard key={group.label} label={group.label} items={group.items} color={group.color} gradient={group.gradient} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function StableDashboardV2() {
  const { loading } = useAuth({ redirectOnUnauthenticated: true });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#0f1219]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <SkeletonPulse className="h-10 w-10 rounded-lg" />
              <SkeletonPulse className="h-8 w-56" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
            <div className="mt-8">
              <SkeletonPulse className="mb-4 h-6 w-40" />
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5">
                  <AlertListSkeleton />
                </div>
                <div className="rounded-xl border border-[#e4e7ec] dark:border-[#2a3040] bg-white dark:bg-[#181d27] p-5">
                  <AlertListSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StableDashboardContent />
    </DashboardLayout>
  );
}
