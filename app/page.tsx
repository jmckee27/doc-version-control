//  Dashboard page

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [username, setUsername]       = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchAssignments() {
      try {

        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
          router.push("/login");
          return;
        }

        setUsername(storedUsername);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meta/docs?username=${storedUsername}`
        );

        const data = await response.json();
        setAssignments(data.result ?? []);

      } catch (err) {
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 flex-col w-full max-w-4xl mx-auto py-8 px-6">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Document Version Control
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Welcome back, <b> {username} </b>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">

          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            <div className="col-span-5">Assignment Title</div>
            <div className="col-span-3">Created</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {assignments.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
              No assignments yet. Create your first document below!
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {assignments.map((doc: {
                assignment_id: number;
                title: string;
                description: string;
                created_at: string;
              }) => (
                <div
                  key={doc.assignment_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="col-span-5">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {doc.title}
                    </p>
                  </div>
                  <div className="col-span-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {doc.created_at.split("T")[0]}
                  </div>
                  <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {doc.description}
                  </div>
                  <div className="col-span-2 text-right">
                    <Link
                      href={`/documents/${doc.assignment_id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          {/* ── SPRINT 3 TODO ──────────────────────────────────
              Wire to POST /api/meta/doc
              Send: {
                user_id: localStorage.getItem("user_id"),
                title: from input,
                description: from input
              }
              On success: refresh assignments list
          ─────────────────────────────────────────────────── */}
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + New Document
          </button>

          <Link
            href="/upload"
            className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Upload Document
          </Link>
        </div>

      </main>
    </div>
  );
}
