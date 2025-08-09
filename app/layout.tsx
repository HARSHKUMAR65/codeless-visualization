import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/lib/providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Codeless Visualization",
  description: "Build beautiful, interactive dashboards without writing a single line of code. Connect data, drag-and-drop charts, and share insights instantly.",
  icons: {
    icon: "/fav.png",
    apple: "/fav.png",
    shortcut: "/fav.jpg",
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers> {children} </Providers>
      </body>
    </html>
  );
}
