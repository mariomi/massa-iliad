"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnimatedList, AnimatedItem } from "@/components/ui/AnimatedList";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useStoreSelector } from "@/lib/store/StoreContext";
export default function Dashboard() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const { selected } = useStoreSelector();
  useEffect(() => {
    (async () => {
      let q = supabase.from("shifts").select("id,store_id,start_at,end_at").eq("published", true).gte("start_at", new Date().toISOString()).order("start_at").limit(5);
      if (selected) q = q.eq("store_id", selected.id);
      const { data: s1 } = await q;
      setShifts(s1 || []);
      const user = (await supabase.auth.getUser()).data.user;
      let q2 = supabase.from("sales").select("id,store_id,sold_at").eq("user_id", user?.id).order("sold_at", { ascending: false }).limit(5);
      if (selected) q2 = q2.eq("store_id", selected.id);
      const { data: s2 } = await q2;
      setSales(s2 || []);
    })();
  }, [selected?.id]);
  return (
    <>
      <PageHeader title="Dashboard" desc={selected ? `Negozio: ${selected.name}` : "Panoramica turni & vendite"} right={selected ? (
        <div className="flex gap-2">
          <Link href={`/stores/${selected.id}/planner`} className="px-3 py-2 border rounded-lg hover:bg-neutral-50 text-sm">Planner</Link>
          <Link href={`/stores/${selected.id}/sales`} className="px-3 py-2 border rounded-lg hover:bg-neutral-50 text-sm">Vendite</Link>
          <Link href={`/stores/${selected.id}/time`} className="px-3 py-2 border rounded-lg hover:bg-neutral-50 text-sm">Presenze</Link>
        </div>
      ) : undefined} />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Turni prossimi 7g" value={String(shifts.length)} />
        <KpiCard title="Vendite oggi" value="—" subtitle="Aggiungi KPI in R2" />
        <KpiCard title="Ore mese (prog.)" value="—" />
        <KpiCard title="Copertura turni" value="—" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Prossimi turni</h3>
          <AnimatedList>
            {shifts.map(s => (<AnimatedItem key={s.id}><div className="text-sm p-2 rounded-lg border">{new Date(s.start_at).toLocaleString()} → {new Date(s.end_at).toLocaleString()}</div></AnimatedItem>))}
            {shifts.length === 0 && <div className="text-sm text-neutral-500">Nessun turno</div>}
          </AnimatedList>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Ultime vendite</h3>
          <AnimatedList>
            {sales.map(v => (<AnimatedItem key={v.id}><div className="text-sm p-2 rounded-lg border">{new Date(v.sold_at).toLocaleString()}</div></AnimatedItem>))}
            {sales.length === 0 && <div className="text-sm text-neutral-500">Nessuna vendita</div>}
          </AnimatedList>
        </Card>
      </div>
    </>
  );
}
