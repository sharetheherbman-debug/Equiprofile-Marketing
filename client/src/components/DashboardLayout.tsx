import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  CircleDot,
  Heart,
  Activity,
  Utensils,
  Cloud,
  FileText,
  Settings,
  Shield,
  MessageSquare,
  ListChecks,
  Baby,
  Calendar,
  Users,
  MoreHorizontal,
  Dumbbell,
  Apple,
  BarChart3,
  DollarSign,
  Stethoscope,
  Syringe,
  Scissors,
  Pill,
  XCircle,
  GitBranch,
  BookOpen,
  Tag,
  Clock,
  Brain,
  Home,
  Building2,
  UserCog,
  Navigation,
  ShoppingCart,
  Wrench,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationCenter } from "./NotificationCenter";
import { TrialBanner } from "./TrialBanner";
import { useAdminViewMode } from "@/contexts/AdminViewContext";
import {
  parseManagementPreferences,
  resolveEffectiveManagementEntitlement,
} from "@shared/managementEntitlement";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CircleDot, label: "My Horses", path: "/horses" },
  { icon: Heart, label: "Health Records", path: "/health" },
  { icon: Utensils, label: "Feeding Plans", path: "/feeding" },
  { icon: Activity, label: "Training", path: "/training" },
  { icon: Cloud, label: "Weather", path: "/weather" },
  { icon: Brain, label: "AI Chat", path: "/ai-chat" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: ListChecks, label: "Tasks", path: "/tasks" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: BookOpen, label: "Reports", path: "/reports" },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: DollarSign, label: "Billing", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const stableNavItems = [
  { icon: Building2, label: "Stable Dashboard", path: "/stable-dashboard" },
  { icon: CircleDot, label: "Horses", path: "/horses" },
  { icon: UserCog, label: "Staff", path: "/staff" },
  { icon: Users, label: "Owners & Clients", path: "/contacts" },
  { icon: Calendar, label: "Yard Calendar", path: "/calendar" },
  { icon: Activity, label: "Training", path: "/training" },
  { icon: Heart, label: "Health Records", path: "/health" },
  { icon: ListChecks, label: "Tasks", path: "/tasks" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: BarChart3, label: "Reports", path: "/stable-reports" },
  { icon: Brain, label: "AI Chat", path: "/ai-chat" },
  { icon: Cloud, label: "Weather", path: "/weather" },
  { icon: Home, label: "Stable Profile", path: "/stable" },
  { icon: Wrench, label: "Stable Setup", path: "/stable-setup" },
  { icon: DollarSign, label: "Billing", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminMenuItems = [
  { icon: Shield, label: "Admin Panel", path: "/admin" },
];

const standardBottomNavItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: CircleDot, label: "Horses", path: "/horses" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: ListChecks, label: "Tasks", path: "/tasks" },
];

const stableBottomNavItems = [
  { icon: Building2, label: "Stable", path: "/stable-dashboard" },
  { icon: CircleDot, label: "Horses", path: "/horses" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: ListChecks, label: "Tasks", path: "/tasks" },
];

interface MoreModuleItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  path: string;
  stableOnly?: boolean;
  stableOverride?: string;
}
interface MoreModuleGroup {
  label: string;
  stableOnly?: boolean;
  items: MoreModuleItem[];
}

