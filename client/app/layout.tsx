import type { Metadata } from "next";
import { Cinzel, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DarshanEase — Temple Darshan Booking Platform",
  description: "Experience hassle-free Indian ethnic-themed temple darshan booking. Book tickets, choose VIP slots, and manage your spiritual journeys smoothly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-warm-cream text-foreground">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
