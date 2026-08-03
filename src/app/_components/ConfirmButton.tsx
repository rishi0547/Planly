'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

interface ConfirmButtonProps {
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
}

export default function ConfirmButton({
  children,
  confirmText = 'Are you sure?',
  className = '',
}: ConfirmButtonProps) {
  const { pending } = useFormStatus();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) return;
    const ok = window.confirm(confirmText);
    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending}
      className={className}
      style={{
        color: pending ? 'var(--pl-muted)' : 'var(--pl-danger)',
        opacity: pending ? 0.6 : 1,
        cursor: pending ? 'not-allowed' : 'pointer',
        fontSize: '0.8125rem',
        transition: 'opacity 0.15s ease',
      }}
    >
      {pending ? 'Deleting…' : children}
    </button>
  );
}
