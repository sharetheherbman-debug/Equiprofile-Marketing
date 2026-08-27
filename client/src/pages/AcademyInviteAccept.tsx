import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, GraduationCap, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

function useInviteToken() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  return params.get("token") ?? "";
}

/**
 * Canonical Academy organisation invitation acceptance.
 *
 * The token only identifies an invitation. The server verifies that the signed-in
 * account email matches the invited address before assigning a teacher or student
 * role, so this UI intentionally never treats possession of the URL as authority.
 */
export default function AcademyInviteAccept() {
  const token = useInviteToken();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const acceptMutation = trpc.academy.acceptInvite.useMutation({
    onSuccess: (data) => {
      const destination =
        data.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
      toast.success("Academy invitation accepted.");
      navigate(destination);
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to accept this Academy invitation.");
    },
  });

  useEffect(() => {
    if (!user && token) {
      const redirect = encodeURIComponent(`/academy-invite?token=${token}`);
      navigate(`/login?redirect=${redirect}`);
    }
  }, [navigate, token, user]);

  if (!token) {
    return (
      <InviteStatusCard
        icon={<XCircle className="h-12 w-12 text-destructive" />}
        title="Invalid Academy invitation"
        description="This invitation link does not contain a token. Please use the complete link sent by your Academy."
      />
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md border-amber-200/60 shadow-xl dark:border-amber-900/40">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <GraduationCap className="h-7 w-7" />
          </div>
          <CardTitle className="font-serif text-xl">
            Join EquiProfile Academy
          </CardTitle>
          <CardDescription>
            Confirm your Academy invitation using the account that received it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-muted-foreground">Signed in as</p>
            <p className="mt-1 break-all font-medium">{user.email}</p>
          </div>
          <p className="rounded-md border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your signed-in email must match the address on the invitation. The
            server will verify this before granting any Academy role.
          </p>
          <Button
            className="w-full bg-[#163563] hover:bg-[#0f2849]"
            aria-label="Accept Academy invitation"
            disabled={acceptMutation.isPending}
            onClick={() => acceptMutation.mutate({ token })}
          >
            {acceptMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Accept Academy invitation
          </Button>
          <div className="text-center">
            <Link href="/academy">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Decline — return to Academy
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InviteStatusCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 py-8 text-center">
          <div className="mx-auto flex justify-center">{icon}</div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Link href="/academy">
            <Button variant="outline">Return to Academy</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
