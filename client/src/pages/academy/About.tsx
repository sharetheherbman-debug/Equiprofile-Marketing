import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Target,
  Users,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const values = [
  {
    icon: Heart,
    title: "Horse Welfare First",
    description:
      "Learning should reinforce humane handling, safe practice, careful observation, and knowing when professional veterinary or other specialist help is needed.",
  },
  {
    icon: GraduationCap,
    title: "Education First",
    description:
      "Academy uses original EquiProfile educational content organised into structured pathways, objectives, practical application, safety notes, and knowledge checks.",
  },
  {
    icon: Lightbulb,
    title: "Useful Technology",
    description:
      "Technology should make learning records, assignments, feedback, scheduling, and progress easier to use without replacing practical instruction or instructor judgement.",
  },
  {
    icon: Layers,
    title: "One EquiProfile Ecosystem",
    description:
      "Academy reuses EquiProfile identity, roles, layouts, data conventions, notifications, and server-side AI foundations instead of becoming a separate generic LMS.",
  },
];

const differentiators = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "The current curriculum contains 15 pathways across four progressive levels, with detailed lesson content already connected to the application's lesson engine.",
  },
  {
    icon: Target,
    title: "Purpose-Built for Equestrian Learning",
    description:
      "Lessons and workflows centre on horse care, riding, welfare, safety, stable management, coaching, nutrition, competition, and other equestrian topics.",
  },
  {
    icon: Users,
    title: "Students, Coaches, and Academy Operators",
    description:
      "Separate role-aware experiences connect student learning, teacher assignments and feedback, competency assessment, scheduling, and education administration.",
  },
  {
    icon: ShieldCheck,
    title: "Compatibility-First",
    description:
      "The controlled Academy migration keeps existing accounts, routes, and stable internal identifiers working while customer-facing terminology changes safely.",
  },
];

const organisationBenefits = [
  "Keep structured lessons and learning pathways in one place",
  "Connect assignments, progress, competencies, and instructor feedback",
  "Support practical lessons with digital learning records",
  "Give students a clearer view of completed and next learning",
  "Reuse existing EquiProfile accounts, roles, and management foundations",
  "Keep genuine equestrian-organisation terminology where it describes the real organisation",
];

export default function AcademyAbout() {
  return (
    <AcademyLayout>
      <section className="relative bg-gradient-to-br from-[#0f1d2e] via-[#163563] to-[#c5a55a] pt-28 pb-20 overflow-hidden">
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
            EquiProfile Academy
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Equestrian Learning,
            <br />
            <span className="text-[#c5a55a]">Connected to EquiProfile</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Academy is the evolution of EquiProfile's existing education system:
            structured lessons, student progress, teacher tools, competencies,
            assignments, feedback, scheduling, and safe AI assistance inside one
            equestrian ecosystem.
          </motion.p>
        </div>
      </section>

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
                  alt="EquiProfile Academy equestrian learning"
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#c5a55a]/10 text-[#c5a55a] text-sm font-semibold mb-4">
                The Academy Direction
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-6">
                Complete What Already Works,{" "}
                <span className="text-[#c5a55a]">Without Starting Over</span>
              </h2>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-6">
                EquiProfile already contains a substantial education product:
                student and teacher experiences, lesson scheduling, a structured
                lesson engine, competency assessment, assignments, feedback, and
                a large equestrian lesson library.
              </p>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed mb-6">
                EquiProfile Academy brings those foundations under one clear
                customer-facing identity and hardens the connections between
                curriculum, progress, roles, safety, and practical instruction.
              </p>
              <p className="text-[#1e293b]/60 text-lg leading-relaxed">
                Stable internal identifiers can remain where changing them would
                risk existing accounts or data. The browser can present Academy
                terminology while the underlying application migrates safely and
                incrementally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-semibold mb-4">
              Academy Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              What Guides the Product
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              The Academy experience is being completed around practical,
              auditable principles rather than unsupported accreditation or
              marketing claims.
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center text-white mx-auto mb-5">
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

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-semibold mb-4">
              Architecture That Fits the Product
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              More Than a Rebrand
            </h2>
            <p className="text-[#1e293b]/60 max-w-2xl mx-auto text-lg">
              Academy is being treated as a compatibility-safe completion of the
              real application, not a new landing page laid over unfinished
              flows.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((item, idx) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex gap-5 bg-[#f7f5f0] rounded-2xl p-7 hover:bg-[#e8eef5] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center text-white shrink-0">
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

      <section className="py-24 bg-gradient-to-br from-[#0f1d2e] to-[#163563]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
                For Equestrian Organisations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
                Academy for Students, Coaches, Riding Schools, and{" "}
                <span className="text-[#c5a55a]">Equestrian Centres</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                The product can use Academy as its platform name while still
                speaking naturally about real riding schools, instructors,
                students, yards, and equestrian centres.
              </p>

              <ul className="space-y-4 mb-8">
                {organisationBenefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    {...fadeUp}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#c5a55a] mt-0.5 shrink-0" />
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

      <section className="py-20 bg-[#f7f5f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Explore EquiProfile Academy
            </h2>
            <p className="text-[#1e293b]/60 text-lg mb-8 max-w-2xl mx-auto">
              Review the Academy features or contact us to discuss how the
              learning experience fits your equestrian organisation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/academy/contact">
                <Button
                  size="lg"
                  className="bg-[#c5a55a] hover:bg-[#a8873d] text-white text-base px-8 py-6 rounded-xl shadow-lg"
                >
                  Contact EquiProfile Academy
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/academy/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#0f1d2e] text-[#0f1d2e] hover:bg-[#0f1d2e] hover:text-white text-base px-8 py-6 rounded-xl"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </AcademyLayout>
  );
}
