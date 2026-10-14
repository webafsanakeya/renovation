"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateContact, type ContactErrors, type ContactInput } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";
type Field = keyof ContactInput;

const empty: ContactInput = { name: "", email: "", phone: "", message: "" };
const FIELDS: Field[] = ["name", "email", "phone", "message"];
const areaCls =
  "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-700/40";

function FieldBox({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  function change(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validateContact(next).errors[field] }));
  }

  function blur(field: Field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateContact(values).errors[field] }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    const result = validateContact(values);
    setTouched({ name: true, email: true, phone: true, message: true });
    setErrors(result.errors);
    setStatus("idle");

    if (!result.ok) {
      setStatus("error");
      setFormError("Please fix the highlighted fields and try again.");
      const first = FIELDS.find((f) => result.errors[f]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        setFormError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setValues(empty);
      setTouched({});
      setErrors({});
      setStatus("success");
    } catch {
      setFormError("Network problem. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const invalid = (f: Field) => (errors[f] ? { "aria-invalid": true, "aria-describedby": `contact-${f}-error` } : {});
  const border = (f: Field) => (errors[f] ? "border-red-500" : "border-input");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
      {/* Honeypot field, hidden from people */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <FieldBox id="contact-name" label="Full name *" error={errors.name}>
        <Input id="contact-name" autoComplete="name" value={values.name} onChange={(e) => change("name", e.target.value)} onBlur={() => blur("name")} className={border("name")} {...invalid("name")} />
      </FieldBox>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldBox id="contact-email" label="Email *" error={errors.email}>
          <Input id="contact-email" type="email" autoComplete="email" value={values.email} onChange={(e) => change("email", e.target.value)} onBlur={() => blur("email")} className={border("email")} {...invalid("email")} />
        </FieldBox>
        <FieldBox id="contact-phone" label="Phone *" error={errors.phone}>
          <Input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01712345678" value={values.phone} onChange={(e) => change("phone", e.target.value)} onBlur={() => blur("phone")} className={border("phone")} {...invalid("phone")} />
        </FieldBox>
      </div>

      <FieldBox id="contact-message" label="How can we help? *" error={errors.message}>
        <textarea id="contact-message" rows={5} value={values.message} onChange={(e) => change("message", e.target.value)} onBlur={() => blur("message")} className={`${areaCls} ${border("message")}`} {...invalid("message")} />
        <p className="text-xs text-stone-500">{values.message.length}/1000</p>
      </FieldBox>

      {status === "error" && formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}
      {status === "success" && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          Thank you! Your message has been sent. We will get back to you soon.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"} className="w-full bg-amber-800 text-white hover:bg-amber-900 sm:w-auto">
        {status === "submitting" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}