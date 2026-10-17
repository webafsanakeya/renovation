import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { COOKIE_NAME, signToken } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Best-effort rate limit. On serverless each instance has its own memory,
// so this slows down guessing but is not a perfect guarantee.
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function safeEqual(a: string, b: string) {
  // Hash first so both buffers have the same length, then compare in constant time
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function prune(now: number) {
  if (attempts.size < 500) return;
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }
}

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD is not set");
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please contact the site owner." },
      { status: 500 },
    );
  }

  const now = Date.now();
  prune(now);
  const ip = clientIp(req);
  const record = attempts.get(ip);

  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    const minutes = Math.ceil(retryAfter / 60);
    return NextResponse.json(
      {
        error: `Too many failed attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 },
    );
  }

  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, adminPassword);

  if (!emailOk || !passwordOk) {
    const fresh = !record || record.resetAt <= now;
    attempts.set(ip, {
      count: fresh ? 1 : record.count + 1,
      resetAt: fresh ? now + WINDOW_MS : record.resetAt,
    });
    // Same message for wrong email and wrong password, so nothing is leaked
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  attempts.delete(ip);

  const token = await signToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}