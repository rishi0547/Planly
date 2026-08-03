import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { updateNote, deleteNote, summarizeNote } from '@/app/(notes)/actions';
import SubmitButton from '@/app/_components/SubmitButton';
import ConfirmButton from '@/app/_components/ConfirmButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailPage({ params }: PageProps) {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();
  const { id } = await params;

  const { data: note } = await supabase
    .from('notes')
    .select('id, title, content, updated_at, created_at, user_id, summary, summarized_at')
    .eq('id', id)
    .single();

  if (!note) return notFound();
  if (note.user_id !== user.id) redirect('/dashboard');

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
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Planly
        </Link>
      </header>

      <div className="mx-auto max-w-[720px] px-6 pb-20 pt-8">
        {/* Back link */}
        <nav className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: 'var(--pl-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to notes
          </Link>
        </nav>

        {/* ── Edit card ── */}
        <div className="pl-card p-6 pl-animate-stagger">
          <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-medium" style={{ color: 'var(--pl-ink)' }}>
                Edit note
              </h1>
              <p
                className="mt-1 text-[0.6875rem]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--pl-muted)' }}
              >
                Last updated {new Date(note.updated_at || note.created_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Summarize */}
              <form action={summarizeNote}>
                <input type="hidden" name="id" value={note.id} />
                <SubmitButton pendingText="Distilling…" className="gap-1.5">
                  <span className="pl-glyph">✦</span> Distill
                </SubmitButton>
              </form>

              {/* Delete */}
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <ConfirmButton confirmText="Delete this note permanently?">
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </header>

          {/* Edit form */}
          <form action={updateNote} className="space-y-4">
            <input type="hidden" name="id" value={note.id} />

            <div>
              <label htmlFor="note-title" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--pl-muted)' }}>
                Title
              </label>
              <input
                id="note-title"
                name="title"
                defaultValue={note.title}
                required
                className="pl-input"
              />
            </div>

            <div>
              <label htmlFor="note-content" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--pl-muted)' }}>
                Content
              </label>
              <textarea
                id="note-content"
                name="content"
                rows={10}
                defaultValue={note.content || ''}
                className="pl-input resize-y"
              />
            </div>

            <div className="flex justify-end pt-2">
              <SubmitButton pendingText="Saving…" className="w-auto px-6">
                Save changes
              </SubmitButton>
            </div>
          </form>
        </div>

        {/* ── Summary card ── */}
        <div
          className="pl-card mt-6 p-6 pl-animate-stagger"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-2">
            <span className="pl-glyph text-base">✦</span>
            <h2 className="text-sm font-medium" style={{ color: 'var(--pl-ink)' }}>
              AI Summary
            </h2>
          </div>

          {!note.summary ? (
            <p className="mt-3 text-sm" style={{ color: 'var(--pl-muted)' }}>
              No summary yet — click{' '}
              <span style={{ color: 'var(--pl-summary)' }}>✦ Distill</span>{' '}
              above to generate one.
            </p>
          ) : (
            <>
              <div className="pl-summary-bar mt-3 py-2 px-3">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--pl-ink)' }}>
                  {note.summary}
                </p>
              </div>
              {note.summarized_at && (
                <p
                  className="mt-3 text-[0.6875rem]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--pl-muted)' }}
                >
                  Generated {new Date(note.summarized_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
