"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TimeTrackingPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nowStr, setNowStr] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => { const t = setInterval(()=> setNowStr(new Date().toLocaleTimeString()), 1000); return ()=>clearInterval(t); }, []);

  const refresh = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return setOpenEntryId(null);
    const { data } = await supabase.from("time_entries").select("id").eq("user_id", user.id).eq("store_id", storeId).is("clock_out_at", null).maybeSingle();
    setOpenEntryId(data?.id ?? null);
  };
  useEffect(() => { refresh(); }, [storeId]);

  const onCheckIn = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Sessione non valida");
      const { data, error } = await supabase.from("time_entries").insert({ user_id: user.id, store_id: storeId, clock_in_at: new Date().toISOString(), source: "mobile" }).select("id").single();
      if (error) throw error;
      setOpenEntryId(data!.id);
    } catch (err: any) { alert(err?.message ?? String(err)); }
    finally { setLoading(false); }
  };

  const onCheckOut = async () => {
    setLoading(true);
    try {
      if (!openEntryId) return;
      const { error } = await supabase.from("time_entries").update({ clock_out_at: new Date().toISOString() }).eq("id", openEntryId);
      if (error) throw error;
      setOpenEntryId(null);
    } catch (err: any) { alert(err?.message ?? String(err)); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader title="Presenze" desc="Registra entrata e uscita" />
      <Card className="p-6 max-w-md">
        <div className="text-4xl font-bold text-center mb-2">{nowStr}</div>
        <div className="text-center text-neutral-500 mb-6">Store: {storeId}</div>
        {openEntryId ? (
          <Button onClick={onCheckOut} disabled={loading} className="w-full h-12 text-lg">Termina turno</Button>
        ) : (
          <Button onClick={onCheckIn} disabled={loading} className="w-full h-12 text-lg">Inizia turno</Button>
        )}
      </Card>
    </>
  );
}

