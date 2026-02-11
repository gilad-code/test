"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCall, type SavedCall } from "@/lib/storage";

function ScoreRing({
  percentage,
  grade,
  size = 120,
}: {
  percentage: number;
  grade: string;
  size?: number;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color =
    percentage >= 70
      ? "text-emerald-500"
      : percentage >= 50
        ? "text-amber-500"
        : "text-red-500";
  const strokeColor =
    percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${color}`}>{grade}</span>
        <span className="text-xs text-muted">{percentage}%</span>
      </div>
    </div>
  );
}

function CategoryBar({
  name,
  score,
  maxScore,
  percentage,
}: {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}) {
  const color =
    percentage >= 70
      ? "bg-emerald-500"
      : percentage >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-muted">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function CallDetailPage() {
  const params = useParams();
  const [call, setCall] = useState<SavedCall | null>(null);
  const [activeTab, setActiveTab] = useState<
    "score" | "strengths" | "improve" | "pains"
  >("score");

  useEffect(() => {
    if (params.id) {
      setCall(getCall(params.id as string));
    }
  }, [params.id]);

  if (!call) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Call not found</h1>
        <p className="text-muted mb-6">
          This call may have been deleted or the link is invalid.
        </p>
        <Link
          href="/calls"
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Calls
        </Link>
      </div>
    );
  }

  const result = call.result;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/calls"
          className="text-sm text-muted hover:text-primary transition-colors mb-3 inline-block"
        >
          &larr; Back to Call History
        </Link>
        <h1 className="text-3xl font-bold mb-1">{call.title}</h1>
        <p className="text-muted text-sm">
          Analyzed on{" "}
          {new Date(call.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing percentage={result.percentage} grade={result.grade} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">
              Overall Score: {result.overallScore}/{result.maxPossibleScore}
            </h2>
            <p className="text-muted">{result.summary}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-sm">
                <span className="text-muted">Talk Ratio: </span>
                <span className="font-medium">
                  You {result.talkRatio.interviewer}% / Them{" "}
                  {result.talkRatio.interviewee}%
                </span>
                {result.talkRatio.interviewer <= 30 && (
                  <span className="text-success ml-1">(Great!)</span>
                )}
                {result.talkRatio.interviewer > 45 && (
                  <span className="text-danger ml-1">(Too much talking)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-card border border-border rounded-lg p-1">
        {[
          { id: "score" as const, label: "Score Breakdown" },
          {
            id: "strengths" as const,
            label: `Strengths (${result.thingsWell.length})`,
          },
          {
            id: "improve" as const,
            label: `To Improve (${result.thingsToImprove.length})`,
          },
          {
            id: "pains" as const,
            label: `Pain Points (${result.painPoints.length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground hover:bg-background"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "score" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Category Scores</h3>
          <div className="space-y-5">
            {result.categories.map((cat) => (
              <div key={cat.criteriaId}>
                <CategoryBar
                  name={cat.name}
                  score={cat.score}
                  maxScore={cat.maxScore}
                  percentage={cat.percentage}
                />
                <p className="text-xs text-muted mt-1">{cat.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "strengths" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Things You Did Well</h3>
          {result.thingsWell.length === 0 ? (
            <p className="text-muted">No specific strengths detected.</p>
          ) : (
            <div className="space-y-3">
              {result.thingsWell.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-success/5 border border-success/20 rounded-lg px-4 py-3"
                >
                  <span className="text-success text-lg">&#x2713;</span>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "improve" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Things to Improve</h3>
          {result.thingsToImprove.length === 0 ? (
            <p className="text-muted">No improvements detected.</p>
          ) : (
            <div className="space-y-3">
              {result.thingsToImprove.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3"
                >
                  <span className="text-amber-500 text-lg">&#x26A0;</span>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "pains" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Detected Pain Points</h3>
            {result.painPoints.length === 0 ? (
              <p className="text-muted">No clear pain points detected.</p>
            ) : (
              <div className="space-y-4">
                {result.painPoints.map((pp, i) => {
                  const severityColor =
                    pp.severity === "high"
                      ? "border-red-500 bg-red-500/5"
                      : pp.severity === "medium"
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-blue-500 bg-blue-500/5";
                  const severityBadge =
                    pp.severity === "high"
                      ? "bg-red-500"
                      : pp.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-blue-500";
                  return (
                    <div
                      key={i}
                      className={`border-l-4 rounded-r-lg p-4 ${severityColor}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${severityBadge}`}
                        >
                          {pp.severity.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-medium ${pp.explored ? "text-success" : "text-danger"}`}
                        >
                          {pp.explored ? "Explored" : "Not explored"}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{pp.topic}</p>
                      <p className="text-xs text-muted italic mb-2">
                        &ldquo;{pp.quote}&rdquo;
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {pp.suggestion}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {result.painPointsToDiveDeeper.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">
                Pain Points to Dive Deeper
              </h3>
              <div className="space-y-3">
                {result.painPointsToDiveDeeper.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3"
                  >
                    <span className="text-primary text-lg">&#x279C;</span>
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
