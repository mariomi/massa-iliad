"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
type Row = { user_id: string; hours: number };
export function HoursTable({ from, to, storeId }: { from: string; to: string; storeId?: string; }) {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { (async () => {
      const q = supabase.from("shift_assignments").select("user_id, shifts!inner(start_at,end_at,store_id)").gte("shifts.start_at", from).lte("shifts.end_at", to);
      if (storeId) q.eq("shifts.store_id", storeId);
      const { data, error } = await q;
      if (error) { console.error(error); setRows([]); return; }
      const totals: Record<string, number> = {};
      (data as any[]).forEach(r => {
        const start = new Date(r.shifts.start_at).getTime();
        const end = new Date(r.shifts.end_at).getTime();
        const hours = Math.max(0, (end - start) / 3600000);
        totals[r.user_id] = (totals[r.user_id] || 0) + hours;
      });
      setRows(Object.entries(totals).map(([user_id, hours]) => ({ user_id, hours })));
  })(); }, [from, to, storeId]);
  const sorted = useMemo(() => rows.sort((a,b)=>b.hours-a.hours), [rows]);
  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 text-sm font-medium px-2 py-2"><div>User</div><div>Ore</div><div>Export</div></div>
      <div className="divide-y">
        {sorted.map(r => (
          <div key={r.user_id} className="grid grid-cols-3 items-center text-sm px-2 py-2">
            <div className="truncate">{r.user_id}</div>
            <div>{r.hours.toFixed(2)}</div>
            <div><button onClick={() => {
                const csv = `user_id,hours\n${sorted.map(x=>`${x.user_id},${x.hours.toFixed(2)}`).join("\n")}`;
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "hours.csv"; a.click(); URL.revokeObjectURL(url);
            }} className="px-2 py-1 border rounded-lg hover:bg-neutral-50">CSV</button></div>
          </div>
        ))}
        {sorted.length === 0 && <div className="text-sm text-neutral-500 px-2 py-4">Nessun dato</div>}
      </div>
    </Card>
  );
}
