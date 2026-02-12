"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-primary"
          >
            <span className="text-xl">&#x25CF;</span>
            <span>Interview Coach</span>
          </Link>
          <div className="flex items-center gap-1">
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/calls"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
                >
                  Calls
                </Link>
              </>
            )}
            <Link
              href="/guide"
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              Guide
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/analyze"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  Analyze
                </Link>
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-xs text-muted hidden sm:inline max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-muted hover:text-danger transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors ml-1"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
