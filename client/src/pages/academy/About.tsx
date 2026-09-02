import { Link } from "wouter";
import { ArrowRight, Heart, Lightbulb, ShieldCheck, TrendingUp } from "lucide-react";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { Button } from "@/components/ui/button";

export default function AcademyAbout() {
  return (
    <AcademyLayout>
      <section className="bg-[#0f1d2e] pt-32 pb-20 text-white"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e4c97f]">About EquiProfile Academy</p><h1 className="mt-5 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">Better knowledge supports better horsemanship</h1><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">Academy helps people develop the understanding, confidence and sound judgement that sit behind responsible equestrian practice.</p></div></section>
      <section className="py-20"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><img src="/images/hero/image2.jpg" alt="Coach supporting an equestrian learner" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"/><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2e6da4]">Our purpose</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#0f1d2e] sm:text-4xl">Make meaningful equestrian learning easier to continue</h2><p className="mt-5 leading-7 text-slate-600">Time with horses matters, but practical sessions alone cannot cover every care, welfare, ownership and decision-making topic. Academy gives riders and owners a clear place to keep learning between those moments.</p><p className="mt-4 leading-7 text-slate-600">It complements qualified teaching and professional advice. It does not replace a coach, veterinarian, farrier, nutrition professional or other suitably qualified expert.</p></div></div></section>
      <section className="bg-[#f5f7fa] py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[
        {icon: ShieldCheck,title:"Safety first",text:"Clear boundaries help learners know when to stop and involve a qualified professional."},
        {icon: TrendingUp,title:"Real progression",text:"Later learning asks for deeper observation, reasoning and responsibility—not just repeated basics."},
        {icon: Lightbulb,title:"Useful understanding",text:"Examples and reflection turn information into better questions and more thoughtful everyday decisions."},
        {icon: Heart,title:"Horse welfare",text:"Learning keeps the horse's needs, individual circumstances and responsible care at the centre."},
      ].map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="h-6 w-6 text-[#2e6da4]"/><h2 className="mt-5 text-lg font-semibold text-[#0f1d2e]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></div></section>
      <section className="bg-[#163563] py-16 text-white"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><h2 className="font-serif text-3xl font-bold">Begin your learning journey</h2><p className="mt-4 text-white/70">Explore the pathways and choose a plan for yourself or your organisation.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/register"><Button size="lg" className="rounded-full bg-[#c5a55a] px-7 text-[#0f1d2e] hover:bg-[#d6bb76]">Create Account <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/academy/pricing"><Button size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-7 text-white hover:bg-white/10">View Plans</Button></Link></div></div></section>
    </AcademyLayout>
  );
}
