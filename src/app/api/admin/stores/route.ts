import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { adminClient } from "@/lib/supabase/admin";

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
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = adminClient();
  const { data, error } = await supabase.from("stores").select("id,name,address").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const name = (body?.name ?? "").toString().trim();
  const address = (body?.address ?? "").toString().trim();
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const supabase = adminClient();
  const { data, error } = await supabase.from("stores").insert({ name, address }).select("id,name,address").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

