// ============================================================
// app/components/Navbar.tsx
// ============================================================
// WHAT IS THIS FILE?
// This is the navigation bar that appears at the top of every
// page. It lives in components/ because it's a shared piece
// used across all pages, not a page itself.
//
// In Next.js, navigation uses <Link> from "next/link" instead
// of React Router's <Link>. It works the same way — just a
// different import.
//
// "use client" is needed here because this component uses
// interactive navigation. Next.js components are server-side
// by default — "use client" opts this one into the browser.
// ============================================================

"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6">

        {/* App name — links back to home */}
        <Link
          href="/"
          className="text-lg font-bold text-black dark:text-zinc-50 mr-4"
        >
          📄 Doc Version Control
        </Link>

        {/* Navigation links */}
        {/* "href" matches the folder name in app/ */}
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
        >
          Dashboard
        </Link>

        <Link
          href="/upload"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
        >
          Upload
        </Link>

        <Link
          href="/compare"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
        >
          Compare
        </Link>

        {/* Login link — pushed to the right */}
        <div className="ml-auto">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>

      </div>
    </nav>
  );
}
