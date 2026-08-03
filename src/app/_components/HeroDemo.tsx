'use client';

import React, { useEffect, useState } from 'react';

const RAW_LINES = [
  'Meeting notes from the Q3 review — budget projections',
  'came in 12% under target. Timeline pushed to March.',
  'Three action items assigned to the dev team for sprint.',
];

const SUMMARY_TEXT =
  'Q3 review covered budget (12% under), pushed timeline to March, and assigned 3 dev sprint actions.';

type Phase = 'idle' | 'reveal' | 'pause' | 'compress' | 'summary' | 'done';

export default function HeroDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [visibleLines, setVisibleLines] = useState(0);

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // If reduced motion, show final state immediately
  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(RAW_LINES.length);
      setPhase('done');
      return;
    }

    // Start reveal after 800ms
    const startTimer = setTimeout(() => setPhase('reveal'), 800);
    return () => clearTimeout(startTimer);
  }, [reducedMotion]);

  // Reveal lines one by one
  useEffect(() => {
    if (phase !== 'reveal') return;
    if (visibleLines >= RAW_LINES.length) {
      const t = setTimeout(() => setPhase('pause'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 500);
    return () => clearTimeout(t);
  }, [phase, visibleLines]);

  // Pause → compress
  useEffect(() => {
    if (phase !== 'pause') return;
    const t = setTimeout(() => setPhase('compress'), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // Compress → summary
  useEffect(() => {
    if (phase !== 'compress') return;
    const t = setTimeout(() => setPhase('summary'), 800);
    return () => clearTimeout(t);
  }, [phase]);

  // Summary → done
  useEffect(() => {
    if (phase !== 'summary') return;
    const t = setTimeout(() => setPhase('done'), 600);
    return () => clearTimeout(t);
  }, [phase]);

  const showRaw = phase !== 'summary' && phase !== 'done';
  const showSummary = phase === 'summary' || phase === 'done';

  return (
    <div className="pl-hero-demo relative mx-auto w-full max-w-lg">
      {/* Raw note block */}
      <div
        className="pl-card p-5 transition-all duration-700"
        style={{
          opacity: showRaw ? 1 : 0,
          transform: showRaw ? 'none' : 'translateY(-12px) scaleY(0.9)',
          position: showRaw ? 'relative' : 'absolute',
          inset: showRaw ? undefined : 0,
        }}
      >
        <div
          className="mb-3 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--pl-muted)' }}
        >
          <span style={{ color: 'var(--pl-ember)', opacity: 0.7 }}>✎</span>
          Raw note
        </div>
        <div className="space-y-2">
          {RAW_LINES.map((line, i) => (
            <p
              key={i}
              data-animate
              className="text-sm leading-relaxed transition-all duration-500"
              style={{
                color: 'var(--pl-ink)',
                opacity: i < visibleLines ? 1 : 0,
                transform: i < visibleLines ? 'none' : 'translateX(-8px)',
                ...(phase === 'compress'
                  ? {
                      opacity: 0.2,
                      transform: `translateY(-${(i + 1) * 6}px) scaleY(0.85)`,
                    }
                  : {}),
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Distill glyph */}
      <div
        className="flex items-center justify-center py-3 transition-opacity duration-500"
        style={{ opacity: phase === 'pause' || phase === 'compress' ? 1 : 0 }}
      >
        <span
          className="pl-glyph text-lg pl-animate-pulse"
          style={{ color: 'var(--pl-summary)' }}
        >
          ✦
        </span>
      </div>

      {/* Summary result */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: showSummary ? 1 : 0,
          transform: showSummary ? 'none' : 'translateY(8px) scale(0.97)',
        }}
      >
        <div className="pl-card p-5">
          <div
            className="mb-3 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--pl-summary)' }}
          >
            <span>✦</span>
            AI Summary
          </div>
          <div className="pl-summary-bar">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--pl-ink)' }}>
              {SUMMARY_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
