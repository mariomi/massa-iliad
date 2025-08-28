import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const token = cookies().get("app_session")?.value;
  if (!token) return false;
  try { return (await verifySessionToken(token)).role === "admin"; } catch { return false; }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = adminClient();
  const { data, error } = await supabase.from("regions").select("id,name,created_at").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const name = (body?.name ?? '').toString().trim();
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const supabase = adminClient();
  const { data, error } = await supabase.from("regions").insert({ name }).select("id,name").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

