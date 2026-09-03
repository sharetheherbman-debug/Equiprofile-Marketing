import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { AuthLayout } from "@/components/AuthLayout";
import { motion } from "framer-motion";
import { getCoreProductContext } from "@/lib/productContext";

/**
 * Email verification page — handles the token from the verification link.
 * Also shows resend flow if the token is expired.
 */
export default function VerifyEmail() {
  const product = getCoreProductContext();
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [, setLocation] = useLocation();

  // Extract token from URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check the link in your email.");
      return;
    }

    // Verify the token
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, product }),
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            // If user hasn't chosen an experience, send to onboarding
            if (product === "academy") {
              window.location.href = data.academyDestination || "/academy/pricing";
            } else if (data.needsOnboarding) {
              window.location.href = "/onboarding";
            } else if (data.planTier === "student") {
              window.location.href = "/student-dashboard";
            } else if (data.planTier === "teacher") {
              window.location.href = "/teacher-dashboard";
            } else if (data.planTier === "stable" || data.bothDashboardsUnlocked === true) {
              window.location.href = "/stable-dashboard";
            } else {
              window.location.href = "/dashboard";
            }
          }, 3000);
        } else {
          const isExpired = data.error?.toLowerCase().includes("expired");
          setStatus(isExpired ? "expired" : "error");
          setMessage(data.error || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred. Please try again.");
      });
  }, [token, product]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim().toLowerCase(), product }),
      });

      const data = await res.json();
      if (res.ok) {
        setResendSent(true);
      } else {
        setMessage(data.error || "Failed to resend verification email.");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
      
        <AuthSplitLayout>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-[#0b1726]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex justify-center mb-4">
                  {status === "verifying" && (
                    <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                    </div>
                  )}
                  {status === "success" && (
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                  )}
                  {(status === "error" || status === "expired") && (
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                  )}
                </div>

                <CardTitle className="text-2xl font-bold text-center text-white">
                  {status === "verifying" && "Verifying your email..."}
                  {status === "success" && "Email Verified!"}
                  {status === "error" && "Verification Failed"}
                  {status === "expired" && "Link Expired"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {message}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {status === "success" && (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-400">
                      Redirecting you to get started...
                    </p>
                    <Link
                      href="/onboarding"
                      className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Choose Your Experience
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {(status === "expired" || status === "error") && !resendSent && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400 text-center">
                      Enter your email to receive a new verification link:
                    </p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base rounded-lg pl-10 pr-4 outline-none transition-all duration-200"
                      />
                    </div>
                    <Button
                      onClick={handleResend}
                      disabled={resendLoading || !resendEmail}
                      className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 h-12"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Verification Email"
                      )}
                    </Button>
                  </div>
                )}

                {resendSent && (
                  <div className="text-center space-y-3">
                    <div className="h-12 w-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-300">
                      A new verification link has been sent. Please check your inbox.
                    </p>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AuthSplitLayout>
      
      </AuthLayout>
    </>
  );
}
