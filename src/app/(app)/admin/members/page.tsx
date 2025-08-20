"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
export default function Members() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { supabase.from("store_memberships").select("user_id, store_id, role").limit(200).then(({ data }) => setRows(data || [])); }, []);
  return (
    <>
      <PageHeader title="Membership" desc="Ruoli per punto vendita" />
      <Card className="p-4">
        <div className="grid grid-cols-3 text-sm font-medium px-2 py-2"><div>User</div><div>Store</div><div>Ruolo</div></div>
        <div className="divide-y">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 items-center text-sm px-2 py-2">
              <div className="truncate">{r.user_id}</div>
              <div className="truncate">{r.store_id}</div>
              <div className="uppercase text-xs px-2 py-1 rounded-md bg-neutral-100 border">{r.role}</div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-sm text-neutral-500 px-2 py-4">Nessun membro</div>}
        </div>
      </Card>
    </>
  );
}
