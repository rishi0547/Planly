import { redirectIfAuthenticated } from '@/utils/redirectIfAuthenticated';
import Link from 'next/link';
import HeroDemo from './_components/HeroDemo';

export default async function LandingPage() {
  await redirectIfAuthenticated();

  return (
    <main
      className="relative min-h-screen"
      style={{ background: 'var(--pl-void)', color: 'var(--pl-ink)' }}
    >
      {/* ── Top nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{
          background: 'rgba(26, 24, 22, 0.85)',
          borderBottom: '1px solid var(--pl-border)',
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
          className="text-sm font-medium text-[var(--pl-muted)] hover:text-[var(--pl-ink)] transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* ── Hero section ── */}
      <section className="relative mx-auto flex flex-col items-center px-6 pb-24 pt-20 sm:pt-28">
        {/* Headline */}
        <div className="pl-animate-stagger max-w-2xl text-center">
          <h1
            className="text-[3rem] leading-[1.1] font-bold tracking-tight sm:text-[3.5rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Write everything.
            <br />
            <span style={{ color: 'var(--pl-ember)' }}>Keep what matters.</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-[1.0625rem]"
            style={{ color: 'var(--pl-muted)' }}
          >
            Capture your thoughts in full. Planly's AI reads through the noise
            and distills each note into the key points you actually need.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="pl-animate-stagger mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '0.15s' }}
        >
          <Link href="/signup" className="pl-btn-primary px-7 py-3">
            Open your notebook →
          </Link>
          <Link href="/login" className="pl-btn-ghost px-7 py-3">
            Sign in
          </Link>
        </div>

        {/* ── The Distill Demo ── */}
        <div
          className="pl-animate-stagger mt-16 w-full max-w-lg"
          style={{ animationDelay: '0.3s' }}
        >
          <HeroDemo />
        </div>

        {/* ── Feature cards ── */}
        <div
          className="pl-animate-stagger mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
          style={{ animationDelay: '0.45s' }}
        >
          {/* Private by design */}
          <div className="pl-card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'var(--pl-surface-raised)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--pl-ember)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'var(--pl-ink)' }}>
              Private by design
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--pl-muted)' }}>
              Only you can ever see your notes. Every row is locked to your account.
            </p>
            <p
              className="mt-2 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--pl-muted)', opacity: 0.6 }}
            >
              Supabase RLS
            </p>
          </div>

          {/* Instant capture */}
          <div className="pl-card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'var(--pl-surface-raised)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--pl-ember)' }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'var(--pl-ink)' }}>
              Instant capture
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--pl-muted)' }}>
              No loading screens. Start typing and your note saves instantly.
            </p>
            <p
              className="mt-2 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--pl-muted)', opacity: 0.6 }}
            >
              Next.js Server Actions
            </p>
          </div>

          {/* AI distills */}
          <div className="pl-card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'var(--pl-summary-bg)' }}>
              <span className="text-base" style={{ color: 'var(--pl-summary)' }}>✦</span>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'var(--pl-ink)' }}>
              AI distills for you
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--pl-muted)' }}>
              One click turns a long note into the 2–3 sentences that matter.
            </p>
            <p
              className="mt-2 text-[0.625rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--pl-muted)', opacity: 0.6 }}
            >
              GPT-4o mini
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t px-6 py-6 text-center text-xs"
        style={{ borderColor: 'var(--pl-border)', color: 'var(--pl-muted)' }}
      >
        Built with Next.js, TypeScript & Supabase
      </footer>
    </main>
  );
}
