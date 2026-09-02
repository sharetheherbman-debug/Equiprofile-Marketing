import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { FREE_TRIAL_DAYS } from "@shared/pricing";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  Mail,
  Users,
  GraduationCap,
  Layers,
  Loader2,
} from "lucide-react";
import { trackMeasurementEvent } from "@/analytics";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const benefits = [
  {
    icon: GraduationCap,
    title: "Academy Walkthrough",
    description:
      "Discuss the student, coach, learning-pathway, progress, competency, assignment, and education-management foundations already in EquiProfile.",
  },
  {
    icon: Users,
    title: "Organisation Fit",
    description:
      "Tell us about your riding school, equestrian centre, instructors, students, and learning programme so the conversation can focus on your real needs.",
  },
  {
    icon: Layers,
    title: "Connected EquiProfile Experience",
    description:
      "See how Academy is designed to reuse EquiProfile accounts, roles, data conventions, and management foundations rather than operate as a disconnected LMS.",
  },
  {
    icon: CheckCircle2,
    title: `${FREE_TRIAL_DAYS}-Day Trial Configuration`,
    description: `The current EquiProfile pricing source of truth defines a ${FREE_TRIAL_DAYS}-day free trial across plans. Current commercial terms can be confirmed during your enquiry.`,
  },
];

export default function AcademyContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolName: "",
    numberOfStudents: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          schoolName: formData.schoolName,
          numberOfStudents: formData.numberOfStudents,
          message: formData.message,
          subject: "EquiProfile Academy Enquiry",
          // Keep the established backend source identifier for compatibility.
          source: "academy",
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      trackMeasurementEvent("generate_lead", {
        lead_source: "academy_contact",
      });

      toast.success("Academy enquiry sent", {
        description:
          "We received your enquiry and can follow up using the email address you supplied.",
      });

      setFormData({
        name: "",
        email: "",
        schoolName: "",
        numberOfStudents: "",
        message: "",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again or email schools@equiprofile.online.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AcademyLayout>
      <section className="relative bg-gradient-to-br from-[#0f1d2e] via-[#163563] to-[#c5a55a] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 40% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
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
            <Send className="w-4 h-4" />
            EquiProfile Academy
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Discuss the <span className="text-[#c5a55a]">Academy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Tell us about your equestrian organisation and what you need from a
            connected learning platform. The form below sends a real enquiry
            through the existing EquiProfile contact endpoint.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <motion.div {...fadeUp} className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <h2 className="font-serif text-2xl font-bold text-[#1e293b] mb-2">
                  Contact the Academy Team
                </h2>
                <p className="text-[#1e293b]/60 text-sm mb-8">
                  Tell us about your riding school or equestrian organisation so
                  the discussion can focus on the right Academy workflows. All
                  fields are required.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#1e293b] mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f5f0] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 focus:border-[#c5a55a] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#1e293b] mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@ridingschool.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f5f0] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 focus:border-[#c5a55a] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="schoolName"
                        className="block text-sm font-medium text-[#1e293b] mb-2"
                      >
                        Riding School / Organisation
                      </label>
                      <input
                        id="schoolName"
                        name="schoolName"
                        type="text"
                        required
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="Meadow Vale Equestrian"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f5f0] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 focus:border-[#c5a55a] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="numberOfStudents"
                        className="block text-sm font-medium text-[#1e293b] mb-2"
                      >
                        Number of Students
                      </label>
                      <select
                        id="numberOfStudents"
                        name="numberOfStudents"
                        required
                        value={formData.numberOfStudents}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f5f0] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 focus:border-[#c5a55a] transition-colors text-sm"
                      >
                        <option value="">Select range...</option>
                        <option value="1-10">1 – 10 students</option>
                        <option value="11-20">11 – 20 students</option>
                        <option value="21-50">21 – 50 students</option>
                        <option value="50+">50+ students</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1e293b] mb-2"
                    >
                      What would you like to see?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your students, coaches, current learning process, and the Academy workflows you want to explore..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f5f0] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 focus:border-[#c5a55a] transition-colors text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full bg-[#c5a55a] hover:bg-[#a8873d] text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-[#c5a55a]/20 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Send Academy Enquiry
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h3 className="font-serif text-lg font-bold text-[#1e293b] mb-6">
                  What We Can Discuss
                </h3>
                <div className="space-y-5">
                  {benefits.map((benefit, idx) => (
                    <motion.div
                      key={benefit.title}
                      {...fadeUp}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center text-white shrink-0">
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#1e293b] mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-[#1e293b]/60 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0f1d2e] to-[#163563] rounded-2xl p-7 text-white">
                <h3 className="font-serif text-lg font-bold mb-5">Email</h3>
                <a
                  href="mailto:schools@equiprofile.online"
                  className="flex items-center gap-3 text-sm font-medium text-white hover:text-[#c5a55a] transition-colors"
                >
                  <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#c5a55a]" />
                  </span>
                  schools@equiprofile.online
                </a>
              </div>

              <div className="bg-[#c5a55a]/5 border border-[#c5a55a]/20 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#c5a55a] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#1e293b] mb-1">
                  A real contact form
                </p>
                <p className="text-xs text-[#1e293b]/60">
                  Your message is sent securely to the EquiProfile team. We do
                  not display invented bookings, customers, response-time
                  guarantees, or support commitments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </AcademyLayout>
  );
}
