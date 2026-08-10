import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";

import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Workly | Freelance expertise, clearly delivered", template: "%s | Workly" },
  description: "Hire independent specialists, manage orders, and review completed work in one focused marketplace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${lora.variable}`}>
      <body><AuthProvider><Navbar /><div className="flex-1">{children}</div><Footer /></AuthProvider></body>
    </html>
  );
}
