export default function ComparePage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Compare Versions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Select two versions of a document to see what changed
          </p>
        </div>

        {/* Version selector card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-6">
            Select Versions to Compare
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8">

            {/* Version A selector */}
            {/* ── SPRINT 4 TODO ──────────────────────────────────
                Replace this placeholder with a dropdown that
                loads the student's uploaded versions from the
                backend API GET /api/versions
            ─────────────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Version A
              </label>
              <select className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a version...</option>
              </select>
            </div>

            {/* Version B selector */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Version B
              </label>
              <select className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a version...</option>
              </select>
            </div>

          </div>

          {/* ── SPRINT 4 TODO ──────────────────────────────────
              Wire this button up to call GET /api/compare
              with the two selected version IDs, then display
              the diff results in the panel below
          ─────────────────────────────────────────────────── */}
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Compare Versions
          </button>

          {/* Sprint note — remove once Sprint 4 is complete */}
          <p className="mt-4 text-xs text-zinc-400">
            ⏳ Comparison functionality coming in Sprint 4
          </p>
        </div>

        {/* Diff results panel — shown after comparison runs */}
        {/* ── SPRINT 4 TODO ────────────────────────────────────
            This panel will display the side-by-side diff once
            the backend returns results. Added lines in green,
            removed lines in red, unchanged lines in gray.
        ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <div className="col-span-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
              Version A
            </div>
            <div className="col-span-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
              Version B
            </div>
          </div>
          <div className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
            Select two versions above and click Compare to see differences
          </div>
        </div>

      </main>
    </div>
  );
}
