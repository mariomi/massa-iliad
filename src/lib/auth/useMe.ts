"use client";
import { useEffect, useState } from "react";
import { findUserByEmail } from "./demo-db";

export type Me = { 
  id?: string; 
  role: "admin" | "user" | "workforce" | "dipendente" | "agente"; 
  email?: string; 
  name?: string; 
  supabaseUserId?: string | null 
} | null;

export function useMe() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // For demo purposes, get user from session storage or default to workforce
    const getCurrentUser = () => {
      try {
        // Try to get from session storage first
        const sessionData = sessionStorage.getItem('demo_user');
        if (sessionData) {
          const user = JSON.parse(sessionData);
          return {
            id: user.email === "admin@demo.com" ? "admin_user" : "workforce_user",
            role: user.role,
            email: user.email,
            name: user.name
          };
        }
        
        // Default to workforce for demo
        return {
          id: "workforce_user",
          role: "workforce" as const,
          email: "workforce@demo.com",
          name: "Forza Lavoro Demo"
        };
      } catch {
        return {
          id: "workforce_user",
          role: "workforce" as const,
          email: "workforce@demo.com", 
          name: "Forza Lavoro Demo"
        };
      }
    };

    const currentUser = getCurrentUser();
    setMe(currentUser);
    setLoading(false);
  }, []);
  
  return { me, loading };
}