const moreModuleGroups: MoreModuleGroup[] = [
  {
    label: "Core",
    items: [
      { icon: Brain, label: "AI Assistant", path: "/ai-chat" },
      { icon: Cloud, label: "Weather", path: "/weather" },
      { icon: Users, label: "Contacts", path: "/contacts" },
      { icon: Clock, label: "Appointments", path: "/appointments" },
    ],
  },
  {
    label: "Health",
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
    items: [
      { icon: Dumbbell, label: "Training Log", path: "/training" },
      { icon: BookOpen, label: "Templates", path: "/training-templates" },
      { icon: Navigation, label: "GPS Tracking", path: "/ride-tracking" },
      { icon: Trophy, label: "Competitions", path: "/competitions" },
      { icon: Users, label: "Lessons", path: "/lessons", stableOnly: true },
      { icon: Baby, label: "Breeding", path: "/breeding", stableOnly: true },
    ],
  },
  {
    label: "Nutrition",
    items: [
      { icon: Apple, label: "Feeding Plans", path: "/feeding" },
      { icon: FileText, label: "Nutrition Plans", path: "/nutrition-plans" },
      { icon: BookOpen, label: "Nutrition Logs", path: "/nutrition-logs" },
      { icon: ShoppingCart, label: "Feed Costs", path: "/feed-costs" },
    ],
  },
  {
    label: "Data & Reports",
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: FileText, label: "Reports", path: "/reports", stableOverride: "/stable-reports" },
      { icon: Tag, label: "Tags", path: "/tags" },
      { icon: GitBranch, label: "Pedigree", path: "/pedigree" },
      { icon: Shield, label: "Equine Passport", path: "/equine-passport" },
    ],
  },
  {
    label: "Stable & People",
    stableOnly: true,
    items: [
      { icon: Home, label: "Stable Management", path: "/stable", stableOnly: true },
      { icon: Wrench, label: "Stable Setup", path: "/stable-setup", stableOnly: true },
      { icon: UserCog, label: "Staff", path: "/staff", stableOnly: true },
      { icon: Users, label: "Client Portal", path: "/client-portal", stableOnly: true },
      { icon: BarChart3, label: "Stable Reports", path: "/stable-reports", stableOnly: true },
      { icon: MessageSquare, label: "Messages", path: "/messages", stableOnly: true },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
      { icon: DollarSign, label: "Billing", path: "/billing" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">Sign in to continue</h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">Access to this dashboard requires authentication. Continue to launch the login flow.</p>
          </div>
          <Button onClick={() => { window.location.href = getLoginUrl(); }} size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">Sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const { viewMode, exitViewMode, isViewingAs, isAdmin: isAdminView } = useAdminViewMode();
  const isOnline = useOnlineStatus();

  const { data: subscriptionStatus } = trpc.user.getSubscriptionStatus.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const managementPreferences = parseManagementPreferences(user?.preferences);
  const basePlanTier = subscriptionStatus?.planTier === "stable" || managementPreferences.planTier === "stable"
    ? "stable"
    : "pro";
  const managementEntitlement = resolveEffectiveManagementEntitlement(
    {
      subscriptionStatus: subscriptionStatus?.status ?? user?.subscriptionStatus ?? "unknown",
      planTier: basePlanTier,
      bothDashboardsUnlocked: subscriptionStatus?.bothDashboardsUnlocked ?? Boolean(managementPreferences.bothDashboardsUnlocked),
    },
    managementPreferences,
  );
  const isStablePlan = managementEntitlement.effectivePlanTier === "stable";
  const isAdmin = user?.role === "admin";
  const bothDashboardsUnlocked = managementEntitlement.effectiveBothDashboardsUnlocked;
  const effectiveIsStablePlan = isAdmin ? viewMode === "stable" : isStablePlan;
  const effectiveIsAdmin = isAdmin && (!viewMode || viewMode === "admin");
  const dualDashboardEligible = effectiveIsStablePlan && bothDashboardsUnlocked;
  const effectiveBothDashboardsUnlocked = (isAdmin && !!viewMode && viewMode !== "admin") ? false : dualDashboardEligible;
  const isOnStablePages = location.startsWith("/stable");

  const activeNavItems = (() => {
    if (isAdmin && viewMode === "stable") return stableNavItems;
    if (isAdmin && (viewMode === "pro" || viewMode === "student" || viewMode === "teacher")) return menuItems;
    if (isAdmin) return menuItems;
    return effectiveBothDashboardsUnlocked
      ? (isOnStablePages ? stableNavItems : menuItems)
      : (effectiveIsStablePlan ? stableNavItems : menuItems);
  })();

  const bottomNavItems = effectiveBothDashboardsUnlocked
    ? (isOnStablePages ? stableBottomNavItems : standardBottomNavItems)
    : (effectiveIsStablePlan ? stableBottomNavItems : standardBottomNavItems);
  const activeMenuItem = activeNavItems.find((item) => item.path === location);

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-white/5 bg-sidebar" disableTransition={isResizing}>
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button onClick={toggleSidebar} className="h-8 w-8 flex items-center justify-center hover:bg-sidebar-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring shrink-0" aria-label="Toggle navigation">
                <PanelLeft className="h-4 w-4 text-sidebar-foreground/70" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src="/logo.png" alt="EquiProfile" className="h-10 w-auto object-contain shrink-0" />
                  <span className="text-lg font-semibold tracking-tight text-sidebar-foreground truncate">EquiProfile</span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {effectiveBothDashboardsUnlocked && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={!isOnStablePages} onClick={() => setLocation("/dashboard")} tooltip="Standard Dashboard" className={`h-10 transition-all font-medium ${!isOnStablePages ? "bg-sidebar-accent text-white font-semibold" : "text-sidebar-foreground/80"}`}>
                      <LayoutDashboard className="h-4 w-4" /><span>Standard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={isOnStablePages} onClick={() => setLocation("/stable-dashboard")} tooltip="Stable Dashboard" className={`h-10 transition-all font-medium ${isOnStablePages ? "bg-sidebar-accent text-white font-semibold" : "text-sidebar-foreground/80"}`}>
                      <Building2 className="h-4 w-4" /><span>Stable</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <div className="my-2 px-2"><div className="h-px bg-sidebar-border" /></div>
                </>
              )}

              {activeNavItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={item.label} className={`h-10 transition-all font-medium ${isActive ? "bg-sidebar-accent text-white font-semibold" : "text-sidebar-foreground/80 hover:text-white"}`}>
                      <item.icon className="h-4 w-4" /><span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {isAdmin && (
                <>
                  <div className="my-2 px-2"><div className="h-px bg-sidebar-border" /></div>
                  {adminMenuItems.map((item) => {
                    const isActive = location === item.path;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={item.label} className={`h-10 transition-all font-medium ${isActive ? "bg-sidebar-accent text-white font-semibold" : "text-sidebar-foreground/80 hover:text-white"}`}>
                          <item.icon className="h-4 w-4" /><span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <div className="flex items-center justify-between gap-2 px-1 mb-2 group-data-[collapsible=icon]:justify-center">
              <ThemeToggle />
              <NotificationCenter />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-sidebar-accent transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9 border border-sidebar-border">
                      <AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.name ?? ""} />
                      <AvatarFallback className="text-xs font-medium">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span title={isOnline ? "Online" : "Offline"} className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-sidebar ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none text-sidebar-foreground">{user?.name || "-"}</p>
                    <p className="text-xs text-sidebar-foreground/65 truncate mt-1.5">{user?.email || "-"}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /><span>Sign out</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }} style={{ zIndex: 50 }} />
      </div>

      <SidebarInset className="min-w-0 bg-background">
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur-md sticky top-0 z-40" style={{ paddingTop: 'var(--safe-area-top, 0px)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="h-11 w-11 rounded-lg bg-background shrink-0" />
              <span className="tracking-tight text-foreground truncate">{activeMenuItem?.label ?? "Menu"}</span>
            </div>
            <div className="flex items-center gap-1">
              <NotificationCenter />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer ml-1">
                    <Avatar className="h-7 w-7 border"><AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.name ?? ""} /><AvatarFallback className="text-[10px] font-medium">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                    <span title={isOnline ? "Online" : "Offline"} className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-background ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 border-b mb-1"><p className="text-sm font-medium truncate">{user?.name || "-"}</p><p className="text-xs text-muted-foreground truncate">{user?.email || "-"}</p></div>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /><span>Sign out</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-x-hidden relative" style={isMobile ? { paddingBottom: 'calc(5rem + var(--safe-area-bottom, 0px))' } : undefined}>
          {isAdmin && isViewingAs && (
            <div className="flex items-center gap-2 -mx-3 sm:-mx-5 md:-mx-6 px-3 sm:px-5 py-2 mb-4 bg-primary/[0.06] border-b border-primary/20">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-primary shrink-0">Admin Preview — <span className="capitalize">{viewMode}</span> Dashboard</span>
              <div className="flex-1" />
              <button onClick={() => { exitViewMode(); setLocation("/admin"); }} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Shield className="w-3.5 h-3.5" />Back to Admin</button>
            </div>
          )}
          <div className="relative"><TrialBanner />{children}</div>
        </main>

        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" style={{ paddingBottom: 'var(--safe-area-bottom, 0px)' }} aria-label="Mobile navigation">
            <div className="flex items-stretch h-16">
              {bottomNavItems.map((item) => {
                const isActive = location === item.path || (item.path === "/dashboard" && location === "/") || (item.path === "/stable-dashboard" && location === "/");
                const Icon = item.icon;
                return (
                  <button key={item.path} onClick={() => setLocation(item.path)} className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors min-h-[44px] ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} aria-label={item.label} aria-current={isActive ? "page" : undefined}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} /><span className="text-[10px] leading-none">{item.label}</span>
                  </button>
                );
              })}

              <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px]" aria-label="More modules"><MoreHorizontal className="h-5 w-5" /><span className="text-[10px] leading-none">More</span></button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-xl">
                  <SheetHeader className="pb-3">
                    <SheetTitle className="font-serif text-left text-base">All Features</SheetTitle>
                    <SheetDescription className="sr-only">Navigate to any feature in the app</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6" style={{ paddingBottom: 'calc(1.5rem + var(--safe-area-bottom, 0px))' }}>
                    {moreModuleGroups.map((group) => {
                      if (group.stableOnly && !effectiveIsStablePlan && !effectiveIsAdmin) return null;
                      const items = group.items
                        .filter((item) => !(item.stableOnly && !effectiveIsStablePlan && !effectiveIsAdmin))
                        .map((item) => ({
                          ...item,
                          path: effectiveIsStablePlan && item.stableOverride ? item.stableOverride : item.path,
                          label: effectiveIsStablePlan && item.stableOverride ? "Stable Reports" : item.label,
                        }));
                      if (items.length === 0) return null;
                      return (
                        <div key={group.label}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 text-center text-primary">{group.label}</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                            {items.map((item) => {
                              const Icon = item.icon;
                              const isActive = location === item.path;
                              return (
                                <button key={item.path} onClick={() => { setLocation(item.path); setMoreSheetOpen(false); }} className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl border transition-all text-center active:scale-[0.97] min-h-[72px] sm:min-h-[80px] ${isActive ? "border-primary/40 bg-primary/10 text-primary shadow-sm" : "border-border bg-card hover:bg-accent hover:border-primary/25"}`}>
                                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-[#052b57]" : "bg-[#167cc1]"}`}>
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs leading-snug font-medium line-clamp-2">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t">
                      <button onClick={() => { logout(); setMoreSheetOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors"><LogOut className="h-5 w-5 shrink-0" /><span className="text-sm font-medium">Sign Out</span></button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        )}
      </SidebarInset>
    </>
  );
}

export { DashboardLayout };
