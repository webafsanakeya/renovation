import Link from "next/link";
import {
  Building2,
  ClipboardList,
  Clock,
  Hammer,
  KeyRound,
  Layers,
  Mail,
  PencilRuler,
  Phone,
  Receipt,
  Ruler,
  Users,
  Wrench,
} from "lucide-react";
import CoverImage from "@/components/site/CoverImage";
import { SITE } from "@/lib/site";

const container = "mx-auto max-w-6xl px-4 sm:px-6";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";
const phoneHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

export function SectionTitle({
  id,
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          light ? "text-amber-300" : "text-amber-800"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-stone-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg ${light ? "text-stone-300" : "text-stone-600"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* 1. Four-icon strip under the hero */
const features = [
  {
    icon: Hammer,
    title: "Experienced Crafting",
    text: "Custom carpentry, cabinets and wardrobes built with care.",
  },
  {
    icon: Ruler,
    title: "Precision Craftsmanship",
    text: "Careful measuring and clean finishing on every joint and edge.",
  },
  {
    icon: Wrench,
    title: "Complete Home Solutions",
    text: "From a single shelf to a full renovation, handled end to end.",
  },
  {
    icon: Building2,
    title: "Commercial & Office Work",
    text: "Custom joinery and fit-outs for shops and workspaces.",
  },
];

export function FeatureStrip() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-stone-950 py-12 text-white sm:py-14"
    >
      <h2 id="features-heading" className="sr-only">
        What sets us apart
      </h2>
      <div className={`${container} grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-700/60 text-amber-400">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-sans text-sm font-semibold uppercase tracking-wider">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">
                {f.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* 2. Dark contact band */
export function ContactBand() {
  const pill =
    "inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 font-semibold transition-colors hover:bg-white/10";
  return (
    <section
      aria-labelledby="contact-band-heading"
      className="bg-stone-900 py-10 text-white"
    >
      <div
        className={`${container} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}
      >
        <div>
          <h2
            id="contact-band-heading"
            className="text-2xl font-bold sm:text-3xl"
          >
            Have a carpentry or renovation project?
          </h2>
          <p className="mt-1 text-stone-300">
            Speak with our team about your plans.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={phoneHref} className={`${pill} ${focusRing}`}>
            <Phone aria-hidden="true" className="h-4 w-4 text-amber-400" />
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className={`${pill} ${focusRing}`}>
            <Mail aria-hidden="true" className="h-4 w-4 text-amber-400" />
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}

/* 3. About teaser: image left, text right */
export function AboutTeaser({ image }: { image?: string }) {
  return (
    <section
      aria-labelledby="about-teaser-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div
        className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}
      >
        <CoverImage
          src={image}
          alt=""
          sizes="(min-width: 1024px) 560px, 100vw"
          className="aspect-4/3 w-full rounded-2xl shadow-lg"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
            About us
          </p>
          <h2
            id="about-teaser-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          >
            Built by Hand, Finished with Care
          </h2>
          <p className="mt-4 text-lg leading-8 text-stone-700">
            What started as a small carpentry workshop has grown into a full
            renovation service. We measure carefully, build properly and keep
            you updated at every step.
          </p>
          <p className="mt-4 text-stone-600">{SITE.address}</p>
          <Link
            href="/about"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-amber-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Learn more about us{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 4. Why choose us: image + four points */
const reasons = [
  {
    icon: Receipt,
    title: "Free Quote",
    text: "Clear, itemized pricing before any work begins.",
  },
  {
    icon: Layers,
    title: "Quality Materials",
    text: "Durable materials and clean, careful finishing.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    text: "A fixed timeline that we plan and stick to.",
  },
  {
    icon: Users,
    title: "Skilled Carpenters",
    text: "Experienced craftsmen who treat your home with care.",
  },
];

export function WhyChoose({ image }: { image?: string }) {
  return (
    <section
      aria-labelledby="why-heading"
      className="bg-[#f3ebe1] py-16 sm:py-20"
    >
      <div
        className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}
      >
        <div className="lg:order-2">
          <CoverImage
            src={image}
            alt=""
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-4/3 w-full rounded-2xl shadow-lg"
          />
        </div>
        <div className="lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
            Why choose us
          </p>
          <h2
            id="why-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          >
            Service You Can Rely On
          </h2>
          <ul className="mt-8 space-y-6">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <li key={r.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      {r.title}
                    </h3>
                    <p className="mt-0.5 text-stone-600">{r.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 5. How we work: brown band, four numbered steps */
const steps = [
  {
    icon: ClipboardList,
    title: "Consultation",
    text: "We visit, listen and understand what you need.",
  },
  {
    icon: PencilRuler,
    title: "Design & Quote",
    text: "You get a clear plan, timeline and itemized price.",
  },
  {
    icon: Hammer,
    title: "Build",
    text: "Our carpenters build with care and keep you updated.",
  },
  {
    icon: KeyRound,
    title: "Handover",
    text: "We check every detail with you before we finish.",
  },
];

export function HowWeWork() {
  return (
    <section
      aria-labelledby="process-heading"
      className="bg-amber-950 py-16 text-white sm:py-20"
    >
      <div className={container}>
        <SectionTitle
          id="process-heading"
          eyebrow="Our process"
          title="How We Work"
          subtitle="Four simple steps from idea to finished space."
          light
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-4 text-5xl font-bold text-white/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon aria-hidden="true" className="h-8 w-8 text-amber-400" />
                <h3 className="mt-5 text-lg font-semibold">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  {s.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* 6. Masonry portfolio built from project images */
type GalleryProject = {
  title: string;
  slug: string;
  coverImage?: string;
  gallery?: string[];
};

const aspects = [
  "aspect-3/4",
  "aspect-square",
  "aspect-4/5",
  "aspect-4/3",
  "aspect-3/4",
  "aspect-square",
  "aspect-4/5",
  "aspect-3/4",
  "aspect-square",
];

export function PortfolioGallery({ projects }: { projects: GalleryProject[] }) {
  const seen = new Set<string>();
  const tiles: { src: string; title: string; slug: string }[] = [];
  for (const p of projects) {
    for (const src of [p.coverImage, ...(p.gallery ?? [])]) {
      if (src && !seen.has(src) && tiles.length < 9) {
        seen.add(src);
        tiles.push({ src, title: p.title, slug: p.slug });
      }
    }
  }
  if (tiles.length < 3) return null;

  return (
    <section
      aria-labelledby="gallery-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div className={container}>
        <SectionTitle
          id="gallery-heading"
          eyebrow="Portfolio"
          title="Work We're Proud Of"
          subtitle="A closer look at our finished spaces."
        />
        <div className="columns-2 gap-4 lg:columns-3">
          {tiles.map((t, i) => (
            <Link
              key={t.src}
              href={`/projects/${t.slug}`}
              className="group mb-4 block break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              <CoverImage
                src={t.src}
                alt={t.title}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className={`${aspects[i % aspects.length]} w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. Closing CTA with two buttons */
export function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-amber-900 py-16 text-center text-white sm:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 id="cta-heading" className="text-3xl font-bold sm:text-4xl">
          Ready to start your project?
        </h2>
        <p className="mt-3 text-lg text-amber-100">
          Tell us what you have in mind and get a free quote.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get Free Quote
          </Link>
          <a
            href={phoneHref}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/50 px-8 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
}
