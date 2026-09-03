// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminViewProvider, useAdminViewMode } from "@/contexts/AdminViewContext";
import {
  SkipToContent,
  useKeyboardNavigation,
} from "@/components/AccessibilityHelpers";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { ProtectedRoute, StableRoute, StudentRoute, TeacherRoute } from "@/components/ProtectedRoute";
import { SalesChatWidget } from "@/components/SalesChatWidget";
import { CookieConsent } from "@/components/CookieConsent";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { getUIVersion } from "@/config/uiVersion";

// School Marketing Pages
import SchoolHome from "@/pages/school/Home";
import SchoolFeatures from "@/pages/school/Features";
import SchoolPricing from "@/pages/school/Pricing";
import SchoolAbout from "@/pages/school/About";
import SchoolContact from "@/pages/school/Contact";

// Shared public pages
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

// Auth Pages — kept eager so login/register loads instantly
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

// App Pages (Protected) — lazy-loaded to reduce initial bundle size
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Horses = lazy(() => import("@/pages/Horses"));
const HorseForm = lazy(() => import("@/pages/HorseForm"));
const HorseDetail = lazy(() => import("@/pages/HorseDetail"));
const Health = lazy(() => import("@/pages/Health"));
const Training = lazy(() => import("@/pages/Training"));
const Feeding = lazy(() => import("@/pages/Feeding"));
const Weather = lazy(() => import("@/pages/Weather"));
const Documents = lazy(() => import("@/pages/Documents"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const Contacts = lazy(() => import("@/pages/Contacts"));
const Admin = lazy(() => import("@/pages/Admin"));
const QAChecklist = lazy(() => import("@/pages/QAChecklist"));
const Stable = lazy(() => import("@/pages/Stable"));
const StableDashboard = lazy(() => import("@/pages/StableDashboard"));
const Messages = lazy(() => import("@/pages/Messages"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Reports = lazy(() => import("@/pages/Reports"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const AIChat = lazy(() => import("@/pages/AIChat"));
const TrainingTemplates = lazy(() => import("@/pages/TrainingTemplates"));
const BreedingManagement = lazy(() => import("@/pages/BreedingManagement"));
const LessonScheduling = lazy(() => import("@/pages/LessonScheduling"));
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const Settings = lazy(() => import("@/pages/Settings"));
const CentralBillingRedirect = lazy(() => import("@/pages/CentralBillingRedirect"));

// Additional Health & Management Pages
const Appointments = lazy(() => import("@/pages/Appointments"));
const NutritionLogs = lazy(() => import("@/pages/NutritionLogs"));
const NutritionPlans = lazy(() => import("@/pages/NutritionPlans"));
const Hoofcare = lazy(() => import("@/pages/Hoofcare"));
const Xrays = lazy(() => import("@/pages/Xrays"));
const Treatments = lazy(() => import("@/pages/Treatments"));
const Vaccinations = lazy(() => import("@/pages/Vaccinations"));
const DentalCare = lazy(() => import("@/pages/DentalCare"));
const Dewormings = lazy(() => import("@/pages/Dewormings"));
const Tags = lazy(() => import("@/pages/Tags"));
const FeedCostTracking = lazy(() => import("@/pages/FeedCostTracking"));
const RideTracking = lazy(() => import("@/pages/RideTracking"));
const EquinePassport = lazy(() => import("@/pages/EquinePassport"));
const PassportView = lazy(() => import("@/pages/PassportView"));
const StableInviteAccept = lazy(() => import("@/pages/StableInviteAccept"));
const StableStaff = lazy(() => import("@/pages/StableStaff"));
const StableSetup = lazy(() => import("@/pages/StableSetup"));
const StableReports = lazy(() => import("@/pages/StableReports"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Competitions = lazy(() => import("@/pages/Competitions"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));
const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));
const SchoolDashboard = lazy(() => import("@/pages/SchoolDashboard"));

// V2 Frontend Pages — lazy-loaded for code splitting
const DashboardV2 = lazy(() => import("@/v2/pages/DashboardV2"));
const StableDashboardV2 = lazy(() => import("@/v2/pages/StableDashboardV2"));

// Minimal spinner shown while lazy chunks load (doesn't block FCP)
function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SchoolRouter() {
  useKeyboardNavigation();
  useScrollToTop();
  const upgradeModal = useUpgradeModal();
  const uiVersion = getUIVersion();
  const { viewMode, isAdmin } = useAdminViewMode();

  // Version-aware dashboard selection
  const ActiveDashboard = uiVersion === "v2" ? DashboardV2 : Dashboard;
  const ActiveStableDashboard = uiVersion === "v2" ? StableDashboardV2 : StableDashboard;

  // Admin view mode resolution
  const ResolvedDashboard = (() => {
    if (!isAdmin || !viewMode || viewMode === "admin" || viewMode === "pro") {
      return ActiveDashboard;
    }
    if (viewMode === "stable") return ActiveStableDashboard;
    if (viewMode === "student") return StudentDashboard;
    if (viewMode === "teacher") return TeacherDashboard;
    return ActiveDashboard;
  })();

  return (
    <>
      <SkipToContent />
      <UpgradeModal
        open={upgradeModal.isOpen}
        onClose={upgradeModal.close}
        reason={upgradeModal.reason}
        message={upgradeModal.message}
      />
      <main id="main-content">
        <Suspense fallback={<PageSpinner />}>
          <Switch>
            {/* School Marketing Pages (Public) */}
            <Route path="/" component={SchoolHome} />
            <Route path="/features" component={SchoolFeatures} />
            <Route path="/pricing" component={SchoolPricing} />
            <Route path="/about" component={SchoolAbout} />
            <Route path="/contact" component={SchoolContact} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />

            {/* Auth Pages */}
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/unsubscribe" component={Unsubscribe} />

            {/* Onboarding — experience selection for new users */}
            <Route path="/onboarding">
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            </Route>

            {/* Student Dashboard — student plan users and admin */}
            <Route path="/student-dashboard">
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            </Route>

            {/* Teacher Dashboard — teacher plan users and admin */}
            <Route path="/teacher-dashboard">
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            </Route>

            {/* School Dashboard — school_owner plan users */}
            <Route path="/school-dashboard">
              <ProtectedRoute>
                <SchoolDashboard />
              </ProtectedRoute>
            </Route>

            {/* Dashboard — version-aware with admin view mode */}
            <Route path="/dashboard">
              <ProtectedRoute>
                <ResolvedDashboard />
              </ProtectedRoute>
            </Route>

            {/* Horse management */}
            <Route path="/horses">
              <ProtectedRoute>
                <Horses />
              </ProtectedRoute>
            </Route>
            <Route path="/horses/new">
              <ProtectedRoute>
                <HorseForm />
              </ProtectedRoute>
            </Route>
            <Route path="/horses/:id/edit">
              <ProtectedRoute>
                <HorseForm />
              </ProtectedRoute>
            </Route>
            <Route path="/horses/:id">
              <ProtectedRoute>
                <HorseDetail />
              </ProtectedRoute>
            </Route>

            {/* Health records */}
            <Route path="/health">
              <ProtectedRoute>
                <Health />
              </ProtectedRoute>
            </Route>
            <Route path="/vaccinations">
              <ProtectedRoute>
                <Vaccinations />
              </ProtectedRoute>
            </Route>
            <Route path="/dental">
              <ProtectedRoute>
                <DentalCare />
              </ProtectedRoute>
            </Route>
            <Route path="/hoofcare">
              <ProtectedRoute>
                <Hoofcare />
              </ProtectedRoute>
            </Route>
            <Route path="/dewormings">
              <ProtectedRoute>
                <Dewormings />
              </ProtectedRoute>
            </Route>
            <Route path="/treatments">
              <ProtectedRoute>
                <Treatments />
              </ProtectedRoute>
            </Route>
            <Route path="/xrays">
              <ProtectedRoute>
                <Xrays />
              </ProtectedRoute>
            </Route>

            {/* Training */}
            <Route path="/training">
              <ProtectedRoute>
                <Training />
              </ProtectedRoute>
            </Route>
            <Route path="/training-templates">
              <ProtectedRoute>
                <TrainingTemplates />
              </ProtectedRoute>
            </Route>

            {/* Feeding & Nutrition */}
            <Route path="/feeding">
              <ProtectedRoute>
                <Feeding />
              </ProtectedRoute>
            </Route>
            <Route path="/nutrition-plans">
              <ProtectedRoute>
                <NutritionPlans />
              </ProtectedRoute>
            </Route>
            <Route path="/nutrition-logs">
              <ProtectedRoute>
                <NutritionLogs />
              </ProtectedRoute>
            </Route>

            {/* Weather */}
            <Route path="/weather">
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            </Route>

            {/* Documents */}
            <Route path="/documents">
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            </Route>

            {/* Tasks */}
            <Route path="/tasks">
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            </Route>

            {/* Contacts */}
            <Route path="/contacts">
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            </Route>

            {/* Calendar & Appointments */}
            <Route path="/calendar">
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            </Route>
            <Route path="/appointments">
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            </Route>

            {/* Reports & Analytics */}
            <Route path="/reports">
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            </Route>
            <Route path="/analytics">
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            </Route>

            {/* Stable Management */}
            <Route path="/stable">
              <StableRoute>
                <Stable />
              </StableRoute>
            </Route>
            <Route path="/stable-dashboard">
              <StableRoute>
                <ActiveStableDashboard />
              </StableRoute>
            </Route>
            <Route path="/staff">
              <StableRoute>
                <StableStaff />
              </StableRoute>
            </Route>
            <Route path="/stable-setup">
              <StableRoute>
                <StableSetup />
              </StableRoute>
            </Route>
            <Route path="/stable-reports">
              <StableRoute>
                <StableReports />
              </StableRoute>
            </Route>

            {/* Breeding Management */}
            <Route path="/breeding">
              <StableRoute>
                <BreedingManagement />
              </StableRoute>
            </Route>

            {/* Lesson Scheduling */}
            <Route path="/lessons">
              <StableRoute>
                <LessonScheduling />
              </StableRoute>
            </Route>

            {/* Feed Cost Tracking */}
            <Route path="/feed-costs">
              <ProtectedRoute>
                <FeedCostTracking />
              </ProtectedRoute>
            </Route>

            {/* GPS Ride Tracking */}
            <Route path="/ride-tracking">
              <ProtectedRoute>
                <RideTracking />
              </ProtectedRoute>
            </Route>

            {/* Equine Passport */}
            <Route path="/equine-passport">
              <ProtectedRoute>
                <EquinePassport />
              </ProtectedRoute>
            </Route>

            {/* Competitions */}
            <Route path="/competitions">
              <ProtectedRoute>
                <Competitions />
              </ProtectedRoute>
            </Route>

            {/* Tags */}
            <Route path="/tags">
              <ProtectedRoute>
                <Tags />
              </ProtectedRoute>
            </Route>

            {/* Settings */}
            <Route path="/settings">
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </Route>

            {/* Billing */}
            <Route path="/billing">
              <ProtectedRoute>
                <CentralBillingRedirect />
              </ProtectedRoute>
            </Route>

            {/* Messaging */}
            <Route path="/messages">
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            </Route>

            {/* AI Chat */}
            <Route path="/ai-chat">
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            </Route>

            {/* Client Portal */}
            <Route path="/client-portal">
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            </Route>

            {/* Admin panel - requires admin role */}
            <Route path="/admin">
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            </Route>

            {/* QA Checklist - requires admin role */}
            <Route path="/qa-check">
              <ProtectedRoute requireAdmin>
                <QAChecklist />
              </ProtectedRoute>
            </Route>

            {/* Public horse passport — accessible without login (QR scan) */}
            <Route path="/passport/:token" component={PassportView} />

            {/* Stable team invite acceptance */}
            <Route path="/stable-invite" component={StableInviteAccept} />

            {/* 404 */}
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </>
  );
}

export default function SchoolApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AdminViewProvider>
          <TooltipProvider>
            <Toaster />
            <SchoolRouter />
            <SalesChatWidget />
            <PWAInstallPrompt />
            <CookieConsent />
          </TooltipProvider>
        </AdminViewProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
