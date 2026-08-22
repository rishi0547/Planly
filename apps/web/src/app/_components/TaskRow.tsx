'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import RelativeTime from './RelativeTime';

interface TaskRowProps {
  id: string;
  title: string;
  isCompleted: boolean;
  content?: string | null;
  priority?: string | null;
  deadline?: string | null;
  updatedAt: string;
  createdAt: string;
  toggleAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}

function ToggleCheckbox({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
      className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
        isCompleted
          ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--bg-deepest)] pl-animate-check pl-animate-glow'
          : 'bg-transparent border-[var(--border)] hover:border-[var(--accent)]'
      } ${pending ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      {isCompleted && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2.5 6 5 8.5 9.5 3.5" />
        </svg>
      )}
    </button>
  );
}

export default function TaskRow({
  id,
  title,
  isCompleted,
  content,
  priority,
  deadline,
  updatedAt,
  createdAt,
  toggleAction,
  deleteAction,
}: TaskRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confirmDelete) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setConfirmDelete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [confirmDelete]);

  // Priority Badge Helper
  const normPriority = (priority || 'medium').toLowerCase();
  const priorityStyle =
    normPriority === 'high'
      ? { bg: 'rgba(239, 68, 68, 0.15)', fg: '#f87171', border: 'rgba(239, 68, 68, 0.3)', label: 'High' }
      : normPriority === 'low'
      ? { bg: 'rgba(148, 163, 184, 0.15)', fg: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)', label: 'Low' }
      : { bg: 'rgba(16, 185, 129, 0.15)', fg: '#34d399', border: 'rgba(16, 185, 129, 0.3)', label: 'Medium' };

  // Deadline formatting
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const isOverdue = deadline && !isCompleted && new Date(deadline) < new Date();

  return (
    <li
      className="pl-card p-4 transition-all duration-200 hover:border-[var(--border-hover)]"
      style={{
        background: isCompleted ? 'rgba(19, 24, 31, 0.6)' : 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox + Details */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="pt-0.5">
            <form action={toggleAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="is_completed" value={String(isCompleted)} />
              <ToggleCheckbox isCompleted={isCompleted} />
            </form>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/notes/${id}`}
                className={`text-[0.9375rem] font-medium leading-snug transition-all ${
                  isCompleted
                    ? 'line-through text-[var(--fg-muted)] opacity-60'
                    : 'text-[var(--fg-light)] hover:text-[var(--accent)]'
                }`}
              >
                {title}
              </Link>

              {/* Priority Badge */}
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-semibold border"
                style={{
                  background: priorityStyle.bg,
                  color: priorityStyle.fg,
                  borderColor: priorityStyle.border,
                }}
              >
                {priorityStyle.label}
              </span>

              {/* Deadline Tag */}
              {formattedDeadline && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6875rem] font-mono border ${
                    isOverdue
                      ? 'bg-[var(--danger-bg)] text-[var(--danger-fg)] border-red-500/30 font-semibold'
                      : 'bg-[var(--bg-elevated)] text-[var(--fg-muted)] border-[var(--border)]'
                  }`}
                  title={isOverdue ? 'Overdue task' : `Due date: ${formattedDeadline}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {isOverdue ? `Overdue (${formattedDeadline})` : `Due ${formattedDeadline}`}
                </span>
              )}
            </div>

            {/* Description Sub-text */}
            {content && (
              <p
                className={`mt-1 text-xs line-clamp-2 leading-relaxed ${
                  isCompleted ? 'text-[var(--fg-subtle)] line-through' : 'text-[var(--fg-muted)]'
                }`}
              >
                {content}
              </p>
            )}
          </div>
        </div>

        {/* Actions: Edit + Delete */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5" ref={menuRef}>
          <span className="text-[0.6875rem] text-[var(--fg-subtle)] hidden sm:inline">
            <RelativeTime dateStr={updatedAt || createdAt} />
          </span>

          {/* Edit Task Link */}
          <Link
            href={`/notes/${id}`}
            className="flex h-7 px-2 items-center gap-1 rounded-md text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg-light)] hover:bg-[var(--bg-elevated)] transition-colors border border-transparent hover:border-[var(--border)]"
            title="Edit task details"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </Link>

          {/* Delete Action */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--fg-muted)] hover:text-[var(--danger-fg)] hover:bg-[var(--danger-bg)] transition-colors"
              aria-label="Delete task"
              title="Delete task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
              <span className="px-1 text-[0.6875rem] text-[var(--fg-muted)]">Delete?</span>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="rounded px-2 py-0.5 text-[0.6875rem] font-medium bg-[var(--danger-bg)] text-[var(--danger-fg)] hover:opacity-80 transition-opacity"
                >
                  Yes
                </button>
              </form>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-1.5 py-0.5 text-[0.6875rem] text-[var(--fg-muted)] hover:text-[var(--fg-light)]"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
