"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateContent } from "@/lib/content-validation";

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

const FIELD_ORDER = [
  "title", "slug", "shortDescription", "content", "coverImage", "author", "videoUrl",
  "location", "completedAt", "gallery", "metaTitle", "metaDescription", "ogImage", "canonicalUrl",
];

const fieldCls =
  "w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-700/40 aria-invalid:border-red-500";

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
    shortDescription: f.shortDescription.trim(),
    content: f.content.trim(),
    coverImage: f.coverImage.trim(),
    published: f.published,
    seo: {
      metaTitle: f.metaTitle.trim(),
      metaDescription: f.metaDescription.trim(),
      keywords: f.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      ogTitle: f.ogTitle.trim(),
      ogDescription: f.ogDescription.trim(),
      ogImage: f.ogImage.trim(),
      canonicalUrl: f.canonicalUrl.trim(),
    },
  };
  if (resource === "blogs") {
    payload.author = f.author.trim() || "Admin";
    payload.videoUrl = f.videoUrl.trim();
  }
  if (resource === "projects") {
    payload.location = f.location.trim();
    payload.completedAt = f.completedAt || undefined;
    payload.gallery = f.gallery.split(/[\n,]/).map((g) => g.trim()).filter(Boolean);
  }
  return payload;
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type Toast = { id: number; type: "success" | "error"; text: string };

