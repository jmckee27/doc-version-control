"use client";

import { useState } from "react"; // remenbers whats user types 
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {

  // STATE VARIABLES- Four fields: username, email, password, confirm password

  const [username, setUsername]           = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);

  const router = useRouter();

  // REGISTER FUNCTION - Runs when Create Account 
  // button is clicked
  async function handleRegister() {

    setError("");

    // Validate all fields are filled in
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // This check if password matches on the frontend BEFORE sending
    // to the backend
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      // Only sends username, password, email - NOT confirmPassword
      // The backend doesn't need confirmPassword, that's just
      // a frontend validation check

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        // Redirect to login page so user can sign in
        // with their new account
        router.push("/login");
      } else {

        // Common failure: "Username already exists."
        // Shows exact error message from backend
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-md mx-auto py-8 px-6">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Create Account
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign up to start tracking your document versions
          </p>
        </div>

        {/* Register card */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">

          {/* Username field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm password field */}
          {/* Frontend only, this is not sent to backend */}
          {/* Just checks that password was typed correctly */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error message only shows if error state is set */}
          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Create Account button */}
          <button
            onClick={handleRegister} // Handles button clicks
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Link back to Login */}
          <p className="mt-4 text-sm text-center text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}