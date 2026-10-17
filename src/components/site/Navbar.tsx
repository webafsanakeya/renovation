"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const phoneHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden bg-amber-900 text-xs text-white sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <a href={`mailto:${SITE.email}`} className={`hover:underline ${focusRing}`}>
            {SITE.email}
          </a>
          <a href={phoneHref} className={`hover:underline ${focusRing}`}>
            {SITE.phone}
          </a>
        </div>
      </div>

      <nav aria-label="Main" className="bg-stone-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className={`font-heading text-xl font-bold tracking-tight ${focusRing}`}
          >
            {SITE.name}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${focusRing} ${
                    isActive(l.href)
                      ? "bg-amber-800 text-white"
                      : "text-stone-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className={`hidden rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold transition-colors hover:bg-amber-800 md:block ${focusRing}`}
          >
            Get Free Quote
          </Link>

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden ${focusRing}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <ul id="mobile-menu" className="space-y-1 border-t border-stone-800 px-4 py-3 md:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base ${focusRing} ${
                    isActive(l.href) ? "bg-amber-800" : "text-stone-300"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={`mt-2 block rounded-full bg-amber-700 px-3 py-3 text-center font-semibold ${focusRing}`}
              >
                Get Free Quote
              </Link>
            </li>
            <li>
              <a
                href={phoneHref}
                className={`block px-3 py-3 text-center text-sm text-stone-300 ${focusRing}`}
              >
                Call {SITE.phone}
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}