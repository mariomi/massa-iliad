import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { jwtVerify } from "jose";

async function verifyJwt(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as any;
  } catch {
    return null;
  }
}

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.next();
  // Bypass API routes
  if (url.pathname.startsWith("/api/")) {
    return res;
  }
  // Avoid initializing Supabase if env is missing, to prevent crashes during demo
  let session: any = null;
  try {
    const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (hasSupabase) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name: string) => {
          const match = req.headers.get("cookie")?.match(new RegExp(`${name}=([^;]+)`));
          return match?.[1];
        } } }
      );
      session = (await supabase.auth.getSession()).data.session;
    }
  } catch {}

  // Check custom app session cookie first
  const cookieHeader = req.headers.get("cookie") || "";
  const appToken = (cookieHeader.match(/(?:^|; )app_session=([^;]+)/)?.[1]) ?? null;
  const jwt = appToken ? await verifyJwt(appToken) : null;

  const isAuthPage = url.pathname.startsWith("/login");
  const isAuthed = Boolean(session) || Boolean(jwt);
  if (!isAuthed && !isAuthPage) { url.pathname = "/login"; return NextResponse.redirect(url); }
  if (isAuthed && isAuthPage) { url.pathname = "/home"; return NextResponse.redirect(url); }

  // Enforce admin-only routes
  if (url.pathname.startsWith("/admin") && (!jwt || jwt.role !== "admin")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Enforce workforce-only access to shifts and time pages
  if (jwt?.role === "workforce") {
    const allowedPaths = ["/home", "/dashboard", "/stores", "/reports/hours"];
    const isShiftOrTimePage = url.pathname.includes("/planner") || url.pathname.includes("/time");
    const isAllowedPath = allowedPaths.some(path => url.pathname.startsWith(path)) || isShiftOrTimePage;
    
    if (!isAllowedPath) {
      // Redirect to home instead of dashboard to avoid potential loops
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }
  
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"] };
