// ============================================================
// Pain Discovery Interview Coaching Content
// ============================================================

export interface Technique {
  title: string;
  description: string;
  examples: string[];
  tips: string[];
}

export interface QuestionCategory {
  category: string;
  icon: string;
  description: string;
  questions: {
    question: string;
    purpose: string;
    followUps: string[];
  }[];
}

export interface DeepDivePrompt {
  trigger: string;
  description: string;
  prompts: string[];
  avoid: string[];
}

// --- Opening & Trust Building ---

export const openingTechniques: Technique[] = [
  {
    title: "The Warm Context Set",
    description:
      "Start by explaining why you're having this conversation and what you'll do with the insights. This removes ambiguity and builds psychological safety.",
    examples: [
      '"Thanks for taking the time today. I\'m not here to sell you anything — I genuinely want to understand how you handle [topic] day-to-day so we can build something that actually helps."',
      '"Before we start, I want you to know there are no right or wrong answers. I\'m here to learn from your experience."',
      '"Everything you share stays between us. I\'m interested in the real story, not the polished version."',
    ],
    tips: [
      "Never jump straight into questions — spend 2-3 minutes on context",
      "Explicitly state there is no sales agenda",
      "Tell them how long the call will take",
      "Let them know they can skip any question",
    ],
  },
  {
    title: "The Peer-Level Rapport",
    description:
      "Position yourself as a curious peer, not an interrogator. Show genuine interest in their role and world before diving into problems.",
    examples: [
      '"I\'d love to start by just understanding your role a bit — what does a typical week look like for you?"',
      '"Before we get into specifics, can you paint me a picture of your team and what you\'re all trying to accomplish this quarter?"',
      '"I was reading about [their company/industry trend] — how is that affecting your day-to-day?"',
    ],
    tips: [
      "Research their company and role beforehand",
      "Use their language, not yours",
      "Match their energy — if they're casual, be casual",
      "Listen for 80% of the time, talk for 20%",
    ],
  },
  {
    title: "The Permission Frame",
    description:
      "Ask permission to go deep. This creates a micro-contract that makes people more comfortable sharing real struggles.",
    examples: [
      '"Would it be okay if I ask some deeper questions about how that process actually works behind the scenes?"',
      '"I might ask some questions that feel a bit detailed — is that alright? Feel free to push back anytime."',
      '"I\'d love to understand not just what you do, but why and how it feels. Cool if we go there?"',
    ],
    tips: [
      "Asking permission paradoxically makes people share MORE",
      "Re-ask permission when shifting to sensitive topics",
      "Honor a 'no' immediately — trust is everything",
    ],
  },
];

// --- Smart Question Frameworks ---

