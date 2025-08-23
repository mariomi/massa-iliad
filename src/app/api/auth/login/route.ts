import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";

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

    const supabase = serverClient();
    // Call Postgres function that verifies the password using crypt()
    const { data, error } = await supabase.rpc("verify_user_credentials", { p_email: email, p_password: password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    if (!data || (Array.isArray(data) && data.length === 0))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: CORS_HEADERS });

    // Return first matched user row
    const user = Array.isArray(data) ? data[0] : data;
    return NextResponse.json({ user }, { status: 200, headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}



