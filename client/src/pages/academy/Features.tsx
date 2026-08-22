import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import {
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
    badge: "Core Learning",
    badgeColor: "bg-[#c5a55a]/10 text-[#c5a55a]",
    title: "Learning Pathways",
    subtitle: "15 Pathways · 4 Progressive Levels",
    description:
      "EquiProfile Academy organises existing structured equestrian lessons into progressive pathways across horse care, riding, safety, welfare, tack, health, stable management, competition, coaching, nutrition, and related topics. Lessons combine objectives, detailed content, practical application, safety notes, knowledge checks, and linked competencies where configured.",
    highlights: [
      "15 current learning pathways",
      "Beginner, developing, intermediate, and advanced levels",
      "Original EquiProfile educational content",
      "Knowledge checks with answer explanations",
      "Safety notes and practical application",
    ],
    image: "/images/hero/image1.jpg",
    imageAlt: "Equestrian learning pathways",
    icon: GraduationCap,
    reverse: false,
  },
  {
    badge: "Student Experience",
    badgeColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
    title: "Student Dashboard",
    subtitle: "Connected Learning Hub",
    description:
      "The existing student experience brings together lesson pathways, progress, assigned work, instructor feedback, competency records, practical tasks, and other student learning tools. Academy work is focused on completing and validating those flows rather than replacing them with a separate LMS.",
    highlights: [
      "Lesson and pathway progress",
      "Teacher-assigned lessons and tasks",
      "Competency records",
      "Instructor feedback and lesson reviews",
      "Learning history and recommended next work",
    ],
    image: "/images/gallery/10.jpg",
    imageAlt: "Student learning dashboard",
    icon: Layout,
    reverse: true,
  },
  {
    badge: "Coach & Teacher",
    badgeColor: "bg-[#f59e0b]/10 text-[#f59e0b]",
    title: "Teacher Dashboard",
    subtitle: "Teaching and Progress Tools",
    description:
      "Teachers can work with assigned students, lesson assignments, competency assessment, feedback, learning resources, and lesson-related workflows. The Academy completion work is validating these existing capabilities and making the final experience consistent and transparent.",
    highlights: [
      "Assigned students and learning groups where configured",
      "Lesson assignments",
      "Competency assessment",
      "Student feedback and lesson reviews",
      "Lesson scheduling and planning workflows",
    ],
    image: "/images/hero/image2.jpg",
    imageAlt: "Teacher dashboard",
    icon: Users,
    reverse: false,
  },
  {
    badge: "Active Learning",
    badgeColor: "bg-[#c5a55a]/10 text-[#c5a55a]",
    title: "Assignments & Practice",
    subtitle: "Learning Beyond a Single Lesson",
    description:
      "Existing assignment and task systems let teachers connect learning between sessions. Students can receive individual or group work, complete assigned tasks, and keep educational activity linked to their Academy record.",
    highlights: [
      "Individual and group assignment foundations",
      "Lesson and pathway assignments",
      "Due dates and instructions",
      "Student completion state",
      "Teacher feedback foundations",
    ],
    image: "/images/gallery/15.jpg",
    imageAlt: "Assignments and practice",
    icon: ClipboardCheck,
    reverse: true,
  },
  {
    badge: "Progress",
    badgeColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
    title: "Progress & Competencies",
    subtitle: "Evidence of Learning",
    description:
      "Academy combines persisted lesson completion with competency assessment, reviews, assignments, and progress intelligence. Current implementation work is hardening those calculations so progress is always derived from trusted curriculum and server-side facts.",
    highlights: [
      "Persisted lesson completion",
      "Competency status and teacher sign-off foundations",
      "Lesson reviews and feedback",
      "Progress summaries",
      "Recommended next-learning foundations",
    ],
    image: "/images/gallery/12.jpg",
    imageAlt: "Learning progress",
    icon: BarChart3,
    reverse: false,
  },
  {
    badge: "Administration",
    badgeColor: "bg-[#163563]/10 text-[#163563]",
    title: "Academy Administration",
    subtitle: "Education Inside EquiProfile",
    description:
      "EquiProfile already has Academy-owner, student, teacher, scheduling, and education administration foundations. The Academy rebrand keeps compatible internal identifiers where necessary while presenting one consistent customer-facing Academy product.",
    highlights: [
      "Student and teacher management foundations",
      "Role-aware access",
      "Lesson scheduling",
      "Curriculum and learning records",
      "Compatibility with existing accounts and persisted role values",
    ],
    image: "/images/hero/image3.jpg",
    imageAlt: "Academy administration",
    icon: Settings,
    reverse: true,
  },
];

