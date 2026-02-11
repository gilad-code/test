import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Master the Art of
          <br />
          <span className="text-primary">Pain Discovery Interviews</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          A coaching toolkit for teams that want to run better customer
          interviews. Learn how to build trust, ask the right questions, dive
          deep into real pain, and analyze your performance.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/guide"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Learning
          </Link>
          <Link
            href="/analyze"
            className="px-6 py-3 bg-card border border-border font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            Analyze a Transcript
          </Link>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          Three Pillars of Great Pain Discovery
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/guide"
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-4 text-primary font-bold">[~]</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
              Open & Build Trust
            </h3>
            <p className="text-sm text-muted">
              Learn proven techniques to set context, build rapport, and create
              the psychological safety that makes people share their real
              struggles.
            </p>
            <div className="mt-4 text-sm font-medium text-primary">
              View coaching guide &rarr;
            </div>
          </Link>

          <Link
            href="/deep-dive"
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-4 text-primary font-bold">[?]</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
              Dive Deep on Pain
            </h3>
            <p className="text-sm text-muted">
              When a customer hints at a real problem, don&apos;t move on. Use
              trigger-based prompts to go beneath the surface and find what
              truly hurts.
            </p>
            <div className="mt-4 text-sm font-medium text-primary">
              View deep dive toolkit &rarr;
            </div>
          </Link>

          <Link
            href="/analyze"
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-4 text-primary font-bold">[&gt;]</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
              Analyze & Improve
            </h3>
            <p className="text-sm text-muted">
              Upload your interview transcript and get instant scoring across 6
              categories, detected pain points, strengths, and specific areas to
              improve.
            </p>
            <div className="mt-4 text-sm font-medium text-primary">
              Analyze a transcript &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* What Gets Scored */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          What the Analyzer Scores
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Opening & Trust",
              weight: "15 pts",
              desc: "Did you set context, build rapport, and create safety?",
            },
            {
              name: "Open-Ended Questions",
              weight: "20 pts",
              desc: "Did you use questions that let the customer narrate?",
            },
            {
              name: "Deep Dive on Pain",
              weight: "25 pts",
              desc: "Did you go deeper when real pain surfaced?",
            },
            {
              name: "Active Listening",
              weight: "20 pts",
              desc: "Did you listen more than you talked?",
            },
            {
              name: "Impact & Priority",
              weight: "10 pts",
              desc: "Did you explore urgency, ranking, and budget?",
            },
            {
              name: "Avoiding Bias",
              weight: "10 pts",
              desc: "Did you stay neutral and avoid pitching?",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.weight}
                </span>
              </div>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Tips */}
      <section className="mb-20">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Quick Interview Reminders
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Listen 80% of the time, talk 20%",
              "Never pitch during a discovery call",
              "When they show emotion, go deeper — don't move on",
              "Ask for specific examples, not hypotheticals",
              "Silence after a question is your best friend",
              "Paraphrase what you hear to build trust",
              "Explore workarounds — they reveal accepted pain",
              "Always validate priority and urgency before wrapping up",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold">&#x2022;</span>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to level up?</h2>
        <p className="text-muted mb-6">
          Start with the coaching guide, then practice with a colleague, then
          analyze your real interviews.
        </p>
        <Link
          href="/guide"
          className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
