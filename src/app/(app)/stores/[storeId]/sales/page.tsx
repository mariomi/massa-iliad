"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useMe } from "@/lib/auth/useMe";
import { useStoreRole } from "@/lib/auth/useStoreRole";
import { canRecordSales } from "@/lib/auth/rbac";
export default function SalesList() {
  const { storeId } = useParams<{ storeId: string }>();
  const [rows, setRows] = useState<any[]>([]);
  const { me } = useMe();
  const { role } = useStoreRole(storeId);
  useEffect(() => { (async () => {
      const { data } = await supabase.from("sales").select("id, sold_at, notes").eq("store_id", storeId).order("sold_at", { ascending: false }).limit(50);
      setRows(data || []);
  })(); }, [storeId]);
  return (
    <>
      <PageHeader title="Vendite" right={canRecordSales(me?.role ?? "user", role) ? (
        <Link href={`/stores/${storeId}/sales/new`} className="px-3 py-2 border rounded-lg hover:bg-neutral-50">Nuova vendita</Link>
      ) : undefined} />
      <Card className="p-2 md:p-4">
        <div className="grid grid-cols-3 text-sm font-medium px-2 py-2"><div>Data</div><div>Note</div><div>ID</div></div>
        <div className="divide-y">
          {rows.map(r => (
            <div key={r.id} className="grid grid-cols-3 items-center text-sm px-2 py-2">
              <div>{new Date(r.sold_at).toLocaleString()}</div>
              <div className="text-neutral-500 truncate">{r.notes || "—"}</div>
              <div className="text-neutral-400">{r.id.slice(0, 8)}…</div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-sm text-neutral-500 px-2 py-4">Nessuna vendita</div>}
        </div>
      </Card>
    </>
  );
}
