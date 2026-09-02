import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SchoolLayout } from "@/components/school/SchoolLayout";
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Users,
  ClipboardCheck,
  Settings,
  TrendingUp,
  Layout,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  Layers,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const majorFeatures = [
  {
    badge: "Core Feature",
    badgeColor: "bg-[#2d6a4f]/10 text-[#2d6a4f]",
    title: "Learning Pathways",
    subtitle: "15 Pathways · 4 Progressive Levels",
    description:
      "Our structured learning pathways guide students from absolute beginner to advanced rider. Each pathway covers a specific discipline — from groundwork and stable management to dressage, jumping, and cross-country. Students progress through four clearly defined levels: Foundation, Developing, Competent, and Advanced.",
    highlights: [
      "15 discipline-specific pathways",
      "4 progressive skill levels per pathway",
      "Aligned with BHS and Pony Club standards",
      "Automatic progression when criteria are met",
      "Visual skill maps for students and parents",
    ],
    image: "/images/hero/image1.jpg",
    imageAlt: "Learning pathways",
    icon: GraduationCap,
    reverse: false,
  },
  {
    badge: "Student Experience",
    badgeColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
    title: "Student Dashboard",
    subtitle: "Personalised Learning Hub",
    description:
      "Every student gets a personalised dashboard showing their current pathways, upcoming lessons, recent achievements, and areas for improvement. The visual progress indicators make learning tangible and motivating — students can see exactly where they are and what comes next.",
    highlights: [
      "Personal progress overview at a glance",
      "Upcoming lessons and assignments",
      "Achievement badges and milestones",
      "Skill-level visualisation across pathways",
      "Lesson history and instructor feedback",
    ],
    image: "/images/gallery/10.jpg",
    imageAlt: "Student dashboard",
    icon: Layout,
    reverse: true,
  },
  {
    badge: "Instructor Power",
    badgeColor: "bg-[#f59e0b]/10 text-[#f59e0b]",
    title: "Teacher Dashboard",
    subtitle: "Everything Instructors Need",
    description:
      "Teachers get a powerful command centre for managing their classes, tracking student progress, and planning lessons. The dashboard surfaces the insights that matter — who's ready to advance, who needs extra support, and what to focus on in each lesson.",
    highlights: [
      "Class management and scheduling",
      "Individual student progress tracking",
      "Lesson planning with pathway alignment",
      "Attendance tracking and reporting",
      "Parent communication tools",
    ],
    image: "/images/hero/image2.jpg",
    imageAlt: "Teacher dashboard",
    icon: Users,
    reverse: false,
  },
  {
    badge: "Active Learning",
    badgeColor: "bg-[#10b981]/10 text-[#10b981]",
    title: "Assignments & Practice",
    subtitle: "Learning Beyond the Arena",
    description:
      "Reinforce lessons between sessions with structured assignments. Teachers can set theory tasks, stable management practice, or reflective exercises that keep students engaged and progressing even when they're not in the saddle.",
    highlights: [
      "Teacher-created assignments per pathway",
      "Theory and practical task types",
      "Completion tracking and reminders",
      "Student self-reflection prompts",
      "Integration with progress tracking",
    ],
    image: "/images/gallery/15.jpg",
    imageAlt: "Assignments and practice",
    icon: ClipboardCheck,
    reverse: true,
  },
  {
    badge: "Data & Insights",
    badgeColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
    title: "Progress & Reports",
    subtitle: "Measure What Matters",
    description:
      "Comprehensive reporting tools give schools, instructors, and parents clear visibility into student development. From individual progress reports to school-wide analytics, you'll always know how your students and school are performing.",
    highlights: [
      "Individual student progress reports",
      "School-wide performance analytics",
      "Exportable PDF reports for parents",
      "Trend analysis and improvement tracking",
      "Customisable report templates",
    ],
    image: "/images/gallery/12.jpg",
    imageAlt: "Progress reports",
    icon: BarChart3,
    reverse: false,
  },
  {
    badge: "Administration",
    badgeColor: "bg-[#1e4d8c]/10 text-[#1e4d8c]",
    title: "School Administration",
    subtitle: "Run Your School Efficiently",
    description:
      "From student enrolment to instructor management, EquiProfile School handles the admin so you can focus on teaching. Manage your entire school operation from one unified platform designed specifically for riding schools.",
    highlights: [
      "Student enrolment and management",
      "Instructor profiles and scheduling",
      "Billing and subscription management",
      "Multi-location support for larger schools",
      "Role-based access control",
    ],
    image: "/images/hero/image3.jpg",
    imageAlt: "School administration",
    icon: Settings,
    reverse: true,
  },
];

