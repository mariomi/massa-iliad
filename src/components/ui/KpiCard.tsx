"use client";
import { motion } from "framer-motion";
import { Card } from "./card";
export function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string; }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="p-4">
        <div className="text-sm text-neutral-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {subtitle && <div className="text-xs text-neutral-400 mt-1">{subtitle}</div>}
      </Card>
    </motion.div>
  );
}
