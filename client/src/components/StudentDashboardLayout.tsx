/**
 * StudentDashboardLayout — isolated layout for student plan users.
 *
 * Entirely separate from DashboardLayout / Pro nav. Student-specific sidebar,
 * topbar with dark/light toggle and logout. Mobile responsive.
 *
 * When an admin user enters this layout (via Admin → Portals), an
 * "Admin Viewing" banner is shown at the top with a back-to-admin button.
 */
import { ReactNode, useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  Brain,
  TrendingUp,
  Zap,
  LogOut,
  Menu,
  X,
  Settings,
  CreditCard,
  Library,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrialBanner } from "@/components/TrialBanner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAdminViewMode } from "@/contexts/AdminViewContext";

export type StudentView =
  | "overview"
  | "learning-path"
  | "practice"
  | "assignments"
  | "ai-tutor"
  | "progress"
  | "settings";

interface StudentNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  view: StudentView;
}

interface StudentDashboardLayoutProps {
  children: ReactNode;
  activeView: StudentView;
  onNavigate: (view: StudentView) => void;
}

const studentNavItems: StudentNavItem[] = [
  { icon: LayoutDashboard, label: "Home", view: "overview" },
  { icon: Library, label: "Learning Path", view: "learning-path" },
  { icon: Zap, label: "Practice", view: "practice" },
  { icon: ClipboardList, label: "Assignments", view: "assignments" },
  { icon: TrendingUp, label: "Progress", view: "progress" },
  { icon: Brain, label: "AI Tutor", view: "ai-tutor" },
];

function SidebarNav({
  activeView,
  onNavigate,
  onClose,
}: {
  activeView: StudentView;
  onNavigate: (view: StudentView) => void;
  onClose?: () => void;
}) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: subscriptionStatus } = trpc.billing.getStatus.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 },
  );
  const isSchoolManaged = (subscriptionStatus as any)?.schoolId != null;

  const handleLogout = async () => {
    // logout() from useAuth handles the API call, cache clear, and redirect.
    await logout();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a2435]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button type="button" onClick={() => { onNavigate("overview"); onClose?.(); }} className="flex items-center gap-2.5 min-w-0 text-left" aria-label="EquiProfile Academy student dashboard">
        <div className="w-8 h-8 rounded-lg bg-[#2e6da4] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate block font-serif">
            EquiProfile Academy
          </span>
          <span className="text-[10px] text-[#2e6da4] font-semibold uppercase tracking-wider">
            Student Portal
          </span>
        </div>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
          Learning
        </p>
        {studentNavItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all text-left ${
                isActive
                  ? "bg-[#2e6da4]/10 text-[#2e6da4] dark:bg-[#2e6da4]/20 dark:text-[#5b9bd5]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2e6da4] dark:text-[#5b9bd5]" : "text-gray-400 dark:text-gray-500"}`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Account section */}
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2 mt-5">
          Account
        </p>
        <button
          onClick={() => { onNavigate("settings"); onClose?.(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all text-left ${
            activeView === "settings"
              ? "bg-[#2e6da4]/10 text-[#2e6da4] dark:bg-[#2e6da4]/20 dark:text-[#5b9bd5]"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
          <span>Settings</span>
        </button>
        {!isSchoolManaged && (
          <button
            onClick={() => { window.location.href = "/api/v1/billing/launch?product=academy&action=home"; onClose?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all text-left"
          >
            <CreditCard className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
            <span>Billing</span>
          </button>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
          <Avatar className="h-8 w-8 ring-2 ring-[#2e6da4]/15 shrink-0">
            <AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.name ?? ""} />
            <AvatarFallback className="text-xs font-semibold bg-[#2e6da4]/10 text-[#2e6da4]">
              {user?.name?.charAt(0).toUpperCase() ?? "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-none">
              {user?.name || "Student"}
            </p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminViewIndicator() {
  const [, setLocation] = useLocation();
  const { exitViewMode } = useAdminViewMode();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200 shrink-0">
      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
      <span className="text-xs font-semibold text-amber-700">
        Admin Preview — Student Portal
      </span>
      <div className="flex-1" />
      <button
        onClick={() => { exitViewMode(); setLocation("/admin"); }}
        className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Back to Admin
      </button>
    </div>
  );
}

export default function StudentDashboardLayout({
  children,
  activeView,
  onNavigate,
}: StudentDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: subscriptionStatus } = trpc.billing.getStatus.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 },
  );

  const viewLabels: Record<StudentView, string> = {
    overview: "Student Dashboard",
    "learning-path": "Learning Path",
    practice: "Practice",
    assignments: "Assignments",
    "ai-tutor": "AI Tutor",
    progress: "Progress",
    settings: "Settings",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f3] dark:bg-[#111827]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 shrink-0 border-r border-gray-200 dark:border-gray-800">
        <SidebarNav activeView={activeView} onNavigate={onNavigate} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav
          activeView={activeView}
          onNavigate={onNavigate}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isAdmin && <AdminViewIndicator />}

        {subscriptionStatus && !isAdmin && <TrialBanner />}

        {/* Topbar */}
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1a2435]/80 backdrop-blur-lg">
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-2 md:ml-0 ml-2">
            <GraduationCap className="w-4 h-4 text-[#2e6da4] hidden md:block" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {viewLabels[activeView]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
