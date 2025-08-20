"use client";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onToggle={() => setOpen(v => !v)} />
      <div className={clsx("flex-1", open ? "md:ml-64" : "md:ml-20")}>
        <Topbar onToggleSidebar={() => setOpen(v => !v)} />
        <motion.div layout>{children}</motion.div>
      </div>
    </div>
  );
}
