import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const stats = [
  { value: "15", label: "Learning Pathways" },
  { value: "4", label: "Progressive Levels" },
  { value: "Structured", label: "Curriculum System" },
  { value: "Connected", label: "Academy Management" },
];

const steps = [
  {
    step: "01",
    title: "Enrol",
    description:
      "Register your riding school and add students in minutes. Invite teachers and configure your learning programme with our guided setup.",
    icon: Users,
  },
  {
    step: "02",
    title: "Learn",
    description:
      "Students follow structured lessons across 15 pathways, from beginner groundwork to more advanced riding and horse-care topics.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Progress",
    description:
      "Track learning milestones with progress records, competency assessment, assignments, and teacher feedback.",
    icon: TrendingUp,
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured Lessons",
    description:
      "Original EquiProfile lesson content organised around practical equestrian knowledge, clear objectives, safety guidance, and knowledge checks.",
  },
  {
    icon: GraduationCap,
    title: "Progressive Pathways",
    description:
      "15 learning pathways spanning 4 levels, supporting a clear progression through horse care, riding, welfare, stable management, and related skills.",
  },
  {
    icon: ClipboardCheck,
    title: "Assignments & Practice",
    description:
      "Set assignments, track completion, and reinforce learning between lessons with structured practice tasks.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Dashboards for lesson progress, competency assessment, teacher feedback, and areas that may need more support.",
  },
  {
    icon: Settings,
    title: "Coach & Teacher Tools",
    description:
      "Tools for lesson planning, student assessment, scheduling, assignments, feedback, and learning oversight.",
  },
  {
    icon: Users,
    title: "Academy Management",
    description:
      "Manage students, instructors, learning activity, scheduling, and education workflows in one connected EquiProfile experience.",
  },
];

const audiences = [
  {
    title: "Students",
    description:
      "Follow structured pathways, open lessons, complete knowledge checks, review progress, and receive instructor feedback.",
    icon: GraduationCap,
  },
  {
    title: "Coaches & Teachers",
    description:
      "Plan learning, assign lessons, assess competencies, review progress, and support students with clear educational records.",
    icon: ClipboardCheck,
  },
  {
    title: "Riding Schools & Centres",
    description:
      "Coordinate students, instructors, lesson activity, scheduling, curriculum delivery, and Academy oversight without replacing existing horse-management workflows.",
    icon: Users,
  },
];

const benefits = [
  "Give students a visible, structured learning journey",
  "Keep lesson content, assignments, feedback, and progress connected",
  "Support instructors with reusable planning and assessment tools",
  "Scale a riding school's learning programme with repeatable curricula",
  "Use original EquiProfile educational material with explicit safety guidance",
  "Reduce fragmented education admin with connected Academy workflows",
];

export default function AcademyHome() {
  return (
    <AcademyLayout>
      {/* ───── Hero Section ───── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero/image4.jpg"
            alt="Equestrian education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1d2e]/90 via-[#163563]/80 to-[#c5a55a]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                EquiProfile Academy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Premium Equestrian
              <br />
              <span className="text-[#c5a55a]">Learning Platform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl"
            >
              Structured equestrian learning for students, coaches, riding
              schools, and equestrian centres. Connect lessons, progress,
              competencies, assignments, feedback, and scheduling in one
              EquiProfile experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/academy/contact">
                <Button
                  size="lg"
                  className="bg-[#c5a55a] hover:bg-[#a8873d] text-white text-base px-8 py-6 rounded-full shadow-2xl shadow-[#c5a55a]/30"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/academy/features">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border border-white/30 hover:bg-white/10 text-base px-8 py-6 rounded-xl"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Stats Bar ───── */}
      <section className="relative z-20 -mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-[#0f1d2e] font-serif">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#1e293b]/60 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c5a55a]/10 text-[#c5a55a] text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              How It Works
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              Build a connected learning journey while preserving the practical
              routines and relationships of your real-world riding school or
              equestrian centre.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#c5a55a] to-[#163563] text-white shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-bold text-[#0f1d2e]/10 font-serif">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-3">
                  {step.title}
                </h3>
                <p className="text-[#1e293b]/60 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features Grid ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-semibold mb-4">
              Academy Features
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Everything for Connected Equestrian Education
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              EquiProfile Academy connects structured learning with the people
              and practical teaching workflows that support it.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="group bg-[#f7f5f0] rounded-2xl p-7 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] font-serif mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#1e293b]/60 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link href="/academy/features">
              <Button
                variant="outline"
                size="lg"
                className="border-[#0f1d2e] text-[#0f1d2e] hover:bg-[#0f1d2e] hover:text-white rounded-xl px-8"
              >
                View All Features
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───── Connected Academy Roles ───── */}
      <section className="py-24 bg-gradient-to-br from-[#0f1d2e] to-[#163563]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
              One Academy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Connected Experiences for Every Learning Role
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Students, coaches, and Academy operators work from the same
              learning records while keeping role-appropriate access and tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {audiences.map((audience, idx) => (
              <motion.div
                key={audience.title}
                {...fadeUp}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <audience.icon className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {audience.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  {audience.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Academy Benefits Split ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#c5a55a]/10 text-[#c5a55a] text-sm font-semibold mb-4">
                Why EquiProfile Academy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-6">
                Built Around Equestrian Learning,{" "}
                <span className="text-[#c5a55a]">Not Generic Courseware</span>
              </h2>
              <p className="text-[#1e293b]/60 text-lg mb-8 leading-relaxed">
                Academy sits inside the EquiProfile ecosystem so education can
                connect naturally with equestrian people, horses, scheduling,
                and management workflows without becoming a disconnected LMS.
              </p>
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    {...fadeUp}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#c5a55a] mt-0.5 shrink-0" />
                    <span className="text-[#1e293b]/70">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/academy/pricing">
                <Button
                  size="lg"
                  className="bg-[#c5a55a] hover:bg-[#a8873d] text-white rounded-xl px-8"
                >
                  View Pricing Plans
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero/image5.jpg"
                  alt="Equestrian school training"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5a55a]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#c5a55a]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e293b]">
                      Structured
                    </p>
                    <p className="text-xs text-[#1e293b]/50">
                      Learning Progress
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── CTA Banner ───── */}
      <section className="py-20 bg-[#c5a55a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Explore EquiProfile Academy?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              See how structured lessons, progress, competencies, assignments,
              feedback, and education management can work together for your
              equestrian learning programme.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/academy/contact">
                <Button
                  size="lg"
                  className="bg-white text-[#0f1d2e] hover:bg-white/90 text-base px-8 py-6 rounded-xl font-semibold shadow-lg"
                >
                  Book Your Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/academy/pricing">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border border-white/30 hover:bg-white/10 text-base px-8 py-6 rounded-xl"
                >
                  See Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </AcademyLayout>
  );
}
