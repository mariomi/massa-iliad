"use client";
import { AppShell } from "@/components/shell/AppShell";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </motion.main>
      </AnimatePresence>
    </AppShell>
  );
}
