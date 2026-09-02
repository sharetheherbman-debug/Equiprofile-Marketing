import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SchoolLayout } from "@/components/school/SchoolLayout";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  Mail,
  Clock,
  Users,
  GraduationCap,
  HeadphonesIcon,
  Loader2,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const benefits = [
  {
    icon: GraduationCap,
    title: "Plan Guidance",
    description:
      "Ask about the Academy plan that fits your school's size, needs and disciplines.",
  },
  {
    icon: Clock,
    title: "Free 14-Day Trial",
    description:
      "Create an account and explore the available Academy experience with no credit card required.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Get assigned a real equestrian education specialist who understands your school's challenges.",
  },
  {
    icon: Users,
    title: "Onboarding Help",
    description:
      "Our team helps you set up pathways, import students, and configure your school — at no extra cost.",
  },
];

const contactDetails = [
  {
    icon: Mail,
    label: "Email Us",
    value: "schools@equiprofile.online",
    href: "mailto:schools@equiprofile.online",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri, 9am–5pm GMT",
    href: null,
  },
];

export default function SchoolContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolName: "",
    numberOfStudents: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
          subject: "Academy School Enquiry",
          source: "school",
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Enquiry sent", {
        description:
          "We received your message and will reply using the email address you supplied.",
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
        description: "Please try again or email us directly at schools@equiprofile.online.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SchoolLayout>
      {/* ───── Hero ───── */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e4d8c] to-[#2d6a4f] pt-28 pb-20 overflow-hidden">
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
            Get in Touch
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Contact the{" "}
            <span className="text-[#10b981]">Academy team</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Ask how EquiProfile Academy can support your equestrian education.
            Fill in the form below and tell us what your school needs.
          </motion.p>
        </div>
      </section>

      {/* ───── Form + Sidebar ───── */}
      <section className="py-24 bg-[#f0f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <h2 className="font-serif text-2xl font-bold text-[#1e293b] mb-2">
                  Send an Academy Enquiry
                </h2>
                <p className="text-[#1e293b]/60 text-sm mb-8">
                  Tell us about your school and the learning support you need.
                  All fields are required.
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f0f4f8] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition-colors text-sm"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f0f4f8] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="schoolName"
                        className="block text-sm font-medium text-[#1e293b] mb-2"
                      >
                        School Name
                      </label>
                      <input
                        id="schoolName"
                        name="schoolName"
                        type="text"
                        required
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="Meadow Vale Equestrian"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f0f4f8] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition-colors text-sm"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f0f4f8] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition-colors text-sm"
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
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your school, what disciplines you teach, and what you're looking for in a learning platform..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f0f4f8] text-[#1e293b] placeholder:text-[#1e293b]/30 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition-colors text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full bg-[#2d6a4f] hover:bg-[#236b45] text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-[#2d6a4f]/20 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Send Enquiry
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Benefits */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h3 className="font-serif text-lg font-bold text-[#1e293b] mb-6">
                  What You'll Get
                </h3>
                <div className="space-y-5">
                  {benefits.map((benefit, idx) => (
                    <motion.div
                      key={benefit.title}
                      {...fadeUp}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d6a4f] to-[#1e4d8c] flex items-center justify-center text-white shrink-0">
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

              {/* Contact Details */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#1e4d8c] rounded-2xl p-7 text-white">
                <h3 className="font-serif text-lg font-bold mb-6">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-5">
                  {contactDetails.map((detail) => (
                    <div key={detail.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <detail.icon className="w-5 h-5 text-[#10b981]" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-0.5">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="text-sm font-medium text-white hover:text-[#10b981] transition-colors"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-white">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#1e293b] mb-1">
                  No Obligation
                </p>
                <p className="text-xs text-[#1e293b]/60">
                  Sending an enquiry creates no commitment. We will not pressure
                  you into a plan.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
