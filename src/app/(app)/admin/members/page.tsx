"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = { user_id: string; user_email?: string | null; user_name?: string | null; store_id: string; store_name?: string | null; role: string };

export default function Members() {
  const [rows, setRows] = useState<Row[]>([]);
  const [userId, setUserId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/memberships", { credentials: "include" });
    if (res.ok) setRows(await res.json());
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/admin/memberships", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ user_id: userId, store_id: storeId, role }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Errore creazione membership");
      setUserId(""); setStoreId(""); setRole("viewer");
      await load();
    } catch (err: any) { alert(err?.message ?? String(err)); } finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader title="Membership" desc="Ruoli per punto vendita" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="grid grid-cols-4 text-sm font-medium px-2 py-2"><div>User</div><div>Store</div><div>Ruolo</div><div></div></div>
          <div className="divide-y">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-4 items-center text-sm px-2 py-2">
                <div className="truncate">{r.user_name || r.user_email || r.user_id}</div>
                <div className="truncate">{r.store_name || r.store_id}</div>
                <div className="uppercase text-xs px-2 py-1 rounded-md bg-neutral-100 border">{r.role}</div>
                <button onClick={async ()=>{ const url = `/api/admin/memberships?user_id=${r.user_id}&store_id=${r.store_id}`; const res = await fetch(url, { method: 'DELETE', credentials: 'include' }); if (res.ok) load(); }} className="text-xs text-red-600">Rimuovi</button>
              </div>
            ))}
            {rows.length === 0 && <div className="text-sm text-neutral-500 px-2 py-4">Nessun membro</div>}
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Aggiungi membro</div>
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="text-sm">User ID</label>
              <Input value={userId} onChange={(e)=>setUserId(e.target.value)} placeholder="UUID utente" required />
            </div>
            <div>
              <label className="text-sm">Store ID</label>
              <Input value={storeId} onChange={(e)=>setStoreId(e.target.value)} placeholder="UUID negozio" required />
            </div>
            <div>
              <label className="text-sm">Ruolo</label>
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="border rounded-lg px-2 py-2 text-sm">
                <option value="viewer">viewer</option>
                <option value="staff">staff</option>
                <option value="manager">manager</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">Aggiungi</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
