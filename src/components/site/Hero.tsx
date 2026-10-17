import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, Receipt, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300";

const trust = [
  { icon: BadgeCheck, label: "Quality Workmanship" },
  { icon: Receipt, label: "Free itemized Quote" },
  { icon: Clock, label: "On-Time Delivery" },
  { icon: ShieldCheck, label: "No Hidden Costs" },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-stone-950 text-white"
    >
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-stone-950/90 via-stone-950/70 to-stone-950/20"
      />

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-36">
        <span className="inline-block rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Carpentry &amp; Home Renovation
        </span>
        <h1
          id="hero-heading"
          className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Custom Carpentry and Renovation, Built to Last
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-200">
          {SITE.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className={`inline-flex min-h-12 items-center rounded-full bg-amber-700 px-7 font-semibold transition-colors hover:bg-amber-800 ${focusRing}`}
          >
            Get Free Quote
          </Link>
          <Link
            href="/projects"
            className={`inline-flex min-h-12 items-center rounded-full border border-white/40 px-7 font-semibold transition-colors hover:bg-white/10 ${focusRing}`}
          >
            See Our Work
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15 bg-black/35 backdrop-blur-sm">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4">
          {trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 text-sm font-medium text-stone-100"
            >
              <Icon
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-amber-400"
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