export const questionCategories: QuestionCategory[] = [
  {
    category: "Current State Mapping",
    icon: "🗺️",
    description:
      "Understand their world before trying to find problems. Map the landscape first.",
    questions: [
      {
        question: "Walk me through how you currently handle [process/task]?",
        purpose: "Gets them narrating their workflow — pain points emerge naturally",
        followUps: [
          "What happens next?",
          "Who else is involved at that point?",
          "How long does that part usually take?",
        ],
      },
      {
        question: "What does a really good day look like vs. a really bad day?",
        purpose: "Contrast reveals what matters most to them emotionally",
        followUps: [
          "What made it a bad day specifically?",
          "How often do the bad days happen?",
          "What do you do when that happens?",
        ],
      },
      {
        question:
          "If you had to explain your biggest challenge to a new hire, what would you say?",
        purpose:
          "Forces them to articulate problems simply — reveals core issues",
        followUps: [
          "Why is that the first thing you'd mention?",
          "How long has this been an issue?",
          "Has anyone tried to fix it?",
        ],
      },
    ],
  },
  {
    category: "Pain Identification",
    icon: "🎯",
    description:
      "Once you understand their world, probe for specific friction points and frustrations.",
    questions: [
      {
        question: "What's the most frustrating part of your week related to [area]?",
        purpose: "Directly surfaces emotional pain — frustration = opportunity",
        followUps: [
          "Can you give me a recent example?",
          "What did that cost you — time, money, sanity?",
          "How did your team react?",
        ],
      },
      {
        question: "What have you tried to solve this? What happened?",
        purpose: "Shows severity (they've invested effort) and reveals failed solutions",
        followUps: [
          "Why didn't that work?",
          "How much did you spend on that attempt?",
          "What would have made it work?",
        ],
      },
      {
        question: "If this problem disappeared tomorrow, what would change for you?",
        purpose:
          "Reveals the real impact and whether this is a must-have or nice-to-have",
        followUps: [
          "Who else would benefit?",
          "Would your manager notice?",
          "How would you measure that improvement?",
        ],
      },
    ],
  },
  {
    category: "Emotional & Impact Probing",
    icon: "💡",
    description:
      "Go beyond surface-level answers to understand the real human and business impact.",
    questions: [
      {
        question:
          "When this goes wrong, how does it affect you personally — not just the project?",
        purpose: "Uncovers emotional weight and personal stakes",
        followUps: [
          "Does it affect your confidence in other areas?",
          "Do you end up working late because of it?",
          "How does your manager view this problem?",
        ],
      },
      {
        question:
          "On a scale of 1-10, how painful is this? What would make it a 10?",
        purpose: "Quantifies pain and reveals the escalation path",
        followUps: [
          "What keeps it from being higher?",
          "Has it ever been a 10? What happened?",
          "What's the trend — getting better or worse?",
        ],
      },
      {
        question:
          "If you could wave a magic wand, what would this look like instead?",
        purpose: "Reveals their ideal state — the gap between ideal and reality is your opportunity",
        followUps: [
          "What's the biggest blocker to getting there?",
          "Who would need to approve a change like that?",
          "What would you pay to have that?",
        ],
      },
    ],
  },
  {
    category: "Priority & Urgency",
    icon: "⏰",
    description:
      "Understand whether this is a burning problem or a mild inconvenience.",
    questions: [
      {
        question:
          "Among all the challenges you face, where does this rank?",
        purpose: "Tests if this is truly a top priority or just conversational",
        followUps: [
          "What's above it?",
          "What would make it jump to #1?",
          "Is anyone pushing to fix this?",
        ],
      },
      {
        question: "What happens if you don't solve this in the next 6 months?",
        purpose: "Tests urgency — if there's no consequence, it's not urgent",
        followUps: [
          "Would you lose customers?",
          "Would your team be affected?",
          "Is there a deadline driving this?",
        ],
      },
      {
        question:
          "Have you set aside budget or time to address this? Tell me about that.",
        purpose:
          "Budget/time allocation = real commitment, not just talk",
        followUps: [
          "Who controls that budget?",
          "What's the approval process?",
          "What competing priorities is it up against?",
        ],
      },
    ],
  },
];

// --- Deep Dive Prompts ---

export const deepDivePrompts: DeepDivePrompt[] = [
  {
    trigger: "They mention a workaround",
    description:
      "When someone describes a hacky solution or manual process, that's a gold mine. Workarounds = pain they've accepted.",
    prompts: [
      "Tell me more about that workaround — how did it come about?",
      "How much time does that workaround cost you per week?",
      "Has the workaround ever failed? What happened?",
      "Does everyone on the team use the same workaround, or does each person have their own?",
      "If a new person joined, how long would it take them to learn this workaround?",
    ],
    avoid: [
      "Don't immediately suggest your solution can replace it",
      "Don't minimize the workaround — they're proud of it, respect the creativity",
    ],
  },
  {
    trigger: "They express frustration or emotion",
    description:
      "When their tone shifts, they lean in, sigh, or use emotional language — STOP and go deeper. Emotion = real pain.",
    prompts: [
      "It sounds like that really affects you. Can you tell me more?",
      "I can hear the frustration — when was the last time this happened?",
      "What went through your mind when that happened?",
      "How does your team feel about this?",
      "Is this the kind of thing that makes you think about changing how you work entirely?",
    ],
    avoid: [
      "Don't rush past the emotion to the next question",
      "Don't try to 'fix' the emotion — sit in it with them",
      "Don't say 'I understand' — say 'Tell me more'",
    ],
  },
  {
    trigger: "They mention a failed tool or process",
    description:
      "Past failures reveal what they actually need and what went wrong. This is competitive intelligence AND pain validation.",
    prompts: [
      "What specifically didn't work about that solution?",
      "Who made the decision to try it, and who pulled the plug?",
      "What were you hoping it would do that it didn't?",
      "How much did that failed attempt cost — money, time, political capital?",
      "What would a tool need to do differently to actually work for you?",
    ],
    avoid: [
      "Don't trash the competitor — they chose it, so respect the decision",
      "Don't say 'our solution is different' — keep learning",
    ],
  },
  {
    trigger: "They say 'it's fine' or downplay a problem",
    description:
      "When people minimize issues, there's often more underneath. Gently probe — sometimes the biggest pains are normalized.",
    prompts: [
      "You say it's fine — is it fine-fine, or 'we've accepted it' fine?",
      "If a new person looked at this process, what would they find surprising?",
      "What would change if this suddenly worked perfectly?",
      "How many hours per week does 'fine' cost your team?",
      "Is this something you've just gotten used to over time?",
    ],
    avoid: [
      "Don't be confrontational — use curiosity, not challenge",
      "Don't push if they genuinely seem fine with it",
    ],
  },
  {
    trigger: "They mention impact on others (team, customers, stakeholders)",
    description:
      "When the pain radiates beyond them, you've found a systemic issue. Explore the blast radius.",
    prompts: [
      "How does this affect your team's morale or productivity?",
      "Do your customers ever feel the downstream effects of this?",
      "Who else in the organization is impacted by this?",
      "If you could solve this, who would thank you first?",
      "Has this ever caused a visible issue with a customer or partner?",
    ],
    avoid: [
      "Don't assume impact — let them tell you",
      "Don't exaggerate the impact for them",
    ],
  },
  {
    trigger: "They reveal a number or metric",
    description:
      "When they drop a number (hours, dollars, percentage), dig in. Numbers make pain concrete and buildable.",
    prompts: [
      "That's a significant number — how did you arrive at it?",
      "Is that getting better or worse over time?",
      "What would that number need to be for you to feel good about it?",
      "Does your leadership know about this number?",
      "If you could cut that in half, what would that mean for the business?",
    ],
    avoid: [
      "Don't challenge their numbers — ask how they measured",
      "Don't do math for them or correct them",
    ],
  },
];

