"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { useMe } from "@/lib/auth/useMe";
export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const { me } = useMe();
  useEffect(() => { (async () => {
    if (me?.role === "admin") {
      const res = await fetch("/api/admin/stores", { credentials: "include" });
      if (res.ok) setStores(await res.json()); else setStores([]);
    } else {
      const { data } = await supabase.from("stores").select("*");
      setStores(data || []);
    }
  })(); }, [me?.role]);
  return (
    <>
      <PageHeader title="Punti vendita" right={me?.role === "admin" ? (
        <Link href="/admin/stores" className="px-3 py-2 border rounded-lg hover:bg-neutral-50">Nuovo punto vendita</Link>
      ) : undefined} />
      <div className="grid gap-4 md:grid-cols-3">
        {stores.map(s => (
          <Card key={s.id} className="p-4">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-neutral-500">{s.address || "—"}</div>
            <div className="mt-3 flex gap-2">
              <Link className="px-3 py-1.5 border rounded-lg hover:bg-neutral-50" href={`/stores/${s.id}/planner`}>Planner</Link>
              <Link className="px-3 py-1.5 border rounded-lg hover:bg-neutral-50" href={`/stores/${s.id}/sales`}>Vendite</Link>
              <Link className="px-3 py-1.5 border rounded-lg hover:bg-neutral-50" href={`/stores/${s.id}/time`}>Presenze</Link>
            </div>
          </Card>
        ))}
        {stores.length === 0 && <div className="text-sm text-neutral-500">Nessun punto vendita</div>}
      </div>
    </>
  );
}
