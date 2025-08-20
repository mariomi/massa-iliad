"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  useEffect(() => { supabase.from("stores").select("*").then(({ data }) => setStores(data || [])); }, []);
  return (
    <>
      <PageHeader title="Punti vendita" />
      <div className="grid gap-4 md:grid-cols-3">
        {stores.map(s => (
          <Card key={s.id} className="p-4">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-neutral-500">{s.address || "—"}</div>
            <div className="mt-3 flex gap-2">
              <Link className="px-3 py-1.5 border rounded-lg hover:bg-neutral-50" href={`/stores/${s.id}/planner`}>Planner</Link>
              <Link className="px-3 py-1.5 border rounded-lg hover:bg-neutral-50" href={`/stores/${s.id}/sales`}>Vendite</Link>
            </div>
          </Card>
        ))}
        {stores.length === 0 && <div className="text-sm text-neutral-500">Nessun punto vendita</div>}
      </div>
    </>
  );
}
