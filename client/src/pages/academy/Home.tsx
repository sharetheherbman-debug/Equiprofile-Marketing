import { Link } from "wouter";
import { ArrowRight, Award, BookOpen, CheckCircle2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { Button } from "@/components/ui/button";

const audiences = [
  {
    icon: BookOpen,
    title: "Individual riders",
    text: "Learn horse care properly, build practical knowledge and become safer and more confident around horses.",
  },
  {
    icon: ShieldCheck,
    title: "Horse owners",
    text: "Understand everyday care more clearly, notice meaningful changes and know when to involve a qualified professional.",
  },
  {
    icon: TrendingUp,
    title: "Coaches",
    text: "Give riders purposeful learning between sessions, review progress and support the next practical step.",
  },
  {
    icon: Users,
    title: "Riding schools and centres",
    text: "Offer consistent learning pathways, organise groups and help every student see how they are developing.",
  },
];

const benefits = [
  "Foundation, intermediate and advanced learning that genuinely progresses",
  "Substantial lessons with examples, knowledge checks and practical reflection",
  "Clear progress, next lessons, assessments and achievements",
  "Supportive Tutor help connected to the lesson you are studying",
];

export default function AcademyHome() {
  return (
    <AcademyLayout>
      <section className="relative overflow-hidden bg-[#0f1d2e] pt-32 pb-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(46,109,164,0.36),transparent_42%),radial-gradient(circle_at_20%_90%,rgba(197,165,90,0.18),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e4c97f]">EquiProfile Academy</p>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Learn more. Care better. Grow with confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Practical equestrian learning for riders, owners, coaches and centres—built to help knowledge grow from safe foundations into confident, thoughtful practice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register"><Button size="lg" className="rounded-full bg-[#c5a55a] px-7 text-[#0f1d2e] hover:bg-[#d6bb76]">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link href="/academy/pricing"><Button size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-7 text-white hover:bg-white/10">View Plans</Button></Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl">
            <img src="/images/hero/image1.jpg" alt="Rider learning with a horse in a calm equestrian setting" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2e6da4]">Made for the whole equestrian community</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#0f1d2e] sm:text-4xl">Learning that meets you where you are</h2>
            <p className="mt-4 leading-7 text-slate-600">Choose your own learning journey or use Academy with a coach, school or centre.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2f9] text-[#2e6da4]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-semibold text-[#0f1d2e]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2e6da4]">A journey worth continuing</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#0f1d2e] sm:text-4xl">Progress beyond the basics</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">Start with safe everyday foundations, develop sound judgement through realistic situations and move into deeper ownership, welfare, training, coaching and yard-management topics.</p>
            <ul className="mt-7 space-y-4">
              {benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a4f]" />{benefit}</li>)}
            </ul>
            <Link href="/academy/features" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2e6da4] hover:text-[#245a8a]">Explore how Academy works <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[{ icon: BookOpen, value: "95", label: "substantial lessons" }, { icon: TrendingUp, value: "4", label: "progressive levels" }, { icon: Award, value: "15", label: "learning pathways" }, { icon: ShieldCheck, value: "Safe", label: "professional boundaries" }].map(({icon: Icon,value,label}) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6"><Icon className="h-6 w-6 text-[#2e6da4]" /><p className="mt-5 text-3xl font-bold text-[#0f1d2e]">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#163563] py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to start learning?</h2>
          <p className="mt-4 max-w-2xl text-white/70">Create your Academy account and begin with the pathway that fits your experience.</p>
          <Link href="/register" className="mt-7"><Button size="lg" className="rounded-full bg-[#c5a55a] px-8 text-[#0f1d2e] hover:bg-[#d6bb76]">Create Account <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>
    </AcademyLayout>
  );
}
