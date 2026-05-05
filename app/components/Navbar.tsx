"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {

  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {

    // Reads localStorage when Navbar first renders

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    // login/page.tsx fires "auth-change" after saving token
    // handleSignOut fires "auth-change" after clearing token
    // This makes Navbar update immediately without page refresh

    function handleAuthChange() {
      const updated = localStorage.getItem("username");
      setUsername(updated);
    }

    window.addEventListener("auth-change", handleAuthChange);

    // Removes the event listener when Navbar unmounts
    // Prevents memory leaks
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };

  }, []);

  // Sign out - Clears all user data from localStorage
  // Fires auth-change so Navbar updates immediately
  // Redirects to login page
  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setUsername(null);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  }

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6">

        {/* App name - always visible */}
        <Link
          href="/"
          className="text-lg font-bold text-black dark:text-zinc-50 mr-4"
        >
          Doc Version Control
        </Link>

        {/* Nav links - remain visible regardless if user signed in */}
        {/* Route protection on each page handles redirecting */}
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

        {/* Right side - changes based on login state */}
        <div className="ml-auto flex items-center gap-4">
          {username ? (
            <>
              {/* Shows username and Sign Out */}
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <b> {username} </b>
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            /* Shows Sign In button if not logged in */
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
