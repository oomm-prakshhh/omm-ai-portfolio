'use client';

import { useEffect, useState, useRef } from 'react';

// ── Configuration ─────────────────────────────────────────────────────────────
// Set to false to completely disable the boot sequence
const BOOT_SEQUENCE_ENABLED = true;

// Session key - change to force replay across all sessions
const SESSION_KEY = 'omm-ai-boot-complete';
// ──────────────────────────────────────────────────────────────────────────────

const BOOT_MESSAGES = [
  { text: 'INITIALIZING OMM//AI CORE...', duration: 600 },
  { text: 'LOADING NEURAL MODULES...', duration: 700 },
  { text: 'VERIFYING SECURITY CLEARANCE...', duration: 800 },
  { text: 'ESTABLISHING CONNECTION...', duration: 600 },
  { text: 'CHECKING SYSTEM STATUS...', duration: 700 },
  { text: 'ACCESS GRANTED', duration: 900, accent: true },
];

function useTypingEffect(text: string, speed = 30, active = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);

  return { displayed, done };
}

function BootLine({
  message,
  active,
  done: lineDone,
  accent,
}: {
  message: string;
  active: boolean;
  done: boolean;
  accent?: boolean;
}) {
  const { displayed, done } = useTypingEffect(message, 28, active);

  return (
    <div className={`flex items-start gap-3 font-mono text-xs sm:text-sm leading-relaxed transition-opacity duration-300 ${active || lineDone ? 'opacity-100' : 'opacity-0'}`}>
      <span className={`mt-0.5 shrink-0 ${accent ? 'text-cyan-400' : 'text-cyan-600'}`}>
        {lineDone ? '✓' : active ? '›' : ' '}
      </span>
      <span className={accent ? 'text-cyan-300 font-bold tracking-widest' : 'text-zinc-300'}>
        {displayed}
        {active && !done && (
          <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
        )}
      </span>
    </div>
  );
}

export default function BootSequence() {
  const [shouldRun, setShouldRun] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if boot sequence should run — client-only check
  useEffect(() => {
    if (!BOOT_SEQUENCE_ENABLED) return;
    // Skip for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const alreadyRan = sessionStorage.getItem(SESSION_KEY);
      if (!alreadyRan) {
        setShouldRun(true);
      }
    } catch {
      // sessionStorage unavailable (private mode edge case) — skip silently
    }
  }, []);

  // Sequence orchestrator
  useEffect(() => {
    if (!shouldRun) return;

    let lineIndex = 0;

    const runNextLine = () => {
      if (lineIndex >= BOOT_MESSAGES.length) {
        // All lines complete — show SYSTEM READY
        setTimeout(() => {
          setShowReady(true);
          // Start fade out
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setHidden(true);
              sessionStorage.setItem(SESSION_KEY, 'true');
            }, 700);
          }, 800);
        }, 300);
        return;
      }

      setCurrentLine(lineIndex);

      // Animate progress bar
      const targetProgress = Math.round(((lineIndex + 1) / BOOT_MESSAGES.length) * 100);
      if (progressRef.current) clearInterval(progressRef.current);
      const stepDuration = BOOT_MESSAGES[lineIndex].duration / 20;
      let current = progress;
      progressRef.current = setInterval(() => {
        current += (targetProgress - current) * 0.15;
        setProgress(Math.round(current));
        if (Math.abs(current - targetProgress) < 0.5) {
          setProgress(targetProgress);
          if (progressRef.current) clearInterval(progressRef.current);
        }
      }, stepDuration);

      // Wait for the message duration then mark complete and move on
      setTimeout(() => {
        setCompletedLines((prev) => [...prev, lineIndex]);
        lineIndex++;
        runNextLine();
      }, BOOT_MESSAGES[lineIndex].duration + BOOT_MESSAGES[lineIndex].text.length * 28);
    };

    // Small initial delay before starting
    const startTimer = setTimeout(runNextLine, 400);
    return () => {
      clearTimeout(startTimer);
      if (progressRef.current) clearInterval(progressRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRun]);

  // Don't render anything if disabled or completed
  if (!shouldRun || hidden) return null;

  return (
    <div
      role="status"
      aria-label="System boot sequence loading"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Scanline overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />

      {/* Animated grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff04 1px, transparent 1px), linear-gradient(to bottom, #ffffff04 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'gridmove 8s linear infinite',
        }}
      />

      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600/8 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-[100px]" />

      {/* Boot panel */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 sm:px-8">

        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded border border-cyan-500/20 bg-cyan-950/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.4em] text-cyan-500 uppercase">System Boot v2.0</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.4))',
            }}
          >
            OMM <span className="text-zinc-500 font-thin">//</span> AI
          </h1>
        </div>

        {/* Terminal window */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.06)]">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 bg-black/40">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/70" />
            <span className="ml-2 text-[10px] font-mono tracking-widest text-zinc-600">OMM//AI — BOOT_SEQUENCE.sh</span>
          </div>

          {/* Terminal content */}
          <div className="p-5 sm:p-6 space-y-2.5 min-h-[200px]">
            <div className="text-[10px] font-mono text-zinc-600 tracking-widest mb-4">
              root@omm-ai:~$ ./boot_sequence.sh
            </div>
            {BOOT_MESSAGES.map((msg, i) => (
              <BootLine
                key={i}
                message={msg.text}
                active={currentLine === i && !completedLines.includes(i)}
                done={completedLines.includes(i)}
                accent={msg.accent}
              />
            ))}

            {/* SYSTEM READY */}
            {showReady && (
              <div className="pt-3 mt-3 border-t border-zinc-800/60">
                <div className="text-sm font-mono font-bold tracking-[0.4em] text-cyan-400"
                  style={{ textShadow: '0 0 20px rgba(34,211,238,0.8)' }}
                >
                  ▶ SYSTEM READY
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono tracking-widest text-zinc-600">BOOT PROGRESS</span>
            <span className="text-[10px] font-mono text-cyan-500">{progress}%</span>
          </div>
          <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #3b82f6, #22d3ee)',
                boxShadow: '0 0 10px rgba(34,211,238,0.6)',
              }}
            />
          </div>
          {/* Tick marks */}
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map((tick) => (
              <span
                key={tick}
                className={`text-[8px] font-mono transition-colors duration-300 ${
                  progress >= tick ? 'text-cyan-600' : 'text-zinc-800'
                }`}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom status */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-zinc-700">
            OMM//AI OPERATING SYSTEM
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-700">
            v2.0.1-prod
          </span>
        </div>
      </div>
    </div>
  );
}
