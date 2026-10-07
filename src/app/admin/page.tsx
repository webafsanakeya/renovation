"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const sections = [
  { title: "Services", desc: "Create, edit and publish your services", href: "/admin/services", icon: "🛠️" },
  { title: "Blogs", desc: "Write and manage blog posts", href: "/admin/blogs", icon: "📝" },
  { title: "Projects", desc: "Showcase your completed projects", href: "/admin/projects", icon: "🏠" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100">
    <main className="mx-auto w-full max-w-5xl p-6">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-90">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
        </div>
        <Button className="bg-amber-800 text-white hover:bg-amber-900" onClick={handleLogout}>
          Logout
        </Button>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sections.map((s) => (
          <motion.div
            key={s.title}
            variants={card}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={s.href}
              className="block rounded-xl border border-amber-100 bg-white p-6 shadow-sm transition-shadow hover:border-amber-300 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{s.icon}</div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
    </div>
  );
}