// --- Analysis Rubric ---

export interface AnalysisCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  indicators: { positive: string[]; negative: string[] };
}

export const analysisCriteria: AnalysisCriteria[] = [
  {
    id: "opening",
    name: "Opening & Trust Building",
    description: "Did the interviewer set context, build rapport, and create psychological safety?",
    maxScore: 15,
    indicators: {
      positive: [
        "Explained the purpose of the call",
        "Set expectations (time, format, no sales)",
        "Asked about their role/context first",
        "Used permission framing",
      ],
      negative: [
        "Jumped straight into questions",
        "Started with a pitch",
        "Didn't introduce themselves or the purpose",
      ],
    },
  },
  {
    id: "open_ended",
    name: "Open-Ended Questions",
    description: "Did the interviewer use open-ended questions that let the interviewee narrate?",
    maxScore: 20,
    indicators: {
      positive: [
        "Used 'how', 'what', 'tell me about', 'walk me through'",
        "Asked about processes and workflows",
        "Let the interviewee lead the direction",
      ],
      negative: [
        "Used leading questions",
        "Asked yes/no questions predominantly",
        "Suggested answers within the question",
      ],
    },
  },
  {
    id: "deep_dive",
    name: "Deep Dive on Pain Points",
    description: "Did the interviewer go deep when real pain surfaced?",
    maxScore: 25,
    indicators: {
      positive: [
        "Asked follow-up questions on emotional moments",
        "Explored workarounds and failed solutions",
        "Probed for impact (time, money, morale)",
        "Asked for specific examples",
      ],
      negative: [
        "Moved on quickly after surface-level answers",
        "Didn't follow up on emotional cues",
        "Stayed at the abstract level",
      ],
    },
  },
  {
    id: "listening",
    name: "Active Listening",
    description: "Did the interviewer demonstrate genuine listening and let the interviewee talk?",
    maxScore: 20,
    indicators: {
      positive: [
        "Interviewer talk time < 30%",
        "Paraphrased what they heard",
        "Referenced earlier points",
        "Used silence effectively",
      ],
      negative: [
        "Interrupted frequently",
        "Talked more than the interviewee",
        "Didn't reference previous answers",
      ],
    },
  },
  {
    id: "impact",
    name: "Impact & Priority Exploration",
    description: "Did the interviewer explore the real-world impact and priority of the pains discovered?",
    maxScore: 10,
    indicators: {
      positive: [
        "Asked about business impact",
        "Explored urgency and priority",
        "Asked about budget or time allocation",
        "Probed consequences of inaction",
      ],
      negative: [
        "Assumed the problem was important without validating",
        "Didn't explore priority ranking",
      ],
    },
  },
  {
    id: "bias",
    name: "Avoiding Bias & Leading",
    description: "Did the interviewer stay neutral and avoid leading the interviewee?",
    maxScore: 10,
    indicators: {
      positive: [
        "Stayed curious and neutral",
        "Didn't pitch or suggest solutions",
        "Didn't validate or invalidate their opinions",
        "Let them arrive at conclusions naturally",
      ],
      negative: [
        "Led the interviewee toward a desired answer",
        "Pitched their product or solution",
        "Said things like 'Don't you think...' or 'Wouldn't it be great if...'",
      ],
    },
  },
];
