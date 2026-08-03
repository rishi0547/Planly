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

  return (
    <li
      className="pl-card p-4 transition-all duration-200 hover:border-[var(--border-hover)]"
      style={{
        background: isCompleted ? 'rgba(11, 43, 38, 0.5)' : 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Toggle + Title block */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <form action={toggleAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="is_completed" value={String(isCompleted)} />
            <ToggleCheckbox isCompleted={isCompleted} />
          </form>

          <div className="min-w-0 flex-1">
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
            {content && (
              <p
                className={`mt-0.5 text-xs line-clamp-1 ${
                  isCompleted ? 'text-[var(--fg-subtle)] line-through' : 'text-[var(--fg-muted)]'
                }`}
              >
                {content}
              </p>
            )}
          </div>
        </div>

        {/* Metadata + Quiet Delete */}
        <div className="flex items-center gap-3 flex-shrink-0" ref={menuRef}>
          <span className="text-[0.6875rem] text-[var(--fg-muted)]">
            <RelativeTime dateStr={updatedAt || createdAt} />
          </span>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--fg-muted)] hover:text-[var(--fg-light)] hover:bg-[var(--bg-elevated)] transition-colors"
              aria-label="Delete task"
              title="Delete task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
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
