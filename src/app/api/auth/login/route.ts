import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};
    if (!email || !password)
      return NextResponse.json({ error: "Missing email or password" }, { status: 400, headers: CORS_HEADERS });

    // Admin credentials (server-only) → always admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      const token = await createSessionToken({ sub: email, role: "admin", email });
      // Set cookie on response explicitly for reliability in all runtimes
      const res = NextResponse.json({ user: { email, role: "admin" } }, { status: 200, headers: CORS_HEADERS });
      res.cookies.set("app_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
      // Also set via helper (no-op if not needed)
      setSessionCookie(token);
      return res;
    }

    // Fallback: validate against DB function
    const supabase = serverClient();
    const { data, error } = await supabase.rpc("verify_user_credentials", { p_email: email, p_password: password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    if (!data || (Array.isArray(data) && data.length === 0))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: CORS_HEADERS });

    const user = (Array.isArray(data) ? data[0] : data) as any;
    // Create a normal user session
    const name = user?.name ?? user?.full_name ?? undefined;
    const token = await createSessionToken({ sub: email, role: "user", email, name });
    const res = NextResponse.json({ user: { email, role: "user", name } }, { status: 200, headers: CORS_HEADERS });
    res.cookies.set("app_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    setSessionCookie(token);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}



