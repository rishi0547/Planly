import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { createClient } from '@/utils/supabase/server';
import SubmitButton from '../_components/SubmitButton';
import { createTask, toggleTaskCompletion, deleteTask } from '../(notes)/actions';
import LogoutButton from '../_components/LogoutButton';
import TaskRow from '../_components/TaskRow';

export default async function DashboardPage() {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();

  // Query tasks with priority and deadline support
  let { data: rawTasks, error } = await supabase
    .from('notes')
    .select('id, title, content, is_completed, priority, deadline, created_at, updated_at')
    .order('created_at', { ascending: false });

  // Fallback query if columns are missing
  if (error) {
    const { data: fallbackTasks } = await supabase
      .from('notes')
      .select('id, title, content, is_completed, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (fallbackTasks) {
      rawTasks = fallbackTasks.map((t) => ({ ...t, priority: 'medium', deadline: null }));
    } else {
      const { data: minimalTasks } = await supabase
        .from('notes')
        .select('id, title, content, created_at, updated_at')
        .order('created_at', { ascending: false });
      rawTasks = (minimalTasks || []).map((t) => ({ ...t, is_completed: false, priority: 'medium', deadline: null }));
    }
  }

  const tasks = (rawTasks || []).map((t) => ({
    ...t,
    is_completed: Boolean(t.is_completed),
    priority: t.priority || 'medium',
    deadline: t.deadline || null,
  }));

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-deepest)', color: 'var(--fg-light)' }}>
      {/* Header Bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{
          background: 'rgba(11, 15, 20, 0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--fg-light)' }}
        >
          Planly
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-[760px] px-6 pb-20 pt-8">
        {/* Task Composer Form */}
        <div className="pl-card-elevated p-6 pl-animate-fade">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--fg-light)' }}>
              <span className="text-[var(--accent)]">⊕</span> Add a new task
            </h2>
            <span className="text-[0.6875rem] font-mono text-[var(--fg-muted)]">
              {pendingCount} pending, {completedCount} done
            </span>
          </div>

          <form action={createTask} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="task-title" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Task Title <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                required
                placeholder="What do you need to get done?"
                className="pl-input"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-content" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                Description (Optional)
              </label>
              <textarea
                id="task-content"
                name="content"
                rows={2}
                placeholder="Add sub-notes or details..."
                className="pl-input resize-y"
              />
            </div>

            {/* Priority & Deadline Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
              {/* Priority Selection */}
              <div>
                <label htmlFor="task-priority" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  defaultValue="medium"
                  className="pl-input cursor-pointer"
                >
                  <option value="low" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">Low Priority</option>
                  <option value="medium" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">Medium Priority</option>
                  <option value="high" className="bg-[var(--bg-deepest)] text-[var(--fg-light)]">High Priority</option>
                </select>
              </div>

              {/* Deadline Selection */}
              <div>
                <label htmlFor="task-deadline" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                  Deadline (Optional)
                </label>
                <input
                  id="task-deadline"
                  name="deadline"
                  type="date"
                  className="pl-input cursor-pointer"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <SubmitButton pendingText="Adding task…" className="w-auto px-7">
                Add task →
              </SubmitButton>
            </div>
          </form>
        </div>

        {/* Task List Section */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between pl-animate-fade">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg-light)' }}>
                Your Tasks
              </h2>
              {tasks.length > 0 && (
                <span className="text-xs font-mono text-[var(--fg-muted)]">
                  ({tasks.length})
                </span>
              )}
            </div>
          </div>

          {/* List or Empty State */}
          {!tasks.length ? (
            <div
              className="pl-animate-fade flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-6 text-center"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-surface)',
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--fg-light)' }}>
                All clear! No tasks yet.
              </h3>
              <p className="mt-1 max-w-xs text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                Create your first task above with description, priority level, and deadline.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  isCompleted={task.is_completed}
                  content={task.content}
                  priority={task.priority}
                  deadline={task.deadline}
                  updatedAt={task.updated_at}
                  createdAt={task.created_at}
                  toggleAction={toggleTaskCompletion}
                  deleteAction={deleteTask}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
