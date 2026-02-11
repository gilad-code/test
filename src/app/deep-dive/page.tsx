import { deepDivePrompts } from "@/lib/coaching-data";

export const metadata = {
  title: "Deep Dive Toolkit - Interview Coach",
};

const triggerColors: Record<string, string> = {
  "They mention a workaround": "bg-amber-500",
  "They express frustration or emotion": "bg-red-500",
  "They mention a failed tool or process": "bg-purple-500",
  "They say 'it's fine' or downplay a problem": "bg-blue-500",
  "They mention impact on others (team, customers, stakeholders)":
    "bg-emerald-500",
  "They reveal a number or metric": "bg-indigo-500",
};

export default function DeepDivePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Deep Dive Toolkit</h1>
        <p className="text-muted text-lg max-w-3xl">
          When a customer says something interesting, don&apos;t just nod and
          move on. These are trigger-based prompts — use them when you
          recognize the signal during an interview.
        </p>
      </div>

      {/* How to use */}
      <section className="mb-12">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">How to Use This Toolkit</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <span>
                <strong>During the interview</strong> — Keep this page open as a
                reference. When you hear a trigger signal, glance at the
                corresponding prompts.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <span>
                <strong>Don&apos;t read prompts verbatim</strong> — Use them as
                inspiration. Adapt to the natural flow of conversation.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <span>
                <strong>Follow the energy</strong> — If the interviewee is
                sharing something emotionally charged, stay there. Don&apos;t
                rush to the next topic.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Trigger Cards */}
      <section>
        <div className="space-y-8">
          {deepDivePrompts.map((prompt) => {
            const color = triggerColors[prompt.trigger] || "bg-gray-500";
            return (
              <div
                key={prompt.trigger}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Trigger header */}
                <div className={`${color} px-6 py-4`}>
                  <h3 className="text-lg font-bold text-white">
                    Trigger: {prompt.trigger}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-muted mb-6">{prompt.description}</p>

                  {/* Prompts to use */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-success mb-3">
                      What to say
                    </h4>
                    <div className="space-y-2">
                      {prompt.prompts.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-success/5 border border-success/20 rounded-lg px-4 py-3"
                        >
                          <span className="text-success text-lg leading-none mt-0.5">
                            &rarr;
                          </span>
                          <p className="text-sm italic">&ldquo;{p}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What to avoid */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-danger mb-3">
                      What to avoid
                    </h4>
                    <div className="space-y-2">
                      {prompt.avoid.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-lg px-4 py-3"
                        >
                          <span className="text-danger text-lg leading-none mt-0.5">
                            &#x2717;
                          </span>
                          <p className="text-sm">{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom tip */}
      <section className="mt-12">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-lg font-semibold mb-2">
            Remember: Silence is your superpower
          </p>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            After asking a deep question, resist the urge to fill the silence.
            Count to 5 in your head. The interviewee will almost always fill the
            gap with something more honest and revealing than their first answer.
          </p>
        </div>
      </section>
    </div>
  );
}
