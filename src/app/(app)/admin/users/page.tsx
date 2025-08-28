"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserRow = { id: string; email: string | null; full_name?: string | null; role: string };

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("agent");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    if (res.ok) setRows(await res.json());
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ email, password, full_name: fullName, app_role: role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore creazione utente");
      setEmail(""); setPassword(""); setFullName(""); setRole("agent");
      await load();
    } catch (err: any) { alert(err?.message ?? String(err)); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader title="Admin: Utenti" desc="Crea e gestisci utenti applicazione" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="font-medium mb-2">Elenco</div>
          <div className="divide-y">
            {rows.map(u => (
              <div key={u.id}>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">{u.full_name || u.email}</div>
                    <div className="text-xs text-neutral-500">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="uppercase text-xs px-2 py-1 rounded-md bg-neutral-100 border">{u.role}</div>
                    {u.email && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/login?email=${encodeURIComponent(u.email!)}&r=${encodeURIComponent(u.role)}`;
                          navigator.clipboard.writeText(link);
                          alert("Link di login copiato");
                        }}
                        className="text-xs px-2 py-1 rounded-md border hover:bg-neutral-50"
                      >Copia login</button>
                    )}
                  </div>
                </div>
                <div className="pl-2 pb-2 text-xs text-neutral-500">Landing consigliata: {u.role === 'admin' ? '/admin/stores' : (u.role === 'manager' ? '/stores/[storeId]/planner' : '/stores/[storeId]/time')}</div>
              </div>
            ))}
            {rows.length === 0 && <div className="text-sm text-neutral-500">Nessun utente</div>}
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Nuovo utente</div>
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="text-sm">Nome completo</label>
              <Input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="(opzionale)" />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
            </div>
            <div>
              <label className="text-sm">Ruolo app</label>
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="border rounded-lg px-2 py-2 text-sm">
                <option value="agent">agent</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creo..." : "Crea utente"}</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
