import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the Service Role key.
// DO NOT expose this key to the browser.
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL env var");
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE env var (server-only)");
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

