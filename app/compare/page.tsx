"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactDiffViewer from "react-diff-viewer-continued";
import mammoth from "mammoth";

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Read URL Params
  // When coming from version history Compare button
  // Pre-fills assignment dropdown and Version A automatically
  const urlAssignmentId = searchParams.get("assignmentId") || "";
  const urlVersionA     = searchParams.get("versionA")     || "";

  const [assignments, setAssignments]   = useState<any[]>([]);
  const [versions, setVersions]         = useState<any[]>([]);
  const [assignmentId, setAssignmentId] = useState(urlAssignmentId);
  const [versionA, setVersionA]         = useState(urlVersionA);
  const [versionB, setVersionB]         = useState("");
  const [textA, setTextA]               = useState("");
  const [textB, setTextB]               = useState("");
  const [comparing, setComparing]       = useState(false);
  const [error, setError]               = useState("");
  const [showDiff, setShowDiff]         = useState(false);
  const [splitView, setSplitView]       = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Route protection and load assignments
  useEffect(() => {
    if (!mounted) return;

    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/login");
      return;
    }

    async function fetchAssignments() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/docs?username=${username}`
        );
        const data = await response.json();
        setAssignments(data.result ?? []);
      } catch (err) {
        console.error("Failed to load assignments");
      }
    }
    fetchAssignments();
  }, [mounted]);

  // Load versions when assignment changes
  useEffect(() => {
    if (!assignmentId) {
      setVersions([]);
      return;
    }

    async function fetchVersions() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/doc/${assignmentId}`
        );
        const data = await response.json();
        setVersions(data.versions ?? []);
      } catch (err) {
        console.error("Failed to load versions");
      }
    }
    fetchVersions();
  }, [assignmentId]);

  // Extract text from files
  async function extractText(filePath: string, token: string): Promise<string> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/file/doc/${filePath}`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${filePath}`);
    }

    const blob = await response.blob();

    // .docx - use mammoth to extract plain text
    if (filePath.toLowerCase().endsWith(".docx")) {
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    // .txt - read bytes directly as text
    if (filePath.toLowerCase().endsWith(".txt")) {
      return await blob.text();
    }

    // .pdf and other formats not supported
    return "File format not supported for comparison. Only .txt and .docx files are supported.";
  }

  // Compare
  async function handleCompare() {
    setError("");
    setShowDiff(false);

    if (!versionA || !versionB) {
      setError("Please select both versions to compare.");
      return;
    }

    if (versionA === versionB) {
      setError("Please select two different versions.");
      return;
    }

    setComparing(true);

    try {
      const token = localStorage.getItem("token");

      // Find file_path for each selected version
      const versionAData = versions.find(
        (v: any) => v.version_number.toString() === versionA.toString()
      );
      const versionBData = versions.find(
        (v: any) => v.version_number.toString() === versionB.toString()
      );

      if (!versionAData || !versionBData) {
        setError("Could not find version data.");
        setComparing(false);
        return;
      }

      // Extract text from both files simultaneously
      const [contentA, contentB] = await Promise.all([
        extractText(versionAData.file_path, token!),
        extractText(versionBData.file_path, token!)
      ]);

      setTextA(contentA);
      setTextB(contentB);
      setShowDiff(true);

    } catch (err) {
      setError("Unable to compare versions. Please try again.");
    } finally {
      setComparing(false);
    }
  }

  // Downloads a specific version file
  async function handleDownload(versionNumber: string) {
    const token = localStorage.getItem("token");

    const versionData = versions.find(
      (v: any) => v.version_number.toString() === versionNumber.toString()
    );

    if (!versionData) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/doc/${versionData.file_path}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (!response.ok) return;

      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = versionData.file_path.split("/").pop() || `version_${versionNumber}`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  // Loading state - render after all hooks have been called
  if (!mounted) {
    return (
      <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
        <main className="flex flex-1 flex-col w-full max-w-7xl mx-auto py-8 px-6">
          <div className="text-zinc-400">Loading...</div>
        </main>
      </div>
    );
  }

  return (
  <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-7xl mx-auto py-8 px-6">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Compare Versions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Select two versions of a document to see what changed
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 mb-6">

          {/* Assignment selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Select Assignment
            </label>
            <select
              value={assignmentId}
              onChange={(e) => {
                setAssignmentId(e.target.value);
                setVersionA("");
                setVersionB("");
                setShowDiff(false);
              }}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an assignment...</option>
              {assignments.map((a: { assignment_id: number; title: string }) => (
                <option key={a.assignment_id} value={a.assignment_id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Version selectors */}
          {assignmentId && versions.length > 0 && (
            <div className="grid grid-cols-2 gap-6 mb-6">

              {/* Version A selector + download button */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Version A
                </label>
                <select
                  value={versionA}
                  onChange={(e) => { setVersionA(e.target.value); setShowDiff(false); }}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="">Select version A...</option>
                  {versions.map((v: { version_id: number; version_number: number }) => (
                    <option key={v.version_id} value={v.version_number}>
                      v{v.version_number}
                    </option>
                  ))}
                </select>
                {versionA && (
                  <button
                    onClick={() => handleDownload(versionA)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                  >
                    Download Version {versionA}
                  </button>
                )}
              </div>

              {/* Version B selector + download button */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Version B
                </label>
                <select
                  value={versionB}
                  onChange={(e) => { setVersionB(e.target.value); setShowDiff(false); }}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="">Select version B...</option>
                  {versions.map((v: { version_id: number; version_number: number }) => (
                    <option key={v.version_id} value={v.version_number}>
                      v{v.version_number}
                    </option>
                  ))}
                </select>
                {versionB && (
                  <button
                    onClick={() => handleDownload(versionB)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                  >
                    Download Version {versionB}
                  </button>
                )}
              </div>

            </div>
          )}

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <button
            onClick={handleCompare}
            disabled={!versionA || !versionB || comparing}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {comparing ? "Comparing..." : "Compare Versions"}
          </button>

          <p className="mt-3 text-xs text-zinc-400">
            Supports .txt and .docx files. PDF comparison not yet supported.
          </p>

        </div>

        {/* Diff viewer - shown after Compare is clicked */}
        {showDiff && (
          <div className="rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">

            {/* Header with legend and toggle */}
            <div className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between flex-wrap gap-3">
              <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                Comparing Version {versionA} - Version {versionB}
              </span>

              <div className="flex items-center gap-4">

                {/* Legend */}
                <div className="flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></span>
                    Added
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900"></span>
                    Removed
                  </span>
                </div>

                {/* Split/Unified toggle */}
                <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-600 overflow-hidden text-xs font-medium">
                  <button
                    onClick={() => setSplitView(true)}
                    className={`px-3 py-1.5 transition-colors ${
                      splitView
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setSplitView(false)}
                    className={`px-3 py-1.5 transition-colors ${
                      !splitView
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    Unified
                  </button>
                </div>

              </div>
            </div>

            {/* Diff viewer with serif font and document styling */}
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", lineHeight: "1.8" }}>
              <ReactDiffViewer
                oldValue={textA}
                newValue={textB}
                splitView={splitView}
                leftTitle={`Version ${versionA}`}
                rightTitle={`Version ${versionB}`}
                styles={{
                  variables: {
                    dark: {
                      diffViewerBackground: '#18181b',
                      diffViewerColor: '#e4e4e7',
                      addedBackground: '#14532d',
                      addedColor: '#bbf7d0',
                      removedBackground: '#450a0a',
                      removedColor: '#fecaca',
                      wordAddedBackground: '#166534',
                      wordRemovedBackground: '#7f1d1d',
                      addedGutterBackground: '#14532d',
                      removedGutterBackground: '#450a0a',
                      gutterBackground: '#27272a',
                      gutterColor: '#71717a',
                      codeFoldBackground: '#27272a',
                      emptyLineBackground: '#18181b',
                      gutterBackgroundDark: '#27272a',
                    },
                    light: {
                      diffViewerBackground: '#ffffff',
                      diffViewerColor: '#18181b',
                      addedBackground: '#f0fdf4',
                      addedColor: '#14532d',
                      removedBackground: '#fef2f2',
                      removedColor: '#7f1d1d',
                      wordAddedBackground: '#bbf7d0',
                      wordRemovedBackground: '#fecaca',
                      gutterBackground: '#f9fafb',
                      gutterColor: '#9ca3af',
                    }
                  },
                  line: {
                    padding: "6px 16px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    lineHeight: "1.8",
                  },
                  titleBlock: {
                    fontFamily: "inherit",
                    fontSize: "13px",
                    fontWeight: "600",
                    padding: "10px 16px",
                    backgroundColor: "transparent",
                  },
                  gutter: {
                    minWidth: "40px",
                    padding: "6px 12px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "13px",
                  },
                  diffContainer: {
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }
                }}
                useDarkTheme={
                  typeof window !== "undefined" &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                }
              />
            </div>

          </div>
        )}

        {/* Shown before compare is run */}
        {!showDiff && (
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
              Select an assignment and two versions above then click Compare
            </div>
          </div>
        )}

      </main>
    </div>
  </Suspense>
  );
}