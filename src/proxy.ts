import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isValid = token ? await verifyToken(token) : false;

  if (pathname === "/admin/login") {
    if (isValid) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }
  if (!isValid) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
