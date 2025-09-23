import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSessionCookie, verifySessionToken } from "@/lib/auth/session";
// import { serverClient } from "@/lib/supabase/server";

export async function GET() {
  // Prefer custom app_session for role; also include Supabase user id if present
  try {
    const store = await cookies();
    const token = store.get("app_session")?.value || await readSessionCookie();
    let role: "admin" | "user" = "user";
    let email: string | undefined;
    let name: string | undefined;
    if (token) {
      try {
        const payload = await verifySessionToken(token);
        role = (payload.role as any) || "user";
        email = payload.email as string | undefined;
        name = payload.name as string | undefined;
      } catch {
        // ignore invalid token
      }
    }
    // For demo, avoid hard dependency on Supabase
    // Map email to user ID for demo purposes
    let id: string | undefined;
    if (email === "admin@demo.com") {
      id = "admin_user";
    } else if (email === "workforce@demo.com") {
      id = "workforce_user";
    }
    
    return NextResponse.json({ id, role, email, name, supabaseUserId: null });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

