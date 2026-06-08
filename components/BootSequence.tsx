'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// ── Configuration ─────────────────────────────────────────────────────────────
// Set to false to completely disable the boot sequence
const BOOT_SEQUENCE_ENABLED = true;

// Session key — change value to force-replay for all users
const SESSION_KEY = 'omm-ai-boot-v2';

// Typing speed in ms per character
const TYPING_SPEED = 22;
// ──────────────────────────────────────────────────────────────────────────────

interface BootMsg {
  text: string;
  pauseAfter: number; // ms to wait after typing completes before moving to next
  targetProgress: number; // 0-100
}

const BOOT_MESSAGES: BootMsg[] = [
  { text: 'INITIALIZING OMM//AI CORE...',    pauseAfter: 180, targetProgress: 15  },
  { text: 'LOADING NEURAL MODULES...',        pauseAfter: 160, targetProgress: 30  },
  { text: 'VERIFYING SECURITY CLEARANCE...', pauseAfter: 220, targetProgress: 45  },
  { text: 'ESTABLISHING CONNECTION...',       pauseAfter: 160, targetProgress: 60  },
  { text: 'CHECKING SYSTEM STATUS...',        pauseAfter: 180, targetProgress: 75  },
  { text: 'CONNECTING TO DATA STREAMS...',   pauseAfter: 160, targetProgress: 90  },
  { text: 'ACCESS GRANTED',                   pauseAfter: 400, targetProgress: 100 },
];

// ── Typing hook ───────────────────────────────────────────────────────────────
function useTypingEffect(text: string, speed: number, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return { displayed, done };
}

