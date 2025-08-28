"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useMe } from "@/lib/auth/useMe";

export type StoreLite = { id: string; name: string; address?: string | null };
type StoreState = {
  stores: StoreLite[];
  loading: boolean;
  selectedId: string | null;
  selected: StoreLite | null;
  setSelectedId: (id: string | null) => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<StoreState | null>(null);
const LS_KEY = "selected_store_id";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { me } = useMe();
  const [stores, setStores] = useState<StoreLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedIdState] = useState<string | null>(null);

  // Load persisted selection
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null;
    if (saved) setSelectedIdState(saved);
  }, []);

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState(id);
    try {
      if (id) window.localStorage.setItem(LS_KEY, id);
      else window.localStorage.removeItem(LS_KEY);
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (me?.role === "admin") {
        const res = await fetch("/api/admin/stores", { credentials: "include" });
        if (!res.ok) throw new Error("admin stores failed");
        const data = await res.json();
        setStores(data || []);
      } else {
        const { data } = await supabase.from("stores").select("id,name,address");
        setStores(data || []);
      }
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [me?.role]);

  useEffect(() => { refresh(); }, [refresh]);

  const selected = useMemo(() => stores.find(s => s.id === selectedId) || null, [stores, selectedId]);

  const value = useMemo<StoreState>(() => ({ stores, loading, selectedId, selected, setSelectedId, refresh }), [stores, loading, selectedId, selected, setSelectedId, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStoreSelector() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Allow optional usage outside provider (e.g., in /home redirect page)
    const fallback: StoreState = {
      stores: [],
      loading: false,
      selectedId: null,
      selected: null,
      setSelectedId: () => {},
      refresh: async () => {},
    };
    return fallback;
  }
  return ctx;
}
