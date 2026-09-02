import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ManagementLayout } from "@/components/management/ManagementLayout";
import { MgmtHero } from "@/components/management/MgmtHero";
import { toast } from "sonner";
import {
  Mail,
  Clock,
  Send,
  MessageSquare,
  Loader2,
  CheckCircle2,
  HeadphonesIcon,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { trackMeasurementEvent } from "@/analytics";

/* ------------------------------------------------------------------ */
/*  Animation helper                                                   */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const benefits = [
  {
    icon: Zap,
    title: "Fast Response",
    description:
      "We typically reply within one business day. Priority support customers receive responses within 4 hours.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Speak directly with the team behind EquiProfile — no generic helpdesk bots, real people who know the product.",
  },
  {
    icon: ShieldCheck,
    title: "Plans and product help",
    description:
      "Ask about features, plans or getting started and the EquiProfile team will help.",
  },
  {
    icon: MessageSquare,
    title: "Quick Answers",
    description:
      "Many common questions are answered in our Pricing FAQ — check there first for instant answers.",
  },
];

const contactDetails = [
  {
    icon: Mail,
    label: "General Enquiries",
    value: "hello@equiprofile.online",
    href: "mailto:hello@equiprofile.online",
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

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "management" }),
      });

      if (!res.ok) throw new Error("Request failed");

      trackMeasurementEvent("generate_lead", {
        lead_source: "management_contact",
      });

      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
      setForm(initialForm);
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  /* shared input classes */
  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-[#f0f4f8] px-4 py-3 text-[#0f1d2e] placeholder:text-[#0f1d2e]/30 outline-none transition-all focus:border-[#2e6da4] focus:ring-2 focus:ring-[#2e6da4]/20 text-sm";

  return (
    <ManagementLayout hidePreFooterCta>
      <div className="min-h-screen">

        {/* ======================== HERO ======================== */}
        <MgmtHero
          imageSrc="/images/management/contact-v2.jpg"
          imageAlt="Horse and rider at the yard"
          eyebrow="Get in Touch"
          eyebrowVariant="glass"
          EyebrowIcon={Send}
          title={
            <>
              We'd love to{" "}
              <span className="text-[#c5a55a]">hear from you</span>
            </>
          }
          subtitle="Have a product question or just want to say hello? Fill in the form and we'll be in touch."
          minHeight="min-h-[500px] md:min-h-[560px]"
        />

        {/* ================= FORM + SIDEBAR ================= */}
        <section className="py-24 bg-[#f0f4f8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

              {/* ---- FORM (3 columns) ---- */}
              <motion.div
                {...fadeUp}
                className="lg:col-span-3"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
                  <h2 className="font-serif text-2xl font-bold text-[#0f1d2e] mb-2">
                    Send us a message
                  </h2>
                  <p className="text-[#0f1d2e]/55 text-sm mb-8">
                    Fill in the form below and we'll respond within one business day.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-[#0f1d2e] mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-[#0f1d2e] mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-[#0f1d2e] mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        placeholder="What's this about?"
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className={inputBase}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-[#0f1d2e] mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={6}
                        required
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={`${inputBase} resize-none`}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full bg-[#2e6da4] hover:bg-[#256091] text-white font-semibold rounded-xl py-6 text-base shadow-lg shadow-[#2e6da4]/20 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* ---- SIDEBAR (2 columns) ---- */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Benefits */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                  <h3 className="font-serif text-lg font-bold text-[#0f1d2e] mb-6">
                    What to Expect
                  </h3>
                  <div className="space-y-5">
                    {benefits.map((benefit, idx) => (
                      <motion.div
                        key={benefit.title}
                        {...fadeUp}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className="flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2e6da4] to-[#1a7a6d] flex items-center justify-center text-white shrink-0">
                          <benefit.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#0f1d2e] mb-1">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-[#0f1d2e]/55 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact details */}
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#1e4d8c] rounded-2xl p-7 text-white">
                  <h3 className="font-serif text-lg font-bold mb-6">
                    Other Ways to Reach Us
                  </h3>
                  <div className="space-y-5">
                    {/* WhatsApp */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ color: "#25D366" }}>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-0.5">WhatsApp (Priority Support)</p>
                        <a
                          href="https://wa.me/447347258089"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#25D366] hover:underline"
                        >
                          +44 7347 258089
                        </a>
                      </div>
                    </div>

                    {contactDetails.map((detail) => (
                      <div key={detail.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <detail.icon className="w-5 h-5 text-[#c5a55a]" />
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-0.5">
                            {detail.label}
                          </p>
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="text-sm font-medium text-white hover:text-[#c5a55a] transition-colors"
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

                {/* Trust badge */}
                <div className="bg-[#2e6da4]/5 border border-[#2e6da4]/20 rounded-2xl p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#2e6da4] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#0f1d2e] mb-1">
                    No Pressure
                  </p>
                  <p className="text-xs text-[#0f1d2e]/55">
                    Every enquiry is answered personally. We'll never push you
                    into a plan you don't need.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </div>
    </ManagementLayout>
  );
}

