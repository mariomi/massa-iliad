import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST() {
  clearSessionCookie();
  const res = new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  res.cookies.set("app_session", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
