import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";

export const metadata = { title: "Iliad Ambassador", description: "Workforce & Sales" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
