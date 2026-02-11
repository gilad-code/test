"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCalls, deleteCall, type SavedCall } from "@/lib/storage";

export default function CallsPage() {
  const [calls, setCalls] = useState<SavedCall[]>([]);

  useEffect(() => {
    setCalls(getAllCalls());
  }, []);

  const handleDelete = (id: string) => {
    deleteCall(id);
    setCalls(getAllCalls());
  };

  const gradeColor = (percentage: number) =>
    percentage >= 70
      ? "text-emerald-600 bg-emerald-50"
      : percentage >= 50
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Call History</h1>
          <p className="text-muted">
            {calls.length === 0
              ? "No calls analyzed yet. Go analyze a transcript to get started."
              : `${calls.length} call${calls.length === 1 ? "" : "s"} analyzed`}
          </p>
        </div>
        <Link
          href="/analyze"
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Analyze New Call
        </Link>
      </div>

      {calls.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">&#x1f4de;</div>
          <h2 className="text-lg font-bold mb-2">No calls yet</h2>
          <p className="text-muted mb-6">
            Analyze your first interview transcript and it will appear here.
          </p>
          <Link
            href="/analyze"
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Analyze a Transcript
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <div
              key={call.id}
              className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors"
            >
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${gradeColor(call.result.percentage)}`}
              >
                <span className="text-lg leading-none">
                  {call.result.grade}
                </span>
                <span className="text-[10px] font-medium opacity-70">
                  {call.result.percentage}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/calls/${call.id}`}
                  className="text-base font-semibold hover:text-primary transition-colors"
                >
                  {call.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  <span>
                    {new Date(call.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    {call.result.overallScore}/{call.result.maxPossibleScore} pts
                  </span>
                  <span>
                    Talk ratio: {call.result.talkRatio.interviewer}% /{" "}
                    {call.result.talkRatio.interviewee}%
                  </span>
                  <span>
                    {call.result.painPoints.length} pain point
                    {call.result.painPoints.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/calls/${call.id}`}
                  className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(call.id)}
                  className="px-3 py-1.5 text-xs font-medium text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
