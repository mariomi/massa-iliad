"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { StoreSelector } from "@/components/StoreSelector";
import { useMe } from "@/lib/auth/useMe";
export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { me } = useMe();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: redirect anyway
      window.location.href = "/login";
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-neutral-200">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="px-3 py-2 rounded-lg border hover:bg-neutral-50">☰</button>
          <span className="font-medium hidden md:block">Ambassador Console</span>
        </div>
        <div className="flex items-center gap-4">
          <StoreSelector />
          <button className="relative p-2 rounded-lg hover:bg-neutral-50">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{me?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-sm">
              <div className="font-medium">{me?.name || "Utente"}</div>
              <div className="text-xs text-neutral-500">{me?.role || "user"}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
