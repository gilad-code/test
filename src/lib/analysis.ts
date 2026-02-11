import { analysisCriteria, type AnalysisCriteria } from "./coaching-data";

// ============================================================
// Transcript Analysis Engine
// Heuristic-based analysis — no external API required.
// Can be replaced with LLM-based analysis later.
// ============================================================

export interface CategoryScore {
  criteriaId: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface PainPoint {
  topic: string;
  quote: string;
  severity: "high" | "medium" | "low";
  explored: boolean;
  suggestion: string;
}

export interface AnalysisResult {
  overallScore: number;
  maxPossibleScore: number;
  percentage: number;
  grade: string;
  categories: CategoryScore[];
  thingsWell: string[];
  thingsToImprove: string[];
  painPoints: PainPoint[];
  painPointsToDiveDeeper: string[];
  talkRatio: { interviewer: number; interviewee: number };
  summary: string;
}

// --- Helpers ---

function countPattern(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => {
    const matches = text.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function extractQuotes(text: string, patterns: RegExp[], maxQuotes = 3): string[] {
  const lines = text.split("\n");
  const quotes: string[] = [];
  for (const line of lines) {
    if (quotes.length >= maxQuotes) break;
    for (const pattern of patterns) {
      if (pattern.test(line) && line.trim().length > 20) {
        quotes.push(line.trim().substring(0, 200));
        break;
      }
    }
  }
  return quotes;
}

// Parse transcript into turns — supports common formats:
//   "Interviewer: ...", "Customer: ...", "Speaker 1: ...", or timestamped
function parseTurns(transcript: string): { role: "interviewer" | "interviewee"; text: string }[] {
  const lines = transcript.split("\n").filter((l) => l.trim().length > 0);
  const turns: { role: "interviewer" | "interviewee"; text: string }[] = [];

  const interviewerPatterns =
    /^(interviewer|host|me|speaker\s*1|q|moderator|researcher)\s*[:\-]/i;
  const intervieweePatterns =
    /^(interviewee|customer|guest|user|client|respondent|participant|speaker\s*2|a)\s*[:\-]/i;

  let currentRole: "interviewer" | "interviewee" | null = null;
  let currentText = "";

  for (const line of lines) {
    if (interviewerPatterns.test(line)) {
      if (currentRole && currentText) {
        turns.push({ role: currentRole, text: currentText.trim() });
      }
      currentRole = "interviewer";
      currentText = line.replace(interviewerPatterns, "").trim();
    } else if (intervieweePatterns.test(line)) {
      if (currentRole && currentText) {
        turns.push({ role: currentRole, text: currentText.trim() });
      }
      currentRole = "interviewee";
      currentText = line.replace(intervieweePatterns, "").trim();
    } else if (currentRole) {
      currentText += " " + line.trim();
    } else {
      // No speaker label detected — alternate starting with interviewer
      if (turns.length === 0 || turns[turns.length - 1].role === "interviewee") {
        currentRole = "interviewer";
      } else {
        currentRole = "interviewee";
      }
      currentText = line.trim();
    }
  }

  if (currentRole && currentText) {
    turns.push({ role: currentRole, text: currentText.trim() });
  }

  return turns;
}

// --- Scoring Functions ---

function scoreOpening(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const earlyInterviewerText = turns
    .slice(0, 6)
    .filter((t) => t.role === "interviewer")
    .map((t) => t.text)
    .join(" ")
    .toLowerCase();

  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Context setting
  const contextPatterns = [/purpose/i, /reason.*call/i, /want to understand/i, /here to learn/i, /not.*sell/i, /no.*sales/i, /goal.*today/i, /agenda/i];
  if (countPattern(earlyInterviewerText, contextPatterns) > 0) {
    score += 4;
    strengths.push("Set context for the conversation");
  } else {
    improvements.push("Start by explaining the purpose of the call and setting expectations");
  }

  // Rapport building
  const rapportPatterns = [/your role/i, /tell me about/i, /typical.*day/i, /typical.*week/i, /your team/i, /background/i, /how long have you/i];
  if (countPattern(earlyInterviewerText, rapportPatterns) > 0) {
    score += 4;
    strengths.push("Built rapport by asking about their role/context");
  } else {
    improvements.push("Ask about their role, team, or typical day before diving into questions");
  }

  // Permission framing
  const permissionPatterns = [/okay if/i, /is that alright/i, /mind if/i, /comfortable/i, /feel free/i, /no right or wrong/i, /skip any/i, /push back/i];
  if (countPattern(earlyInterviewerText, permissionPatterns) > 0) {
    score += 4;
    strengths.push("Used permission framing to create safety");
  } else {
    improvements.push("Use permission framing — ask 'Is it okay if I ask some deeper questions?'");
  }

  // Time/format expectations
  const expectationPatterns = [/take about/i, /minutes/i, /half hour/i, /agenda/i, /first.*then/i, /format/i];
  if (countPattern(earlyInterviewerText, expectationPatterns) > 0) {
    score += 3;
    strengths.push("Set time or format expectations");
  } else {
    improvements.push("Let them know how long the call will take and what to expect");
  }

  score = Math.min(score, criteria.maxScore);

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 10
      ? "Strong opening that built trust and set the stage well."
      : score >= 5
        ? "Decent opening but missed some trust-building elements."
        : "The opening could be much stronger — trust building is critical for pain discovery.",
    strengths,
    improvements,
  };
}

function scoreOpenEnded(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const interviewerTexts = turns.filter((t) => t.role === "interviewer").map((t) => t.text);
  const allInterviewerText = interviewerTexts.join(" ").toLowerCase();

  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Open-ended question patterns
  const openEnded = [/\bhow do you/i, /\bwhat do you/i, /\btell me about/i, /\bwalk me through/i, /\bdescribe/i, /\bexplain/i, /\bwhat happens/i, /\bhow does/i, /\bwhat's your/i, /\bwhat was/i];
  const openCount = countPattern(allInterviewerText, openEnded);

  // Closed/leading patterns
  const closed = [/\bdo you\b.*\?/gi, /\bis it\b.*\?/gi, /\bdon't you think/gi, /\bwouldn't it/gi, /\bisn't it/gi, /\bdo you agree/gi, /\bright\?/gi];
  const closedCount = countPattern(allInterviewerText, closed);

  const totalQuestions = openCount + closedCount;
  const openRatio = totalQuestions > 0 ? openCount / totalQuestions : 0;

  if (openCount >= 5) {
    score += 8;
    strengths.push(`Used ${openCount} open-ended questions — good variety`);
  } else if (openCount >= 2) {
    score += 4;
    improvements.push("Try to use more open-ended questions (how, what, tell me about, walk me through)");
  } else {
    improvements.push("Almost no open-ended questions detected — this is critical for pain discovery");
  }

  if (openRatio >= 0.6) {
    score += 6;
    strengths.push("Good ratio of open vs. closed questions");
  } else if (closedCount > openCount) {
    improvements.push("Too many yes/no questions — shift to open-ended alternatives");
  }

  // Process/workflow questions
  const processPatterns = [/process/i, /workflow/i, /step/i, /how.*handle/i, /day-to-day/i, /routine/i];
  if (countPattern(allInterviewerText, processPatterns) > 0) {
    score += 6;
    strengths.push("Asked about processes and workflows");
  } else {
    improvements.push("Ask about their current processes and workflows to surface natural pain points");
  }

  score = Math.min(score, criteria.maxScore);

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 14
      ? "Excellent use of open-ended questions that let the interviewee narrate."
      : score >= 8
        ? "Good mix of questions but could lean more into open-ended formats."
        : "Needs significant improvement in asking open-ended questions.",
    strengths,
    improvements,
  };
}

function scoreDeepDive(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const interviewerText = turns
    .filter((t) => t.role === "interviewer")
    .map((t) => t.text)
    .join(" ")
    .toLowerCase();

  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Follow-up patterns
  const followUpPatterns = [/tell me more/i, /can you give me an example/i, /what happened/i, /how did that/i, /why is that/i, /what do you mean/i, /unpack that/i, /elaborate/i, /specifically/i, /for instance/i];
  const followUpCount = countPattern(interviewerText, followUpPatterns);

  if (followUpCount >= 5) {
    score += 8;
    strengths.push(`Strong follow-up game — ${followUpCount} probing follow-ups detected`);
  } else if (followUpCount >= 2) {
    score += 4;
    improvements.push("Ask more follow-up questions when the interviewee shares something interesting");
  } else {
    improvements.push("Almost no follow-up questions detected — you must dig deeper when pain surfaces");
  }

  // Impact probing
  const impactPatterns = [/how much time/i, /cost/i, /how many hours/i, /impact/i, /affect/i, /consequence/i, /result/i, /what happened.*when/i];
  if (countPattern(interviewerText, impactPatterns) >= 2) {
    score += 6;
    strengths.push("Explored the concrete impact of pain points");
  } else if (countPattern(interviewerText, impactPatterns) >= 1) {
    score += 3;
    improvements.push("Dig deeper into the quantifiable impact — ask about time, money, and morale costs");
  } else {
    improvements.push("You need to explore the impact of problems — ask how much time/money they cost");
  }

  // Example requests
  const examplePatterns = [/example/i, /last time/i, /recently/i, /can you recall/i, /specific.*instance/i, /tell me about a time/i];
  if (countPattern(interviewerText, examplePatterns) >= 2) {
    score += 6;
    strengths.push("Asked for concrete examples — this grounds abstract pain in reality");
  } else {
    improvements.push("Ask for specific examples — 'Can you tell me about the last time this happened?'");
  }

  // Workaround exploration
  const workaroundPatterns = [/workaround/i, /hack/i, /manual/i, /spreadsheet/i, /how do you get around/i, /what do you do instead/i];
  if (countPattern(interviewerText, workaroundPatterns) >= 1) {
    score += 5;
    strengths.push("Explored workarounds — a gold mine for pain discovery");
  } else {
    improvements.push("Look for workarounds — they reveal pain that's been accepted and normalized");
  }

  score = Math.min(score, criteria.maxScore);

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 18
      ? "Excellent deep diving — you went below the surface consistently."
      : score >= 10
        ? "Some good probing, but there were opportunities to go deeper."
        : "Major area for improvement — when pain surfaces, stop and dig in.",
    strengths,
    improvements,
  };
}

function scoreListening(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const interviewerWords = turns
    .filter((t) => t.role === "interviewer")
    .reduce((sum, t) => sum + t.text.split(/\s+/).length, 0);
  const intervieweeWords = turns
    .filter((t) => t.role === "interviewee")
    .reduce((sum, t) => sum + t.text.split(/\s+/).length, 0);
  const totalWords = interviewerWords + intervieweeWords;
  const interviewerRatio = totalWords > 0 ? interviewerWords / totalWords : 0.5;

  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (interviewerRatio <= 0.3) {
    score += 8;
    strengths.push(`Talk ratio ${Math.round(interviewerRatio * 100)}% interviewer / ${Math.round((1 - interviewerRatio) * 100)}% interviewee — excellent listening`);
  } else if (interviewerRatio <= 0.45) {
    score += 5;
    strengths.push(`Talk ratio ${Math.round(interviewerRatio * 100)}% interviewer — decent but could listen more`);
  } else {
    score += 2;
    improvements.push(`You talked ${Math.round(interviewerRatio * 100)}% of the time — aim for under 30%`);
  }

  // Paraphrasing
  const interviewerText = turns.filter((t) => t.role === "interviewer").map((t) => t.text).join(" ").toLowerCase();
  const paraphrasePatterns = [/so what you're saying/i, /if i understand/i, /sounds like/i, /what i'm hearing/i, /let me make sure/i, /so basically/i, /in other words/i];
  if (countPattern(interviewerText, paraphrasePatterns) >= 2) {
    score += 6;
    strengths.push("Paraphrased the interviewee's answers — shows active listening");
  } else if (countPattern(interviewerText, paraphrasePatterns) >= 1) {
    score += 3;
    improvements.push("Paraphrase more — repeat back what you hear to confirm understanding");
  } else {
    improvements.push("No paraphrasing detected — try 'So what I'm hearing is...' to validate understanding");
  }

  // Referencing earlier points
  const referencePatterns = [/you mentioned earlier/i, /going back to/i, /earlier you said/i, /you talked about/i, /circling back/i];
  if (countPattern(interviewerText, referencePatterns) >= 1) {
    score += 6;
    strengths.push("Referenced earlier points — shows you were genuinely listening");
  } else {
    improvements.push("Try referencing earlier answers — 'You mentioned earlier that... can we go deeper on that?'");
  }

  score = Math.min(score, criteria.maxScore);

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 14
      ? "Great active listening — you let the interviewee lead and showed you were engaged."
      : score >= 8
        ? "Decent listening but there's room to talk less and validate more."
        : "You need to listen much more — the interviewee should be doing most of the talking.",
    strengths,
    improvements,
  };
}

function scoreImpact(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const interviewerText = turns.filter((t) => t.role === "interviewer").map((t) => t.text).join(" ").toLowerCase();

  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  const priorityPatterns = [/priority/i, /rank/i, /most important/i, /top.*challenge/i, /where does this/i, /compared to/i];
  if (countPattern(interviewerText, priorityPatterns) >= 1) {
    score += 3;
    strengths.push("Explored priority and ranking of the pain");
  } else {
    improvements.push("Ask where this pain ranks among their other challenges");
  }

  const urgencyPatterns = [/urgent/i, /timeline/i, /deadline/i, /how soon/i, /what happens if.*don't/i, /six months/i, /next quarter/i];
  if (countPattern(interviewerText, urgencyPatterns) >= 1) {
    score += 3;
    strengths.push("Probed urgency and timeline");
  } else {
    improvements.push("Explore urgency — 'What happens if you don't solve this in the next 6 months?'");
  }

  const budgetPatterns = [/budget/i, /invest/i, /spend/i, /pay/i, /resources/i, /allocated/i];
  if (countPattern(interviewerText, budgetPatterns) >= 1) {
    score += 4;
    strengths.push("Explored budget or resource allocation — a strong signal of real commitment");
  } else {
    improvements.push("Ask about budget or resource allocation to validate the problem is real");
  }

  score = Math.min(score, criteria.maxScore);

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 7
      ? "Good job exploring priority and business impact."
      : score >= 4
        ? "Some impact exploration but needs more urgency and budget probing."
        : "You need to validate that this is a real priority — explore urgency, ranking, and budget.",
    strengths,
    improvements,
  };
}

function scoreBias(
  turns: { role: "interviewer" | "interviewee"; text: string }[],
  criteria: AnalysisCriteria
): CategoryScore {
  const interviewerText = turns.filter((t) => t.role === "interviewer").map((t) => t.text).join(" ").toLowerCase();

  let score = criteria.maxScore; // Start at max, deduct for problems
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Leading questions
  const leadingPatterns = [/don't you think/i, /wouldn't it be/i, /isn't it true/i, /do you agree that/i, /surely you/i, /obviously/i, /you must feel/i];
  const leadingCount = countPattern(interviewerText, leadingPatterns);
  if (leadingCount > 0) {
    score -= Math.min(4, leadingCount * 2);
    improvements.push(`Found ${leadingCount} leading question(s) — stay neutral, let them form their own conclusions`);
  } else {
    strengths.push("No leading questions detected — you stayed neutral");
  }

  // Pitching
  const pitchPatterns = [/our product/i, /our solution/i, /we can/i, /we offer/i, /our platform/i, /we built/i, /our tool/i, /what we do/i, /let me show you/i];
  const pitchCount = countPattern(interviewerText, pitchPatterns);
  if (pitchCount > 0) {
    score -= Math.min(4, pitchCount * 2);
    improvements.push(`Found ${pitchCount} instance(s) of pitching — a pain discovery call is NOT for selling`);
  } else {
    strengths.push("No pitching detected — you kept the focus on their problems, not your solution");
  }

  // Suggesting answers
  const suggestPatterns = [/would you say that/i, /so the answer is/i, /what you need is/i, /the solution would be/i, /you should/i];
  const suggestCount = countPattern(interviewerText, suggestPatterns);
  if (suggestCount > 0) {
    score -= Math.min(2, suggestCount);
    improvements.push("Avoided suggesting answers to the interviewee — let them arrive at insights naturally");
  }

  score = Math.max(0, Math.min(score, criteria.maxScore));

  if (improvements.length === 0) {
    strengths.push("Maintained objectivity throughout the interview");
  }

  return {
    criteriaId: criteria.id,
    name: criteria.name,
    score,
    maxScore: criteria.maxScore,
    percentage: Math.round((score / criteria.maxScore) * 100),
    feedback: score >= 8
      ? "Great neutrality — you let the interviewee share their genuine experience."
      : score >= 5
        ? "Mostly neutral but slipped into leading or pitching in a few spots."
        : "Significant bias detected — focus on listening, not selling or leading.",
    strengths,
    improvements,
  };
}

// --- Pain Point Extraction ---

function extractPainPoints(
  turns: { role: "interviewer" | "interviewee"; text: string }[]
): PainPoint[] {
  const painPoints: PainPoint[] = [];
  const interviewerText = turns.filter((t) => t.role === "interviewer").map((t) => t.text.toLowerCase()).join(" ");

  const painIndicators = [
    /frustrat/i, /annoying/i, /painful/i, /struggle/i, /hate/i, /waste.*time/i,
    /takes forever/i, /broken/i, /nightmare/i, /problem/i, /issue/i, /challenge/i,
    /difficult/i, /hard to/i, /complicated/i, /workaround/i, /manual/i, /tedious/i,
    /expensive/i, /losing/i, /fail/i, /error/i, /bug/i, /slow/i, /clunky/i, /outdated/i,
  ];

  const highSeverityIndicators = [
    /frustrat/i, /hate/i, /nightmare/i, /waste.*time/i, /takes forever/i, /broken/i,
    /losing/i, /expensive/i, /critical/i, /urgent/i, /desperate/i,
  ];

  for (const turn of turns) {
    if (turn.role !== "interviewee") continue;

    const text = turn.text;
    const matchCount = painIndicators.filter((p) => p.test(text)).length;

    if (matchCount >= 1) {
      const isHigh = highSeverityIndicators.some((p) => p.test(text));
      const severity = matchCount >= 3 ? "high" : isHigh ? "high" : matchCount >= 2 ? "medium" : "low";

      // Check if interviewer followed up
      const turnIndex = turns.indexOf(turn);
      const nextInterviewerTurns = turns
        .slice(turnIndex + 1, turnIndex + 3)
        .filter((t) => t.role === "interviewer");
      const followedUp = nextInterviewerTurns.some((t) => {
        const ft = t.text.toLowerCase();
        return /tell me more/i.test(ft) || /example/i.test(ft) || /how/i.test(ft) || /why/i.test(ft) || /what happened/i.test(ft) || /impact/i.test(ft) || /cost/i.test(ft);
      });

      // Extract a short topic from the text
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
      const topSentence = sentences.find((s) => painIndicators.some((p) => p.test(s))) || sentences[0] || text;

      painPoints.push({
        topic: topSentence.trim().substring(0, 100),
        quote: text.substring(0, 250),
        severity,
        explored: followedUp,
        suggestion: followedUp
          ? "You followed up on this — good job. Consider probing even deeper on impact and urgency."
          : "You didn't follow up on this pain point. Next time, ask: 'Tell me more about that — what's the impact?'",
      });
    }
  }

  // Deduplicate by similarity (simple)
  const uniquePainPoints: PainPoint[] = [];
  for (const pp of painPoints) {
    const isDuplicate = uniquePainPoints.some(
      (existing) => existing.topic.substring(0, 40) === pp.topic.substring(0, 40)
    );
    if (!isDuplicate) {
      uniquePainPoints.push(pp);
    }
  }

  return uniquePainPoints.slice(0, 10); // Max 10 pain points
}

// --- Main Analysis Function ---

export function analyzeTranscript(transcript: string): AnalysisResult {
  const turns = parseTurns(transcript);

  if (turns.length < 4) {
    return {
      overallScore: 0,
      maxPossibleScore: 100,
      percentage: 0,
      grade: "N/A",
      categories: [],
      thingsWell: [],
      thingsToImprove: ["The transcript is too short to analyze. Please upload a full interview transcript with clear speaker labels (e.g., 'Interviewer:' and 'Customer:')."],
      painPoints: [],
      painPointsToDiveDeeper: [],
      talkRatio: { interviewer: 50, interviewee: 50 },
      summary: "Unable to analyze — the transcript is too short or doesn't have recognizable speaker turns.",
    };
  }

  const criteriaMap: Record<string, (turns: { role: "interviewer" | "interviewee"; text: string }[], c: AnalysisCriteria) => CategoryScore> = {
    opening: scoreOpening,
    open_ended: scoreOpenEnded,
    deep_dive: scoreDeepDive,
    listening: scoreListening,
    impact: scoreImpact,
    bias: scoreBias,
  };

  const categories: CategoryScore[] = analysisCriteria.map((c) => {
    const scoreFn = criteriaMap[c.id];
    return scoreFn ? scoreFn(turns, c) : {
      criteriaId: c.id,
      name: c.name,
      score: 0,
      maxScore: c.maxScore,
      percentage: 0,
      feedback: "",
      strengths: [],
      improvements: [],
    };
  });

  const overallScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxPossibleScore = categories.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = Math.round((overallScore / maxPossibleScore) * 100);

  const grade =
    percentage >= 85 ? "A" :
    percentage >= 70 ? "B" :
    percentage >= 55 ? "C" :
    percentage >= 40 ? "D" : "F";

  const thingsWell = categories.flatMap((c) => c.strengths);
  const thingsToImprove = categories.flatMap((c) => c.improvements);

  const painPoints = extractPainPoints(turns);

  const painPointsToDiveDeeper = painPoints
    .filter((pp) => !pp.explored || pp.severity === "high")
    .map((pp) => {
      if (!pp.explored) return `Unexplored pain: "${pp.topic}" — follow up next time with deeper probing`;
      return `High-severity pain: "${pp.topic}" — explore impact, urgency, and budget in follow-up calls`;
    });

  // Talk ratio
  const interviewerWords = turns.filter((t) => t.role === "interviewer").reduce((sum, t) => sum + t.text.split(/\s+/).length, 0);
  const intervieweeWords = turns.filter((t) => t.role === "interviewee").reduce((sum, t) => sum + t.text.split(/\s+/).length, 0);
  const total = interviewerWords + intervieweeWords;
  const talkRatio = {
    interviewer: total > 0 ? Math.round((interviewerWords / total) * 100) : 50,
    interviewee: total > 0 ? Math.round((intervieweeWords / total) * 100) : 50,
  };

  const summary =
    percentage >= 85
      ? "Excellent interview! You built trust, asked great questions, and dug deep into real pain points."
      : percentage >= 70
        ? "Good interview with solid fundamentals. Focus on going deeper when pain surfaces and exploring impact more thoroughly."
        : percentage >= 55
          ? "Decent effort but several areas need improvement. Focus on open-ended questions, deeper follow-ups, and talking less."
          : percentage >= 40
            ? "This interview missed significant opportunities. Review the coaching guide and practice the deep dive techniques."
            : "This interview needs major improvement across the board. Start with the coaching guide basics and practice with a colleague.";

  return {
    overallScore,
    maxPossibleScore,
    percentage,
    grade,
    categories,
    thingsWell,
    thingsToImprove,
    painPoints,
    painPointsToDiveDeeper,
    talkRatio,
    summary,
  };
}
