import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "app_session";
const isProd = process.env.NODE_ENV === "production";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET env var");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // subject (email or user id)
  role: "admin" | "user" | "workforce";
  name?: string;
  email?: string;
};

export async function createSessionToken(payload: SessionPayload, maxAgeSec = 60 * 60 * 24 * 7) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as SessionPayload & { iat: number; exp: number };
}

export function setSessionCookie(token: string, maxAgeSec = 60 * 60 * 24 * 7) {
  const store = cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export function clearSessionCookie() {
  const store = cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
}

export function readSessionCookie() {
  const store = cookies();
  return store.get(COOKIE_NAME)?.value;
}

export const AuthCookie = { name: COOKIE_NAME };
