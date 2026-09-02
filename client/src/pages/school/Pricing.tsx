import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SchoolLayout } from "@/components/school/SchoolLayout";
import { SCHOOL_PRICING } from "@shared/pricing";
import {
  CheckCircle2,
  ArrowRight,
  Crown,
  Building2,
  Users,
  GraduationCap,
  Zap,
  ChevronDown,
  ChevronUp,
  Calculator,
  HelpCircle,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const tierIcons = [Users, GraduationCap, Crown, Building2];
const tierDescriptions = [
  "Perfect for small yards and individual instructors getting started with structured learning.",
  "Ideal for growing schools with multiple classes and a team of instructors.",
  "For established schools running full programmes across multiple disciplines.",
  "Custom solutions for large academies, multi-site operations, and organisations.",
];

const tierColors = [
  { border: "border-[#3b82f6]", bg: "bg-[#3b82f6]", ring: "ring-[#3b82f6]" },
  { border: "border-[#2d6a4f]", bg: "bg-[#2d6a4f]", ring: "ring-[#2d6a4f]" },
  { border: "border-[#f59e0b]", bg: "bg-[#f59e0b]", ring: "ring-[#f59e0b]" },
  { border: "border-[#1e4d8c]", bg: "bg-[#1e4d8c]", ring: "ring-[#1e4d8c]" },
];

const featureCategories = [
  {
    category: "Learning & Pathways",
    features: [
      { name: "Learning pathways access", tiers: [true, true, true, true] },
      { name: "Progressive levels (4 tiers)", tiers: [true, true, true, true] },
      { name: "Custom pathway creation", tiers: [false, true, true, true] },
      { name: "Curriculum customisation", tiers: [false, false, true, true] },
    ],
  },
  {
    category: "Student Management",
    features: [
      { name: "Student profiles & dashboard", tiers: [true, true, true, true] },
      { name: "Progress tracking", tiers: [true, true, true, true] },
      { name: "Assignments & practice tasks", tiers: [true, true, true, true] },
      { name: "Parent portal access", tiers: [false, true, true, true] },
      { name: "Automated progress reports", tiers: [false, true, true, true] },
    ],
  },
  {
    category: "Teacher & Admin",
    features: [
      { name: "Teacher dashboard", tiers: [true, true, true, true] },
      { name: "Lesson planning tools", tiers: [true, true, true, true] },
      { name: "Attendance tracking", tiers: [true, true, true, true] },
      { name: "Multiple instructor accounts", tiers: ["1", "3", "10", "Unlimited"] },
      { name: "School branding", tiers: [false, false, true, true] },
    ],
  },
  {
    category: "Analytics & Reporting",
    features: [
      { name: "Basic analytics", tiers: [true, true, true, true] },
      { name: "Advanced reporting", tiers: [false, true, true, true] },
      { name: "Exportable PDF reports", tiers: [false, true, true, true] },
      { name: "School-wide analytics", tiers: [false, false, true, true] },
      { name: "Custom report builder", tiers: [false, false, false, true] },
    ],
  },
  {
    category: "Support & Services",
    features: [
      { name: "Email support", tiers: [true, true, true, true] },
      { name: "Priority support", tiers: [false, true, true, true] },
      { name: "Dedicated account manager", tiers: [false, false, false, true] },
      { name: "Onboarding assistance", tiers: [false, false, true, true] },
      { name: "API access", tiers: [false, false, false, true] },
    ],
  },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference. When downgrading, the credit is applied to future billing.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan comes with a 14-day free trial. No credit card required to start. You'll have full access to all features in your chosen tier.",
  },
  {
    q: "What happens if I exceed my student limit?",
    a: "We'll notify you when you're approaching your limit and offer a seamless upgrade path. We never cut off access to existing students — you'll just need to upgrade before adding more.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes, annual billing saves you approximately 17% compared to monthly billing. The savings are reflected in the yearly prices shown above.",
  },
  {
    q: "Can I add additional instructors to my plan?",
    a: "Each plan includes a set number of instructor accounts. If you need more, you can add additional instructor seats or upgrade to a higher tier.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, as well as direct debit for annual plans. Enterprise customers can arrange invoicing and purchase orders.",
  },
];

