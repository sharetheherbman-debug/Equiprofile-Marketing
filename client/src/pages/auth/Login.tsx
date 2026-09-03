import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState, FormEvent } from "react";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  ArrowRight,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { AuthLayout } from "@/components/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";
import { trackMeasurementEvent } from "@/analytics";
import {
  getCoreProductContext,
  getProductName,
  isSafeProductRedirect,
  resolveAcademyDashboard,
} from "@/lib/productContext";

/**
 * Login page
 *
 * Step 1: Email input
 * Step 2: Password input + submit
 */
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const product = getCoreProductContext();
  const academy = product === "academy";
  const productName = getProductName(product);

  // Honour ?redirect= param so invite links work correctly.
  // SECURITY: only allow same-origin relative paths (must start with '/' and not '//').
  const redirectParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;
  const postLoginUrl = (() => {
    if (!redirectParam) return null;
    const decoded = decodeURIComponent(redirectParam);
    // Reject anything that looks like an absolute URL or protocol-relative URL
    if (!isSafeProductRedirect(decoded, product)) return null;
    return decoded;
  })();

  // Redirect if already authenticated — honour ?redirect= or go to role-correct destination
  if (isAuthenticated) {
    if (postLoginUrl) {
      setLocation(postLoginUrl);
    } else {
      if (academy) {
        setLocation(resolveAcademyDashboard(user));
      // Admin always goes to the Management admin panel on Management.
      } else if (user?.role === "admin") {
        setLocation("/admin");
      } else {
        let goToStable = false;
        try {
          if (user?.preferences) {
            const prefs = JSON.parse(user.preferences);
            goToStable = prefs?.planTier === "stable" || !!prefs?.bothDashboardsUnlocked;
          }
        } catch { /* ignore */ }
        if (goToStable) setLocation("/stable-dashboard");
        else setLocation("/dashboard");
      }
    }
    return null;
  }

  const handleEmailStep = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setStep(2);
  };

  const handleChangeEmail = () => {
    setStep(1);
    setError("");
  };

  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationResent, setVerificationResent] = useState(false);

  const handlePasswordStep = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          product,
        }),
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            "Too many login attempts from this network. Please wait a few minutes and try again.",
          );
        } else if (data.requiresVerification) {
          setShowVerificationPrompt(true);
        } else {
          setError(data.error || data.message || "Login failed");
        }
        setIsLoading(false);
        return;
      }

      trackMeasurementEvent("login", { method: "email" });

      // Redirect — honour ?redirect= (e.g. from stable invite link), otherwise go to role-correct dashboard
      if (postLoginUrl) {
        // Use URL constructor to guarantee same-origin redirect (satisfies static analysis)
        const safe = new URL(postLoginUrl, window.location.origin);
        if (safe.origin === window.location.origin) {
          window.location.href = safe.href;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        if (academy) {
          window.location.href = data.academyDestination || "/academy/pricing";
        // Admin always lands in the Management admin portal on Management.
        } else if (data.user?.role === "admin") {
          window.location.href = "/admin";
        } else if (data.needsOnboarding) {
          // New users who haven't completed experience selection go to onboarding
          window.location.href = "/onboarding";
        } else {
          const goToStable = data.planTier === "stable" || data.bothDashboardsUnlocked === true;
          window.location.href = goToStable ? "/stable-dashboard" : "/dashboard";
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), product }),
      });
      setVerificationResent(true);
    } catch {
      // silent
    } finally {
      setResendingVerification(false);
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
            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>

            {/* Login Form Card */}
            <Card className="bg-[#0b1726]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 pb-2">
                {/* Brand logo */}
                <div className="flex flex-col items-center gap-1.5 mb-2">
                  <img src="/logo.png" alt={productName} className="h-14 w-auto object-contain" />
                  <span className="text-base font-bold text-white tracking-tight font-serif leading-none">{productName}</span>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-gradient-to-r from-[#3a93b8] to-[#5b8def]" : "bg-white/10"}`}
                  />
                  <div
                    className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-gradient-to-r from-[#3a93b8] to-[#5b8def]" : "bg-white/10"}`}
                  />
                </div>

                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                  Welcome back to {productName}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {step === 1
                    ? "Enter your email to continue"
                    : "Enter your password to sign in"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {showVerificationPrompt ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="h-14 w-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Mail className="h-7 w-7 text-amber-400" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-300">
                      Your email address hasn&apos;t been verified yet. Please check your inbox for the verification link.
                    </p>

                    {verificationResent ? (
                      <div className="bg-green-950/50 border border-green-500/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-300">
                          A new verification link has been sent to your email.
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleResendVerification}
                        disabled={resendingVerification}
                        className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 h-12"
                      >
                        {resendingVerification ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    )}

                    <button
                      onClick={() => {
                        setShowVerificationPrompt(false);
                        setStep(1);
                        setError("");
                      }}
                      className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors py-2"
                    >
                      Try a different account
                    </button>
                  </motion.div>
                ) : (
                <>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      variant="destructive"
                      className="bg-red-950/50 border-red-500/50 backdrop-blur-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleEmailStep}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handlePasswordStep}
                      className="space-y-4"
                    >
                      {/* Show selected email */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-300 truncate">
                          {email}
                        </span>
                        <button
                          type="button"
                          onClick={handleChangeEmail}
                          className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                        >
                          Change
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-white">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            autoFocus
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0b1726]/60 px-2 text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                {/* Register link */}
                <div className="text-center text-sm">
                  <span className="text-gray-400">Don't have an account? </span>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent font-medium hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                  >
                    Create account
                  </Link>
                </div>
                </>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-center text-gray-500 mt-4">
              Secure email/password authentication
            </p>
          </motion.div>
        </AuthSplitLayout>
      </AuthLayout>
    </>
  );
}
