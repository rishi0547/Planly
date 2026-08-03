import Link from 'next/link';
import { signup } from '../(auth)/actions';
import { redirectIfAuthenticated } from '@/utils/redirectIfAuthenticated';
import SubmitButton from '../_components/SubmitButton';

interface PageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  await redirectIfAuthenticated();
  const { error, message } = await searchParams;

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: 'var(--pl-void)', color: 'var(--pl-ink)' }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        className="mb-10 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Planly
      </Link>

      <div className="w-full max-w-sm">
        <div className="pl-card overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-7 pb-0">
            <h1 className="text-lg font-medium" style={{ color: 'var(--pl-ink)' }}>
              Create your account
            </h1>
            <p className="mt-1 text-xs" style={{ color: 'var(--pl-muted)' }}>
              Start capturing and distilling in seconds
            </p>
          </div>

          {/* Form */}
          <div className="px-7 pt-5 pb-7">
            {error && (
              <div
                className="mb-4 rounded-lg border px-3 py-2.5 text-xs"
                style={{
                  borderColor: 'rgba(161, 92, 92, 0.3)',
                  background: 'var(--pl-danger-bg)',
                  color: 'var(--pl-danger)',
                }}
              >
                {error}
              </div>
            )}
            {message && (
              <div
                className="mb-4 rounded-lg border px-3 py-2.5 text-xs"
                style={{
                  borderColor: 'rgba(91, 138, 114, 0.3)',
                  background: 'var(--pl-summary-bg)',
                  color: 'var(--pl-summary)',
                }}
              >
                {message}
              </div>
            )}

            <form action={signup} className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--pl-muted)' }}>
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@domain.com"
                  className="pl-input"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--pl-muted)' }}>
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="At least 6 characters"
                  className="pl-input"
                />
              </div>

              <div className="pt-1">
                <SubmitButton pendingText="Creating account…" className="w-full">
                  Open your notebook →
                </SubmitButton>
              </div>
            </form>

            <div className="mt-5 flex items-center justify-center gap-1 text-xs">
              <span style={{ color: 'var(--pl-muted)' }}>Already have an account?</span>
              <Link
                href="/login"
                className="font-medium transition-colors"
                style={{ color: 'var(--pl-ember)' }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.625rem]" style={{ color: 'var(--pl-muted)', opacity: 0.6 }}>
          By continuing you agree to our terms.
        </p>
      </div>
    </div>
  );
}
