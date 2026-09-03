// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SkipToContent, useKeyboardNavigation } from "@/components/AccessibilityHelpers";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { CookieConsent } from "@/components/CookieConsent";
import { AcademyProtectedRoute } from "@/components/academy/AcademyProtectedRoute";
import { useAuth } from "@/_core/hooks/useAuth";
import { resolveAcademyDashboard } from "@/lib/productContext";

import AcademyHome from "@/pages/academy/Home";
import AcademyFeatures from "@/pages/academy/Features";
import AcademyPricing from "@/pages/academy/Pricing";
import AcademyAbout from "@/pages/academy/About";
import AcademyContact from "@/pages/academy/Contact";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));
const AcademyDashboard = lazy(() => import("@/pages/AcademyDashboard"));
const AcademyInviteAccept = lazy(() => import("@/pages/AcademyInviteAccept"));
const AcademySettings = lazy(() => import("@/pages/academy/AcademySettings"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));

function PageSpinner() {
  return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
}

function AcademyDashboardRedirect() {
  const { user } = useAuth();
  useEffect(() => window.location.replace(resolveAcademyDashboard(user)), [user]);
  return <PageSpinner />;
}

function AcademyBillingRedirect() {
  useEffect(() => window.location.replace("/api/v1/billing/launch?product=academy&action=home"), []);
  return <PageSpinner />;
}

function AcademyRouter() {
  useKeyboardNavigation();
  useScrollToTop();
  return (
    <>
      <SkipToContent />
      <main id="main-content">
        <Suspense fallback={<PageSpinner />}>
          <Switch>
            <Route path="/academy" component={AcademyHome} />
            <Route path="/academy/features" component={AcademyFeatures} />
            <Route path="/academy/pricing" component={AcademyPricing} />
            <Route path="/academy/about" component={AcademyAbout} />
            <Route path="/academy/contact" component={AcademyContact} />
            <Route path="/school" component={AcademyHome} />
            <Route path="/school/features" component={AcademyFeatures} />
            <Route path="/school/pricing" component={AcademyPricing} />
            <Route path="/school/about" component={AcademyAbout} />
            <Route path="/school/contact" component={AcademyContact} />
            <Route path="/" component={AcademyHome} />
            <Route path="/features" component={AcademyFeatures} />
            <Route path="/pricing" component={AcademyPricing} />
            <Route path="/about" component={AcademyAbout} />
            <Route path="/contact" component={AcademyContact} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/unsubscribe" component={Unsubscribe} />
            <Route path="/academy-invite" component={AcademyInviteAccept} />

            <Route path="/student-dashboard"><AcademyProtectedRoute allow={["rider", "learner", "admin"]}><StudentDashboard /></AcademyProtectedRoute></Route>
            <Route path="/teacher-dashboard"><AcademyProtectedRoute allow={["teacher", "admin"]}><TeacherDashboard /></AcademyProtectedRoute></Route>
            <Route path="/academy-dashboard"><AcademyProtectedRoute allow={["owner", "admin"]}><AcademyDashboard /></AcademyProtectedRoute></Route>
            <Route path="/school-dashboard"><AcademyProtectedRoute allow={["owner", "admin"]}><AcademyDashboard /></AcademyProtectedRoute></Route>
            <Route path="/dashboard"><AcademyProtectedRoute allow={["rider", "learner", "teacher", "owner", "admin"]}><AcademyDashboardRedirect /></AcademyProtectedRoute></Route>
            <Route path="/settings"><AcademyProtectedRoute allow={["rider", "learner", "teacher", "owner", "admin"]}><AcademySettings /></AcademyProtectedRoute></Route>
            <Route path="/billing"><AcademyProtectedRoute allow={["rider", "learner", "teacher", "owner", "admin"]}><AcademyBillingRedirect /></AcademyProtectedRoute></Route>

            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </>
  );
}

export default function AcademyApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AcademyRouter />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
