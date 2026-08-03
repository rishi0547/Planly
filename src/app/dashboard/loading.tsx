export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'var(--pl-void)', color: 'var(--pl-muted)' }}
    >
      <div className="flex items-center gap-3">
        <span className="pl-animate-pulse text-lg" style={{ color: 'var(--pl-summary)' }}>✦</span>
        <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>Loading notes…</span>
      </div>
    </div>
  );
}
