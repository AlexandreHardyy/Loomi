import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Providers from "./providers";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loomi",
  description: "Loomi app quiz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  axios.defaults.baseURL = "http://localhost:3000";

  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
