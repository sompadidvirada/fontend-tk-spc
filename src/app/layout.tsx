import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-day-picker/dist/style.css";
import NextTopLoader from "nextjs-toploader";
import { Noto_Sans_Lao } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/socket-io/SocketContext";

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-lao",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Treekoff store",
  description: "treekoff suuply chain hold and maintenance by sompadid virada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSansLao.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <SocketProvider>
          {children}
        </SocketProvider>
        <Toaster />
      </body>
    </html>
  );
}