export default function ResourceManager({ resource, label }: { resource: Resource; label: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const base = `/api/admin/${resource}`;
  
function notify(type: Toast["type"], text: string) {
  if (toastTimer.current) clearTimeout(toastTimer.current);
  setToast((prev) => ({ id: (prev?.id ?? 0) + 1, type, text }));
  toastTimer.current = setTimeout(() => setToast(null), 3500);
}
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  async function load() {
    try {
      const res = await fetch(base);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setListError("");
    } catch {
      setListError("Failed to load data. Please refresh the page.");
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
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  const a11y = (key: string) =>
    fieldErrors[key] ? { "aria-invalid": true, "aria-describedby": `f-${key}-error` } : {};

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFieldErrors({});
    setShowForm(true);
  }

  function openEdit(item: Item) {
    setEditingId(item._id);
    setForm(toForm(item));
    setError("");
    setFieldErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function focusFirstError(errors: Record<string, string>) {
    const first = FIELD_ORDER.find((k) => errors[k]);
    if (first) document.getElementById(`f-${first}`)?.focus();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const check = validateContent(form, resource);
    if (!check.ok) {
      setFieldErrors(check.errors);
      setError("Please fix the highlighted fields.");
      focusFirstError(check.errors);
      return;
    }
    setFieldErrors({});

    setSaving(true);
    try {
      const res = await fetch(editingId ? `${base}/${editingId}` : base, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form, resource)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          focusFirstError(data.errors);
        }
        setError(data.error || data.message || "Something went wrong. Please try again.");
        return;
      }
      setShowForm(false);
      notify("success", editingId ? `${label} updated.` : `${label} created.`);
      await load();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: Item) {
    try {
      const res = await fetch(`${base}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) throw new Error("failed");
      notify("success", item.published ? "Moved to drafts." : "Published.");
      await load();
    } catch {
      notify("error", "Could not change publish status. Please try again.");
    }
  }

  async function handleDelete(item: Item) {
    try {
      const res = await fetch(`${base}/${item._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setConfirmingId(null);
      notify("success", `"${item.title}" deleted.`);
      await load();
    } catch {
      notify("error", "Could not delete. Please try again.");
    }
  }

  // Simple SEO checklist (bonus)
  const checks = [
    { ok: form.metaTitle.length >= 30 && form.metaTitle.length <= 60, text: "Meta title 30-60 characters" },
    { ok: form.metaDescription.length >= 120 && form.metaDescription.length <= 160, text: "Meta description 120-160 characters" },
    { ok: form.keywords.trim().length > 0, text: "Keywords added" },
    { ok: form.ogImage.trim().length > 0 || form.coverImage.trim().length > 0, text: "OG / cover image set" },
    { ok: form.title.length > 0 || form.slug.length > 0, text: "Slug present (auto-generated if empty)" },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100">
      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-amber-800 hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">{label}</h1>
          </div>
          <Button className="bg-amber-800 text-white hover:bg-amber-900" onClick={openNew}>
            + New
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSave}
              noValidate
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mb-8 space-y-4 rounded-xl border border-amber-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit" : "Create"} {label}
              </h2>

              <Field id="f-title" label="Title *" error={fieldErrors.title}>
                <Input id="f-title" value={form.title} onChange={(e) => set("title", e.target.value)} {...a11y("title")} />
              </Field>
              <Field id="f-slug" label="Slug" hint="Leave empty to auto-generate from title" error={fieldErrors.slug}>
                <Input id="f-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} {...a11y("slug")} />
              </Field>
              <Field id="f-shortDescription" label="Short description *" hint={`${form.shortDescription.length}/250`} error={fieldErrors.shortDescription}>
                <textarea id="f-shortDescription" className={fieldCls} rows={2} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} {...a11y("shortDescription")} />
              </Field>
              <Field id="f-content" label="Content *" error={fieldErrors.content}>
                <textarea id="f-content" className={fieldCls} rows={8} value={form.content} onChange={(e) => set("content", e.target.value)} {...a11y("content")} />
              </Field>
              <Field id="f-coverImage" label="Cover image URL" error={fieldErrors.coverImage}>
                <Input id="f-coverImage" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." {...a11y("coverImage")} />
              </Field>

              {resource === "blogs" && (
                <>
                  <Field id="f-author" label="Author" error={fieldErrors.author}>
                    <Input id="f-author" value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Admin" {...a11y("author")} />
                  </Field>
                  <Field id="f-videoUrl" label="YouTube URL (optional)" hint="Paste a YouTube link to show a video on the blog page" error={fieldErrors.videoUrl}>
                    <Input id="f-videoUrl" value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." {...a11y("videoUrl")} />
                  </Field>
                </>
              )}

              {resource === "projects" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="f-location" label="Location" error={fieldErrors.location}>
                      <Input id="f-location" value={form.location} onChange={(e) => set("location", e.target.value)} {...a11y("location")} />
                    </Field>
                    <Field id="f-completedAt" label="Completed date" error={fieldErrors.completedAt}>
                      <Input id="f-completedAt" type="date" value={form.completedAt} onChange={(e) => set("completedAt", e.target.value)} {...a11y("completedAt")} />
                    </Field>
                  </div>
                  <Field id="f-gallery" label="Gallery image URLs" hint="One URL per line" error={fieldErrors.gallery}>
                    <textarea id="f-gallery" className={fieldCls} rows={3} value={form.gallery} onChange={(e) => set("gallery", e.target.value)} {...a11y("gallery")} />
                  </Field>
                </>
              )}

              <div className="space-y-4 rounded-lg border border-amber-100 bg-stone-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">SEO</h3>
                  <span className={`text-sm font-medium ${score >= 80 ? "text-green-700" : score >= 50 ? "text-amber-700" : "text-red-600"}`}>
                    Score: {score}%
                  </span>
                </div>
                <Field id="f-metaTitle" label="Meta title" hint={`${form.metaTitle.length}/60`} error={fieldErrors.metaTitle}>
                  <Input id="f-metaTitle" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} {...a11y("metaTitle")} />
                </Field>
                <Field id="f-metaDescription" label="Meta description" hint={`${form.metaDescription.length}/160`} error={fieldErrors.metaDescription}>
                  <textarea id="f-metaDescription" className={fieldCls} rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} {...a11y("metaDescription")} />
                </Field>
                <Field id="f-keywords" label="Keywords" hint="Comma separated">
                  <Input id="f-keywords" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="f-ogTitle" label="OG title">
                    <Input id="f-ogTitle" value={form.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} />
                  </Field>
                  <Field id="f-ogImage" label="OG image URL" error={fieldErrors.ogImage}>
                    <Input id="f-ogImage" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} {...a11y("ogImage")} />
                  </Field>
                </div>
                <Field id="f-ogDescription" label="OG description">
                  <textarea id="f-ogDescription" className={fieldCls} rows={2} value={form.ogDescription} onChange={(e) => set("ogDescription", e.target.value)} />
                </Field>
                <Field id="f-canonicalUrl" label="Canonical URL" error={fieldErrors.canonicalUrl}>
                  <Input id="f-canonicalUrl" value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="https://..." {...a11y("canonicalUrl")} />
                </Field>
                <ul className="space-y-1 text-sm">
                  {checks.map((c) => (
                    <li key={c.text} className={c.ok ? "text-green-700" : "text-muted-foreground"}>
                      {c.ok ? "✓" : "○"} {c.text}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
                Published
              </label>

              {error && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="bg-amber-800 text-white hover:bg-amber-900">
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {listError && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {listError}
          </p>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No {label.toLowerCase()} yet. Click &quot;+ New&quot; to add one.</p>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-3"
          >
            {items.map((item) => (
              <motion.li
                key={item._id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">/{item.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.published ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                  {confirmingId === item._id ? (
                    <>
                      <span className="text-sm text-red-700">Delete this?</span>
                      <Button size="sm" className="bg-red-700 text-white hover:bg-red-800" onClick={() => handleDelete(item)}>
                        Yes, delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => togglePublish(item)}>
                        {item.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => setConfirmingId(item._id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role={toast.type === "error" ? "alert" : "status"}
            className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-700" : "bg-red-700"}`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}