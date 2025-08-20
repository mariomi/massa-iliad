"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);
    if (error) alert(error.message); else window.location.href = "/dashboard";
  };
  return (
    <div className="grid place-items-center min-h-screen px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <h1 className="text-xl font-semibold mb-4">Accedi</h1>
        <form onSubmit={login} className="space-y-3">
          <div><Label>Email</Label><Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required /></div>
          <div><Label>Password</Label><Input value={pwd} onChange={(e)=>setPwd(e.target.value)} type="password" required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "Entra"}</Button>
        </form>
      </div>
    </div>
  );
}
