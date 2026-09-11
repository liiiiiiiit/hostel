import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorldHostel — Book hostels & budget stays worldwide",
  description:
    "Find, compare and book beds in 23,000 hostels across 170 countries. Best price guarantee, free cancellation on most rooms, and reviews from 10 million travelers.",
  keywords: [
    "hostel",
    "hostels",
    "backpacker",
    "budget travel",
    "hostel booking",
    "cheap accommodation",
    "WorldHostel",
  ],
  authors: [{ name: "WorldHostel" }],
  openGraph: {
    title: "WorldHostel — Sleep cheap. Travel far.",
    description:
      "The home of budget travel. Book beds in 23,000 hostels across 170 countries.",
    siteName: "WorldHostel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldHostel — Sleep cheap. Travel far.",
    description:
      "The home of budget travel. Book beds in 23,000 hostels across 170 countries.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
