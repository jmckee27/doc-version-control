// ============================================================
// app/upload/page.tsx — Upload Page
// ============================================================
// FULLY IMPLEMENTED IN SPRINT 3
//
// WHAT THIS PAGE DOES:
// Lets a student upload a file as a new version of an
// existing assignment. The file is sent to Azure Blob
// Storage and recorded as a new version in the SQL database.
//
// REQUIRES:
// - User must be logged in (JWT token in localStorage)
// - An existing assignment ID to upload to
// - A file selected from their computer
//
// ENDPOINT: POST /api/file/doc/{id}
// HEADERS:
//   Authorization: Bearer {token}  ← JWT authentication
//   x-file-name: {filename}        ← tells backend the filename
//   Content-Type: {file.type}      ← file mime type
// BODY: raw file bytes
// RETURNS: { message, file_path, url }
//
// FLOW:
// 1. Student selects assignment from dropdown
// 2. Student picks a file from their computer
// 3. Clicks Upload
// 4. File sent to backend with JWT token
// 5. Backend stores in Azure Blob Storage
// 6. Backend records new version in SQL database
// 7. Success → redirect to version history page
// 8. Failure → show error message
//
// NOTE: Currently only supports uploading to EXISTING
// assignments. Creating a new assignment + uploading
// (POST /api/file/doc) is a Sprint 4 TODO.
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Upload() {

  const [assignments, setAssignments]   = useState<any[]>([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const router = useRouter();

  // Route protection & Fetch assignents 
  // Loads assignment list so student can pick which one
  // they are uploading a new version for.

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
    if (!assignmentId) {
      setError("Please select an assignment.");
      return;
    }
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      // GET JWT TOKEN 
      // Required by the upload endpoint for authentication.
      const token = localStorage.getItem("token");

      // POST FILE TO BACKEND
      // Instead of JSON requests, this sends raw file bytes as body.
      // File name goes in x-file-name header.
      // Content-Type tells backend what kind of file it is.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/doc/${assignmentId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "x-file-name": selectedFile.name,
            "Content-Type": selectedFile.type || "application/octet-stream"
          },
          body: selectedFile  // raw file bytes - NOT JSON
        }
      );

      const data = await response.json();

      if (response.ok) {
        // UPLOAD SUCCESSFUL
        //  Backend returns: message, file_path, url 

        setSuccess("File uploaded successfully!");
        setTimeout(() => {
          router.push(`/documents/${assignmentId}`);
        }, 1500);

      } else {
        setError(data.error || "Upload failed. Please try again.");
      }

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

          {/* Assignment selector */}
          {/* Populated with real assignments from the database */}
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
              {assignments.map((a: {
                assignment_id: number;
                title: string;
              }) => (
                <option key={a.assignment_id} value={a.assignment_id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* File picker */}
          {/* Opens file browser when clicked */}
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
              <label
                htmlFor="file-input"
                className="cursor-pointer"
              >
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
                      Supports .docx, .txt, .pdf
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {/* Success message */}
          {success && (
            <p className="mb-4 text-sm text-green-500">{success}</p>
          )}

          {/* Action buttons */}
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

          {/* ── SPRINT 4 TODO ──────────────────────────────────
              Add ability to create a NEW assignment and upload
              first version in one step using:
              POST /api/file/doc (no id in URL)
              This initializes a new document and version together
          ─────────────────────────────────────────────────── */}

        </div>
      </main>
    </div>
  );
}
