"use client";

import { useState, useCallback } from "react";
import { analyzeTranscript, type AnalysisResult } from "@/lib/analysis";
import { saveCall } from "@/lib/storage";

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

function CategoryBar({ name, score, maxScore, percentage }: { name: string; score: number; maxScore: number; percentage: number }) {
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

const sampleTranscript = `Interviewer: Hi Sarah, thanks for taking the time to chat today. I really appreciate it. Just to set the stage — I'm not here to sell you anything. I genuinely want to understand how your team handles customer onboarding and where the friction points are. This should take about 30 minutes, and there are no right or wrong answers. Feel free to skip anything you're not comfortable with. Sound good?

Customer: Yeah, that sounds great. Happy to help.

Interviewer: Awesome. Before we dive in, could you tell me a bit about your role and your team?

Customer: Sure. I'm the Head of Customer Success at a B2B SaaS company. We have about 15 people on the team, and we handle everything from onboarding new customers to managing renewals and expansions.

Interviewer: Got it. So walk me through what happens when a new customer signs up — what does the onboarding process look like from your team's perspective?

Customer: Honestly, it's kind of a mess. Sales closes the deal, and then there's this handoff that happens where they're supposed to fill out a brief with all the customer details — what they bought, what their goals are, who the key contacts are. But half the time that brief is incomplete or just doesn't exist.

Interviewer: That sounds frustrating. Can you give me a recent example of when that happened?

Customer: Oh, just last week actually. We had a mid-market customer sign a $50K annual deal, and all we got from sales was a name and an email. No context on what problems they were trying to solve, what was promised in the sales process, nothing. My team had to basically re-discover everything from scratch.

Interviewer: What went through your mind when you saw that?

Customer: Honestly? I was furious. It's not the first time. It makes us look unprofessional to the customer because we're asking them questions they've already answered. And it wastes our first two weeks just getting up to speed instead of actually delivering value.

Interviewer: That's a significant impact. When you say it wastes two weeks — how does that affect the customer's experience and your team's morale?

Customer: The customer gets frustrated because they feel like the left hand doesn't know what the right hand is doing. And my team... they're burned out from playing detective. Two of my best people have mentioned it as a reason they're considering leaving.

Interviewer: That's really concerning — people thinking about leaving over this. Tell me more about what your team has tried to fix this problem.

Customer: We've tried everything. We built a Notion template for the handoff brief, we set up a Slack channel between sales and CS, we even had a joint meeting to align on the process. It worked for about two weeks and then everyone went back to their old habits.

Interviewer: So the Notion template approach didn't stick. What specifically about it didn't work?

Customer: The salespeople just didn't fill it out. They're focused on closing the next deal, not documenting the last one. I don't blame them entirely — their incentives aren't aligned with our needs. But it means we're left holding the bag.

Interviewer: If I understand correctly — the core issue isn't the tool, it's the behavior and incentive alignment between sales and CS. Is that right?

Customer: Exactly. You nailed it. It's a people and process problem, not a technology problem. Though better technology might help enforce the process.

Interviewer: Among all the challenges you face in your role, where does this handoff problem rank?

Customer: It's top 3 for sure. Maybe number one, because it affects everything downstream. If onboarding is bad, time-to-value is slow, and if time-to-value is slow, renewals are at risk. We've already lost two customers this quarter who cited poor onboarding as a factor.

Interviewer: Two customers lost — do you know what that cost the business in revenue?

Customer: Together, about $120K in ARR. And that's just the direct loss. The reputation hit and the reference loss is probably worth more.

Interviewer: That's a meaningful number. Has your leadership team acknowledged this as a priority? Is there budget being allocated to solve it?

Customer: My VP is aware and supportive, but it keeps getting deprioritized because there's always a fire to fight. I've been told "next quarter" three times now. I think if I could show a clear solution with a solid business case, I could get budget approved.

Interviewer: What would a solution need to look like for you to feel confident presenting it to your VP?

Customer: It would need to make the handoff automatic or at least semi-automatic — pull data from the CRM, capture the key details from the sales process, and give my team a complete picture on day one. And it would need to not rely on salespeople changing their behavior, because that hasn't worked.

Interviewer: That's really helpful. Is there anything else about this problem that I haven't asked about that you think is important?

Customer: I think the emotional toll on my team is underappreciated. They got into customer success because they love helping customers, and instead they spend half their time doing administrative work and playing telephone between departments. It's demoralizing.

Interviewer: Thank you for sharing that, Sarah. Let me make sure I captured the key things — the sales-to-CS handoff is broken, costing you roughly 2 weeks per customer in onboarding delays, contributing to $120K in lost revenue this quarter, and affecting team morale to the point of potential attrition. The failed solutions have been manual processes that don't stick because of misaligned incentives. Did I miss anything?

Customer: No, that's a great summary. You actually captured it better than I usually explain it myself.

Interviewer: I really appreciate your honesty and time today. This has been incredibly valuable.`;

export default function AnalyzePage() {
  const [transcript, setTranscript] = useState("");
  const [callTitle, setCallTitle] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"score" | "strengths" | "improve" | "pains">("score");

  const handleAnalyze = useCallback(() => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);
    setSaved(false);
    setTimeout(() => {
      const analysis = analyzeTranscript(transcript);
      setResult(analysis);
      setIsAnalyzing(false);
      setActiveTab("score");
      // Auto-save the call
      const title = callTitle.trim() || `Call on ${new Date().toLocaleDateString()}`;
      saveCall(title, transcript, analysis);
      setSaved(true);
    }, 800);
  }, [transcript, callTitle]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTranscript(text);
      };
      reader.readAsText(file);
    },
    []
  );

  const loadSample = useCallback(() => {
    setTranscript(sampleTranscript);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Transcript Analyzer</h1>
        <p className="text-muted text-lg max-w-3xl">
          Upload or paste your interview transcript and get instant feedback on
          your interviewing skills, detected pain points, and actionable
          improvements.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Interview Transcript</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSample}
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Load sample transcript
            </button>
            <label className="cursor-pointer text-sm bg-primary/10 text-primary hover:bg-primary/20 font-medium px-4 py-2 rounded-lg transition-colors">
              Upload .txt file
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <input
          type="text"
          value={callTitle}
          onChange={(e) => setCallTitle(e.target.value)}
          placeholder="Call title (e.g., Candice from Polymedco)"
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="text-sm text-muted mb-3">
          Format: Label each speaker on separate lines. Supports generic labels
          (&quot;Interviewer:&quot;, &quot;Customer:&quot;, &quot;Speaker 1:&quot;)
          and real names (&quot;Tal:&quot;, &quot;Sarah:&quot;). The first speaker
          detected is assumed to be the interviewer.
        </p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={`Interviewer: Hi, thanks for joining today...\n\nCustomer: Thanks for having me...\n\nInterviewer: Walk me through how you currently handle...`}
          className="w-full h-64 bg-background border border-border rounded-lg p-4 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted">
            {transcript.split(/\s+/).filter(Boolean).length} words
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!transcript.trim() || isAnalyzing}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Transcript"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div>
          {/* Summary Header */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing percentage={result.percentage} grade={result.grade} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">
                    Overall Score: {result.overallScore}/{result.maxPossibleScore}
                  </h2>
                  {saved && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                      Saved
                    </span>
                  )}
                </div>
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

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-6 bg-card border border-border rounded-lg p-1">
            {[
              { id: "score" as const, label: "Score Breakdown" },
              { id: "strengths" as const, label: `Strengths (${result.thingsWell.length})` },
              { id: "improve" as const, label: `To Improve (${result.thingsToImprove.length})` },
              { id: "pains" as const, label: `Pain Points (${result.painPoints.length})` },
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
                <p className="text-muted">
                  No specific strengths detected — review the coaching guide and
                  try again.
                </p>
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
                <p className="text-muted">
                  No improvements detected — excellent work!
                </p>
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
              {/* Detected Pain Points */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">
                  Detected Pain Points
                </h3>
                {result.painPoints.length === 0 ? (
                  <p className="text-muted">
                    No clear pain points detected in the transcript. This
                    could mean the questions didn&apos;t go deep enough to
                    surface real problems.
                  </p>
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
                              {pp.explored
                                ? "Explored"
                                : "Not explored"}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-1">
                            {pp.topic}
                          </p>
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

              {/* Pain Points to Dive Deeper */}
              {result.painPointsToDiveDeeper.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">
                    Pain Points to Dive Deeper
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    These are opportunities for follow-up conversations — either
                    with this customer or others in similar roles.
                  </p>
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
      )}
    </div>
  );
}
