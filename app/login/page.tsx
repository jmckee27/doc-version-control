export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-md mx-auto py-8 px-6">

        {/* App name / logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Document Version Control
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to manage your document versions
          </p>
        </div>

        {/* Login card */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">

          {/* Username field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Username
            </label>
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Connect this field to a state variable so its
                value can be read when the Sign In button is clicked
            ─────────────────────────────────────────────────── */}
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            {/* ── SPRINT 3 TODO ────────────────────────────────
                Connect this field to a state variable so its
                value can be read when the Sign In button is clicked
            ─────────────────────────────────────────────────── */}
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ── SPRINT 3 TODO ──────────────────────────────────
              Wire this button up to:
              - Read username + password from the fields above
              - POST to backend API /api/login
              - On success: save token, redirect to "/"
              - On failure: show error message below this button
          ─────────────────────────────────────────────────── */}
          <button className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>

          {/* Sprint note — remove once Sprint 3 is complete */}
          <p className="mt-4 text-xs text-zinc-400 text-center">
            ⏳ Login functionality coming in Sprint 3
          </p>

        </div>
      </main>
    </div>
  );
}
