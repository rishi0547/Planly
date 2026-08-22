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

  let { data: rawTask, error } = await supabase
    .from('notes')
    .select('id, title, content, is_completed, priority, deadline, updated_at, created_at, user_id')
    .eq('id', id)
    .single();

  if (error) {
    const { data: fallbackTask } = await supabase
      .from('notes')
      .select('id, title, content, is_completed, updated_at, created_at, user_id')
      .eq('id', id)
      .single();
    if (fallbackTask) {
      rawTask = { ...fallbackTask, priority: 'medium', deadline: null };
    }
  }

  const task = rawTask
    ? {
        ...rawTask,
        is_completed: Boolean(rawTask.is_completed),
        priority: rawTask.priority || 'medium',
        deadline: rawTask.deadline || null,
      }
    : null;

  if (!task) return notFound();
  if (task.user_id !== user.id) redirect('/dashboard');

  const formattedDeadlineDate = task.deadline
    ? new Date(task.deadline).toISOString().split('T')[0]
    : '';

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-deepest)', color: 'var(--fg-light)' }}>
      {/* Top Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{
          background: 'rgba(11, 15, 20, 0.85)',
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

      <div className="mx-auto max-w-[760px] px-6 pb-20 pt-8">
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
          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    task.is_completed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                  }`}
                />
                <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg-light)' }}>
                  Edit Task Details
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
              {/* Toggle Completion Status */}
              <form action={toggleTaskCompletion}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="is_completed" value={String(task.is_completed)} />
                <SubmitButton variant="secondary" pendingText="Updating…" className="gap-1 text-xs py-1.5 px-3">
                  {task.is_completed ? 'Mark incomplete' : '✓ Mark completed'}
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

            {/* Task Title */}
            <div>
              <label htmlFor="task-title" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Task Title <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                defaultValue={task.title}
                required
                className="pl-input"
              />
            </div>

            {/* Task Description */}
            <div>
              <label htmlFor="task-content" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Description / Details (Optional)
              </label>
              <textarea
                id="task-content"
                name="content"
                rows={5}
                defaultValue={task.content || ''}
                placeholder="Add task description or sub-notes..."
                className="pl-input resize-y"
              />
            </div>

            {/* Priority & Deadline Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
              {/* Priority */}
              <div>
                <label htmlFor="task-priority" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                  Priority Level
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  defaultValue={task.priority}
                  className="pl-input cursor-pointer"
                >
                  <option value="low" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">Low Priority</option>
                  <option value="medium" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">Medium Priority</option>
                  <option value="high" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">High Priority</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="task-deadline" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                  Deadline Date (Optional)
                </label>
                <input
                  id="task-deadline"
                  name="deadline"
                  type="date"
                  defaultValue={formattedDeadlineDate}
                  className="pl-input cursor-pointer"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3">
              <SubmitButton pendingText="Saving…" className="w-auto px-7">
                Save changes
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