const whyChooseUs = [
  {
    icon: Star,
    title: "Purpose-Built",
    description: "Designed exclusively for equestrian education, not adapted from generic tools.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Schools using structured pathways see clearer student progression and reduced admin overhead.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Cloud-hosted with enterprise-grade security to protect your school data.",
  },
  {
    icon: MessageSquare,
    title: "Dedicated Support",
    description: "Real equestrian experts supporting you, not generic helpdesk agents.",
  },
  {
    icon: Calendar,
    title: "Regular Updates",
    description: "New features and improvements released monthly based on school feedback.",
  },
  {
    icon: Layers,
    title: "Scalable Platform",
    description: "From 5 students to 500, the platform grows seamlessly with your school.",
  },
];

const additionalFeatures = [
  "Lesson scheduling & calendar",
  "Automated parent notifications",
  "Student attendance records",
  "Achievement certificates",
  "Waitlist management",
  "Custom branding options",
  "API integrations",
  "Data export tools",
  "Mobile-responsive design",
  "Multi-language support",
  "Offline lesson recording",
  "Photo & video attachments",
];

export default function SchoolFeatures() {
  return (
    <SchoolLayout>
      {/* ───── Hero ───── */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e4d8c] to-[#2d6a4f] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 50%)",
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
            <FileText className="w-4 h-4" />
            Full Feature Overview
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Everything Your
            <br />
            <span className="text-[#10b981]">School Needs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive platform built from the ground up for equestrian
            education. Explore every feature designed to help your school thrive.
          </motion.p>
        </div>
      </section>

      {/* ───── Major Feature Sections ───── */}
      {majorFeatures.map((feature, idx) => (
        <section
          key={feature.title}
          className={`py-24 ${idx % 2 === 0 ? "bg-white" : "bg-[#f0f4f8]"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                feature.reverse ? "lg:[direction:rtl]" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: feature.reverse ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:[direction:ltr]"
              >
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${feature.badgeColor}`}
                >
                  {feature.badge}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-2">
                  {feature.title}
                </h2>
                <p className="text-[#3b82f6] font-medium text-sm mb-5">
                  {feature.subtitle}
                </p>
                <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-8">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, hIdx) => (
                    <motion.li
                      key={hIdx}
                      {...fadeUp}
                      transition={{ delay: hIdx * 0.06, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                      <span className="text-[#1e293b]/70">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: feature.reverse ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:[direction:ltr]"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ───── Additional Features Grid ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] text-sm font-semibold mb-4">
              And More
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Plus Dozens More Features
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              Every detail has been considered to make running your school
              smoother and teaching more effective.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalFeatures.map((feature, idx) => (
              <motion.div
                key={feature}
                {...fadeUp}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="flex items-center gap-3 bg-[#f0f4f8] rounded-xl px-5 py-4"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span className="text-[#1e293b]/70 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Why Schools Choose Us ───── */}
      <section className="py-24 bg-gradient-to-br from-[#1e3a5f] to-[#1e4d8c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
              Trusted Choice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Schools Choose Us
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              More than just software — we're a partner in your school's success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/[0.12] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#10b981] mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-serif mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-[#f0f4f8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              See It All in Action
            </h2>
            <p className="text-[#1e293b]/60 text-lg mb-8 max-w-2xl mx-auto">
              Contact us to discuss the right Academy plan for your organisation
              tailored to your school's needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#2d6a4f] hover:bg-[#236b45] text-white text-base px-8 py-6 rounded-xl shadow-lg"
                >
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white text-base px-8 py-6 rounded-xl"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SchoolLayout>
  );
}
