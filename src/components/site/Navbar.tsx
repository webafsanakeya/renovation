"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden bg-amber-900 text-xs text-white sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <span>{SITE.email}</span>
          <span>{SITE.phone}</span>
        </div>
      </div>
      <nav className="bg-stone-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {SITE.name}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(l.href) ? "bg-amber-800 text-white" : "text-stone-300 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="hidden rounded-full bg-amber-800 px-5 py-2 text-sm font-semibold hover:bg-amber-900 md:block"
          >
            Get Free Quote
          </Link>

          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <ul className="space-y-1 border-t border-stone-800 px-4 py-3 md:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm ${
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
                className="mt-2 block rounded-lg bg-amber-800 px-3 py-2 text-center text-sm font-semibold"
              >
                Get Free Quote
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}