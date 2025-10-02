"use client";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { StoreProvider } from "@/lib/store/StoreContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        {isMobile && open && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setOpen(false)}
          />
        )}
        
        <Sidebar 
          open={open} 
          onToggle={() => setOpen(v => !v)} 
          isMobile={isMobile}
        />
        
        <div className={clsx(
          "flex-1 transition-all duration-300",
          // Desktop: sidebar width
          !isMobile && (open ? "ml-64" : "ml-20"),
          // Mobile: full width
          isMobile && "ml-0"
        )}>
          <Topbar 
            onToggleSidebar={() => setOpen(v => !v)} 
            isMobile={isMobile}
          />
          <motion.div layout className="p-4 md:p-6">
            {children}
          </motion.div>
        </div>
      </div>
    </StoreProvider>
  );
}
