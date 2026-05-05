"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function DownloadButton({ filePath, versionNumber }: {
  filePath: string;
  versionNumber: number;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState("");

  async function handleDownload() {
    setDownloading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Uses real file_path from database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/doc/${filePath}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        setError("Failed to download file.");
        return;
      }

      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `document_v${versionNumber}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium disabled:opacity-50"
      >
        {downloading ? "Downloading..." : "Download"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function DocumentVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }                        = use(params);
  const [document, setDocument]       = useState<any>(null);
  const [versions, setVersions]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const router                        = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/doc/${id}`
        );
        const data = await response.json();
        setDocument(data.document);
        setVersions(data.versions ?? []);

      } catch (err) {
        setError("Failed to load document.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen items-center justify-center">
        <p className="text-red-500">{error || "Document not found."}</p>
        <Link href="/" className="text-blue-600 mt-4 text-sm">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        <div className="mb-6">
          <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            {document.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Assignment ID: {id} · {versions.length} versions
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">

          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            <div className="col-span-1">Ver.</div>
            <div className="col-span-4">Uploaded</div>
            <div className="col-span-3">File Path</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {versions.map((version: {
              version_id: number;
              version_number: number;
              file_path: string;
              uploaded_at: string;
            }, index: number) => (
              <div
                key={version.version_id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors items-center"
              >
                <div className="col-span-1 flex items-center gap-2">
                  <span className="font-medium text-black dark:text-zinc-50">
                    v{version.version_number}
                  </span>
                  {index === versions.length - 1 && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded">
                      Latest
                    </span>
                  )}
                </div>

                <div className="col-span-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {version.uploaded_at.split("T")[0]}
                </div>

                <div className="col-span-3 text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {version.file_path}
                </div>

                <div className="col-span-4 flex justify-end gap-3">
                  {/* Download uses real file_path from database */}
                  <DownloadButton
                    filePath={version.file_path}
                    versionNumber={version.version_number}
                  />

                  {/* Compare pre-fills assignmentId and versionA on compare page */}
                  <Link
                    href={`/compare?assignmentId=${id}&versionA=${version.version_number}`}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 text-sm font-medium"
                  >
                    Compare
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Links to upload page in Mode 2 for existing assignment */}
          <Link
            href={`/upload?mode=existing`}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Upload New Version
          </Link>
        </div>

      </main>
    </div>
  );
}
