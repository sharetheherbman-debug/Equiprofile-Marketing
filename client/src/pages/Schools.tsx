// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
/**
 * Schools — Dedicated marketing landing page for riding schools and
 * equestrian organisations considering EquiProfile for their students.
 *
 * Highlights seat-based pricing, teacher/student management, learning
 * pathways, assignments, reports, and ROI.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ManagementLayout } from "@/components/management/ManagementLayout";
import { PageBanner } from "@/components/PageBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Shield,
  ChevronRight,
  Check,
  Building2,
  Award,
  Zap,
  Brain,
  BarChart3,
  FolderOpen,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { useState } from "react";

// ── ROI Calculator ──────────────────────────────────────────────────────────
function ROICalculator() {
  // Default to 15 students — midpoint of the "Medium School" tier (0–20)
  const [students, setStudents] = useState(15);
  const hoursSavedPerStudent = 2; // hours/month admin time saved
  const costPerHour = 15; // average admin cost
  const monthlyPlan =
    students <= 10 ? 49 : students <= 20 ? 89 : students <= 50 ? 199 : 299;

  const monthlySaving = students * hoursSavedPerStudent * costPerHour;
  const monthlyROI = monthlySaving - monthlyPlan;
  const yearlyROI = monthlyROI * 12;

  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">ROI Calculator</h3>
          <p className="text-xs text-gray-500">See what EquiProfile saves your school</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Number of students: <span className="text-white font-bold">{students}</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            value={students}
            onChange={(e) => setStudents(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5</span>
            <span>60+</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Monthly Plan Cost</p>
            <p className="text-xl font-bold text-white">£{monthlyPlan}</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Admin Time Saved</p>
            <p className="text-xl font-bold text-[#7dd3c0]">{students * hoursSavedPerStudent}h/mo</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Monthly Saving</p>
            <p className="text-xl font-bold text-emerald-400">£{monthlySaving}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-400 mb-1">Annual ROI</p>
            <p className="text-xl font-bold text-emerald-400">£{yearlyROI.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-600 mt-2">
          Based on estimated {hoursSavedPerStudent} hours/month admin time saved per student at £{costPerHour}/hr.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function Schools() {
  return (
    <>
      <ManagementLayout>
      
        <div className="min-h-screen bg-[#0b1726]">
          {/* Hero */}
          <PageBanner
            title="For Schools & Organisations"
            subtitle="A complete equestrian learning platform built for riding schools, colleges, and training centres"
            imageSrc="/images/hero/image5.jpg"
            imagePosition="center"
          />

          {/* Value Prop Section */}
          <section className="container mx-auto px-4 py-16 md:py-28">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5b8def]/10 border border-[#5b8def]/20 mb-6">
                  <Building2 className="w-4 h-4 text-[#5b8def]" />
                  <span className="text-sm text-[#7baaf5] font-medium">Purpose-Built for Schools</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                  Everything Your School Needs in{" "}
                  <span className="bg-gradient-to-r from-[#5b8def] to-[#7dd3c0] bg-clip-text text-transparent">
                    One Platform
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Replace scattered worksheets, paper records, and ad-hoc messaging with a single platform
                  that manages learning, progression, communication, and administration.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: "95+ Structured Lessons",
                  desc: "15 learning pathways across 4 levels — from beginner horse care to advanced welfare and nutrition.",
                  gradient: "from-[#5b8def] to-[#3a93b8]",
                },
                {
                  icon: TrendingUp,
                  title: "Progression Tracking",
                  desc: "Level-gated content ensures students master fundamentals before advancing. Teachers see exactly where each student is.",
                  gradient: "from-[#3a93b8] to-blue-500",
                },
                {
                  icon: Zap,
                  title: "Daily Practice Scenarios",
                  desc: "3 fresh scenarios every day matched to each student's level — keeping learning active and consistent.",
                  gradient: "from-amber-500 to-orange-500",
                },
                {
                  icon: ClipboardList,
                  title: "Assignments & Feedback",
                  desc: "Set tasks, review submissions, and provide structured feedback — all tracked within the platform.",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: BarChart3,
                  title: "Reports & Analytics",
                  desc: "See weak areas, completion rates, and student progression data at a glance. Export for inspections.",
                  gradient: "from-rose-500 to-pink-500",
                },
                {
                  icon: MessageSquare,
                  title: "Messaging & Resources",
                  desc: "Direct teacher-student messaging, shared resource library, and notifications — keep everyone connected.",
                  gradient: "from-violet-500 to-purple-500",
                },
                {
                  icon: Brain,
                  title: "AI Tutor Support",
                  desc: "Students get instant help with equine theory questions from the AI tutor — available 24/7.",
                  gradient: "from-fuchsia-500 to-pink-500",
                },
                {
                  icon: Users,
                  title: "Teacher & Student Management",
                  desc: "Invite teachers and students by email. Manage roles, seats, and access from your school dashboard.",
                  gradient: "from-blue-500 to-[#5b8def]",
                },
                {
                  icon: Shield,
                  title: "Safeguarding Ready",
                  desc: "Individual student accounts with role-based access. No student data is shared between organisations.",
                  gradient: "from-green-500 to-emerald-500",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    className="bg-[#111827] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Use Cases */}
          <section className="bg-[#0d1b30] py-16 md:py-28">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                    Built for Every Equestrian Organisation
                  </h2>
                  <p className="text-gray-400">
                    Whether you run a small riding school or a large equestrian college,
                    EquiProfile scales with you.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    title: "Riding Schools",
                    desc: "Structured learning for recreational and competitive students. Track progress, set assignments, and keep parents informed.",
                    features: ["Weekly lesson tracking", "Student progress reports", "Parent-friendly dashboards"],
                    gradient: "from-[#2e86ab] to-violet-600",
                  },
                  {
                    title: "Equestrian Colleges",
                    desc: "Curriculum-aligned pathways with formal assessment support. Export data for accreditation and inspection bodies.",
                    features: ["Curriculum pathways", "Formal assessments", "Exportable records"],
                    gradient: "from-[#3a93b8] to-blue-600",
                  },
                  {
                    title: "Training Centres",
                    desc: "Professional development programmes with CPD tracking. Ideal for BHS, Pony Club, and independent training providers.",
                    features: ["CPD tracking", "Flexible pathways", "Multi-teacher support"],
                    gradient: "from-emerald-600 to-teal-600",
                  },
                ].map((useCase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${useCase.gradient}`} />
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{useCase.desc}</p>
                      <ul className="space-y-2">
                        {useCase.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ROI + Pricing CTA */}
          <section className="container mx-auto px-4 py-16 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
              {/* ROI Calculator */}
              <ScrollReveal>
                <ROICalculator />
              </ScrollReveal>

              {/* Pricing Summary */}
              <ScrollReveal>
                <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#5b8def]/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#5b8def]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">School Pricing</h3>
                      <p className="text-xs text-gray-500">Simple seat-based plans. 7-day free trial.</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { tier: "Small School", students: "Up to 10 students", price: "£49/mo", yearly: "£490/yr" },
                      { tier: "Medium School", students: "Up to 20 students", price: "£89/mo", yearly: "£890/yr" },
                      { tier: "Large School", students: "Up to 50 students", price: "£199/mo", yearly: "£1,990/yr" },
                      { tier: "Enterprise", students: "50+ students", price: "Contact us", yearly: "" },
                    ].map((plan) => (
                      <div key={plan.tier} className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                        <div>
                          <p className="text-sm font-medium text-white">{plan.tier}</p>
                          <p className="text-xs text-gray-500">{plan.students}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{plan.price}</p>
                          {plan.yearly && <p className="text-[10px] text-gray-500">{plan.yearly}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Link href="/pricing">
                      <Button className="w-full bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#1a5276] hover:to-[#4a7dd4] text-white h-11 text-sm font-semibold">
                        View Full Pricing <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-11 text-sm">
                        Explore Academy
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-[#0d1b30] py-16 md:py-28">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                    Get Started in Minutes
                  </h2>
                  <p className="text-gray-400">
                    Setting up your school on EquiProfile is simple and guided.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  { step: "1", title: "Create Organisation", desc: "Name your school and choose your plan tier" },
                  { step: "2", title: "Invite Teachers", desc: "Send email invites to your teaching team" },
                  { step: "3", title: "Add Students", desc: "Invite students who get their own learning dashboards" },
                  { step: "4", title: "Start Teaching", desc: "Assign lessons, track progress, and give feedback" },
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3a93b8] to-[#5b8def] flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="container mx-auto px-4 py-16 md:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <GraduationCap className="w-12 h-12 text-[#5b8def] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                Ready to Transform Your School?
              </h2>
              <p className="text-gray-400 mb-8">
                Join riding schools and equestrian centres already using EquiProfile to deliver
                structured, trackable learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#1a5276] hover:to-[#4a7dd4] text-white px-8 h-12 text-sm font-semibold gap-2">
                    Start 7-Day Free Trial <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 px-8 h-12 text-sm">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      
      </ManagementLayout>
    </>
  );
}
