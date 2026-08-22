import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { FREE_TRIAL_DAYS, SCHOOL_PRICING } from "@shared/pricing";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Crown,
  GraduationCap,
  Users,
  Loader2,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const tierIcons = [Users, GraduationCap, Crown, Building2];
const tierDescriptions = [
  "For riding schools and equestrian organisations with up to 10 students.",
  "For growing riding schools and equestrian organisations with up to 20 students.",
  "For larger riding schools and equestrian organisations with up to 50 students.",
  "For organisations needing more than 50 student seats or a separately agreed commercial plan.",
];

const tierColors = [
  { border: "border-[#3b82f6]", bg: "bg-[#3b82f6]", ring: "ring-[#3b82f6]" },
  { border: "border-[#c5a55a]", bg: "bg-[#c5a55a]", ring: "ring-[#c5a55a]" },
  { border: "border-[#f59e0b]", bg: "bg-[#f59e0b]", ring: "ring-[#f59e0b]" },
  { border: "border-[#163563]", bg: "bg-[#163563]", ring: "ring-[#163563]" },
];

const includedFoundations = [
  "EquiProfile Academy learning experience",
  "Structured lesson pathways",
  "Student and teacher experience foundations",
  "Lesson progress records",
  "Assignments and teacher feedback foundations",
  "Role-aware access through the existing EquiProfile account system",
];

export default function AcademyPricing() {
  const [annual, setAnnual] = useState(false);
  const { user } = useAuth();
  const tiers = SCHOOL_PRICING.tiers;
  const createCheckout = trpc.academy.createBillingCheckout.useMutation({
    onError: (error) => {
      toast.error("Academy TEST checkout is unavailable", {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("academy_billing") === "success") {
      toast.success("Academy TEST checkout completed", {
        description:
          "Subscription activation is confirmed only after the Academy billing webhook processes the Stripe TEST event.",
      });
      window.history.replaceState({}, "", "/academy/pricing");
    } else if (parameters.get("academy_billing") === "cancelled") {
      toast.message(
        "Academy TEST checkout was cancelled. No live charge was made.",
      );
      window.history.replaceState({}, "", "/academy/pricing");
    }
  }, []);

  const startCheckout = (
    planTier: (typeof SCHOOL_PRICING.tiers)[number]["id"],
  ) => {
    if (!user) {
      toast.error("Sign in as an Academy Owner to start TEST checkout.");
      return;
    }
    createCheckout.mutate(
      { planTier, interval: annual ? "yearly" : "monthly" },
      {
        onSuccess: ({ checkoutUrl }) => {
          window.location.assign(checkoutUrl);
        },
      },
    );
  };

  return (
    <AcademyLayout>
      <section className="relative bg-gradient-to-br from-[#0f1d2e] via-[#163563] to-[#c5a55a] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6"
          >
            <Calculator className="w-4 h-4" />
            EquiProfile Academy Pricing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Organisation Plans for
            <br />
            <span className="text-[#c5a55a]">Equestrian Learning</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Seat-based Academy pricing for riding schools and equestrian
            organisations. Current plans include a {FREE_TRIAL_DAYS}-day free
            trial.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
          >
            <span
              className={`text-sm font-medium ${
                !annual ? "text-white" : "text-white/50"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? "bg-[#c5a55a]" : "bg-white/20"
              }`}
              aria-label="Toggle annual billing"
              aria-pressed={annual}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  annual ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                annual ? "text-white" : "text-white/50"
              }`}
            >
              Annual
            </span>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => {
              const Icon = tierIcons[idx];
              const colors = tierColors[idx];
              const isEnterprise = tier.monthly === null;

              return (
                <motion.div
                  key={tier.id}
                  {...fadeUp}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 ${colors.border} p-7 flex flex-col`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white mb-5`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1e293b] mb-1">
                    {tier.label}
                  </h3>
                  <p className="text-[#1e293b]/50 text-sm mb-5">
                    {tier.maxStudents
                      ? `Up to ${tier.maxStudents} students`
                      : "More than 50 students"}
                  </p>

                  {!isEnterprise ? (
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-[#1e293b] font-serif">
                        {annual ? tier.yearly!.display : tier.monthly!.display}
                      </span>
                      <span className="text-[#1e293b]/50 text-sm">
                        /{annual ? "year" : "month"}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <span className="text-2xl font-bold text-[#1e293b] font-serif">
                        Contact for pricing
                      </span>
                    </div>
                  )}

                  <p className="text-[#1e293b]/60 text-sm leading-relaxed mb-6 flex-grow">
                    {tierDescriptions[idx]}
                  </p>

                  <Button
                    type="button"
                    onClick={() => startCheckout(tier.id)}
                    disabled={createCheckout.isPending}
                    className={`w-full rounded-xl ${
                      isEnterprise
                        ? "bg-[#163563] hover:bg-[#1a3d6e] text-white"
                        : "bg-[#c5a55a] hover:bg-[#a8873d] text-white"
                    }`}
                  >
                    {createCheckout.isPending ? (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 w-4 h-4" />
                    )}
                    {isEnterprise
                      ? "Start Enterprise TEST Checkout"
                      : "Start TEST Checkout"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c5a55a]/10 text-[#c5a55a] text-sm font-semibold mb-4">
              Academy Foundations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Built on the Existing EquiProfile Education System
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              The Academy migration reuses working EquiProfile education,
              identity, role, and data foundations rather than selling a
              disconnected replacement system.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {includedFoundations.map((item, idx) => (
              <motion.div
                key={item}
                {...fadeUp}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className="flex items-start gap-3 bg-white rounded-xl p-5 border border-gray-100"
              >
                <CheckCircle2 className="w-5 h-5 text-[#c5a55a] mt-0.5 shrink-0" />
                <span className="text-[#1e293b]/70 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm text-[#1e293b]/50 text-center max-w-3xl mx-auto">
            Academy checkout is currently available only through an Academy
            Owner account using Stripe TEST mode. No live payment is created by
            this environment. Plan entitlements and commercial terms should be
            confirmed against the active account configuration before any future
            live-billing release.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#c5a55a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Discuss the Right Academy Plan
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us about your students, instructors, and learning programme
              and we can confirm the appropriate current plan and trial terms.
            </p>
            <Link href="/academy/contact">
              <Button
                size="lg"
                className="bg-white text-[#0f1d2e] hover:bg-white/90 text-base px-8 py-6 rounded-xl font-semibold shadow-lg"
              >
                Contact EquiProfile Academy
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </AcademyLayout>
  );
}
