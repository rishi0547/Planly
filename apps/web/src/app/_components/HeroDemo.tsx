'use client';

import React, { useEffect, useState } from 'react';

const DEMO_TASKS = [
  { id: 1, title: 'Review Q3 team sprint roadmap', completed: false, time: 'Due today' },
  { id: 2, title: 'Finalize core product documentation', completed: true, time: 'Done 2h ago' },
  { id: 3, title: 'Schedule sync with design lead', completed: false, time: 'Due tomorrow' },
];

export default function HeroDemo() {
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [activeStep, setActiveStep] = useState(0);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 3;
        if (next === 1) {
          setTasks((current) =>
            current.map((t) => (t.id === 1 ? { ...t, completed: true } : t))
          );
        } else if (next === 2) {
          setTasks((current) =>
            current.map((t) => (t.id === 3 ? { ...t, completed: true } : t))
          );
        } else {
          setTasks(DEMO_TASKS);
        }
        return next;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pl-card p-5 w-full shadow-2xl border-[var(--border)]">
      <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-xs font-mono text-[var(--fg-muted)]">Live Interactive Demo</span>
        </div>
        <span className="text-[0.6875rem] font-mono text-[var(--accent)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
          {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
        </span>
      </div>

      <ul className="space-y-2.5">
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] cursor-pointer transition-all duration-300 hover:border-[var(--accent)]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-5 w-5 flex-shrink-0 rounded-md border flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--bg-deepest)] pl-animate-check pl-animate-glow'
                    : 'border-[var(--border)] bg-transparent'
                }`}
              >
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2.5 6 5 8.5 9.5 3.5" />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium transition-all ${
                  task.completed
                    ? 'line-through text-[var(--fg-muted)] opacity-60'
                    : 'text-[var(--fg-light)]'
                }`}
              >
                {task.title}
              </span>
            </div>
            <span className="text-[0.6875rem] font-mono text-[var(--fg-muted)] flex-shrink-0">
              {task.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
