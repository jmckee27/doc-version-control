export default function Home() {
  const documents = [
    {
      id: 1,
      name: "Project Proposal Q1 2026",
      lastModified: "March 24, 2026",
      size: "2.4 MB",
      versions: 5,
    },
    {
      id: 2,
      name: "Design Specifications v2.0",
      lastModified: "March 22, 2026",
      size: "8.7 MB",
      versions: 12,
    },
    {
      id: 3,
      name: "Budget Report 2026",
      lastModified: "March 20, 2026",
      size: "1.1 MB",
      versions: 3,
    },
    {
      id: 4,
      name: "Meeting Minutes - March",
      lastModified: "March 19, 2026",
      size: "0.5 MB",
      versions: 8,
    },
    {
      id: 5,
      name: "User Requirements Document",
      lastModified: "March 15, 2026",
      size: "3.2 MB",
      versions: 15,
    },
    {
      id: 6,
      name: "API Documentation",
      lastModified: "March 10, 2026",
      size: "4.5 MB",
      versions: 21,
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Document Version Control
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and track versions of your documents
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            <div className="col-span-5">Document Name</div>
            <div className="col-span-2">Last Modified</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-2">Versions</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="col-span-5">
                  <p className="font-medium text-black dark:text-zinc-50">
                    {doc.name}
                  </p>
                </div>
                <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {doc.lastModified}
                </div>
                <div className="col-span-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {doc.size}
                </div>
                <div className="col-span-2">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded">
                    {doc.versions} versions
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + New Document
          </button>
          <button className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Upload Document
          </button>
        </div>
      </main>
    </div>
  );
}
