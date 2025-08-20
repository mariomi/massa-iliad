import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "Iliad Ambassador", description: "Workforce & Sales" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="it"><body className="min-h-screen">{children}</body></html>);
}
