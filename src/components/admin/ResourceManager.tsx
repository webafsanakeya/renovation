"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Resource = "services" | "blogs" | "projects";

type Item = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  published: boolean;
  author?: string;
  videoUrl?: string;
  location?: string;
  completedAt?: string;
  gallery?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
};

const emptyForm = {
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  coverImage: "",
  published: false,
  author: "",
  videoUrl: "",
  location: "",
  completedAt: "",
  gallery: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
};
type FormState = typeof emptyForm;

const fieldCls =
  "w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-700/40";

function toForm(i: Item): FormState {
  return {
    title: i.title ?? "",
    slug: i.slug ?? "",
    shortDescription: i.shortDescription ?? "",
    content: i.content ?? "",
    coverImage: i.coverImage ?? "",
    published: !!i.published,
    author: i.author ?? "",
    videoUrl: i.videoUrl ?? "",
    location: i.location ?? "",
    completedAt: i.completedAt ? i.completedAt.slice(0, 10) : "",
    gallery: (i.gallery ?? []).join("\n"),
    metaTitle: i.seo?.metaTitle ?? "",
    metaDescription: i.seo?.metaDescription ?? "",
    keywords: (i.seo?.keywords ?? []).join(", "),
    ogTitle: i.seo?.ogTitle ?? "",
    ogDescription: i.seo?.ogDescription ?? "",
    ogImage: i.seo?.ogImage ?? "",
    canonicalUrl: i.seo?.canonicalUrl ?? "",
  };
}

function toPayload(f: FormState, resource: Resource) {
  const payload: Record<string, unknown> = {
    title: f.title.trim(),
    slug: f.slug.trim() || undefined,
    shortDescription: f.shortDescription,
    content: f.content,
    coverImage: f.coverImage,
    published: f.published,
    seo: {
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
      keywords: f.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      ogTitle: f.ogTitle,
      ogDescription: f.ogDescription,
      ogImage: f.ogImage,
      canonicalUrl: f.canonicalUrl,
    },
  };
  if (resource === "blogs") {
    payload.author = f.author || "Admin";
    payload.videoUrl = f.videoUrl.trim();
  }
  if (resource === "projects") {
    payload.location = f.location;
    payload.completedAt = f.completedAt || undefined;
    payload.gallery = f.gallery
      .split(/[\n,]/)
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return payload;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ResourceManager({
  resource,
  label,
}: {
  resource: Resource;
  label: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const base = `/api/admin/${resource}`;

  async function load() {
    try {
      const res = await fetch(base);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(item: Item) {
    setEditingId(item._id);
    setForm(toForm(item));
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editingId ? `${base}/${editingId}` : base, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form, resource)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong");
        return;
      }
      setShowForm(false);
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: Item) {
    await fetch(`${base}/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    await load();
  }

  async function handleDelete(item: Item) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await fetch(`${base}/${item._id}`, { method: "DELETE" });
    await load();
  }

  // Simple SEO checklist (bonus)
  const checks = [
    {
      ok: form.metaTitle.length >= 30 && form.metaTitle.length <= 60,
      text: "Meta title 30-60 characters",
    },
    {
      ok:
        form.metaDescription.length >= 120 &&
        form.metaDescription.length <= 160,
      text: "Meta description 120-160 characters",
    },
    { ok: form.keywords.trim().length > 0, text: "Keywords added" },
    {
      ok: form.ogImage.trim().length > 0 || form.coverImage.trim().length > 0,
      text: "OG / cover image set",
    },
    {
      ok: form.title.length > 0 || form.slug.length > 0,
      text: "Slug present (auto-generated if empty)",
    },
  ];
  const score = Math.round(
    (checks.filter((c) => c.ok).length / checks.length) * 100,
  );

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100">
      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm text-amber-800 hover:underline"
            >
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              {label}
            </h1>
          </div>
          <Button
            className="bg-amber-800 text-white hover:bg-amber-900"
            onClick={openNew}
          >
            + New
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mb-8 space-y-4 rounded-xl border border-amber-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit" : "Create"} {label}
              </h2>

              <Field label="Title *">
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </Field>
              <Field
                label="Slug"
                hint="Leave empty to auto-generate from title"
              >
                <Input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </Field>
              <Field label="Short description *">
                <textarea
                  className={fieldCls}
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  required
                />
              </Field>
              <Field label="Content *">
                <textarea
                  className={fieldCls}
                  rows={8}
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  required
                />
              </Field>
              <Field label="Cover image URL">
                <Input
                  value={form.coverImage}
                  onChange={(e) => set("coverImage", e.target.value)}
                  placeholder="https://..."
                />
              </Field>

              {resource === "blogs" && (
                <>
                  <Field label="Author">
                    <Input
                      value={form.author}
                      onChange={(e) => set("author", e.target.value)}
                      placeholder="Admin"
                    />
                  </Field>
                  <Field
                    label="YouTube URL (optional)"
                    hint="Paste a YouTube link to show a video on the blog page"
                  >
                    <Input
                      value={form.videoUrl}
                      onChange={(e) => set("videoUrl", e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </Field>
                </>
              )}

              {resource === "projects" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Location">
                      <Input
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                      />
                    </Field>
                    <Field label="Completed date">
                      <Input
                        type="date"
                        value={form.completedAt}
                        onChange={(e) => set("completedAt", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Gallery image URLs" hint="One URL per line">
                    <textarea
                      className={fieldCls}
                      rows={3}
                      value={form.gallery}
                      onChange={(e) => set("gallery", e.target.value)}
                    />
                  </Field>
                </>
              )}

              <div className="space-y-4 rounded-lg border border-amber-100 bg-stone-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">SEO</h3>
                  <span
                    className={`text-sm font-medium ${score >= 80 ? "text-green-700" : score >= 50 ? "text-amber-700" : "text-red-600"}`}
                  >
                    Score: {score}%
                  </span>
                </div>
                <Field label="Meta title" hint={`${form.metaTitle.length}/60`}>
                  <Input
                    value={form.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                  />
                </Field>
                <Field
                  label="Meta description"
                  hint={`${form.metaDescription.length}/160`}
                >
                  <textarea
                    className={fieldCls}
                    rows={2}
                    value={form.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                  />
                </Field>
                <Field label="Keywords" hint="Comma separated">
                  <Input
                    value={form.keywords}
                    onChange={(e) => set("keywords", e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="OG title">
                    <Input
                      value={form.ogTitle}
                      onChange={(e) => set("ogTitle", e.target.value)}
                    />
                  </Field>
                  <Field label="OG image URL">
                    <Input
                      value={form.ogImage}
                      onChange={(e) => set("ogImage", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="OG description">
                  <textarea
                    className={fieldCls}
                    rows={2}
                    value={form.ogDescription}
                    onChange={(e) => set("ogDescription", e.target.value)}
                  />
                </Field>
                <Field label="Canonical URL">
                  <Input
                    value={form.canonicalUrl}
                    onChange={(e) => set("canonicalUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                <ul className="space-y-1 text-sm">
                  {checks.map((c) => (
                    <li
                      key={c.text}
                      className={
                        c.ok ? "text-green-700" : "text-muted-foreground"
                      }
                    >
                      {c.ok ? "✓" : "○"} {c.text}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Published
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-800 text-white hover:bg-amber-900"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">
            No {label.toLowerCase()} yet. Click &quot;+ New&quot; to add one.
          </p>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="space-y-3"
          >
            {items.map((item) => (
              <motion.li
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    /{item.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.published ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(item)}
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </main>
    </div>
  );
}
