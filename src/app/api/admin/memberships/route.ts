import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_session")?.value;
  if (!token) return false;
  try { return (await verifySessionToken(token)).role === "admin"; } catch { return false; }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = adminClient();
  const { data, error } = await supabase.from("store_memberships").select("user_id, store_id, role, created_at").limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Optionally hydrate with user email and store name
  const userIds = Array.from(new Set((data||[]).map(r => r.user_id)));
  const storeIds = Array.from(new Set((data||[]).map(r => r.store_id)));
  const [{ data: profiles }, { data: stores }] = await Promise.all([
    supabase.from("profiles").select("id,email,full_name").in("id", userIds),
    supabase.from("stores").select("id,name").in("id", storeIds),
  ]);
  const pmap = Object.fromEntries((profiles||[]).map((p:any)=>[p.id,p]));
  const smap = Object.fromEntries((stores||[]).map((s:any)=>[s.id,s]));
  const rows = (data||[]).map(r => ({...r, user_email: pmap[r.user_id]?.email ?? null, user_name: pmap[r.user_id]?.full_name ?? null, store_name: smap[r.store_id]?.name ?? null }));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const user_id = (body?.user_id ?? '').toString();
  const store_id = (body?.store_id ?? '').toString();
  const role = (body?.role ?? 'viewer').toString();
  if (!user_id || !store_id) return NextResponse.json({ error: "Missing user_id or store_id" }, { status: 400 });
  const supabase = adminClient();
  const { error } = await supabase.from("store_memberships").upsert({ user_id, store_id, role });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  const store_id = searchParams.get('store_id');
  if (!user_id || !store_id) return NextResponse.json({ error: "Missing user_id or store_id" }, { status: 400 });
  const supabase = adminClient();
  const { error } = await supabase.from("store_memberships").delete().eq("user_id", user_id).eq("store_id", store_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
