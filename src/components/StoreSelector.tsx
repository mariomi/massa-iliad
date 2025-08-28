"use client";
import { useMemo, useState } from "react";
import { useStoreSelector } from "@/lib/store/StoreContext";

export function StoreSelector() {
  const { stores, selectedId, setSelectedId, loading } = useStoreSelector();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores.slice(0, 50);
    return stores.filter(s => s.name.toLowerCase().includes(q) || (s.address||"").toLowerCase().includes(q)).slice(0, 50);
  }, [stores, query]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          className="w-56 md:w-64 px-3 py-2 border rounded-lg text-sm"
          placeholder={loading ? "Carico negozi..." : "Cerca/Seleziona negozio"}
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          onFocus={() => setQuery("")}
        />
        <select
          value={selectedId || ""}
          onChange={(e)=> setSelectedId(e.target.value || null)}
          className="hidden md:block border rounded-lg px-2 py-2 text-sm"
        >
          <option value="">(Nessuno)</option>
          {filtered.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
        </select>
      </div>
      {/* Mobile-friendly list below input when typing */}
      {query && (
        <div className="absolute mt-1 w-72 max-h-64 overflow-auto bg-white border rounded-lg shadow-md z-10">
          {filtered.length === 0 && <div className="px-3 py-2 text-sm text-neutral-500">Nessun risultato</div>}
          {filtered.map(s => (
            <button key={s.id} onClick={()=>{ setSelectedId(s.id); setQuery(""); }} className="w-full text-left px-3 py-2 hover:bg-neutral-50">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-neutral-500">{s.address || ""}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

