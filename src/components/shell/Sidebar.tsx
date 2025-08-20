"use client";

// 1. L'import di React è ancora FONDAMENTALE. Assicurati che sia presente.
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Route } from 'next';
import { LayoutDashboard, Store, Calendar, Users } from "lucide-react";

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void; }) {
  
  // 2. MODIFICA: Ho cambiato 'JSX.Element' con 'React.ReactNode'.
  // Questo tipo è più flessibile e non dovrebbe causare l'errore del namespace.
  const items: { href: Route; label: string; icon: React.ReactNode }[] = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/stores", icon: <Store size={20} />, label: "Punti vendita" },
    { href: "/reports/hours", icon: <Calendar size={20} />, label: "Report ore" },
    { href: "/admin/members", icon: <Users size={20} />, label: "Members" }
  ];

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
      <nav className="space-y-1 px-2">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50">
            {it.icon}
            <motion.span animate={{ opacity: open ? 1 : 0 }} className="text-sm">{it.label}</motion.span>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}