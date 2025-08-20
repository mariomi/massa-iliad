"use client";
import { motion } from "framer-motion";
export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 }}}} className="space-y-2">
      {children}
    </motion.ul>
  );
}
export function AnimatedItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
      {children}
    </motion.li>
  );
}
