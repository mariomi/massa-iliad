"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { HoursTable } from "@/components/tables/HoursTable";
function isoLocal(dt: Date) { const tzOffset = dt.getTimezoneOffset() * 60000; return new Date(dt.getTime() - tzOffset).toISOString().slice(0,16); }
export default function HoursReport() {
  const now = new Date(); const startMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0);
  const [fromLocal, setFromLocal] = useState(isoLocal(startMonth));
  const [toLocal, setToLocal] = useState(isoLocal(now));
  return (
    <>
      <PageHeader title="Report ore" desc="Programmate (R2: Erogate con presenze)" />
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2"><label className="text-sm text-neutral-600">Da</label><input className="border rounded-lg px-2 py-1" type="datetime-local" value={fromLocal} onChange={(e)=>setFromLocal(e.target.value)} /></div>
        <div className="flex items-center gap-2"><label className="text-sm text-neutral-600">A</label><input className="border rounded-lg px-2 py-1" type="datetime-local" value={toLocal} onChange={(e)=>setToLocal(e.target.value)} /></div>
      </div>
      <HoursTable from={new Date(fromLocal).toISOString()} to={new Date(toLocal).toISOString()} />
    </>
  );
}
