import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
import AffiliateTracker from "@/components/AffiliateTracker";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vya Nexus | Productivity Suite",
  description: "Infraestrutura de alta performance para desenvolvedores e empresas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <CartProvider>
            <Suspense fallback={null}>
              <AffiliateTracker />
            </Suspense>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
