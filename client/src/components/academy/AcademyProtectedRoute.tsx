import { type ReactNode, useEffect } from "react";
import { Link } from "wouter";
import { AlertCircle, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

type AcademyAudience = "rider" | "learner" | "teacher" | "owner" | "admin";

export function AcademyProtectedRoute({ children, allow }: { children: ReactNode; allow: AcademyAudience[] }) {
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const entitlement = trpc.academy.getEntitlement.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (authLoading || isAuthenticated || authError) return;
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirect}`;
  }, [authError, authLoading, isAuthenticated]);

  if (authLoading || (isAuthenticated && entitlement.isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking EquiProfile Academy access…</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  if (entitlement.error) {
    return <AcademyAccessState icon="error" title="EquiProfile Academy access is temporarily unavailable" body="We could not confirm your Academy access. Please try again shortly; no account or payment changes have been made." />;
  }
  const access = entitlement.data;
  if (!access?.entitled) {
    return <AcademyAccessState title="An EquiProfile Academy plan or invitation is required" body="Your EquiProfile account is valid, but it does not currently include Academy access. Management access does not automatically unlock Academy." />;
  }
  if (!allow.includes(access.audience as AcademyAudience)) {
    return <AcademyAccessState title="This Academy area is not included in your role" body="Open the dashboard for your Academy role, or contact your Academy organisation owner if your role is incorrect." showPricing={false} />;
  }
  return <>{children}</>;
}

function AcademyAccessState({ title, body, icon = "book", showPricing = true }: { title: string; body: string; icon?: "book" | "error"; showPricing?: boolean }) {
  const Icon = icon === "error" ? AlertCircle : BookOpen;
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#163563]/10"><Icon className="h-7 w-7 text-[#163563]" /></div>
        <h1 className="font-serif text-2xl font-bold text-[#102a43]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {showPricing && <Button asChild><Link href="/academy/pricing">View EquiProfile Academy plans</Link></Button>}
          <Button asChild variant="outline"><Link href="/academy">Academy home</Link></Button>
        </div>
      </div>
    </div>
  );
}
