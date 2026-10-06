import { COOKIE_NAME, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "server misconfigured" },
      { status: 500 },
    );
  }
  const { email, password } = await req.json();
  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

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
