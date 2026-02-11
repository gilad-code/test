"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCalls, type SavedCall } from "@/lib/storage";

function ProgressChart({ calls }: { calls: SavedCall[] }) {
  // Show calls in chronological order (oldest first)
  const sorted = [...calls].reverse();

  if (sorted.length === 0) return null;

  const padding = { top: 30, right: 30, bottom: 50, left: 45 };
  const width = 700;
  const height = 300;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scores = sorted.map((c) => c.result.percentage);
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const maxScore = Math.min(100, Math.max(...scores) + 10);
  const range = maxScore - minScore || 1;

  const points = sorted.map((c, i) => ({
    x: padding.left + (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW),
    y: padding.top + chartH - ((c.result.percentage - minScore) / range) * chartH,
    score: c.result.percentage,
    grade: c.result.grade,
    title: c.title,
    date: new Date(c.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // Build SVG path for line
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area fill path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Horizontal grid lines
  const gridLines = 5;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = minScore + (range / gridLines) * i;
    const y = padding.top + chartH - ((val - minScore) / range) * chartH;
    return { val: Math.round(val), y };
  });

  // Color based on latest score
  const latestScore = scores[scores.length - 1];
  const lineColor =
    latestScore >= 70 ? "#10b981" : latestScore >= 50 ? "#f59e0b" : "#ef4444";

  // Trend arrow
  const trend =
    scores.length >= 2
      ? scores[scores.length - 1] - scores[scores.length - 2]
      : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold">Score Progress</h3>
        {scores.length >= 2 && (
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              trend > 0
                ? "text-emerald-700 bg-emerald-50"
                : trend < 0
                  ? "text-red-700 bg-red-50"
                  : "text-gray-600 bg-gray-100"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}% from last
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: 340 }}
      >
        {/* Grid lines */}
        {gridSteps.map((g) => (
          <g key={g.val}>
            <line
              x1={padding.left}
              y1={g.y}
              x2={padding.left + chartW}
              y2={g.y}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={g.y + 4}
              textAnchor="end"
              className="text-muted fill-current"
              fontSize="11"
            >
              {g.val}%
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={lineColor} opacity="0.08" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots and labels */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Outer glow */}
            <circle cx={p.x} cy={p.y} r="8" fill={lineColor} opacity="0.15" />
            {/* Dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="white"
              stroke={lineColor}
              strokeWidth="2.5"
            />
            {/* Score label above dot */}
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={lineColor}
            >
              {p.score}%
            </text>
            {/* Date label below */}
            <text
              x={p.x}
              y={padding.top + chartH + 18}
              textAnchor="middle"
              className="text-muted fill-current"
              fontSize="10"
            >
              {p.date}
            </text>
            {/* Title label */}
            {sorted.length <= 10 && (
              <text
                x={p.x}
                y={padding.top + chartH + 32}
                textAnchor="middle"
                className="text-muted fill-current"
                fontSize="9"
              >
                {p.title.length > 15
                  ? p.title.substring(0, 14) + "..."
                  : p.title}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-sm text-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || ""}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [calls, setCalls] = useState<SavedCall[]>([]);

  useEffect(() => {
    setCalls(getAllCalls());
  }, []);

  if (calls.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">&#x1f4c8;</div>
          <h2 className="text-lg font-bold mb-2">No data yet</h2>
          <p className="text-muted mb-6">
            Analyze at least one call to see your progress dashboard.
          </p>
          <Link
            href="/analyze"
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Analyze a Transcript
          </Link>
        </div>
      </div>
    );
  }

  const scores = calls.map((c) => c.result.percentage);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best = Math.max(...scores);
  const latest = scores[0]; // calls are sorted newest first
  const totalPainPoints = calls.reduce(
    (sum, c) => sum + c.result.painPoints.length,
    0
  );
  const avgTalkRatio = Math.round(
    calls.reduce((sum, c) => sum + c.result.talkRatio.interviewer, 0) /
      calls.length
  );

  // Category averages
  const categoryAverages: { name: string; avg: number }[] = [];
  if (calls[0]?.result.categories) {
    const catNames = calls[0].result.categories.map((c) => c.name);
    for (const name of catNames) {
      const catScores = calls
        .map((call) => {
          const cat = call.result.categories.find((c) => c.name === name);
          return cat ? cat.percentage : 0;
        })
        .filter((s) => s > 0);
      if (catScores.length > 0) {
        categoryAverages.push({
          name,
          avg: Math.round(
            catScores.reduce((a, b) => a + b, 0) / catScores.length
          ),
        });
      }
    }
  }

  const avgColor =
    avg >= 70
      ? "text-emerald-600"
      : avg >= 50
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted">
            Track your interview skills over time.
          </p>
        </div>
        <Link
          href="/analyze"
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Analyze New Call
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Calls"
          value={String(calls.length)}
          sub="analyzed"
        />
        <StatCard
          label="Average Score"
          value={`${avg}%`}
          color={avgColor}
        />
        <StatCard
          label="Best Score"
          value={`${best}%`}
          color="text-emerald-600"
        />
        <StatCard
          label="Avg Talk Ratio"
          value={`${avgTalkRatio}%`}
          sub={avgTalkRatio <= 30 ? "Great!" : avgTalkRatio > 45 ? "Too high" : "Okay"}
        />
        <StatCard
          label="Pain Points Found"
          value={String(totalPainPoints)}
          sub="across all calls"
        />
      </div>

      {/* Progress Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <ProgressChart calls={calls} />
      </div>

      {/* Category Averages */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Category Averages</h3>
        <div className="space-y-4">
          {categoryAverages.map((cat) => {
            const color =
              cat.avg >= 70
                ? "bg-emerald-500"
                : cat.avg >= 50
                  ? "bg-amber-500"
                  : "bg-red-500";
            return (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted">{cat.avg}%</span>
                </div>
                <div className="h-2.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${cat.avg}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Calls</h3>
          <Link
            href="/calls"
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {calls.slice(0, 5).map((call) => {
            const scoreColor =
              call.result.percentage >= 70
                ? "text-emerald-600"
                : call.result.percentage >= 50
                  ? "text-amber-600"
                  : "text-red-600";
            return (
              <Link
                key={call.id}
                href={`/calls/${call.id}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-background/50 -mx-2 px-2 rounded transition-colors"
              >
                <div>
                  <span className="font-medium text-sm">{call.title}</span>
                  <span className="text-xs text-muted ml-3">
                    {new Date(call.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className={`font-bold text-sm ${scoreColor}`}>
                  {call.result.percentage}%
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
