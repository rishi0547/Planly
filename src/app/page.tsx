import { redirectIfAuthenticated } from '@/utils/redirectIfAuthenticated';
import Link from 'next/link';
import HeroDemo from './_components/HeroDemo';

export default async function LandingPage() {
  await redirectIfAuthenticated();

  return (
    <main
      className="relative min-h-screen"
      style={{ background: 'var(--bg-deepest)', color: 'var(--fg-light)' }}
    >
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{
          background: 'rgba(5, 31, 32, 0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Planly
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg-light)] transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto flex flex-col items-center px-6 pb-24 pt-16 sm:pt-24 max-w-5xl">
        {/* Headline */}
        <div className="pl-animate-fade max-w-2xl text-center">
          <h1
            className="text-[2.75rem] leading-[1.1] font-bold tracking-tight sm:text-[3.5rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Clear your mind.
            <br />
            <span style={{ color: 'var(--accent)' }}>Follow through today.</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-[1.0625rem]"
            style={{ color: 'var(--fg-muted)' }}
          >
            Turn a scattered to-do list into a clear, doable plan. Capture what needs to be done, mark it complete, and move forward.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pl-animate-fade mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="pl-btn-primary px-7 py-3 text-base">
            Get started →
          </Link>
          <Link href="/login" className="pl-btn-secondary px-7 py-3 text-base">
            Sign in
          </Link>
        </div>

        {/* Live Interactive Task Demo */}
        <div className="pl-animate-fade mt-14 w-full max-w-lg">
          <HeroDemo />
        </div>

        {/* Task Manager Value Feature Cards */}
        <div className="pl-animate-fade mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="pl-card p-6">
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--fg-light)' }}>
              Private to You
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Only your authenticated account can ever view or manage your tasks. Every row is protected at the database level.
            </p>
            <p
              className="mt-3 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}
            >
              Supabase Row Level Security
            </p>
          </div>

          {/* Card 2 */}
          <div className="pl-card p-6">
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--fg-light)' }}>
              Instant Action
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              No spinner lags or page reloads. Add a task or check it off with instant UI responsiveness.
            </p>
            <p
              className="mt-3 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}
            >
              Next.js Server Actions
            </p>
          </div>

          {/* Card 3 */}
          <div className="pl-card p-6">
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--fg-light)' }}>
              Pure Focus
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Designed without heavy productivity bloat. A clean space to decide what matters today and mark it done.
            </p>
            <p
              className="mt-3 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}
            >
              Task Clarity Interface
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 py-6 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
      >
        Planly Task Manager — Built with Next.js, TypeScript & Supabase
      </footer>
    </main>
  );
}
