
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Upload() {

  // mode=new: "New Assignment" button on dashboard
  //  Shows title + description inputs
  //  Three step flow: create assignment -> upload file -> record version
  //
  // mode=existing: "Upload Document" button on dashboard
  // or "Upload New Version" on version history page
  // Shows assignment dropdown
  // Two step flow: upload file -> record version
  //
  // no mode: User navigated directly to /upload

  const searchParams   = useSearchParams();
  const initialMode    = searchParams.get("mode") || "toggle";

  const [mode, setMode]                 = useState(initialMode);
  const [assignments, setAssignments]   = useState<any[]>([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [title, setTitle]               = useState("");
  const [description, setDescription]  = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const username = localStorage.getItem("username");
      if (!username) {
        router.push("/login");
        return;
      }

      // Fetch assignments to populate the dropdown
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/docs?username=${username}`
        );
        const data = await response.json();
        setAssignments(data.result ?? []);
      } catch (err) {
        setError("Failed to load assignments.");
      }
    }
    init();
  }, []);

  // Runs when student picks a file from their computer.
  // Saves the file object to state so we can send it on upload

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError("");
    }
  }

  // ── HANDLE UPLOAD ──────────────────────────────────────────
  // Runs when student clicks the Upload button.
  // Validates inputs, then sends file to backend.
  // ───────────────────────────────────────────────────────────
  async function handleUpload() {
    setError("");
    setSuccess("");

    // Validate both assignment and file are selected
    if (mode === "existing" && !assignmentId) {
      setError("Please select an assignment.");
      return;
    }
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const token  = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    setUploading(true);

    try {
      let finalAssignmentId = assignmentId;

      // Mode 1: New assignment
      // Create assignment record in SQL
      // Returns assignment_id to use in steps 2 and 3
      if (mode === "new") {
        if (!title) {
          setError("Please enter an assignment title.");
          setUploading(false);
          return;
        }

        const assignmentResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/doc`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: parseInt(userId || "0"),
              title: title,
              description: description
            })
          }
        );

        const assignmentData = await assignmentResponse.json();

        if (!assignmentResponse.ok) {
          setError("Failed to create assignment.");
          setUploading(false);
          return;
        }

        finalAssignmentId = assignmentData.assignment_id;

      } else {
        // Mode 2: Existing Assignment 
        if (!assignmentId) {
          setError("Please select an assignment.");
          setUploading(false);
          return;
        }
      }

      // Step 2:Uploads  file to stoage account 
      // Sends raw file bytes with JWT token in header
      // Returns file_path - the blob storage location
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/doc?id=${finalAssignmentId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "x-file-name": selectedFile.name,
            "Content-Type": selectedFile.type || "application/octet-stream"
          },
          body: selectedFile
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setError(uploadData.error || "File upload failed.");
        setUploading(false);
        return;
      }

      const filePath = uploadData.file_path;

      // Step 3: record version in SQL
      // Links the blob file_path to the assignment in SQL
      // Auto increments version number
      const versionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/meta/doc/${finalAssignmentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(userId || "0"),
            file_path: filePath
          })
        }
      );

      if (!versionResponse.ok) {
        setError("File uploaded but failed to record version.");
        setUploading(false);
        return;
      }

      setSuccess("File uploaded successfully!");
      setTimeout(() => {
        router.push(`/documents/${finalAssignmentId}`);
      }, 1500);

    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Upload Document
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload a new version of your assignment to the cloud
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">

          {/* Toggle - only shown when navigating directly to /upload */}
          {mode === "toggle" && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                What would you like to do?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setMode("new")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Create New Assignment
                </button>
                <button
                  onClick={() => setMode("existing")}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Upload to Existing Assignment
                </button>
              </div>
            </div>
          )}

          {/* Mode 1 - New Assignment: title and description inputs */}
          {mode === "new" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Research Paper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Description <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Final year thesis"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Mode 2 - Existing Assignment: dropdown */}
          {mode === "existing" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Select Assignment
              </label>
              <select
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
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
          )}

          {/* File picker - shows once a mode is selected */}
          {mode !== "toggle" && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Select File
              </label>
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".docx,.txt,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  {selectedFile ? (
                    <div>
                      <p className="text-black dark:text-zinc-50 font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-zinc-400 text-xs mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB — click to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                        Click to browse for a file
                      </p>
                      <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                        Supports .docx, and .txt PDF not yet supported
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {error   && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

          {mode !== "toggle" && (
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
              <Link
                href="/"
                className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
