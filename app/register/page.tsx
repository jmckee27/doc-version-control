import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-md mx-auto py-8 px-6">

        {/* App name / logo */}
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
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Connect to state variable to read on submit
            ─────────────────────────────────────────────────── */}
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Connect to state variable to read on submit
            ─────────────────────────────────────────────────── */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Connect to state variable to read on submit
            ─────────────────────────────────────────────────── */}
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm password field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Confirm Password
            </label>
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Validate this matches the password field above
                before allowing the form to submit
            ─────────────────────────────────────────────────── */}
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ── SPRINT 3 TODO ──────────────────────────────────
              Wire this button up to:
              - Validate passwords match
              - POST to backend API /api/register
              - On success: redirect to /login
              - On failure: show error message
          ─────────────────────────────────────────────────── */}
          <button className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Create Account
          </button>

          {/* Sprint note — remove once Sprint 3 is complete */}
          <p className="mt-4 text-xs text-zinc-400 text-center">
            <b> Registration functionality coming in Sprint 3 </b>
          </p>

          {/* Link back to Login page */}
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
