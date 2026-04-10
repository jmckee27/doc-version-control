import Link from "next/link";

// MOCK DATA — Will replace with real API call in Sprint 3
// This simulates what the backend would return for a document - dynamic page
// This page can only be reached through a manual URL: /documents

const mockDocument = {
  id: 1,
  name: "Research Paper Draft",
  totalVersions: 5,
};

const mockVersions = [
  {
    versionNumber: 5,
    uploadedAt: "March 24, 2026 — 3:42 PM",
    fileSize: "2.4 MB",
    note: "Added conclusion section",
    isLatest: true,
  },
  {
    versionNumber: 4,
    uploadedAt: "March 22, 2026 — 11:15 AM",
    fileSize: "2.1 MB",
    note: "Revised methodology",
    isLatest: false,
  },
  {
    versionNumber: 3,
    uploadedAt: "March 20, 2026 — 9:00 AM",
    fileSize: "1.9 MB",
    note: "Added references",
    isLatest: false,
  },
  {
    versionNumber: 2,
    uploadedAt: "March 18, 2026 — 2:30 PM",
    fileSize: "1.6 MB",
    note: "Initial body sections",
    isLatest: false,
  },
  {
    versionNumber: 1,
    uploadedAt: "March 15, 2026 — 10:00 AM",
    fileSize: "0.8 MB",
    note: "First draft",
    isLatest: false,
  },
];

// The page component, mockVersion and mockDocuments will be deleted in Sprint 3
// "params" is automatically provided by Next.js and contains
// the [id] value from the URL — example: /documents/3, id = 3

export default async function DocumentVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Read the document ID from the URL
  const { id } = await params;

  // ── SPRINT 3 TODO ──────────────────────────────────────────
  // Replace mockDocument and mockVersions above with:
  //   const response = await fetch(`/api/documents/${id}/versions`)
  //   const { document, versions } = await response.json()
  // ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        {/* Back link to Dashboard */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            {mockDocument.name}
          </h1>
          {/* Shows the document ID from the URL — confirms dynamic routing works */}
          <p className="text-zinc-600 dark:text-zinc-400">
            Document ID: {id} · {mockDocument.totalVersions} versions
          </p>
        </div>

        {/* Version history table */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            <div className="col-span-1">Ver.</div>
            <div className="col-span-4">Uploaded</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Note</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Version rows */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {mockVersions.map((version) => (
              <div
                key={version.versionNumber}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors items-center"
              >
                {/* Version number + Latest badge */}
                <div className="col-span-1 flex items-center gap-2">
                  <span className="font-medium text-black dark:text-zinc-50">
                    v{version.versionNumber}
                  </span>
                  {version.isLatest && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded">
                      Latest
                    </span>
                  )}
                </div>

                {/* Timestamp */}
                <div className="col-span-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {version.uploadedAt}
                </div>

                {/* File size */}
                <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {version.fileSize}
                </div>

                {/* Version note */}
                <div className="col-span-3 text-sm text-zinc-600 dark:text-zinc-400 italic">
                  {version.note}
                </div>

                {/* Action buttons */}
                {/* ── SPRINT 4 TODO ──────────────────────────
                    Wire these buttons up to:
                    - Download: fetch file from Azure Blob Storage
                    - Compare: navigate to /compare with this
                      version pre-selected
                ─────────────────────────────────────────── */}
                <div className="col-span-2 flex justify-end gap-3">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium">
                    Download
                  </button>
                  <Link
                    href="/compare"
                    className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 text-sm font-medium"
                  >
                    Compare
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Upload new version button */}
        <div className="flex gap-4">
          <Link
            href="/upload"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Upload New Version
          </Link>
        </div>

        {/* Sprint note — remove once Sprint 3 is complete */}
        <p className="mt-6 text-xs text-zinc-400">
          <b> Real version data coming in Sprint 3 — currently showing mock data </b>
        </p>

      </main>
    </div>
  );
}
