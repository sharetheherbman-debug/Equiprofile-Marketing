import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { FREE_TRIAL_DAYS, SCHOOL_PRICING } from "@shared/pricing";
import { BILLING_CATALOG } from "@shared/billingCatalog";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function billingUrl(plan: string, interval: "monthly" | "yearly") {
  const params = new URLSearchParams({
    product: "academy",
    action: "checkout",
    plan,
    interval,
  });
  return `/api/v1/billing/launch?${params.toString()}`;
}

const riderFeatures = [
  "Structured beginner-to-advanced learning pathways",
  "Progress tracking and achievements",
  "Assessments and practical learning activities",
  "EquiProfile Academy Tutor support",
  "Learning history that stays with your account",
  "New lessons and pathway content as the Academy grows",
];

const schoolFeatures = [
  "Student learning accounts",
  "Teacher and school-owner workspace",
  "Student progress visibility",
  "Assignments and feedback",
  "Structured Academy pathways",
  "Centralised account and billing management",
];

export default function AcademyPricing() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const rider = BILLING_CATALOG.academy_rider;
  const schoolPlans = [
    BILLING_CATALOG.academy_school_10,
    BILLING_CATALOG.academy_school_20,
    BILLING_CATALOG.academy_school_50,
  ] as const;

  return (
    <AcademyLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1d2e] via-[#163563] to-[#c5a55a] pb-20 pt-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.16) 0%, transparent 50%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
          >
            <GraduationCap className="h-4 w-4" /> EquiProfile Academy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Learn as a rider.
            <br />
            <span className="text-[#e4ca8b]">Teach as a team.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75"
          >
            One Academy with plans for individual riders, teachers, riding schools and equestrian organisations. New subscriptions include a {FREE_TRIAL_DAYS}-day trial.
          </motion.p>

          <div className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${interval === "monthly" ? "bg-white text-[#163563]" : "text-white/70"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${interval === "yearly" ? "bg-white text-[#163563]" : "text-white/70"}`}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-8 rounded-2xl border-2 border-[#c5a55a] bg-white p-7 shadow-xl lg:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#163563] text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#c5a55a]">For individual riders</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#102a43]">Academy Rider</h2>
                <p className="mt-3 max-w-2xl text-[#334e68]">
                  Build knowledge over time with structured pathways, assessments and Tutor-supported learning rather than a one-off short course.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {riderFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#334e68]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a55a]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-[#f7f5f0] p-6 text-center">
                <div>
                  <span className="font-serif text-5xl font-bold text-[#102a43]">{rider[interval].display}</span>
                  <span className="text-sm text-[#526d82]">/{interval === "monthly" ? "month" : "year"}</span>
                </div>
                {interval === "yearly" && (
                  <p className="mt-2 text-sm font-medium text-emerald-700">Two months equivalent saved each year</p>
                )}
                <Button asChild size="lg" className="mt-6 w-full bg-[#c5a55a] text-white hover:bg-[#aa8c48]">
                  <a href={billingUrl("academy_rider", interval)}>
                    Start Academy Rider <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <p className="mt-3 text-xs text-[#607d8b]">Secure checkout and subscription management through EquiProfile Billing.</p>
              </div>
            </div>
          </motion.div>

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#c5a55a]">For schools and organisations</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#102a43]">Teach and track progress together</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#526d82]">Choose the student capacity that fits your programme. Teachers and school owners manage learning from the Academy workspace.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {schoolPlans.map((plan, index) => {
              const icons = [Users, GraduationCap, Crown] as const;
              const Icon = icons[index];
              return (
                <motion.div key={plan.key} {...fadeUp} transition={{ delay: index * 0.06 }}>
                  <div className="flex h-full flex-col rounded-2xl border border-[#d9d2c3] bg-white p-7 shadow-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#163563] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#102a43]">{plan.shortName}</h3>
                    <p className="mt-2 text-sm text-[#526d82]">{plan.description}</p>
                    <div className="my-6">
                      <span className="font-serif text-4xl font-bold text-[#102a43]">{plan[interval].display}</span>
                      <span className="text-sm text-[#607d8b]">/{interval === "monthly" ? "month" : "year"}</span>
                    </div>
                    <ul className="mb-7 space-y-2">
                      {schoolFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-[#334e68]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a55a]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-auto bg-[#163563] text-white hover:bg-[#214778]">
                      <a href={billingUrl(plan.key, interval)}>
                        Choose {plan.shortName} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...fadeUp} className="mt-6 rounded-2xl border border-[#d9d2c3] bg-[#f7f5f0] p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#163563]"><Building2 className="h-5 w-5" /><strong>More than 50 students?</strong></div>
              <p className="mt-2 text-sm text-[#526d82]">We can structure an Academy organisation plan around your student numbers and teaching team.</p>
            </div>
            <Link href="/academy/contact">
              <Button variant="outline" className="mt-4 border-[#163563] text-[#163563] sm:mt-0">Contact Academy</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#163563] py-18">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-white">One account. Separate products. Clear billing.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Academy and Management can be used together, but each has its own subscription and access entitlement. EquiProfile Billing keeps payment methods, invoices and subscriptions in one secure place.
          </p>
        </div>
      </section>
    </AcademyLayout>
  );
}
