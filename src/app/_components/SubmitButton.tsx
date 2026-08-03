'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function SubmitButton({
  children,
  pendingText = 'Working…',
  className = '',
  variant = 'primary',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const base = variant === 'primary' ? 'pl-btn-primary' : 'pl-btn-secondary';

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${base} ${className}`}
    >
      {pending && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
      )}
      {pending ? pendingText : children}
    </button>
  );
}
