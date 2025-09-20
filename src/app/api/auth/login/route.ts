import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/demo-db";

const isProd = process.env.NODE_ENV === "production";

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

    // Verify credentials against demo database
    const user = verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: CORS_HEADERS });
    }

    // Create session token
    const token = await createSessionToken({ 
      sub: email, 
      role: user.role, 
      email, 
      name: user.name 
    });
    
    // Set cookie on response
    const res = NextResponse.json({ 
      user: { 
        email, 
        role: user.role, 
        name: user.name 
      } 
    }, { status: 200, headers: CORS_HEADERS });
    
    res.cookies.set("app_session", token, { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: "lax", 
      path: "/", 
      maxAge: 60 * 60 * 24 * 7 
    });
    
    setSessionCookie(token);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}



