import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";  // ← added
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Controls the browser tab title and description
export const metadata: Metadata = {
  title: "Doc Version Control",               // ← updated from default
  description: "Version control for plaintext and .docx files",  // ← updated
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />        {/* ← added — shows on every page */}
        <Suspense fallback={<div>Loading...</div>}>
        {children}        {/* ← each page loads here */}
        </Suspense>
      </body>
    </html>
  );
}
