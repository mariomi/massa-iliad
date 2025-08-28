"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Region = { id: string; name: string };

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [name, setName] = useState("");
  const [managerUserId, setManagerUserId] = useState("");
  const [targetRegionId, setTargetRegionId] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/regions", { credentials: "include" });
    if (res.ok) setRegions(await res.json());
  };
  useEffect(() => { load(); }, []);

  const onCreateRegion = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/admin/regions", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Errore creazione regione");
      setName(""); await load();
    } catch (err: any) { alert(err?.message ?? String(err)); } finally { setLoading(false); }
  };

  const onAssignManager = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/admin/regions/managers", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ user_id: managerUserId, region_id: targetRegionId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Errore assegnazione manager");
      setManagerUserId(""); setTargetRegionId("");
      alert("Manager assegnato");
    } catch (err: any) { alert(err?.message ?? String(err)); } finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader title="Admin: Regioni" desc="Crea regioni e assegna manager" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="font-medium mb-2">Elenco</div>
          <div className="divide-y">
            {regions.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-neutral-400">{r.id.slice(0,8)}…</div>
              </div>
            ))}
            {regions.length === 0 && <div className="text-sm text-neutral-500">Nessuna regione</div>}
          </div>
        </Card>
        <div className="grid gap-4">
          <Card className="p-4">
            <div className="font-medium mb-2">Nuova regione</div>
            <form onSubmit={onCreateRegion} className="space-y-3">
              <div>
                <label className="text-sm">Nome</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">Crea</Button>
            </form>
          </Card>
          <Card className="p-4">
            <div className="font-medium mb-2">Assegna manager a regione</div>
            <form onSubmit={onAssignManager} className="space-y-3">
              <div>
                <label className="text-sm">User ID</label>
                <Input value={managerUserId} onChange={(e)=>setManagerUserId(e.target.value)} placeholder="UUID utente" required />
              </div>
              <div>
                <label className="text-sm">Regione</label>
                <select value={targetRegionId} onChange={(e)=>setTargetRegionId(e.target.value)} className="border rounded-lg px-2 py-2 text-sm" required>
                  <option value="" disabled>Seleziona...</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">Assegna</Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

