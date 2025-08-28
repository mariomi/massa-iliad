import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const token = cookies().get("app_session")?.value;
  if (!token) return false;
  try { return (await verifySessionToken(token)).role === "admin"; } catch { return false; }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const user_id = (body?.user_id ?? '').toString();
  const region_id = (body?.region_id ?? '').toString();
  if (!user_id || !region_id) return NextResponse.json({ error: "Missing user_id or region_id" }, { status: 400 });
  const supabase = adminClient();
  const { error } = await supabase.from("region_managers").upsert({ user_id, region_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  const region_id = searchParams.get('region_id');
  if (!user_id || !region_id) return NextResponse.json({ error: "Missing user_id or region_id" }, { status: 400 });
  const supabase = adminClient();
  const { error } = await supabase.from("region_managers").delete().eq("user_id", user_id).eq("region_id", region_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

