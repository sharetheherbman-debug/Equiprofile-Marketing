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
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useState, FormEvent } from "react";
import { trackMeasurementEvent } from "@/analytics";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { AuthLayout } from "@/components/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";

/**
 * Register page
 *
 * Step 1: Full name input
 * Step 2: Email input
 * Step 3: Password input
 * Step 4: Confirm password + Terms
 *
 * Plan selection (Standard vs Stable) has been moved to the post-login
 * onboarding wizard, so registration is now always 4 steps.
 *
 * Supports ?plan=pro&interval=monthly|yearly from the Pricing page:
 * after successful signup the user is automatically sent to Stripe checkout.
 */
export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  const [verificationSent, setVerificationSent] = useState(false);

  // Detect subscription intent from query params (set by Pricing page)
  const searchParams = new URLSearchParams(window.location.search);
  const intentPlan = searchParams.get("plan"); // e.g. "pro"
  const intentInterval =
    (searchParams.get("interval") as "monthly" | "yearly") || "monthly";
  const hasSubscribeIntent =
    !!intentPlan &&
    (intentInterval === "monthly" || intentInterval === "yearly");

  const createCheckout = trpc.billing.createCheckout.useMutation();
  const [checkoutRedirecting, setCheckoutRedirecting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && !checkoutRedirecting) {
    if (hasSubscribeIntent) {
      // Logged-in user reached register with a plan intent → go to checkout.
      // Set redirecting flag first so we render a loading state instead of
      // triggering the mutation again on the next render.
      setCheckoutRedirecting(true);
      createCheckout
        .mutateAsync({
          plan: intentPlan === "stable" ? "stable" : ("pro" as const),
          interval: intentInterval,
        })
        .then((r) => {
          if (r.url) window.location.href = r.url;
          else setLocation("/dashboard");
        })
        .catch(() => setLocation("/dashboard"));
      // Fall through and show a brief loading UI below
    } else {
      // Route to the correct dashboard based on planTier
      let destination = "/dashboard";
      try {
        if (user?.preferences) {
          const prefs = JSON.parse(user.preferences);
          if (prefs.planTier === "stable" || prefs.bothDashboardsUnlocked) {
            destination = "/stable-dashboard";
          }
        }
      } catch { /* ignore */ }
      setLocation(destination);
      return null;
    }
  }

  if (checkoutRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1726]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Preparing checkout…</p>
        </div>
      </div>
    );
  }

  const handleNameStep = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    setStep(2);
  };

  const handleEmailStep = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setStep(3);
  };

  const handleChangeName = () => {
    setStep(1);
    setError("");
  };

  const handleChangeEmail = () => {
    setStep(2);
    setError("");
  };

  const handlePasswordStep = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setStep(4);
  };

  const handleChangePassword = () => {
    setStep(3);
    setError("");
  };

  const handleEmailRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Proceed with registration (plan selection moved to onboarding)
    await performRegistration();
  };

  const performRegistration = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name,
        }),
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If re-submitting with an unverified email, show verification state
        if (data.requiresVerification) {
          setVerificationSent(true);
          setIsLoading(false);
          return;
        }
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      trackMeasurementEvent("sign_up", { method: "email" });

      // New flow: backend returns requiresVerification=true, show verification screen
      if (data.requiresVerification) {
        setVerificationSent(true);
        setIsLoading(false);
        return;
      }

      // Fallback: If the user came from the Pricing page with a plan intent, redirect to
      // Stripe checkout.  Otherwise go to experience selection.
      if (hasSubscribeIntent) {
        try {
          const checkout = await createCheckout.mutateAsync({
            plan: intentPlan === "stable" ? "stable" : ("pro" as const),
            interval: intentInterval,
          });
          if (checkout.url) {
            window.location.href = checkout.url;
            return;
          }
        } catch {
          // checkout failed – fall through to experience selection
        }
      }

      // New users must choose their experience (Standard vs Stable) before landing on a dashboard
      window.location.href = "/onboarding";
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const stepLabels = ["Name", "Email", "Password", "Confirm"];

  // Show verification email sent screen
  if (verificationSent) {
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
                    <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-indigo-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                    Check Your Email
                  </CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    We&apos;ve sent a verification link to <span className="text-white font-medium">{email}</span>.
                    Please click the link to verify your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-400 space-y-2">
                    <p>• The link will expire in 24 hours</p>
                    <p>• Check your spam/junk folder if you don&apos;t see it</p>
                    <p>• Make sure <span className="text-gray-300">noreply@equiprofile.online</span> is whitelisted</p>
                  </div>

                  <Button
                    onClick={async () => {
                      try {
                        await fetch("/api/auth/resend-verification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: email.trim().toLowerCase() }),
                        });
                        setError("");
                      } catch {
                        // silent
                      }
                    }}
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 h-12"
                  >
                    Resend Verification Email
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-400">Already verified? </span>
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent font-medium hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                    >
                      Sign in
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

            {/* Dark Glass Form Card */}
            <Card className="bg-[#0b1726]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 pb-2">
                {/* Brand logo */}
                <div className="flex flex-col items-center gap-1.5 mb-2">
                  <img src="/logo.png" alt="EquiProfile" className="h-14 w-auto object-contain" />
                  <span className="text-base font-bold text-white tracking-tight font-serif leading-none">EquiProfile</span>
                </div>

                {/* Step progress indicator */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4].map(
                    (s) => (
                      <div
                        key={s}
                        className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${step >= s ? "bg-gradient-to-r from-[#3a93b8] to-[#5b8def]" : "bg-white/10"}`}
                      />
                    ),
                  )}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-xs text-gray-500">
                    Step {step} of 4 —{" "}
                    <span className="text-gray-400">
                      {stepLabels[step - 1]}
                    </span>
                  </span>
                </div>

                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                  Create an account
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {step === 1
                    ? "Let's start with your name"
                    : step === 2
                      ? "What's your email address?"
                      : step === 3
                        ? "Create a secure password"
                        : "Confirm your password"}
                </CardDescription>
                {hasSubscribeIntent && (
                  <p className="text-xs text-center text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 rounded-lg px-3 py-2 mt-2">
                    After signup you'll be taken to checkout for the{" "}
                    <strong className="text-indigo-200">
                      Pro {intentInterval}
                    </strong>{" "}
                    plan.
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
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
                      onSubmit={handleNameStep}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                  ) : step === 2 ? (
                    <motion.form
                      key="step2"
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

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChangeName}
                          className="flex-1 border-white/10 text-white hover:bg-white/10 h-12 text-base"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.form>
                  ) : step === 3 ? (
                    <motion.form
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handlePasswordStep}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          At least 8 characters
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChangeEmail}
                          className="flex-1 border-white/10 text-white hover:bg-white/10 h-12 text-base"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleEmailRegister}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-white"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoFocus
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms"
                          className="mt-1 border-white/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#3a93b8] data-[state=checked]:to-[#5b8def]"
                          checked={acceptTerms}
                          onCheckedChange={(checked) =>
                            setAcceptTerms(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm font-normal cursor-pointer leading-relaxed text-gray-300"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChangePassword}
                          className="flex-1 border-white/10 text-white hover:bg-white/10 h-12 text-base"
                          disabled={isLoading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </div>
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

                {/* Login link */}
                <div className="text-center text-sm">
                  <span className="text-gray-400">
                    Already have an account?{" "}
                  </span>
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent font-medium hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-gray-500 mt-4">
              Start your{" "}
              <strong className="text-gray-400">7-day free trial</strong> - no
              credit card required
            </p>
          </motion.div>
        </AuthSplitLayout>
      
      </AuthLayout>
    </>
  );
}
