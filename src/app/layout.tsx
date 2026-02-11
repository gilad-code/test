import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Coach - Pain Discovery Mastery",
  description:
    "A coaching app to help interviewers run better customer pain discovery calls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-bold text-primary"
                >
                  <span className="text-2xl">&#x1f3af;</span>
                  <span>Interview Coach</span>
                </Link>
                <div className="flex items-center gap-1">
                  <Link
                    href="/guide"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
                  >
                    Coaching Guide
                  </Link>
                  <Link
                    href="/deep-dive"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
                  >
                    Deep Dive Toolkit
                  </Link>
                  <Link
                    href="/analyze"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-card bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Analyze Transcript
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted">
            Pain Discovery Interview Coach &mdash; Built for teams that want to
            truly understand their customers.
          </footer>
        </div>
      </body>
    </html>
  );
}
