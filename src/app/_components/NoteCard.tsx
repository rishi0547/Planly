'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import RelativeTime from './RelativeTime';

interface NoteCardProps {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  updatedAt: string;
  createdAt: string;
  deleteAction: (formData: FormData) => void;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs transition-colors"
      style={{
        color: pending ? 'var(--pl-muted)' : 'var(--pl-danger)',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}

export default function NoteCard({
  id,
  title,
  content,
  summary,
  updatedAt,
  createdAt,
  deleteAction,
}: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <li
      className="pl-card p-4 transition-all duration-200 hover:border-[var(--pl-muted)]/30"
      style={{
        borderColor: 'var(--pl-border)',
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/notes/${id}`}
          className="text-[0.9375rem] font-medium leading-snug transition-colors hover:text-[var(--pl-ember)]"
          style={{ color: 'var(--pl-ink)' }}
        >
          {title}
        </Link>

        {/* ··· menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setConfirmDelete(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            style={{
              color: 'var(--pl-muted)',
              background: menuOpen ? 'var(--pl-surface-raised)' : 'transparent',
            }}
            aria-label="Note actions"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="3" cy="8" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="13" cy="8" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-10 min-w-[140px] rounded-lg border p-1 shadow-lg"
              style={{
                background: 'var(--pl-surface-raised)',
                borderColor: 'var(--pl-border)',
              }}
            >
              <Link
                href={`/notes/${id}`}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors"
                style={{ color: 'var(--pl-ink)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pl-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Edit
              </Link>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors"
                  style={{ color: 'var(--pl-danger)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pl-danger-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Delete
                </button>
              ) : (
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={id} />
                  <div className="px-3 py-2">
                    <p className="mb-2 text-xs" style={{ color: 'var(--pl-muted)' }}>
                      Are you sure?
                    </p>
                    <DeleteButton />
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content preview */}
      {content && (
        <p
          className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed"
          style={{ color: 'var(--pl-muted)' }}
        >
          {content}
        </p>
      )}

      {/* AI Summary line */}
      {summary && (
        <div className="mt-3 pl-summary-bar py-1.5 px-2.5">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--pl-ink)', opacity: 0.85 }}>
            <span className="pl-glyph mr-1">✦</span>
            {summary}
          </p>
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-3">
        <RelativeTime dateStr={updatedAt || createdAt} />
      </div>
    </li>
  );
}
