import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => {
      const match = req.headers.get("cookie")?.match(new RegExp(`${name}=([^;]+)`));
      return match?.[1];
    } } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthPage = url.pathname.startsWith("/login");
  if (!session && !isAuthPage) { url.pathname = "/login"; return NextResponse.redirect(url); }
  if (session && isAuthPage) { url.pathname = "/dashboard"; return NextResponse.redirect(url); }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
