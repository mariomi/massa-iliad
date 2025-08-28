"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/auth/useMe";
import { useStoreSelector } from "@/lib/store/StoreContext";
import { supabase } from "@/lib/supabase/client";
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
      if (me.role === "user") {
        const user = (await supabase.auth.getUser()).data.user;
        // Determine if user is manager of any store
        let isManager = false;
        let firstStore: string | null = null;
        if (user) {
          const { data: mm } = await supabase.from("store_memberships").select("store_id, role").eq("user_id", user.id).limit(50);
          const m = (mm || []);
          isManager = m.some(r => r.role === 'manager');
          firstStore = m[0]?.store_id ?? null;
        }
        if (selected) {
          router.replace(`/stores/${selected.id}/${isManager ? 'planner' : 'time'}`);
          return;
        }
        if (firstStore) {
          router.replace(`/stores/${firstStore}/${isManager ? 'planner' : 'time'}`);
          return;
        }
        // Fallback: go to stores list to pick
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
