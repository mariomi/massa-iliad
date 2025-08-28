"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const roleHint = params.get("r") || "";
  const prefill = params.get("email") || "";
  
  // Prefill email if provided
  useEffect(() => { if (prefill) setEmail(prefill); }, [prefill]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) { setLoading(false); return alert(data.error || "Login fallito"); }
      // For non-admin users, also sign into Supabase Auth to enable RLS
      try {
        if (data?.user?.role === "user") {
          const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
          if (error) console.warn("Supabase sign-in failed:", error.message);
        }
      } catch {}
      window.location.href = "/home";
    } catch (err: any) {
      setLoading(false);
      alert(err?.message ?? String(err));
    }
  };

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <h1 className="text-xl font-semibold mb-1">Accedi</h1>
        {roleHint && <p className="text-xs text-neutral-500 mb-3">Accesso area: {roleHint}</p>}
        <form onSubmit={login} className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "Entra"}</Button>
        </form>
      </div>
    </div>
  );
}