const whyChooseUs = [
  {
    icon: Star,
    title: "Purpose-Built",
    description:
      "Equestrian education lives inside the same EquiProfile ecosystem as horse-management workflows rather than in a disconnected generic LMS.",
  },
  {
    icon: TrendingUp,
    title: "Progressive",
    description:
      "Pathways, lesson completion, competencies, assignments, and feedback are designed to form a coherent learning journey.",
  },
  {
    icon: Shield,
    title: "Compatibility-First",
    description:
      "The Academy migration preserves existing accounts, persisted identifiers, and legacy routes while customer-facing branding evolves safely.",
  },
  {
    icon: MessageSquare,
    title: "Teacher Feedback",
    description:
      "Existing lesson-review and feedback foundations keep instructor judgement visible alongside digital learning activity.",
  },
  {
    icon: Calendar,
    title: "Practical + Digital",
    description:
      "Scheduling, assignments, progress, and structured content are designed to support real practical equestrian instruction, not replace it.",
  },
  {
    icon: Layers,
    title: "Shared Platform",
    description:
      "Academy reuses EquiProfile auth, roles, UI, backend, database conventions, and AI abstraction instead of duplicating core systems.",
  },
];

const additionalFeatures = [
  "Lesson scheduling",
  "Structured lesson catalogue",
  "Learning pathways",
  "Knowledge checks and answer explanations",
  "Lesson completion records",
  "Competency assessment foundations",
  "Teacher lesson assignments",
  "Student groups foundations",
  "Instructor feedback and lesson reviews",
  "Study topics and scenario training",
  "AI Tutor through the server-side AI abstraction",
  "Role-aware student and teacher experiences",
];

export default function AcademyFeatures() {
  return (
    <AcademyLayout>
      {/* ───── Hero ───── */}
      <section className="relative bg-gradient-to-br from-[#0f1d2e] via-[#163563] to-[#c5a55a] pt-28 pb-20 overflow-hidden">
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
            EquiProfile Academy
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Connected Equestrian
            <br />
            <span className="text-[#c5a55a]">Learning Features</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Explore the existing learning, teaching, progress, competency, and
            administration foundations being completed as EquiProfile Academy.
          </motion.p>
        </div>
      </section>

      {/* ───── Major Feature Sections ───── */}
      {majorFeatures.map((feature, idx) => (
        <section
          key={feature.title}
          className={`py-24 ${idx % 2 === 0 ? "bg-white" : "bg-[#f7f5f0]"}`}
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
                      <CheckCircle2 className="w-5 h-5 text-[#c5a55a] mt-0.5 shrink-0" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1d2e]/30 to-transparent" />
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c5a55a]/10 text-[#c5a55a] text-sm font-semibold mb-4">
              Existing Foundations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Built on the EquiProfile Education System
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              These capabilities already exist in the application or its data
              model and are being audited, connected, and hardened for Academy.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalFeatures.map((feature, idx) => (
              <motion.div
                key={feature}
                {...fadeUp}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="flex items-center gap-3 bg-[#f7f5f0] rounded-xl px-5 py-4"
              >
                <CheckCircle2 className="w-4 h-4 text-[#c5a55a] shrink-0" />
                <span className="text-[#1e293b]/70 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Why Academy Architecture ───── */}
      <section className="py-24 bg-gradient-to-br from-[#0f1d2e] to-[#163563]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
              Academy Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              One EquiProfile Ecosystem
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Academy is being completed by reusing the application's working
              systems and adding compatibility where needed.
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
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#c5a55a] mb-5">
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
      <section className="py-20 bg-[#f7f5f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Explore EquiProfile Academy
            </h2>
            <p className="text-[#1e293b]/60 text-lg mb-8 max-w-2xl mx-auto">
              Book a demo to discuss the Academy learning and management
              experience for your equestrian organisation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/academy/contact">
                <Button
                  size="lg"
                  className="bg-[#c5a55a] hover:bg-[#a8873d] text-white text-base px-8 py-6 rounded-xl shadow-lg"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/academy/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#0f1d2e] text-[#0f1d2e] hover:bg-[#0f1d2e] hover:text-white text-base px-8 py-6 rounded-xl"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </AcademyLayout>
  );
}
