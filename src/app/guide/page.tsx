import { openingTechniques, questionCategories } from "@/lib/coaching-data";

export const metadata = {
  title: "Coaching Guide - Interview Coach",
};

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">
          Pain Discovery Coaching Guide
        </h1>
        <p className="text-muted text-lg max-w-3xl">
          Master the art of uncovering real customer pain. This guide covers how
          to open interviews, build trust, and ask the right questions to
          discover what truly matters to your customers.
        </p>
      </div>

      {/* Golden Rules */}
      <section className="mb-16">
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-accent">
            Golden Rules of Pain Discovery
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                rule: "Listen 80%, Talk 20%",
                detail:
                  "Your job is to create space for them to share. Every second you talk is a second they can't.",
              },
              {
                rule: "Never pitch during discovery",
                detail:
                  "The moment you pitch, you stop learning. Save solutions for later — this call is about their world.",
              },
              {
                rule: "Follow the emotion",
                detail:
                  "When their voice changes, they sigh, or use strong words — STOP and go deeper. Emotion = real pain.",
              },
              {
                rule: "Seek specifics, not abstractions",
                detail:
                  'When they say "it\'s hard", ask "Can you give me an example from this week?" Specifics reveal truth.',
              },
            ].map((item) => (
              <div key={item.rule} className="bg-card rounded-lg p-4">
                <p className="font-semibold text-foreground">{item.rule}</p>
                <p className="text-sm text-muted mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening & Trust Building */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">
          Opening & Trust Building
        </h2>
        <p className="text-muted mb-8">
          The first 3-5 minutes determine the quality of the entire interview.
          Get these right and people will share things they&apos;ve never told
          anyone.
        </p>

        <div className="space-y-6">
          {openingTechniques.map((technique) => (
            <div
              key={technique.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-2">{technique.title}</h3>
              <p className="text-muted mb-4">{technique.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                  Example Scripts
                </h4>
                <div className="space-y-2">
                  {technique.examples.map((example, i) => (
                    <div
                      key={i}
                      className="bg-primary/5 border-l-4 border-primary rounded-r-lg px-4 py-3 text-sm italic"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-success mb-2">
                  Tips
                </h4>
                <ul className="space-y-1">
                  {technique.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-success mt-0.5">&#x2713;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Questions */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">
          Smart Question Frameworks
        </h2>
        <p className="text-muted mb-8">
          Use these question categories to systematically uncover pain. Start
          with Current State, then move to Pain Identification, deepen with
          Emotional Probing, and validate with Priority & Urgency.
        </p>

        <div className="space-y-10">
          {questionCategories.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{cat.category}</h3>
                  <p className="text-sm text-muted">{cat.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {cat.questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <p className="font-semibold text-lg mb-1">
                      &ldquo;{q.question}&rdquo;
                    </p>
                    <p className="text-sm text-muted mb-3">
                      <span className="font-medium text-primary">
                        Purpose:
                      </span>{" "}
                      {q.purpose}
                    </p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
                        Follow-up prompts:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {q.followUps.map((fu, j) => (
                          <span
                            key={j}
                            className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {fu}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Flow */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Recommended Interview Flow
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          {[
            {
              phase: "1. Open (3-5 min)",
              desc: "Set context, build rapport, ask permission to go deep",
              color: "bg-primary",
            },
            {
              phase: "2. Map (5-10 min)",
              desc: "Understand their world — role, team, processes, typical day",
              color: "bg-blue-500",
            },
            {
              phase: "3. Discover (15-20 min)",
              desc: "Ask about challenges, frustrations, and what they've tried",
              color: "bg-accent",
            },
            {
              phase: "4. Deep Dive (10-15 min)",
              desc: "Follow the emotion — probe impact, examples, workarounds",
              color: "bg-danger",
            },
            {
              phase: "5. Validate (5-10 min)",
              desc: "Check priority, urgency, and willingness to invest in a solution",
              color: "bg-success",
            },
            {
              phase: "6. Close (2-3 min)",
              desc: "Summarize what you heard, ask if you missed anything, thank them",
              color: "bg-muted",
            },
          ].map((step, i) => (
            <div key={i} className="relative flex items-start gap-4 pb-8">
              <div
                className={`relative z-10 w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {i + 1}
              </div>
              <div className="pt-2">
                <p className="font-bold">{step.phase}</p>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
