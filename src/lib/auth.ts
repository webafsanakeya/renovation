import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("plz define JWT_SECRET in .env.local ");
}
const secret = new TextEncoder().encode(JWT_SECRET);

export const COOKIE_NAME = "admin_token";

export async function signToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
try {
    await jwtVerify(token,secret);
    return true;
} catch {
    return false;
}
}
