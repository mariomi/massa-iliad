"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoDataService, DemoUser } from "@/lib/demo-data/demo-service";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<DemoUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");
  const [loading, setLoading] = useState(false);

  const load = () => {
    const users = demoDataService.getAllUsers();
    setRows(users);
  };
  
  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      // Create new user using demo service
      const newUser = demoDataService.addUser({
        name: fullName || email,
        email: email,
        role: role as "admin" | "manager" | "staff" | "workforce",
        store_id: null, // Will be assigned later
        team: null,
        phone: "",
        address: "",
        hire_date: new Date().toISOString(),
        status: "active"
      });
      
      alert(`Utente "${newUser.name}" creato con successo!`);
      setEmail(""); 
      setPassword(""); 
      setFullName(""); 
      setRole("staff");
      load();
    } catch (err: any) { 
      alert(err?.message ?? String(err)); 
    }
    finally { 
      setLoading(false); 
    }
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
                    <div className="font-medium">{u.name}</div>
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
                <option value="staff">staff</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
                <option value="workforce">workforce</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creo..." : "Crea utente"}</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
