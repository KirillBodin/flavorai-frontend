import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/ui/layout/Navbar";


export const metadata = {
  title: "FlavorAI",
  description: "AI-powered recipe discovery app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
