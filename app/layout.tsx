import type { Metadata } from "next";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "BooyahStats",
  description: "Analytics inteligente para Free Fire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider />

        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}