"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ReactQueryProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
