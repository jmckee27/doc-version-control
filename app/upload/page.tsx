export default function UploadPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Upload Document
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload a new version of your assignment to the cloud
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">

          {/* Assignment name input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Assignment Name
            </label>
            <input
              type="text"
              placeholder="e.g. Research Paper Draft"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Version note input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Version Note <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Added conclusion section"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File drop zone */}
          {/* ── SPRINT 3 TODO ────────────────────────────────────
              Wire this area up to:
              - Accept a file via click or drag and drop
              - On file selected, POST to backend /api/upload
              - Show file name once selected
              - Show success message when upload is complete
          ─────────────────────────────────────────────────── */}
          <div className="mb-8 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs">
              Supports .txt and .docx files
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            {/* ── SPRINT 3 TODO ──────────────────────────────────
                Wire this button up to trigger the file upload
                to the backend API endpoint POST /api/upload
            ─────────────────────────────────────────────────── */}
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Upload Document
            </button>
            <button className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
          </div>

          {/* Sprint note — remove once Sprint 3 is complete */}
          <p className="mt-4 text-xs text-zinc-400">
            ⏳ File upload functionality coming in Sprint 3
          </p>

        </div>
      </main>
    </div>
  );
}
