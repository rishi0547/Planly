'use client';

import React, { useEffect, useState } from 'react';

const UNITS: [string, number][] = [
  ['y', 31536000],
  ['mo', 2592000],
  ['w', 604800],
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
];

function getRelative(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  for (const [unit, val] of UNITS) {
    const count = Math.floor(seconds / val);
    if (count >= 1) return `${count}${unit} ago`;
  }
  return 'just now';
}

interface RelativeTimeProps {
  dateStr: string;
  className?: string;
}

export default function RelativeTime({ dateStr, className = '' }: RelativeTimeProps) {
  const [relative, setRelative] = useState<string>('');

  useEffect(() => {
    setRelative(getRelative(dateStr));
    const interval = setInterval(() => setRelative(getRelative(dateStr)), 60000);
    return () => clearInterval(interval);
  }, [dateStr]);

  const exact = new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <time
      dateTime={dateStr}
      title={exact}
      className={className}
      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--pl-muted)', cursor: 'default' }}
    >
      {relative || exact}
    </time>
  );
}