export default function SchoolPricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tiers = SCHOOL_PRICING.tiers;

  return (
    <SchoolLayout>
      {/* ───── Hero ───── */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e4d8c] to-[#2d6a4f] pt-28 pb-20 overflow-hidden">
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
            Transparent Pricing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            School Plans That
            <br />
            <span className="text-[#10b981]">Scale With You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Simple, honest pricing for riding schools of every size. Start with
            a 14-day free trial — no credit card required.
          </motion.p>

          {/* Billing Toggle */}
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
                annual ? "bg-[#10b981]" : "bg-white/20"
              }`}
              aria-label="Toggle annual billing"
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
              <span className="ml-2 text-xs bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ───── Pricing Cards ───── */}
      <section className="relative z-20 -mt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => {
              const Icon = tierIcons[idx];
              const colors = tierColors[idx];
              const isPopular = idx === 2;
              const isEnterprise = tier.monthly === null;

              return (
                <motion.div
                  key={tier.id}
                  {...fadeUp}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                    isPopular ? colors.border : "border-gray-100"
                  } p-7 flex flex-col ${isPopular ? `ring-2 ${colors.ring} ring-offset-2` : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#f59e0b] text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                        Most Popular
                      </span>
                    </div>
                  )}

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
                      : "50+ students"}
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
                        Custom Pricing
                      </span>
                    </div>
                  )}

                  <p className="text-[#1e293b]/60 text-sm leading-relaxed mb-6 flex-grow">
                    {tierDescriptions[idx]}
                  </p>

                  <Link href="/contact">
                    <Button
                      className={`w-full rounded-xl ${
                        isPopular
                          ? "bg-[#f59e0b] hover:bg-[#d97706] text-white"
                          : isEnterprise
                            ? "bg-[#1e4d8c] hover:bg-[#1a3d6e] text-white"
                            : "bg-[#2d6a4f] hover:bg-[#236b45] text-white"
                      }`}
                    >
                      {isEnterprise ? "Contact Us" : "Start Free Trial"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Feature Comparison ───── */}
      <section className="py-24 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-semibold mb-4">
              Compare Plans
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Feature Comparison
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              Every plan includes the core platform. Higher tiers unlock
              advanced features for growing schools.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="grid grid-cols-5 gap-0 border-b border-gray-100 bg-[#1e3a5f] text-white">
              <div className="p-5 font-semibold text-sm">Feature</div>
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-5 text-center font-semibold text-sm"
                >
                  {tier.label}
                </div>
              ))}
            </div>

            {/* Categories */}
            {featureCategories.map((cat) => (
              <div key={cat.category}>
                <div className="grid grid-cols-5 gap-0 bg-[#f0f4f8] border-b border-gray-100">
                  <div className="col-span-5 p-4 font-bold text-[#1e293b] text-sm">
                    {cat.category}
                  </div>
                </div>
                {cat.features.map((feature, fIdx) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-5 gap-0 border-b border-gray-50 ${
                      fIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <div className="p-4 text-sm text-[#1e293b]/70">
                      {feature.name}
                    </div>
                    {feature.tiers.map((val, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-4 text-center flex items-center justify-center"
                      >
                        {val === true ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                        ) : val === false ? (
                          <span className="text-[#1e293b]/20">—</span>
                        ) : (
                          <span className="text-sm font-medium text-[#1e293b]/70">
                            {val}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── ROI Section ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm font-semibold mb-4">
                Why It Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-6">
                Built to Deliver{" "}
                <span className="text-[#2d6a4f]">Real Value</span>
              </h2>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-8">
                EquiProfile is designed to improve how riding schools operate —
                from student progression to admin efficiency.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    value: "✓",
                    label: "Faster Student Progression",
                    desc: "Students reach milestones faster with structured pathways",
                  },
                  {
                    value: "✓",
                    label: "Less Admin Time",
                    desc: "Instructors spend more time teaching, less on paperwork",
                  },
                  {
                    value: "✓",
                    label: "Better Retention",
                    desc: "Students stay longer when they see their progress clearly",
                  },
                  {
                    value: "✓",
                    label: "Scalable Growth",
                    desc: "Schools grow effectively with structured, scalable programmes",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    {...fadeUp}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="bg-[#f0f4f8] rounded-xl p-5"
                  >
                    <p className="text-3xl font-bold text-[#2d6a4f] font-serif mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-[#1e293b] mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xs text-[#1e293b]/50">{stat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#1e4d8c] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-[#f59e0b]" />
                  <h3 className="font-serif text-xl font-bold">
                    What You Get
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="bg-white/10 rounded-xl p-5">
                    <p className="text-white/60 text-sm mb-1">
                      Less time on admin
                    </p>
                    <p className="text-base font-semibold font-serif leading-snug">
                      Automated lesson plans and progress reports mean instructors focus on teaching, not paperwork.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5">
                    <p className="text-white/60 text-sm mb-1">
                      Students who see their progress
                    </p>
                    <p className="text-base font-semibold font-serif leading-snug">
                      Structured pathways give students clear milestones and a reason to stay enrolled.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5">
                    <p className="text-white/60 text-sm mb-1">
                      A platform built for riding schools
                    </p>
                    <p className="text-base font-semibold font-serif leading-snug">
                      Not adapted from generic software — designed from the ground up for equestrian education.
                    </p>
                  </div>
                  <div className="bg-[#10b981]/20 rounded-xl p-5 border border-[#10b981]/30">
                    <p className="text-[#10b981] text-sm font-medium mb-1">
                      7-day free trial
                    </p>
                    <p className="text-base font-bold font-serif text-white">
                      No credit card required. See the difference for yourself.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-24 bg-[#f0f4f8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-semibold mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                {...fadeUp}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-semibold text-[#1e293b] text-sm pr-4">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#1e293b]/40 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#1e293b]/40 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-[#1e293b]/60 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-gradient-to-r from-[#2d6a4f] to-[#1e4d8c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Your Free 14-Day Trial
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              No credit card required. Full access to all features. Cancel
              anytime. Experience the platform built for riding schools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-[#1e3a5f] hover:bg-white/90 text-base px-8 py-6 rounded-xl font-semibold shadow-lg"
                >
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SchoolLayout>
  );
}
