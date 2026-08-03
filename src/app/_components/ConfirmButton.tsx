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
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Deleting…' : children}
    </button>
  );
}
