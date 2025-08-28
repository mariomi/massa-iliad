import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const token = cookies().get("app_session")?.value;
  if (!token) return false;
  try { return (await verifySessionToken(token)).role === "admin"; } catch { return false; }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = adminClient();
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });
  const userList = usersData.users || [];
  const profileIds = userList.map(u => u.id);
  const { data: profiles } = await supabase.from("profiles").select("id, full_name, app_role, email").in("id", profileIds);
  const profileMap = Object.fromEntries((profiles||[]).map((p: any) => [p.id, p]));
  const result = userList.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    role: profileMap[u.id]?.app_role ?? 'agent',
    full_name: profileMap[u.id]?.full_name ?? null,
  }));
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const email = (body?.email ?? '').toString().trim();
  const password = (body?.password ?? '').toString();
  const full_name = (body?.full_name ?? '').toString().trim();
  const app_role = (body?.app_role ?? 'agent').toString();
  if (!email || !password) return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  const supabase = adminClient();
  const { data: created, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name } });
  if (error || !created?.user) return NextResponse.json({ error: error?.message || 'Create user failed' }, { status: 500 });
  const userId = created.user.id;
  await supabase.from("profiles").upsert({ id: userId, email, full_name, app_role }, { onConflict: 'id' });
  return NextResponse.json({ id: userId, email, full_name, app_role }, { status: 201 });
}
