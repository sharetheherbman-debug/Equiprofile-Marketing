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
import { Link } from "wouter";
import { useState, FormEvent } from "react";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
} from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { motion } from "framer-motion";
import { getCoreProductContext, getProductName } from "@/lib/productContext";

export default function ForgotPassword() {
  const product = getCoreProductContext();
  const productName = getProductName(product);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), product }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
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
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>

            <Card className="bg-[#0b1726]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex justify-center mb-2">
                  <img src="/logo.png" alt={productName} className="h-14 w-auto object-contain" />
                </div>
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                  {product === "academy" ? "EquiProfile Academy password help" : "Forgot password?"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Enter your email and we'll send you a reset link
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
                        Check your email
                      </h3>
                      <p className="text-sm text-gray-400">
                        If an account exists with that email, we've sent
                        password reset instructions.
                      </p>
                    </div>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/10 h-12 text-base"
                      >
                        Back to login
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email field */}
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
                          disabled={isLoading}
                          required
                          autoFocus
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 text-base transition-all duration-200 pl-10"
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0 shadow-lg shadow-[#5b8def]/20 h-12 text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-gray-400">
                        Remember your password?{" "}
                      </span>
                      <Link
                        href="/login"
                        className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent font-medium hover:from-indigo-300 hover:to-cyan-300 transition-all duration-200"
                      >
                        Sign in
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
