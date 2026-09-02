import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SchoolLayout } from "@/components/school/SchoolLayout";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Target,
  Users,
  Award,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Globe,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const values = [
  {
    icon: Heart,
    title: "Passion for Horses",
    description:
      "We believe every rider deserves structured, high-quality education that honours the bond between horse and rider.",
  },
  {
    icon: GraduationCap,
    title: "Education First",
    description:
      "Our platform is built on proven equestrian pedagogy, aligning with BHS and Pony Club frameworks.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description:
      "We constantly evolve our platform based on feedback from real riding schools and instructors.",
  },
  {
    icon: Globe,
    title: "Accessible Learning",
    description:
      "Making quality equestrian education available to schools of every size, from small yards to large academies.",
  },
];

const differentiators = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "15 carefully designed learning pathways spanning 4 progressive levels. No more guesswork — every lesson has purpose and direction.",
  },
  {
    icon: Target,
    title: "Purpose-Built for Equestrian",
    description:
      "Not a generic LMS with horse labels. Every feature, from skill tracking to lesson planning, is designed for how riding schools actually work.",
  },
  {
    icon: Users,
    title: "Complete Teacher Toolkit",
    description:
      "Lesson planning, student assessment, attendance, progress reports, and parent communication — all in one place.",
  },
  {
    icon: Award,
    title: "Measurable Progression",
    description:
      "Visual progress tracking that motivates students and gives parents confidence their children are advancing.",
  },
];

const schoolBenefits = [
  "Save instructor preparation time with ready-made lesson structures",
  "Improve student retention with visible progress tracking",
  "Deliver consistent lesson quality across all instructors",
  "Generate professional progress reports for parents automatically",
  "Scale your school without sacrificing education quality",
  "Meet national equestrian standards effortlessly",
];

export default function SchoolAbout() {
  return (
    <SchoolLayout>
      {/* ───── Hero Banner ───── */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e4d8c] to-[#2d6a4f] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)",
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
            <Heart className="w-4 h-4" />
            Our Story
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            About EquiProfile
            <br />
            <span className="text-[#10b981]">School</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            We're on a mission to elevate equestrian education through
            technology, structure, and a deep love of horses.
          </motion.p>
        </div>
      </section>

      {/* ───── Mission Statement ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/aboutus.jpg"
                  alt="EquiProfile School mission"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] text-sm font-semibold mb-4">
                Our Mission
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-6">
                Empowering Every Rider's{" "}
                <span className="text-[#2d6a4f]">Journey</span>
              </h2>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-6">
                EquiProfile School was born from a simple observation: riding
                schools deserve better tools. Too many talented instructors spend
                hours on admin instead of teaching, and too many students lack
                clear progression paths.
              </p>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-6">
                We created a platform that brings structure, visibility, and joy
                to equestrian education. From the first nervous approach to a
                pony, through confident cantering, to the mastery of advanced
                disciplines — every step is supported, tracked, and celebrated.
              </p>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed">
                Our team combines decades of equestrian experience with modern
                technology expertise to build tools that genuinely make a
                difference in how riding schools operate and how students learn.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Our Values ───── */}
      <section className="py-24 bg-[#f0f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-semibold mb-4">
              Our Values
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              What Drives Us
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              Every decision we make is guided by our commitment to riders,
              instructors, and the equestrian community.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                {...fadeUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1e4d8c] flex items-center justify-center text-white mx-auto mb-5">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] font-serif mb-3">
                  {value.title}
                </h3>
                <p className="text-[#1e293b]/60 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── What Makes Us Different ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-semibold mb-4">
              Our Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              What Makes Us Different
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              We don't just digitise your existing processes — we transform how
              equestrian education is delivered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((item, idx) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex gap-5 bg-[#f0f4f8] rounded-2xl p-7 hover:bg-[#e8eef5] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1e4d8c] flex items-center justify-center text-white shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e293b] font-serif mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#1e293b]/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── For Schools ───── */}
      <section className="py-24 bg-gradient-to-br from-[#1e3a5f] to-[#1e4d8c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
                For Schools
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
                Designed for Riding Schools of{" "}
                <span className="text-[#10b981]">Every Size</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Whether you're a small yard with a handful of students or a
                large academy with multiple instructors, EquiProfile School
                scales to fit your needs. Our platform grows with you.
              </p>

              <ul className="space-y-4 mb-8">
                {schoolBenefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    {...fadeUp}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
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
                  src="/images/hero/image6.jpg"
                  alt="Riding school students"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="py-20 bg-[#f0f4f8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Ready to Elevate Your School?
            </h2>
            <p className="text-[#1e293b]/60 text-lg mb-8 max-w-2xl mx-auto">
              See how EquiProfile School can transform your equestrian education
              by creating an account or contacting our team.
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
              <Link href="/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white text-base px-8 py-6 rounded-xl"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SchoolLayout>
  );
}
