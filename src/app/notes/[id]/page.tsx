import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { updateTask, deleteTask, toggleTaskCompletion } from '@/app/(notes)/actions';
import SubmitButton from '@/app/_components/SubmitButton';
import ConfirmButton from '@/app/_components/ConfirmButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();
  const { id } = await params;

  const { data: task } = await supabase
    .from('notes')
    .select('id, title, content, is_completed, updated_at, created_at, user_id')
    .eq('id', id)
    .single();

  if (!task) return notFound();
  if (task.user_id !== user.id) redirect('/dashboard');

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-deepest)', color: 'var(--fg-light)' }}>
      {/* Top Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{
          background: 'rgba(5, 31, 32, 0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--fg-light)' }}
        >
          Planly
        </Link>
      </header>

      <div className="mx-auto max-w-[720px] px-6 pb-20 pt-8">
        {/* Back navigation */}
        <nav className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--fg-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to tasks
          </Link>
        </nav>

        {/* Task Edit Card */}
        <div className="pl-card p-6 pl-animate-fade">
          <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    task.is_completed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                  }`}
                />
                <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg-light)' }}>
                  {task.is_completed ? 'Completed Task' : 'Edit Task'}
                </h1>
              </div>
              <p
                className="mt-1 text-[0.6875rem]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}
              >
                Last updated {new Date(task.updated_at || task.created_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Status */}
              <form action={toggleTaskCompletion}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="is_completed" value={String(task.is_completed)} />
                <SubmitButton variant="secondary" pendingText="Updating…" className="gap-1 text-xs py-1.5 px-3">
                  {task.is_completed ? 'Mark incomplete' : '✓ Mark done'}
                </SubmitButton>
              </form>

              {/* Delete Task */}
              <form action={deleteTask}>
                <input type="hidden" name="id" value={task.id} />
                <ConfirmButton confirmText="Delete this task permanently?">
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </header>

          {/* Edit Form */}
          <form action={updateTask} className="space-y-4">
            <input type="hidden" name="id" value={task.id} />

            <div>
              <label htmlFor="task-title" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Task Title
              </label>
              <input
                id="task-title"
                name="title"
                defaultValue={task.title}
                required
                className="pl-input"
              />
            </div>

            <div>
              <label htmlFor="task-content" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Notes / Sub-details (Optional)
              </label>
              <textarea
                id="task-content"
                name="content"
                rows={6}
                defaultValue={task.content || ''}
                placeholder="Add optional task sub-notes or details..."
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
      </div>
    </main>
  );
}