// ── Single boot line ──────────────────────────────────────────────────────────
function BootLine({
  message, active, completed, isAccent,
}: {
  message: string; active: boolean; completed: boolean; isAccent: boolean;
}) {
  const { displayed, done } = useTypingEffect(message, TYPING_SPEED, active);
  const visible = active || completed;

  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] sm:text-xs leading-relaxed
        transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Status glyph */}
      <span
        className={`w-4 shrink-0 text-center transition-all duration-300
          ${completed
            ? isAccent ? 'text-cyan-300' : 'text-cyan-500'
            : 'text-zinc-600'
          }`}
        style={completed && isAccent
          ? { textShadow: '0 0 12px rgba(34,211,238,0.9)' }
          : completed
            ? { textShadow: '0 0 8px rgba(34,211,238,0.5)' }
            : {}}
      >
        {completed ? '✓' : active ? '›' : '·'}
      </span>

      {/* Text */}
      <span
        className={`transition-all duration-300 ${
          isAccent && completed
            ? 'text-cyan-300 font-bold tracking-[0.2em]'
            : completed
              ? 'text-zinc-200'
              : 'text-zinc-400'
        }`}
        style={isAccent && completed
          ? { textShadow: '0 0 16px rgba(34,211,238,0.6)' }
          : completed
            ? { textShadow: '0 0 6px rgba(34,211,238,0.2)' }
            : {}}
      >
        {active ? displayed : completed ? message : ''}
        {/* Blinking cursor while typing */}
        {active && !done && (
          <span
            className="inline-block w-[7px] h-[13px] bg-cyan-400 ml-0.5 align-middle"
            style={{ animation: 'blink 0.9s step-end infinite' }}
          />
        )}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BootSequence() {
  const [shouldRun,      setShouldRun     ] = useState(false);
  const [flicker,        setFlicker       ] = useState(false);
  const [currentLine,    setCurrentLine   ] = useState(-1);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [progress,       setProgress      ] = useState(0);
  const [showReady,      setShowReady     ] = useState(false);
  const [fadeOut,        setFadeOut       ] = useState(false);
  const [hidden,         setHidden        ] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const progressRef  = useRef(0);

  // Smooth progress animation using requestAnimationFrame
  const animateProgress = useCallback((target: number) => {
    const step = () => {
      const diff = target - progressRef.current;
      if (Math.abs(diff) < 0.3) {
        progressRef.current = target;
        setProgress(target);
        return;
      }
      progressRef.current += diff * 0.07;
      setProgress(Math.round(progressRef.current));
      animFrameRef.current = requestAnimationFrame(step);
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // ── Client-side gate ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!BOOT_SEQUENCE_ENABLED) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) setShouldRun(true);
    } catch { /* ignore */ }
  }, []);

  // ── Sequence orchestrator ──────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldRun) return;

    // Startup flicker
    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      setFlicker(f => !f);
      flickerCount++;
      if (flickerCount >= 5) clearInterval(flickerInterval);
    }, 80);

    let lineIndex = 0;
    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>(res => setTimeout(res, ms));

    const runSequence = async () => {
      await delay(500); // initial pause

      while (lineIndex < BOOT_MESSAGES.length && !cancelled) {
        const msg = BOOT_MESSAGES[lineIndex];
        setCurrentLine(lineIndex);
        animateProgress(msg.targetProgress);

        // Wait for typing to complete + pause after
        const typingDuration = msg.text.length * TYPING_SPEED;
        await delay(typingDuration + msg.pauseAfter);

        if (cancelled) break;
        setCompletedLines(prev => [...prev, lineIndex]);
        lineIndex++;
        await delay(90); // gap between lines
      }

      if (cancelled) return;

      // SYSTEM READY moment
      await delay(200);
      setShowReady(true);
      await delay(1100);

      // Fade out
      setFadeOut(true);
      await delay(900);
      setHidden(true);
      try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch { /* ignore */ }
    };

    runSequence();

    return () => {
      cancelled = true;
      clearInterval(flickerInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [shouldRun, animateProgress]);

  if (!shouldRun || hidden) return null;

  return (
    <>
      {/* Blink keyframe injected once */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes sweepline {
          0%   { transform: translateY(-8px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes boot-flicker {
          0%,100% { opacity: 1; }
          25%     { opacity: 0.85; }
          50%     { opacity: 0.92; }
          75%     { opacity: 0.78; }
        }
      `}</style>

      <div
        role="status"
        aria-label="OMM//AI system booting"
        aria-live="polite"
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black
          transition-opacity ease-in-out ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{
          transitionDuration: fadeOut ? '900ms' : '0ms',
          animation: flicker ? 'boot-flicker 0.08s ease-in-out' : 'none',
        }}
      >
        {/* ── Static scanlines ─────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
          }}
        />

        {/* ── Sweeping scanline ─────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.18), transparent)',
            animation: 'sweepline 5s linear infinite',
          }}
        />

        {/* ── Animated cyber grid ───────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right,#ffffff03 1px,transparent 1px),linear-gradient(to bottom,#ffffff03 1px,transparent 1px)',
            backgroundSize: '32px 32px',
            animation: 'gridmove 10s linear infinite',
          }}
        />

        {/* ── Ambient glows ────────────────────────────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/6 blur-[140px]" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-700/6 blur-[120px]" />

        {/* ── Boot panel ───────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-[600px] mx-auto px-4 sm:px-8">

          {/* Header branding */}
          <div className="mb-6 sm:mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-cyan-500 uppercase">
                System Boot v2.0
              </span>
            </div>
            <h1
              className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 45%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 24px rgba(34,211,238,0.45))',
              }}
            >
              {'OMM'}&nbsp;<span style={{ WebkitTextFillColor: '#52525b', fontWeight: 300 }}>{'//'}</span>&nbsp;{'AI'}
            </h1>
          </div>

          {/* Terminal window */}
          <div
            className="rounded-xl border border-zinc-800 bg-zinc-950/85 backdrop-blur-2xl overflow-hidden"
            style={{ boxShadow: '0 0 50px rgba(34,211,238,0.07), 0 0 120px rgba(59,130,246,0.04), inset 0 0 30px rgba(34,211,238,0.02)' }}
          >
            {/* macOS-style title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/80 bg-black/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80" />
              <span className="ml-3 text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-600 select-none">
                OMM//AI — BOOT_SEQUENCE.sh
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-4 sm:p-6 space-y-1.5">

              {/* Shell prompt */}
              <div className="text-[10px] sm:text-[11px] font-mono text-zinc-600 tracking-wide mb-3 select-none">
                <span className="text-cyan-700">root</span>
                <span className="text-zinc-700">@</span>
                <span className="text-blue-700">omm-ai</span>
                <span className="text-zinc-700">:~$ </span>
                <span className="text-zinc-500">./boot_sequence.sh</span>
              </div>

              {/* Boot lines */}
              {BOOT_MESSAGES.map((msg, i) => (
                <BootLine
                  key={i}
                  message={msg.text}
                  active={currentLine === i && !completedLines.includes(i)}
                  completed={completedLines.includes(i)}
                  isAccent={i === BOOT_MESSAGES.length - 1}
                />
              ))}

              {/* SYSTEM READY block */}
              {showReady && (
                <div
                  className="mt-4 pt-4 border-t border-zinc-800/60 space-y-1"
                  style={{ animation: 'fadeInUp 0.4s ease-out forwards' }}
                >
                  <div className="font-mono text-[10px] sm:text-[11px] text-zinc-700 tracking-widest select-none">
                    ================================
                  </div>
                  <div
                    className="font-mono text-sm sm:text-base font-bold tracking-[0.35em] text-cyan-300"
                    style={{ textShadow: '0 0 24px rgba(34,211,238,0.9), 0 0 48px rgba(34,211,238,0.4)' }}
                  >
                    SYSTEM READY
                  </div>
                  <div
                    className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-blue-400"
                    style={{ textShadow: '0 0 14px rgba(96,165,250,0.7)' }}
                  >
                    WELCOME TO OMM//AI
                  </div>
                  <div className="font-mono text-[10px] sm:text-[11px] text-zinc-700 tracking-widest select-none">
                    ================================
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 sm:mt-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-700">
                BOOT PROGRESS
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-cyan-600 tabular-nums">
                {progress}%
              </span>
            </div>

            {/* Track */}
            <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #2563eb, #06b6d4, #22d3ee)',
                  boxShadow: '0 0 12px rgba(34,211,238,0.65)',
                  transition: 'width 0.08s linear',
                }}
              />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-1">
              {[0, 15, 30, 45, 60, 75, 90, 100].map(tick => (
                <span
                  key={tick}
                  className={`text-[7px] font-mono tabular-nums transition-colors duration-300
                    ${progress >= tick ? 'text-cyan-700' : 'text-zinc-900'}`}
                >
                  {tick === 0 || tick === 100 ? tick : '|'}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-800 select-none">
              OMM//AI OPERATING SYSTEM
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-800 select-none">
              v2.0.1-prod
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
