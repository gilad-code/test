import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "./navbar";
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
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border py-6 text-center text-sm text-muted">
              Pain Discovery Interview Coach &mdash; Built for teams that want
              to truly understand their customers.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
