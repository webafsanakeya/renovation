import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our carpentry and home renovation team and how we work.",
};

const steps = [
  { title: "Consultation", text: "We visit, listen and understand what you need." },
  { title: "Design & Quote", text: "You get a clear plan, timeline and itemised price." },
  { title: "Build", text: "Our carpenters build with care and keep you updated." },
  { title: "Handover", text: "We check every detail with you before we finish." },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="bg-stone-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold tracking-tight">About {SITE.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-300">
            We are a team of carpenters and renovation specialists who care about quality,
            honest pricing and homes that work for the people living in them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-stone-900">Our Story</h2>
        <p className="mt-3 leading-relaxed text-stone-700">
          What started as a small carpentry workshop has grown into a full renovation service.
          We still approach every job the same way: measure carefully, build properly and
          communicate clearly. Whether it is a single wardrobe or a complete kitchen, we treat
          your home like our own.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-stone-900">How We Work</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-amber-800">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{s.text}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="mt-12 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900">
          Talk to Us
        </Link>
      </section>
    </div>
  );
}