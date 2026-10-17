"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Counts = { total: number; published: number; drafts: number };
type RecentMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
};
type Stats = {
  services: Counts;
  blogs: Counts;
  projects: Counts;
  messages: { total: number; recent: RecentMessage[] };
};

const resources = [
  { key: "services", label: "Services", href: "/admin/services", hint: "What you offer" },
  { key: "blogs", label: "Blogs", href: "/admin/blogs", hint: "Articles and vlogs" },
  { key: "projects", label: "Projects", href: "/admin/projects", hint: "Finished work" },
] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function shortDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data: Stats) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setFailed(false);
    setStats(null);
    setAttempt((n) => n + 1);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const drafts = stats ? stats.services.drafts + stats.blogs.drafts + stats.projects.drafts : 0;

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100">
      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">Dashboard</h1>
            <p className="text-stone-600">Manage your website content and messages.</p>
          </div>
          <div className="flex gap-2">
           <Link
  href="/"
  target="_blank"
  rel="noopener"
  className="inline-flex h-9 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-amber-700"
>
  View site
</Link>
            <Button className="bg-amber-800 text-white hover:bg-amber-900" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {failed && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Could not load dashboard data. Your session may have expired.{" "}
            <button onClick={retry} className="font-semibold underline">Try again</button>
            {" or "}
            <Link href="/admin/login" className="font-semibold underline">log in again</Link>.
          </div>
        )}

        {stats && drafts > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-100/60 p-4 text-sm text-amber-900">
            You have <strong>{drafts}</strong> draft{drafts === 1 ? "" : "s"} waiting to be published.
          </div>
        )}

        {!stats && !failed ? (
          <div className="grid gap-4 sm:grid-cols-3" aria-busy="true" aria-label="Loading dashboard">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-amber-100 bg-white/70" />
            ))}
          </div>
        ) : stats ? (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {resources.map((r) => {
                const c = stats[r.key];
                return (
                  <motion.div key={r.key} variants={rise} whileHover={{ y: -4 }}>
                    <Link
                      href={r.href}
                      className="block rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-amber-700"
                    >
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">{r.label}</h2>
                      <p className="mt-2 text-4xl font-bold text-stone-900">{c.total}</p>
                      <p className="text-sm text-stone-500">{r.hint}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-green-800">{c.published} published</span>
                        <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-stone-700">{c.drafts} draft</span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-amber-800">Manage →</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.section variants={rise} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-stone-900">Recent messages</h2>
                <span className="text-sm text-stone-500">{stats.messages.total} total</span>
              </div>
              {stats.messages.recent.length === 0 ? (
                <p className="text-sm text-stone-500">No messages yet. New contact form submissions will appear here.</p>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {stats.messages.recent.map((m) => (
                    <li key={m._id} className="py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-stone-900">{m.name}</p>
                        <p className="text-xs text-stone-500">{shortDate(m.createdAt)}</p>
                      </div>
                      <p className="text-sm text-stone-600">
                        {m.email}
                        {m.phone ? ` · ${m.phone}` : ""}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-700">{m.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}