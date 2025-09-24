"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoDataService } from "@/lib/demo-data/demo-service";

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [managerUserId, setManagerUserId] = useState("");
  const [targetRegionId, setTargetRegionId] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    const regionList = demoDataService.getRegions();
    setRegions(regionList);
  };
  
  useEffect(() => { load(); }, []);

  const onCreateRegion = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const success = demoDataService.addRegion(name);
      if (success) {
        alert(`Regione "${name}" creata con successo!`);
        setName(""); 
        load();
      } else {
        alert("Regione già esistente!");
      }
    } catch (err: any) { 
      alert(err?.message ?? String(err)); 
    } finally { 
      setLoading(false); 
    }
  };

  const onAssignManager = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      // For demo purposes, just show a message
      alert("Funzionalità di assegnazione manager non implementata nel demo");
      setManagerUserId(""); 
      setTargetRegionId("");
    } catch (err: any) { 
      alert(err?.message ?? String(err)); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <PageHeader title="Admin: Regioni" desc="Crea regioni e assegna manager" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="font-medium mb-2">Elenco</div>
          <div className="divide-y">
            {regions.map(r => (
              <div key={r} className="flex items-center justify-between py-2">
                <div className="font-medium">{r}</div>
                <div className="text-xs text-neutral-400">Regione</div>
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
                  {regions.map((region, index) => <option key={index} value={region}>{region}</option>)}
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

