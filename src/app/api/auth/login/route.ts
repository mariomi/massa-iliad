import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};
    if (!email || !password) return NextResponse.json({ error: "Missing email or password" }, { status: 400 });

    const supabase = serverClient();
    // Call Postgres function that verifies the password using crypt()
    const { data, error } = await supabase.rpc("verify_user_credentials", { p_email: email, p_password: password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || (Array.isArray(data) && data.length === 0)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Return first matched user row
    const user = Array.isArray(data) ? data[0] : data;
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}


