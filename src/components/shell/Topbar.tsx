"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { StoreSelector } from "@/components/StoreSelector";
import { useMe } from "@/lib/auth/useMe";
export function Topbar({ onToggleSidebar, isMobile }: { onToggleSidebar: () => void; isMobile?: boolean; }) {
  const { me } = useMe();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear demo user from sessionStorage
      sessionStorage.removeItem('demo_user');
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: clear sessionStorage and redirect anyway
      sessionStorage.removeItem('demo_user');
      window.location.href = "/login";
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/80 backdrop-blur border-b border-neutral-200 dark:border-gray-800">
      <div className="h-16 px-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 md:px-3 md:py-2 rounded-lg border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            ☰
          </button>
          <span className="font-medium hidden sm:block text-gray-900 dark:text-gray-100 text-sm md:text-base">
            Ambassador Console
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <StoreSelector />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100">
            <Bell size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-1 md:gap-2">
            <Avatar className="h-7 w-7 md:h-8 md:w-8">
              <AvatarFallback className="text-xs md:text-sm">{me?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100">{me?.name || "Utente"}</div>
              <div className="text-xs text-neutral-500 dark:text-gray-400">{me?.role || "user"}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 p-2 md:px-3 md:py-2"
            >
              <LogOut size={14} className="md:w-4 md:h-4" />
              <span className="hidden md:inline text-xs md:text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
