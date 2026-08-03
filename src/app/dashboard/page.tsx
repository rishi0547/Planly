import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { createClient } from '@/utils/supabase/server';
import SubmitButton from '../_components/SubmitButton';
import { createNote, deleteNote } from '../(notes)/actions';
import LogoutButton from '../_components/LogoutButton';
import NoteCard from '../_components/NoteCard';

export default async function DashboardPage() {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, content, summary, summarized_at, created_at, updated_at')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen" style={{ background: 'var(--pl-void)', color: 'var(--pl-ink)' }}>
      {/* ── Top bar ── */}
      <header
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
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--pl-muted)', fontFamily: 'var(--font-mono)' }}>
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-[720px] px-6 pb-20 pt-8">
        {/* ── Composer ── */}
        <div
          className="pl-card-raised p-5 pl-animate-stagger"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span style={{ color: 'var(--pl-ember)', fontSize: '1rem' }}>✎</span>
            <h2 className="text-sm font-medium" style={{ color: 'var(--pl-ink)' }}>
              Capture a thought
            </h2>
          </div>

          <form action={createNote} className="space-y-3">
            <input
              id="dashboard-title"
              name="title"
              required
              placeholder="What's this about?"
              className="pl-input"
            />
            <textarea
              id="dashboard-content"
              name="content"
              rows={3}
              placeholder="Write freely — you can distill it later..."
              className="pl-input resize-y"
            />
            <div className="flex justify-end pt-1">
              <SubmitButton pendingText="Capturing…" className="w-auto px-6">
                Capture →
              </SubmitButton>
            </div>
          </form>
        </div>

        {/* ── Notes section ── */}
        <div className="mt-10">
          <div
            className="mb-4 flex items-baseline gap-2 pl-animate-stagger"
            style={{ animationDelay: '0.15s' }}
          >
            <h2 className="text-lg font-medium" style={{ color: 'var(--pl-ink)' }}>
              Your notes
            </h2>
            {notes && notes.length > 0 && (
              <span
                className="text-xs"
                style={{ color: 'var(--pl-muted)', fontFamily: 'var(--font-mono)' }}
              >
                ({notes.length})
              </span>
            )}
          </div>

          {!notes?.length ? (
            /* ── Empty state ── */
            <div
              className="pl-animate-stagger flex flex-col items-center rounded-xl border border-dashed py-16 text-center"
              style={{
                borderColor: 'var(--pl-border)',
                background: 'var(--pl-surface)',
                animationDelay: '0.2s',
              }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: 'var(--pl-surface-raised)' }}
              >
                <span className="text-2xl" style={{ color: 'var(--pl-ember)', opacity: 0.7 }}>
                  ✎
                </span>
              </div>
              <h3
                className="text-base font-medium"
                style={{ color: 'var(--pl-ink)' }}
              >
                Your notebook is empty
              </h3>
              <p
                className="mt-1 max-w-xs text-sm"
                style={{ color: 'var(--pl-muted)' }}
              >
                Capture your first thought above. Write as much as you want —
                AI will distill it into what matters.
              </p>

              {/* Decorative ✦ watermark */}
              <span
                className="mt-6 pl-animate-pulse text-3xl"
                style={{ color: 'var(--pl-summary)', opacity: 0.15 }}
              >
                ✦
              </span>
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((n, i) => (
                <div
                  key={n.id}
                  className="pl-animate-stagger"
                  style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                >
                  <NoteCard
                    id={n.id}
                    title={n.title}
                    content={n.content}
                    summary={n.summary ?? null}
                    updatedAt={n.updated_at}
                    createdAt={n.created_at}
                    deleteAction={deleteNote}
                  />
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
