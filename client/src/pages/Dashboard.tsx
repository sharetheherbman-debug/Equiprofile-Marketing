import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useCountUp } from "@/hooks/useCountUp";
import { useRecentVisits } from "@/hooks/useRecentVisits";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAdminViewMode } from "@/contexts/AdminViewContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  CloudSun,
  Cloud,
  Plus,
  ChevronRight,
  AlertCircle,
  Clock,
  Activity,
  Stethoscope,
  Dumbbell,
  Apple,
  CalendarDays,
  Brain,
  FileText,
  Baby,
  DollarSign,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Shield,
  Syringe,
  Pill,
  Scissors,
  XCircle,
  GitBranch,
  Tag,
  Sparkles,
  BookOpen,
  TrendingUp,
  Navigation,
  ShoppingCart,
  Home,
  UserCog,
  Star,
  Zap,
} from "lucide-react";

// ─── Quick Links data — mirrors mobile "More" sheet exactly ─────────────────
// Each group has a gradient used to colour-code the icon backgrounds.

const dashboardModuleGroups = [
  {
    label: "Core",
    gradient: "from-blue-700 to-blue-800",
    labelColor: "text-blue-400",
    items: [
      { icon: Brain, label: "AI Assistant", path: "/ai-chat" },
      { icon: Cloud, label: "Weather", path: "/weather" },
      { icon: Users, label: "Contacts", path: "/contacts" },
      { icon: Clock, label: "Appointments", path: "/appointments" },
    ],
  },
  {
    label: "Health",
    gradient: "from-rose-700 to-rose-800",
    labelColor: "text-rose-400",
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
    gradient: "from-emerald-700 to-emerald-800",
    labelColor: "text-emerald-400",
    items: [
      { icon: Dumbbell, label: "Training Log", path: "/training" },
      { icon: BookOpen, label: "Templates", path: "/training-templates" },
      { icon: Navigation, label: "GPS Tracking", path: "/ride-tracking" },
      { icon: Users, label: "Lessons", path: "/lessons", stableOnly: true },
      { icon: Baby, label: "Breeding", path: "/breeding", stableOnly: true },
    ],
  },
  {
    label: "Nutrition",
    gradient: "from-teal-700 to-teal-800",
    labelColor: "text-teal-400",
    items: [
      { icon: Apple, label: "Feeding Plans", path: "/feeding" },
      { icon: FileText, label: "Nutrition Plans", path: "/nutrition-plans" },
      { icon: BookOpen, label: "Nutrition Logs", path: "/nutrition-logs" },
      { icon: ShoppingCart, label: "Feed Costs", path: "/feed-costs" },
    ],
  },
  {
    label: "Data & Reports",
    gradient: "from-indigo-700 to-indigo-800",
    labelColor: "text-indigo-400",
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: FileText, label: "Reports", path: "/reports" },
      { icon: Tag, label: "Tags", path: "/tags" },
      { icon: GitBranch, label: "Pedigree", path: "/pedigree" },
      { icon: Shield, label: "Equine Passport", path: "/equine-passport" },
    ],
  },
  {
    label: "Stable & People",
    gradient: "from-cyan-700 to-teal-800",
    labelColor: "text-cyan-400",
    items: [
      { icon: Home, label: "Stable Management", path: "/stable", stableOnly: true },
      { icon: UserCog, label: "Staff", path: "/staff", stableOnly: true },
      { icon: MessageSquare, label: "Messages", path: "/messages", stableOnly: true },
    ],
  },
  {
    label: "Account",
    gradient: "from-slate-600 to-slate-700",
    labelColor: "text-slate-400",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

// Helper: map task priority to a dot color class
const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500",
};
function taskPriorityColor(priority: string): string {
  return PRIORITY_COLOR[priority] ?? "bg-green-500";
}

// Quick actions for the pill row
const quickActions = [
  {
    label: "Add Horse",
    href: "/horses/new",
    icon: Plus,
    color: "from-rose-700 to-rose-800",
  },
  {
    label: "Log Training",
    href: "/training",
    icon: Dumbbell,
    color: "from-emerald-700 to-emerald-800",
  },
  {
    label: "Weather",
    href: "/weather",
    icon: CloudSun,
    color: "from-blue-700 to-blue-800",
  },
  {
    label: "AI Chat",
    href: "/ai-chat",
    icon: Sparkles,
    color: "from-indigo-700 to-indigo-800",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    color: "from-teal-700 to-teal-800",
  },
];

