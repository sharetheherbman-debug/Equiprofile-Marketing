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
import { useState, FormEvent, useEffect } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { motion } from "framer-motion";
import { getCoreProductContext, getProductName } from "@/lib/productContext";

export default function ResetPassword() {
  const product = getCoreProductContext();
  const productName = getProductName(product);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, product }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return null;
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
            <Card className="bg-[#0b1726]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex justify-center mb-2">
                  <img src="/logo.png" alt={productName} className="h-14 w-auto object-contain" />
                </div>
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                  Reset your {product === "academy" ? "EquiProfile Academy " : ""}password
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Enter your new password below
                </CardDescription>
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

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-white">
                        Password reset successful!
                      </h3>
                      <p className="text-sm text-gray-400">
                        You can now log in with your new password.
                      </p>
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base">
                        Go to login
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        New Password
                      </Label>
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
                      <p className="text-xs text-gray-500">
                        At least 8 characters
                      </p>
                    </div>

                    {/* Confirm Password field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                      disabled={isLoading || !token}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset password"
                      )}
                    </Button>

                    <div className="text-center text-sm">
                      <Link
                        href="/login"
                        className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent font-medium hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                      >
                        Back to login
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AuthSplitLayout>
      
      </AuthLayout>
    </>
  );
}
