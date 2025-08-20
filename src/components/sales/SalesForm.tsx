"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
export function SalesForm({ storeId }: { storeId: string }) {
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { data: prod } = await supabase.from("products").select("id,unit_price").eq("sku", sku).maybeSingle();
    if (!prod) { setLoading(false); return alert("SKU non trovato"); }
    const user = (await supabase.auth.getUser()).data.user;
    const { data: sale, error } = await supabase.from("sales").insert({ store_id: storeId, user_id: user?.id, notes }).select("id").single();
    if (error) { setLoading(false); return alert(error.message); }
    await supabase.from("sale_items").insert({ sale_id: sale!.id, product_id: prod.id, qty, unit_price: prod.unit_price });
    router.back();
  };
  return (
    <Card className="p-4 max-w-lg">
      <form onSubmit={submit} className="space-y-3">
        <div><Label>SKU</Label><Input value={sku} onChange={(e)=>setSku(e.target.value)} required /></div>
        <div><Label>Quantità</Label><Input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value||"1"))} required /></div>
        <div><Label>Note</Label><Input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="(opzionale)" /></div>
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Salvo..." : "Registra vendita"}</Button>
      </form>
    </Card>
  );
}