function DashboardContent() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { viewMode } = useAdminViewMode();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { recentPaths, trackVisit } = useRecentVisits();

  const { data: stats } = trpc.user.getDashboardStats.useQuery(undefined, {
    retry: false,
    staleTime: 2 * 60 * 1000,
  });
  const { data: subscription } = trpc.user.getSubscriptionStatus.useQuery();
  const { data: trainingStats } = trpc.analytics.getTrainingStats.useQuery(
    {},
    { retry: false },
  );
  const { data: horses = [], isLoading: horsesLoading } = trpc.horses.list.useQuery(undefined, {
    retry: false,
    staleTime: 2 * 60 * 1000,
  });
  const { data: upcomingAppointments = [] } = trpc.appointments.list.useQuery(
    undefined,
    { retry: false },
  );
  const { data: tasks = [] } = trpc.tasks.list.useQuery(undefined, {
    retry: false,
  });
  const { data: smartAlerts = [] } = trpc.timeline.getHealthAlerts.useQuery({}, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Redirect Stable plan users to the Stable Dashboard.
  // Student / teacher / school_owner plans are not hosted in this management
  // frontend — redirect them to onboarding so they can pick the correct path.
  // Admin users bypass all redirects — they can view any dashboard via Portals.
  useEffect(() => {
    if (user?.role === "admin") return;
    if (subscription?.planTier === "stable" && !subscription?.bothDashboardsUnlocked) {
      setLocation("/stable-dashboard");
    } else if (
      subscription?.planTier === "student" ||
      subscription?.planTier === "teacher" ||
      subscription?.planTier === "school_owner"
    ) {
      // These plan types don't have dedicated dashboards in the management app.
      // Send them to onboarding so they can access the right platform.
      setLocation("/onboarding");
    }
  }, [user?.role, subscription?.planTier, subscription?.bothDashboardsUnlocked, setLocation]);

  const today = new Date();
  const todayDateString = today.toDateString();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  // Stable calendar query dates — computed once per mount so the query key
  // doesn't change on every render (which would cause repeated fetches).
  // Fetches from today (midnight) to 31 days forward — covers the full month
  // ahead while keeping today's events visible at the top of the "Today" panel.
  const calendarQueryDates = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start.toISOString(),
      endDate: new Date(start.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Single calendar query for the next 30 days — filtered client-side for "today"
  // to avoid two separate HTTP requests on every Dashboard mount.
  const { data: allCalendarEvents = [] } = trpc.calendar.getEvents.useQuery(
    calendarQueryDates,
    { retry: false, staleTime: 5 * 60 * 1000 },
  );

  // Split into today's events and all upcoming events from the single response
  const calendarEvents = allCalendarEvents.filter((e: any) => {
    const d = new Date(e.startDate);
    return d >= todayStart && d < todayEnd;
  });
  const upcomingCalendarEvents = allCalendarEvents;

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const getSubscriptionBadge = () => {
    if (!subscription) return null;
    switch (subscription.status) {
      case "trial": {
        const trialDays = subscription.trialEndsAt
          ? Math.ceil(
              (new Date(subscription.trialEndsAt).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            )
          : 0;
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800 gap-1 text-[11px]">
            <Star className="w-3 h-3" />
            {trialDays}d trial
          </Badge>
        );
      }
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 text-[11px]">
            <Zap className="w-3 h-3" />
            Starter
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px]">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px]">
            <AlertCircle className="w-3 h-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  // Upcoming events limited to today and tomorrow only — no future clutter
  const tomorrowEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 2,
  );
  const futureAppointments = upcomingAppointments
    .filter(
      (a: any) =>
        new Date(a.appointmentDate) >= new Date() &&
        new Date(a.appointmentDate) < tomorrowEnd,
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    )
    .slice(0, 4);

  const activeTasks = (tasks as any[]).filter((t: any) => !t.isCompleted);

  const healthAlerts =
    (stats?.reminderCount || 0) > 0
      ? [
          {
            id: "health-reminder",
            message: `${stats?.reminderCount} health reminder${(stats?.reminderCount || 0) > 1 ? "s" : ""} due`,
            href: "/health",
          },
        ]
      : [];

  // ── Animated counters for stat cards ────────────────────────────────────
  const animatedHorseCount = useCountUp((horses as any[]).length);
  const animatedEventCount = useCountUp((upcomingCalendarEvents as any[]).length);
  const animatedTaskCount = useCountUp(activeTasks.length);

  // ── "All Features" global expand / collapse ──────────────────────────────
  const FEATURE_LIMIT = 5;
  const expandableGroupLabels = useMemo(() => {
    const isStablePlan =
      user?.role === "admin"
        ? viewMode === "stable"
        : subscription?.planTier === "stable";
    return dashboardModuleGroups
      .map((g) => ({
        label: g.label,
        count: g.items.filter((item: any) => isStablePlan || !item.stableOnly).length,
      }))
      .filter((g) => g.count > FEATURE_LIMIT)
      .map((g) => g.label);
  }, [user?.role, viewMode, subscription?.planTier]);

  const allExpanded =
    expandableGroupLabels.length > 0 &&
    expandableGroupLabels.every((l) => expandedGroups.has(l));

  // ── Build label lookup for recent-visit chips ────────────────────────────
  const pathLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const group of dashboardModuleGroups) {
      for (const item of group.items) {
        map[item.path] = item.label;
      }
    }
    for (const action of quickActions) {
      map[action.href] = action.label;
    }
    return map;
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800/90 to-emerald-950/40 p-5 sm:p-6 text-white shadow-xl shadow-black/30 border border-white/10"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-6 right-14 h-28 w-28 rounded-full bg-white/[0.04]" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-300/80 mb-1 truncate">
              {greeting}, {user?.name?.split(" ")[0] || "Rider"} 🐎
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              Dashboard
            </h1>
            <p className="text-white/50 text-xs mt-1">
              {today.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            {(horses as any[]).length > 0 && !horsesLoading && (
              <p className="text-emerald-300/60 text-xs mt-1">
                Managing {(horses as any[]).length} horse{(horses as any[]).length !== 1 ? "s" : ""}
                {activeTasks.length > 0 && ` · ${activeTasks.length} active task${activeTasks.length !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {getSubscriptionBadge()}
          </div>
        </div>

        {/* Quick action pills */}
        <div className="relative mt-4 flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <button
                  onClick={() => trackVisit(action.href)}
                  className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-medium text-white border border-white/15"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center`}
                  >
                    <ActionIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                  {action.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Recent visited chips — only shown once the user has navigated somewhere */}
        {recentPaths.length > 0 && (
          <div className="relative mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-white/35 shrink-0">Recent:</span>
            {recentPaths.map((path) => (
              <Link key={path} href={path}>
                <button
                  onClick={() => trackVisit(path)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.14] active:scale-95 text-[10px] text-white/55 hover:text-white/80 border border-white/10 transition-all"
                >
                  {pathLabelMap[path] ?? path}
                </button>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-3 sm:gap-4"
      >
        <Link href="/horses">
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 to-pink-950/30 hover:from-rose-950/60 hover:border-rose-500/35 transition-all cursor-pointer text-center group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-700 to-rose-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold font-serif leading-none mt-0.5">{animatedHorseCount}</p>
            <p className="text-[10px] text-muted-foreground leading-tight font-medium uppercase tracking-wider">
              Horses
            </p>
          </div>
        </Link>
        <Link href="/calendar">
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-violet-950/30 hover:from-purple-950/60 hover:border-purple-500/35 transition-all cursor-pointer text-center group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-violet-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold font-serif leading-none mt-0.5">
              {animatedEventCount}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight font-medium uppercase tracking-wider">
              Events
            </p>
          </div>
        </Link>
        <Link href="/tasks">
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-orange-950/30 hover:from-amber-950/60 hover:border-amber-500/35 transition-all cursor-pointer text-center group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold font-serif leading-none mt-0.5">
              {animatedTaskCount}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight font-medium uppercase tracking-wider">
              Tasks
            </p>
          </div>
        </Link>
      </motion.div>

      {/* ── Care Insights ────────────────────────────────────── */}
      {(() => {
        // Show urgent/warning alerts only — never surface "no_recent_health"
        // at any severity on the main dashboard (avoid raw warning spam).
        const actionableAlerts = (smartAlerts as any[]).filter(
          (a) => (a.severity === "urgent" || a.severity === "warning") &&
            a.type !== "no_recent_health"
        );
        const hasContent = healthAlerts.length > 0 || actionableAlerts.length > 0;
        if (!hasContent) return null;
        const allAlerts = [
          ...healthAlerts.map((a) => ({ id: a.id, href: a.href, severity: "warning", title: a.message, horseId: null })),
          ...actionableAlerts,
        ];
        const visibleAlerts = allAlerts.slice(0, 3);
        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-950/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-sm flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-amber-400" />
                    Care Reminders
                  </CardTitle>
                  {allAlerts.length > 3 && (
                    <Link href="/health">
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] text-amber-400/80 hover:text-amber-300 px-2">
                        View all →
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {visibleAlerts.map((alert: any) => (
                  <Link key={alert.id} href={alert.horseId ? `/horses/${alert.horseId}` : (alert.href || "/health")}>
                    <div className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      alert.severity === "urgent"
                        ? "border-red-500/25 bg-red-500/5 hover:bg-red-500/10"
                        : "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${alert.severity === "urgent" ? "text-red-400" : "text-amber-400"}`} />
                        <p className="text-xs font-medium leading-snug">{alert.title}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        );
      })()}

      {/* ── Getting Started (shown when user has no horses yet) ───── */}
      {(horses as any[]).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-950/40">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Getting Started
              </CardTitle>
              <CardDescription className="text-[11px]">
                Welcome! Complete these steps to set up your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/horses/new">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                    <p className="text-xs font-medium">Add your first horse</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </Link>
              <Link href="/documents">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <p className="text-xs font-medium">Upload a document or photo</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </Link>
              <Link href="/calendar">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-xs font-medium">Schedule your first event</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </Link>
              <Link href="/settings">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-xs font-medium">Set your location for weather</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </Link>
              <Link href="/contacts">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <p className="text-xs font-medium">Add your vet or farrier</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Two-column live view ──────────────────────────────── */}
      {/* Today card — hidden when no events scheduled */}
      {(calendarEvents.length > 0 || futureAppointments.some((a: any) => new Date(a.appointmentDate).toDateString() === todayDateString)) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
        >
          <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                Today
              </CardTitle>
              <CardDescription className="text-[11px]">
                {today.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {calendarEvents.slice(0, 3).map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-purple-500/15 bg-purple-500/5"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {event.eventType}
                      </p>
                    </div>
                  </div>
                ))}
                {futureAppointments.slice(0, 2).map((appt: any) => {
                  const d = new Date(appt.appointmentDate);
                  const isToday =
                    d.toDateString() === todayDateString;
                  if (!isToday) return null;
                  return (
                    <div
                      key={appt.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-muted/30 bg-muted/20"
                    >
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {appt.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {appt.appointmentType || "Appointment"}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Link href="/calendar">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 h-7"
                  >
                    View calendar <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming — today & tomorrow only, hidden when empty */}
      {futureAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
        >
          <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Upcoming
              </CardTitle>
              <CardDescription className="text-[11px]">Today & tomorrow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {futureAppointments.map((appt: any) => {
                  const d = new Date(appt.appointmentDate);
                  const isToday =
                    d.toDateString() === todayDateString;
                  return (
                    <div
                      key={appt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${isToday ? "border-purple-500/25 bg-purple-500/5" : "border-muted/30 bg-muted/20"}`}
                    >
                      <div className="text-center shrink-0 w-8">
                        <p className="text-[9px] text-muted-foreground font-medium uppercase leading-none">
                          {d.toLocaleDateString("en-GB", { month: "short" })}
                        </p>
                        <p className="text-sm font-bold leading-tight">
                          {d.getDate()}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">
                          {appt.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {appt.appointmentType || "Appointment"}
                        </p>
                      </div>
                      {isToday && (
                        <Badge className="text-[9px] h-4 px-1.5 bg-purple-500/20 text-purple-300 border-purple-500/30 shrink-0">
                          Today
                        </Badge>
                      )}
                    </div>
                  );
                })}
                <Link href="/calendar">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 h-7"
                  >
                    Open calendar <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Horses + Active Tasks ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      >
        {/* Horse Overview */}
        <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                My Horses
              </CardTitle>
              <Link href="/horses/new">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 px-2"
                >
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {horses.length === 0 ? (
              <div className="text-center py-5 text-muted-foreground">
                <Heart className="w-7 h-7 mx-auto mb-2 opacity-25" />
                <p className="text-xs">No horses added yet</p>
                <Link href="/horses/new">
                  <Button variant="ghost" size="sm" className="mt-2 text-xs h-7">
                    Add first horse
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {(horses as any[]).slice(0, 5).map((horse: any) => (
                  <Link key={horse.id} href={`/horses/${horse.id}`}>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-muted/30 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      {horse.photoUrl ? (
                        <img
                          src={horse.photoUrl}
                          alt={horse.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/hero/image6.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-700 to-rose-800 flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-white font-bold">
                            {horse.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {horse.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {horse.breed || "Unknown breed"}
                          {horse.age ? ` · ${horse.age}yr` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    </div>
                  </Link>
                ))}
                {(horses as any[]).length > 5 && (
                  <Link href="/horses">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 h-7"
                    >
                      View all {horses.length} horses{" "}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Active Tasks
              </CardTitle>
              <Link href="/tasks">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 px-2"
                >
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activeTasks.length === 0 ? (
              <div className="text-center py-5 text-muted-foreground">
                <Activity className="w-7 h-7 mx-auto mb-2 opacity-25" />
                <p className="text-xs">No pending tasks</p>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="mt-2 text-xs h-7">
                    Add task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {activeTasks.slice(0, 6).map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-muted/30 bg-muted/20"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${taskPriorityColor(task.priority)}`}
                    />
                    <p className="text-xs font-medium truncate flex-1">
                      {task.title}
                    </p>
                  </div>
                ))}
                {activeTasks.length > 6 && (
                  <Link href="/tasks">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 h-7"
                    >
                      View all tasks <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Training Summary Strip ─────────────────────────────── */}
      {(trainingStats?.totalSessions || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-muted/30 bg-card/60">
            <Dumbbell className="w-4 h-4 shrink-0 text-green-400" />
            <div>
              <p className="text-lg font-bold leading-none">{Math.round((trainingStats?.totalDuration || 0) / 60)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Training hrs logged</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-muted/30 bg-card/60">
            <Stethoscope className="w-4 h-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-lg font-bold leading-none">{stats?.reminderCount || 0}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Health reminders</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Quick Links — desktop-only feature directory ────── */}
      {/* Mobile uses the "More" sheet in the bottom navigation bar instead */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 pb-1 border-b border-white/5">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary/50" />
            <h2 className="font-serif text-base font-semibold">All Features</h2>
            <span className="text-xs text-muted-foreground/70">Your complete toolkit</span>
            {expandableGroupLabels.length > 0 && (
              <button
                onClick={() => {
                  if (allExpanded) {
                    setExpandedGroups(new Set());
                  } else {
                    setExpandedGroups(new Set(expandableGroupLabels));
                  }
                }}
                className="ml-auto text-[11px] text-muted-foreground/55 hover:text-muted-foreground transition-colors"
              >
                {allExpanded ? "Collapse All ↑" : "Expand All ↓"}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {dashboardModuleGroups.map((group) => {
              const isStablePlan =
                user?.role === "admin"
                  ? viewMode === "stable"
                  : subscription?.planTier === "stable";
              const items = group.items.filter((item: any) => {
                if (!isStablePlan && item.stableOnly) return false;
                return true;
              });
              if (items.length === 0) return null;
              const isExpanded = expandedGroups.has(group.label);
              const visibleItems = isExpanded ? items : items.slice(0, FEATURE_LIMIT);
              const hasMore = items.length > FEATURE_LIMIT;
              return (
                <div key={group.label} className="rounded-xl border border-white/[0.07] bg-card/50 p-4 space-y-3 hover:border-white/[0.12] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-sm bg-gradient-to-br ${group.gradient} shrink-0`} />
                      <p className={`text-[11px] font-bold uppercase tracking-widest ${group.labelColor}`}>
                        {group.label}
                      </p>
                    </div>
                    {hasMore && (
                      <button
                        onClick={() => setExpandedGroups((prev) => {
                          const next = new Set(prev);
                          if (isExpanded) next.delete(group.label);
                          else next.add(group.label);
                          return next;
                        })}
                        className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                      >
                        {isExpanded ? "Show less ↑" : `+${items.length - FEATURE_LIMIT} more`}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => { trackVisit(item.path); setLocation(item.path); }}
                          className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 text-center active:scale-95 ${
                            isActive
                              ? "border-primary/40 bg-primary/10 shadow-sm"
                              : "border-white/5 bg-card/60 hover:bg-card hover:border-white/15 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${group.gradient} group-hover:scale-105 transition-transform duration-200`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-[11px] leading-tight font-medium">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
