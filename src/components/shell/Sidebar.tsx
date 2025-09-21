"use client";

// 1. L'import di React è ancora FONDAMENTALE. Assicurati che sia presente.
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Route } from 'next';
import { LayoutDashboard, Store, Calendar, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void; }) {
  
  // 2. MODIFICA: Ho cambiato 'JSX.Element' con 'React.ReactNode'.
  // Questo tipo è più flessibile e non dovrebbe causare l'errore del namespace.
  const items: { href: Route; label: string; icon: React.ReactNode; adminOnly?: boolean; workforceOnly?: boolean }[] = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/stores", icon: <Store size={20} />, label: "Punti vendita" },
    { href: "/reports/hours", icon: <Calendar size={20} />, label: "Report ore" },
    { href: "/reports/timesheet", icon: <Clock size={20} />, label: "Timesheet", workforceOnly: true },
    { href: "/admin/members", icon: <Users size={20} />, label: "Members", adminOnly: true },
    { href: "/admin/stores", icon: <Store size={20} />, label: "Admin Stores", adminOnly: true },
    { href: "/admin/users", icon: <Users size={20} />, label: "Admin Users", adminOnly: true },
    { href: "/admin/regions", icon: <Store size={20} />, label: "Admin Regions", adminOnly: true }
  ];

  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        setUserRole(data?.role || null);
      } catch {
        setUserRole(null);
      }
    })();
  }, []);

  const isAdmin = userRole === "admin";
  const isWorkforce = userRole === "workforce";

  // Filter items based on user role
  const core = items.filter(i => {
    if (i.adminOnly) return false;
    if (i.workforceOnly) return isWorkforce;
    if (isWorkforce) {
      // Workforce can only see dashboard, stores, reports/hours, and timesheet
      return i.href === "/dashboard" || i.href === "/stores" || i.href === "/reports/hours" || i.href === "/reports/timesheet";
    }
    return true;
  });
  const admin = items.filter(i => i.adminOnly);
  const [adminOpen, setAdminOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 256 : 80 }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-neutral-200 shadow-sm overflow-hidden"
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="h-16 flex items-center justify-between px-4">
        <div className="font-semibold">Iliad</div>
        <button onClick={onToggle} className="text-sm opacity-60 hover:opacity-100">⇔</button>
      </div>
      <nav className="space-y-2 px-2">
        {core.map((it) => (
          <Link key={it.href} href={it.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50">
            {it.icon}
            <motion.span animate={{ opacity: open ? 1 : 0 }} className="text-sm">{it.label}</motion.span>
          </Link>
        ))}

        {isAdmin && (
          <div className="mt-2">
            <button onClick={() => setAdminOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wide text-neutral-500">
              <span>Admin</span>
              <span>{adminOpen ? "▴" : "▾"}</span>
            </button>
            {adminOpen && (
              <div className="space-y-1">
                {admin.map((it) => (
                  <Link key={it.href} href={it.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50">
                    {it.icon}
                    <motion.span animate={{ opacity: open ? 1 : 0 }} className="text-sm">{it.label}</motion.span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </motion.aside>
  );
}
