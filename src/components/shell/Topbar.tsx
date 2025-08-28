"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { StoreSelector } from "@/components/StoreSelector";
export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
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
          <Avatar className="h-8 w-8"><AvatarFallback>ME</AvatarFallback></Avatar>
        </div>
      </div>
    </div>
  );
}
