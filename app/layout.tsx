// ============================================================
// app/layout.tsx
// ============================================================
// WHAT IS THIS FILE?
// This is the root layout — it wraps EVERY page in the app.
// Whatever you put here appears on all pages automatically.
//
// WHAT CHANGED FROM THE ORIGINAL:
// Added the Navbar import and <Navbar /> component so the
// navigation bar appears on every page without needing to
// add it to each page file individually.
//
// The original layout.tsx only had fonts and a <body> tag.
// ============================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";  // ← added

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
        {children}        {/* ← each page loads here */}
      </body>
    </html>
  );
}
