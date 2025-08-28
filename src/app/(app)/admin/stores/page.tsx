"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Store = { id: string; name: string; address?: string | null };

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    const res = await fetch("/api/admin/stores", { credentials: "include" });
    if (res.ok) setStores(await res.json());
  };

  useEffect(() => { fetchStores(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore creazione store");
      setName(""); setAddress("");
      await fetchStores();
    } catch (err: any) {
      alert(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Admin: Punti vendita" desc="Crea e gestisci i punti vendita" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="font-medium mb-3">Elenco</div>
          <div className="divide-y">
            {stores.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-neutral-500">{s.address || "—"}</div>
                </div>
                <div className="text-xs text-neutral-400">{s.id.slice(0,8)}…</div>
              </div>
            ))}
            {stores.length === 0 && <div className="text-sm text-neutral-500 py-2">Nessun punto vendita</div>}
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-3">Nuovo punto vendita</div>
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="text-sm">Nome</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Indirizzo</label>
              <Input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="(opzionale)" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creo..." : "Crea"}</Button>
          </form>
        </Card>
      </div>
    </>
  );
}

