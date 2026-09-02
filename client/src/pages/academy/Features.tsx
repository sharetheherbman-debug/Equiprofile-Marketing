import { Link } from "wouter";
import { ArrowRight, Award, BookOpenCheck, Bot, CheckCircle2, ClipboardCheck, Users } from "lucide-react";
import { AcademyLayout } from "@/components/academy/AcademyLayout";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BookOpenCheck, title: "Progressive learning", text: "Begin with the essentials, then build towards deeper judgement and more demanding situations. Each stage has a clear purpose and next step." },
  { icon: ClipboardCheck, title: "Learning by doing", text: "Use realistic scenarios, practical checklists, reflections and knowledge checks to connect reading with safe real-world learning." },
  { icon: Award, title: "Progress you can see", text: "Return to your current pathway, continue the next lesson and see completed work, assessments and achievements in one place." },
  { icon: Bot, title: "A helpful Tutor", text: "Ask for an explanation in the context of your lesson. Tutor supports learning while keeping veterinary and professional boundaries clear." },
  { icon: Users, title: "Support from your coach", text: "Coaches can recommend learning, review work and help riders develop between practical sessions." },
  { icon: CheckCircle2, title: "Tools for centres", text: "Schools and centres can organise learners, keep teaching consistent and understand where individuals or groups need support." },
];

export default function AcademyFeatures() {
  return (
    <AcademyLayout>
      <section className="bg-[#0f1d2e] pt-32 pb-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e4c97f]">How Academy helps</p>
          <h1 className="mt-5 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">Practical learning that grows with you</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">Build dependable knowledge, practise thoughtful decisions and keep moving towards the next meaningful level.</p>
        </div>
      </section>
      <section className="bg-[#f5f7fa] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f2f9] text-[#2e6da4]"><Icon className="h-6 w-6" /></div>
                <h2 className="mt-5 text-xl font-semibold text-[#0f1d2e]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#0f1d2e]">For your own learning</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {["Continue from exactly where you stopped", "Follow a clear pathway from foundation to advanced topics", "Check understanding as you learn", "Keep practical reflections and accomplishments together", "Ask Tutor for a clearer explanation"].map((item)=><li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a4f]" />{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#0f1d2e]">For coaches and centres</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {["Recommend lessons that reinforce practical teaching", "See learner progress and completed work", "Give constructive feedback", "Support consistent learning across groups", "Manage learner and instructor access appropriately"].map((item)=><li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a4f]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-[#163563] py-16 text-white"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><h2 className="font-serif text-3xl font-bold">Find the Academy plan that fits</h2><p className="mt-4 text-white/70">Choose an individual rider plan or compare options for a riding school or equestrian centre.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/academy/pricing"><Button size="lg" className="rounded-full bg-[#c5a55a] px-7 text-[#0f1d2e] hover:bg-[#d6bb76]">View Plans <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/register"><Button size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-7 text-white hover:bg-white/10">Start Free</Button></Link></div></div></section>
    </AcademyLayout>
  );
}
