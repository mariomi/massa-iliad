import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

const isProd = process.env.NODE_ENV === "production";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST() {
  await clearSessionCookie();
  const res = new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  res.cookies.set("app_session", "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
