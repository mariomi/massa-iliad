"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useMe } from "./useMe";
import type { StoreRole } from "./rbac";

export function useStoreRole(storeId: string) {
  const { me } = useMe();
  const [role, setRole] = useState<StoreRole>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (me?.role === "admin") { setRole("manager"); return; }
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) { setRole(null); return; }
        const { data, error } = await supabase
          .from("store_memberships")
          .select("role")
          .eq("store_id", storeId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        setRole((data?.role as StoreRole) ?? null);
      } catch {
        setRole(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [storeId, me?.role]);
  return { role, loading };
}

