import Link from "next/link";
import { SITE } from "@/lib/site";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";
const linkCls = `inline-block py-1 transition-colors hover:text-white ${focusRing}`;

export default function Footer() {
  const phoneHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-heading text-xl font-bold text-white">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{SITE.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Explore</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/services" className={linkCls}>Services</Link></li>
            <li><Link href="/projects" className={linkCls}>Projects</Link></li>
            <li><Link href="/blog" className={linkCls}>Blog</Link></li>
            <li><Link href="/about" className={linkCls}>About</Link></li>
            <li><Link href="/contact" className={linkCls}>Contact</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Contact</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><a href={phoneHref} className={linkCls}>{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className={linkCls}>{SITE.email}</a></li>
            <li className="py-1">{SITE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}