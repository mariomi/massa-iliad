"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/auth/useMe";
import { useStoreSelector } from "@/lib/store/StoreContext";
// import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";

export default function HomeRouter() {
  const router = useRouter();
  const { me, loading } = useMe();
  const { selected, stores } = useStoreSelector();

  useEffect(() => {
    if (loading) return;
    if (!me) { router.replace("/login"); return; }
    const go = async () => {
      if (me.role === "admin") { router.replace("/admin/stores"); return; }
      if (me.role === "workforce") { 
        // Workforce goes directly to dashboard
        router.replace("/dashboard"); 
        return; 
      }
          if (me.role === "user") {
            // Demo: non usiamo più supabase qui. Rimanda alla lista negozi
            if (selected) { router.replace(`/stores/${selected.id}/time`); return; }
            router.replace("/stores");
          }
    };
    go();
  }, [me?.role, selected?.id, loading, stores.length]);

  return (
    <div className="p-6">
      <PageHeader title="Caricamento" desc="Reindirizzamento alla tua area" />
      <Card className="p-4">Stiamo reindirizzando in base al tuo ruolo...</Card>
    </div>
  );
}
