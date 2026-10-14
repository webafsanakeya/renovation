export type ContactInput = { name: string; email: string; phone: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BD_PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
const INTL_PHONE_RE = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(raw: string) {
  return raw.replace(/[\s\-().]/g, "");
}

export function validateContact(input: Partial<Record<keyof ContactInput, unknown>>) {
  const data: ContactInput = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim().toLowerCase(),
    phone: normalizePhone(String(input.phone ?? "")),
    message: String(input.message ?? "").trim(),
  };
  const errors: ContactErrors = {};

  if (data.name.length < 2) errors.name = "Please enter your full name (at least 2 characters).";
  else if (data.name.length > 80) errors.name = "Name must be 80 characters or fewer.";

  if (!data.email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "Enter a valid email address, for example name@example.com.";

  if (!data.phone) errors.phone = "Phone number is required.";
  else if (!BD_PHONE_RE.test(data.phone) && !INTL_PHONE_RE.test(data.phone))
    errors.phone = "Enter a valid phone number, for example 01712345678 or +8801712345678.";

  if (data.message.length < 10) errors.message = "Please write at least 10 characters so we can help you.";
  else if (data.message.length > 1000) errors.message = "Message must be 1000 characters or fewer.";

  return { ok: Object.keys(errors).length === 0, errors, data };
}