import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const token = cookies().get("app_session")?.value;
  if (!token) return false;
  try {
    const payload = await verifySessionToken(token);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const supabase = adminClient();
    const { data, error } = await supabase.from("stores").select("id,name,address").order("name");
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    const hint = msg.includes("SUPABASE_SERVICE_ROLE")
      ? "Set SUPABASE_SERVICE_ROLE in server env (never expose to client)."
      : (msg.includes("NEXT_PUBLIC_SUPABASE_URL") ? "Set NEXT_PUBLIC_SUPABASE_URL in env." : undefined);
    return NextResponse.json({ error: msg, hint }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const address = (body?.address ?? "").toString().trim();
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
    const supabase = adminClient();
    const { data, error } = await supabase.from("stores").insert({ name, address }).select("id,name,address").single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    const hint = msg.includes("SUPABASE_SERVICE_ROLE")
      ? "Set SUPABASE_SERVICE_ROLE in server env (never expose to client)."
      : (msg.includes("NEXT_PUBLIC_SUPABASE_URL") ? "Set NEXT_PUBLIC_SUPABASE_URL in env." : undefined);
    return NextResponse.json({ error: msg, hint }, { status: 500 });
  }
}
