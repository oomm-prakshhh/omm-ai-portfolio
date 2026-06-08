'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────
const TYPING_SPEED  = 12;   // ms per character
const LINE_PAUSE    = 25;   // ms between lines
const PROMPT        = 'omm@ai:~$';
const SESSION_KEY   = 'omm-terminal-v3';

const ALL_COMMANDS = [
  'help','whoami','pwd','ls','date','uname','cat profile.txt',
  'projects','skills','mission','contact','builds','profile',
  'capabilities','timeline','github','linkedin','resume',
  'version','system-status','clear',
  'sudo reveal-secret','hack nasa','coffee','matrix',
  'open portfolio','open jarvis','open chatbot',
];

const QUICK_COMMANDS = ['help','whoami','skills','system-status','ls','date','matrix','coffee'];

// ── Types ─────────────────────────────────────────────────────────────────────
type LineType   = 'input'|'output'|'error'|'success'|'accent'|'empty'|'matrix';
type OutputLine = { type: LineType; text: string; instant?: boolean };
type CmdResult  = { lines: OutputLine[]; effect?: () => void };

// ── Client-safe helpers ───────────────────────────────────────────────────────
function clientScroll(id: string) {
  if (typeof window === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function clientOpen(url: string) {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
function getDate() {
  return new Date().toLocaleString('en-IN', {
    weekday:'short', year:'numeric', month:'short', day:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
  });
}

// ── Matrix line generator (only called on user interaction) ───────────────────
function makeMatrixLines(): OutputLine[] {
  const pool = '01アイウエカキクケコサシスセタチツナニヌネノハヒフヘホ▓░▒█│┼╬╫◈◉◊';
  return Array.from({ length: 15 }, () => {
    const len = 44 + Math.floor(Math.random() * 18);
    let row = '  ';
    for (let j = 0; j < len; j++) row += pool[Math.floor(Math.random() * pool.length)];
    return { type: 'matrix' as LineType, text: row, instant: true };
  });
}

// ── Command processor ─────────────────────────────────────────────────────────
function processCommand(raw: string): CmdResult {
  const cmd = raw.trim().toLowerCase();

  switch (cmd) {

    case 'help': return { lines: [
      { type:'accent',  text:'╔════════════════════════════════════════╗' },
      { type:'accent',  text:'║      OMM//AI  COMMAND  REGISTRY        ║' },
      { type:'accent',  text:'╚════════════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'success', text:'  SYSTEM COMMANDS' },
      { type:'output',  text:'  pwd · ls · date · uname · clear · version' },
      { type:'output',  text:'  cat profile.txt · system-status' },
      { type:'empty',   text:'' },
      { type:'success', text:'  INFORMATION' },
      { type:'output',  text:'  whoami · skills · mission · profile' },
      { type:'output',  text:'  timeline · capabilities · projects' },
      { type:'empty',   text:'' },
      { type:'success', text:'  NAVIGATION' },
      { type:'output',  text:'  builds · contact · github · linkedin · resume' },
      { type:'output',  text:'  open portfolio · open jarvis · open chatbot' },
      { type:'empty',   text:'' },
      { type:'success', text:'  EASTER EGGS  🥚' },
      { type:'output',  text:'  sudo reveal-secret · hack nasa · coffee · matrix' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  TAB autocomplete  ↑↓ history  ENTER run' },
      { type:'empty',   text:'' },
    ]};

    case 'whoami': return { lines: [
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ██████  ███    ███  ███    ███' },
      { type:'accent',  text:'  ██  ██  ████  ████  ████  ████' },
      { type:'accent',  text:'  ██  ██  ██ ████ ██  ██ ████ ██' },
      { type:'accent',  text:'  ██████  ██  ██  ██  ██  ██  ██' },
      { type:'empty',   text:'' },
      { type:'success', text:'  NAME    →  Omm Prakash Sahoo' },
      { type:'success', text:'  ROLE    →  AI & Web Developer' },
      { type:'output',  text:'  STATUS  →  ● SYSTEMS ONLINE' },
      { type:'output',  text:'  BASE    →  Odisha, India' },
      { type:'output',  text:'  FOCUS   →  Intelligent Systems & Immersive UX' },
      { type:'output',  text:'  CLASS   →  Computer Science Student' },
      { type:'empty',   text:'' },
    ]};

    case 'pwd': return { lines: [
      { type:'output', text:'  /home/omm/portfolio' },
    ]};

    case 'ls': return { lines: [
      { type:'empty',   text:'' },
      { type:'success', text:'  📁  projects/    📁  builds/    📁  skills/' },
      { type:'output',  text:'  📄  profile.txt  📄  skills.log 📄  mission.txt' },
      { type:'output',  text:'  📄  resume.pdf   📄  contact.json' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Tip: cat profile.txt' },
      { type:'empty',   text:'' },
    ]};

    case 'date': return { lines: [
      { type:'output', text:`  ${getDate()}` },
      { type:'accent', text:'  IST (UTC+5:30) | OMM//AI System Clock' },
    ]};

    case 'uname': return { lines: [
      { type:'output', text:'  OMM//AI OS v2.0.1-prod' },
      { type:'output', text:'  Kernel: OMM-AI-CORE/2.0.1' },
      { type:'output', text:'  Arch:   WebAssembly / JavaScript / AI' },
      { type:'output', text:'  Build:  Next.js 16 · React 19 · Three.js' },
    ]};

    case 'cat profile.txt': return { lines: [
      { type:'accent',  text:'  ╔══ /home/omm/profile.txt ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  PROFILE_ID  →  OPS-2004-AI' },
      { type:'output',  text:'  NAME        →  Omm Prakash Sahoo' },
      { type:'output',  text:'  ROLE        →  AI & Web Developer' },
      { type:'output',  text:'  LOCATION    →  Odisha, India' },
      { type:'output',  text:'  EMAIL       →  ommprakashs648@gmail.com' },
      { type:'output',  text:'  GITHUB      →  github.com/oomm-prakshhh' },
      { type:'empty',   text:'' },
      { type:'success', text:'  EXPERTISE' },
      { type:'output',  text:'  → AI/ML Systems Development' },
      { type:'output',  text:'  → Full Stack Web Development' },
      { type:'output',  text:'  → 3D Graphics & WebGL (Three.js)' },
      { type:'output',  text:'  → Immersive UI/UX Engineering' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ╚══════════════════════════╝' },
    ]};

    case 'skills': return { lines: [
      { type:'accent',  text:'╔══ TECHNICAL STACK ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  AI & ML' },
      { type:'output',  text:'  Python · AI APIs · Speech Recognition · NLP' },
      { type:'empty',   text:'' },
      { type:'success', text:'  FRONTEND' },
      { type:'output',  text:'  JS · TS · React · Next.js · Three.js · GSAP' },
      { type:'empty',   text:'' },
      { type:'success', text:'  BACKEND & TOOLS' },
      { type:'output',  text:'  Node.js · Git · GitHub · Vercel' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚═════════════════════╝' },
    ]};

    case 'mission': return { lines: [
      { type:'accent',  text:'╔══ CORE DIRECTIVES ══╗' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  To engineer intelligent systems that bridge' },
      { type:'output',  text:'  the gap between human intent and machine' },
      { type:'output',  text:'  capability — creating experiences that feel' },
      { type:'output',  text:'  alive, immersive, and purposeful.' },
      { type:'empty',   text:'' },
      { type:'success', text:'  01 → Build AI-powered applications' },
      { type:'success', text:'  02 → Create immersive web experiences' },
      { type:'success', text:'  03 → Advance human-computer interaction' },
      { type:'success', text:'  04 → Continuously evolve & learn' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚══════════════════════╝' },
    ]};

    case 'projects': return { lines: [
      { type:'accent',  text:'╔══ PROJECT MANIFEST ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [01] JARVIS AI ASSISTANT' },
      { type:'output',  text:'       Python · Speech Recognition · AI APIs' },
      { type:'output',  text:'       Status: ● DEPLOYED  →  open jarvis' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [02] AI CHATBOT PLATFORM' },
      { type:'output',  text:'       React · Node.js · AI APIs' },
      { type:'output',  text:'       Status: ● IN DEV    →  open chatbot' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [03] 3D PORTFOLIO SYSTEM' },
      { type:'output',  text:'       Next.js · Three.js · React Three Fiber' },
      { type:'output',  text:'       Status: ● ONLINE    →  open portfolio' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚═══════════════════════╝' },
    ]};

    case 'builds': return {
      lines: [
        { type:'accent', text:'  [Navigating to System Builds...]' },
        { type:'output', text:'  Try: open portfolio · open jarvis · open chatbot' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open portfolio': return {
      lines: [
        { type:'success', text:'  ● Accessing: 3D Portfolio System' },
        { type:'output',  text:'  Stack: Next.js · Three.js · React Three Fiber' },
        { type:'output',  text:'  Status: ● ONLINE  v2.0.1-prod' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open jarvis': return {
      lines: [
        { type:'success', text:'  ● Accessing: JARVIS AI Assistant' },
        { type:'output',  text:'  Stack: Python · Speech Recognition · AI APIs' },
        { type:'output',  text:'  Status: ● DEPLOYED  v1.2.0-stable' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open chatbot': return {
      lines: [
        { type:'success', text:'  ● Accessing: AI Chatbot Platform' },
        { type:'output',  text:'  Stack: React · Node.js · AI APIs' },
        { type:'output',  text:'  Status: ● IN DEVELOPMENT  v0.8.5-dev' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'contact': return {
      lines: [
        { type:'accent',  text:'╔══ COMMUNICATION NODES ══╗' },
        { type:'empty',   text:'' },
        { type:'success', text:'  EMAIL    →  ommprakashs648@gmail.com' },
        { type:'success', text:'  GITHUB   →  github.com/oomm-prakshhh' },
        { type:'success', text:'  LINKEDIN →  linkedin.com/in/omm-prakash-sahoo' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Response time: <24h' },
        { type:'accent',  text:'  [Navigating to Contact...]' },
      ],
      effect: () => setTimeout(() => clientScroll('contact'), 200),
    };

    case 'profile': return {
      lines: [
        { type:'accent', text:'  [Navigating to Developer Profile...]' },
        { type:'output', text:'  Tip: cat profile.txt for full details.' },
      ],
      effect: () => setTimeout(() => clientScroll('about'), 200),
    };

    case 'capabilities': return { lines: [
      { type:'accent',  text:'╔══ SYSTEM CAPABILITIES ══╗' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  [████████████] AI Development    98%' },
      { type:'output',  text:'  [███████████░] Frontend Dev      94%' },
      { type:'output',  text:'  [██████████░░] 3D / WebGL        88%' },
      { type:'output',  text:'  [█████████░░░] Backend Systems   82%' },
      { type:'output',  text:'  [████████░░░░] DevOps & Cloud    75%' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚══════════════════════════╝' },
    ]};

    case 'timeline': return { lines: [
      { type:'accent',  text:'╔══ SYSTEM HISTORY LOG ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  2022  →  First line of code' },
      { type:'output',  text:'         Python · algorithms' },
      { type:'success', text:'  2023  →  Web development' },
      { type:'output',  text:'         HTML · CSS · JavaScript' },
      { type:'success', text:'  2024  →  React & Next.js' },
      { type:'output',  text:'         Full-stack apps built' },
      { type:'success', text:'  2025  →  AI integration' },
      { type:'output',  text:'         JARVIS AI launched' },
      { type:'success', text:'  2026  →  OMM//AI PORTFOLIO ◈' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚════════════════════════╝' },
    ]};

    case 'system-status': return { lines: [
      { type:'accent',  text:'╔══ SYSTEM DIAGNOSTICS ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  AI CORE         ●  ACTIVE' },
      { type:'success', text:'  NEURAL MODULES  ●  LOADED' },
      { type:'success', text:'  NETWORK         ●  STABLE' },
      { type:'success', text:'  SECURITY        ●  VERIFIED' },
      { type:'success', text:'  DATA STREAMS    ●  CONNECTED' },
      { type:'success', text:'  UPTIME          ●  99.9%' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  OS      →  OMM//AI v2.0.1-prod' },
      { type:'output',  text:'  RUNTIME →  Next.js 16 · React 19 · Three.js' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚════════════════════════╝' },
    ]};

    case 'version': return { lines: [
      { type:'accent',  text:'  OMM//AI OPERATING SYSTEM' },
      { type:'output',  text:'  Version  →  2.0.1-prod' },
      { type:'output',  text:'  Build    →  2026.06' },
      { type:'output',  text:'  Runtime  →  Next.js 16.2.2 · React 19' },
      { type:'output',  text:'  Renderer →  Three.js · React Three Fiber' },
      { type:'output',  text:'  Host     →  Vercel Edge Network' },
    ]};

    case 'github': return {
      lines: [
        { type:'success', text:'  Connecting to GitHub...' },
        { type:'output',  text:'  Repo: github.com/oomm-prakshhh' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://github.com/oomm-prakshhh'), 200),
    };

    case 'linkedin': return {
      lines: [
        { type:'success', text:'  Connecting to LinkedIn...' },
        { type:'output',  text:'  Profile: linkedin.com/in/omm-prakash-sahoo' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/'), 200),
    };

    case 'resume': return { lines: [
      { type:'output', text:'  Resume module initializing...' },
      { type:'error',  text:'  [404] Not yet deployed to CDN.' },
      { type:'output', text:'  Contact: ommprakashs648@gmail.com' },
    ]};

    case 'clear': return { lines: [{ type:'empty', text:'__CLEAR__' }] };

    // ── Easter eggs ──────────────────────────────────────────────────────────
    case 'sudo reveal-secret':
    case 'sudo': return { lines: [
      { type:'output',  text:'  [SUDO] Escalating privileges...' },
      { type:'empty',   text:'' },
      { type:'success', text:'  ACCESS GRANTED' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ⚠  CLASSIFIED INTEL UNLOCKED  ⚠' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  "The best AI is curiosity."' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  More precisely: "The best code makes someone' },
      { type:'output',  text:'   feel something — wonder, delight, or that' },
      { type:'output',  text:'   quiet satisfaction of a system working' },
      { type:'output',  text:'   exactly as intended."' },
      { type:'empty',   text:'' },
      { type:'success', text:'              — Omm Prakash Sahoo' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  You found the easter egg. Welcome 🌀' },
    ]};

    case 'hack nasa': return { lines: [
      { type:'output', text:'  Locating nasa.gov servers...' },
      { type:'output', text:'  Bypassing firewall layer 1...' },
      { type:'output', text:'  Bypassing firewall layer 2...' },
      { type:'empty',  text:'' },
      { type:'error',  text:'  ██  ACCESS DENIED  ██' },
      { type:'error',  text:'  Intrusion attempt logged.' },
      { type:'error',  text:'  FBI notified. (Just kidding 😎)' },
      { type:'empty',  text:'' },
      { type:'accent', text:'  Nice try. Build cool things instead 🚀' },
    ]};

    case 'coffee': return { lines: [
      { type:'output',  text:'  ☕  Brewing system coffee...' },
      { type:'output',  text:'  ████████████████  100%' },
      { type:'empty',   text:'' },
      { type:'success', text:'  ☕ System energy restored +100' },
      { type:'accent',  text:'  AI running at peak capacity.' },
      { type:'output',  text:'  Fun fact: This portfolio runs on coffee & code.' },
    ]};

    case 'matrix': {
      const matLines = makeMatrixLines();
      return { lines: [
        { type:'empty',   text:'' },
        ...matLines,
        { type:'empty',   text:'' },
        { type:'accent',  text:'  Wake up, Neo...', instant: true },
        { type:'accent',  text:'  Follow the cyan rabbit. 🐇', instant: true },
        { type:'success', text:'  The Matrix has you.', instant: true },
        { type:'empty',   text:'' },
      ]};
    }

    case '': return { lines: [] };

    default: {
      if (cmd.startsWith('open ')) {
        return { lines: [
          { type:'error',  text:`  open: project not found: "${cmd.slice(5)}"` },
          { type:'output', text:'  Try: open portfolio · open jarvis · open chatbot' },
        ]};
      }
      if (cmd.startsWith('cat ')) {
        return { lines: [
          { type:'error',  text:`  cat: ${cmd.slice(4)}: No such file` },
          { type:'output', text:'  Available: profile.txt  →  cat profile.txt' },
        ]};
      }
      return { lines: [
        { type:'error',  text:`  command not found: ${raw.trim()}` },
        { type:'output', text:'  Type "help" for all commands.' },
        { type:'output', text:'  Press TAB to autocomplete.' },
      ]};
    }
  }
}

// ── Terminal line renderer ────────────────────────────────────────────────────
function TerminalLine({ line, isTyping }: { line: OutputLine; isTyping?: boolean }) {
  const cls: Record<string, string> = {
    input:   'text-white',
    output:  'text-zinc-400',
    error:   'text-red-400',
    success: 'text-emerald-400',
    accent:  'text-cyan-400',
    empty:   'h-[4px]',
    matrix:  'text-cyan-500',
  };
  const glow: Partial<Record<string, React.CSSProperties>> = {
    accent:  { textShadow: '0 0 8px rgba(34,211,238,0.45)' },
    matrix:  { textShadow: '0 0 5px rgba(34,211,238,0.55)', opacity: 0.75 },
    success: { textShadow: '0 0 6px rgba(52,211,153,0.3)' },
  };
  return (
    <div
      className={`font-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-words ${cls[line.type] ?? 'text-zinc-400'}`}
      style={glow[line.type]}
    >
      {line.text}
      {isTyping && (
        <span
          className="inline-block w-[6px] h-[11px] bg-cyan-400 ml-0.5 align-middle"
          style={{ animation: 'blink 0.8s step-end infinite' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TerminalSection() {
  const [history,    setHistory   ] = useState<OutputLine[]>([]);
  const [typingLine, setTypingLine] = useState<OutputLine | null>(null);
  const [input,      setInput     ] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [visible,    setVisible   ] = useState(false);
  const [booted,     setBooted    ] = useState(false);

  const histIdxRef      = useRef(-1);
  const outputRef       = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const sectionRef      = useRef<HTMLElement>(null);
  const pendingRef      = useRef<OutputLine[]>([]);
  const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef       = useRef(false);
  const onCompleteRef   = useRef<(() => void) | null>(null);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history, typingLine]);

  // ── Viewport observer ─────────────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Typing engine — processes pendingRef queue ────────────────────────────
  const processQueue = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const tick = () => {
      const next = pendingRef.current.shift();
      if (!next) {
        activeRef.current = false;
        setTypingLine(null);
        const cb = onCompleteRef.current;
        onCompleteRef.current = null;
        if (cb) cb();
        return;
      }

      // Instant lines (empty, matrix, instant-flagged)
      if (next.instant || next.type === 'empty' || !next.text) {
        setHistory(prev => [...prev, next]);
        timerRef.current = setTimeout(tick, next.instant ? 40 : LINE_PAUSE);
        return;
      }

      // Character-by-character typing
      let i = 0;
      const typeChar = () => {
        i++;
        setTypingLine({ type: next.type, text: next.text.slice(0, i) });
        if (i < next.text.length) {
          timerRef.current = setTimeout(typeChar, TYPING_SPEED);
        } else {
          setHistory(prev => [...prev, next]);
          setTypingLine(null);
          timerRef.current = setTimeout(tick, LINE_PAUSE);
        }
      };
      typeChar();
    };

    tick();
  }, []);

  // ── Flush — skip typing, commit all pending instantly ─────────────────────
  const flushTyping = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    activeRef.current     = false;
    onCompleteRef.current = null;
    const rem = [...pendingRef.current];
    pendingRef.current = [];
    if (rem.length) setHistory(prev => [...prev, ...rem]);
    setTypingLine(null);
  }, []);

  // ── Core command runner ───────────────────────────────────────────────────
  const runCmd = useCallback((raw: string) => {
    flushTyping();
    const trimmed = raw.trim();
    const echo: OutputLine = { type: 'input', text: `${PROMPT} ${trimmed}` };
    const { lines, effect } = processCommand(trimmed);

    if (lines[0]?.text === '__CLEAR__') { setHistory([]); return; }

    setHistory(prev => [...prev, echo]);
    if (trimmed) {
      setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
      histIdxRef.current = -1;
    }
    pendingRef.current = [...lines];
    processQueue();
    if (effect) effect();
  }, [flushTyping, processQueue]);

  // ── Execute from input ────────────────────────────────────────────────────
  const executeInput = useCallback(() => {
    const val = input;
    setInput('');
    histIdxRef.current = -1;
    runCmd(val);
  }, [input, runCmd]);

  // ── Session-aware startup sequence ────────────────────────────────────────
  useEffect(() => {
    if (!visible || booted) return;
    setBooted(true);

    const alreadyStarted = (() => {
      try { return !!sessionStorage.getItem(SESSION_KEY); } catch { return false; }
    })();

    if (alreadyStarted) {
      setHistory([
        { type:'accent',  text:'╔═══════════════════════════════════════════╗' },
        { type:'accent',  text:'║          OMM//AI  TERMINAL v2.0           ║' },
        { type:'accent',  text:'╚═══════════════════════════════════════════╝' },
        { type:'empty',   text:'' },
        { type:'success', text:'  ● SESSION RESTORED — terminal ready.' },
        { type:'output',  text:'  Type "help" for available commands.' },
        { type:'empty',   text:'' },
      ]);
      return;
    }

    try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch {}

    const startup: OutputLine[] = [
      { type:'accent',  text:'╔═══════════════════════════════════════════╗' },
      { type:'accent',  text:'║          OMM//AI  TERMINAL v2.0           ║' },
      { type:'accent',  text:'╚═══════════════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'input',   text:'root@omm-ai:~$ ./init_terminal.sh' },
      { type:'output',  text:'booting terminal interface...' },
      { type:'output',  text:'loading user profile...' },
      { type:'output',  text:'verifying access credentials...' },
      { type:'output',  text:'syncing system data...' },
      { type:'empty',   text:'' },
      { type:'success', text:'● terminal ready.' },
      { type:'empty',   text:'' },
    ];

    // After startup completes → auto-run help
    onCompleteRef.current = () => {
      const echo: OutputLine = { type: 'input', text: `${PROMPT} help` };
      const { lines } = processCommand('help');
      setHistory(prev => [...prev, echo]);
      pendingRef.current = [...lines];
      processQueue();
    };

    pendingRef.current = [...startup];
    processQueue();
  }, [visible, booted, processQueue]);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeInput();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdxRef.current + 1, cmdHistory.length - 1);
      histIdxRef.current = next;
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = next;
      setInput(next === -1 ? '' : (cmdHistory[next] ?? ''));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const lower = input.toLowerCase().trim();
      if (!lower) return;
      const matches = ALL_COMMANDS.filter(c => c.startsWith(lower) && c !== lower);
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        flushTyping();
        const matchLines: OutputLine[] = [
          { type:'output', text:`  Matches for "${lower}":` },
          ...matches.map(m => ({ type:'accent' as LineType, text:`  → ${m}` })),
          { type:'empty',  text:'' },
        ];
        setHistory(prev => [...prev, ...matchLines]);
      }
    }
  }, [executeInput, input, cmdHistory, flushTyping]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-labelledby="terminal-heading"
      className="relative w-full bg-black overflow-hidden py-20 sm:py-28 border-t border-zinc-900"
    >
      {/* Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`mb-10 sm:mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 mb-4">
            {'// TERMINAL_INTERFACE'}
          </p>
          <h2 id="terminal-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Interactive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              OS Terminal.
            </span>
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-px bg-cyan-500/50 shrink-0" />
            <p className="text-sm sm:text-lg text-zinc-400 max-w-xl">
              Fully functional CLI.{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">help</code>{' '}
              lists commands &bull;{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">TAB</code>{' '}
              autocompletes.
            </p>
          </div>
        </div>

        {/* Terminal window */}
        <div
          className={`rounded-xl overflow-hidden border border-zinc-800 transition-all duration-700 ease-out delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ boxShadow: '0 0 80px rgba(34,211,238,0.07), inset 0 0 40px rgba(34,211,238,0.02)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-cyan-400/80" />
            </div>
            <div className="flex-1 flex justify-center min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-zinc-600 select-none truncate">
                omm@ai:~/portfolio — TERMINAL_INTERFACE v2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-600 tracking-wider select-none">LIVE</span>
            </div>
          </div>

          {/* Scanlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-b-xl"
            style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)' }}
          />

          {/* Output */}
          <div
            ref={outputRef}
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
            aria-relevant="additions"
            className="terminal-output relative bg-zinc-950/95 backdrop-blur-md px-4 sm:px-5 pt-4 pb-2 overflow-y-auto cursor-text"
            style={{ height: 'clamp(300px, 48vh, 460px)' }}
          >
            <div className="space-y-[2px]">
              {history.map((line, i) => (
                <TerminalLine key={i} line={line} />
              ))}
              {typingLine && <TerminalLine line={typingLine} isTyping />}
            </div>

            {/* Prompt row */}
            <div className="flex items-center gap-2 mt-2 mb-1">
              <span
                className="font-mono text-[11px] sm:text-xs text-cyan-400 shrink-0 select-none"
                style={{ textShadow:'0 0 8px rgba(34,211,238,0.6)' }}
                aria-hidden="true"
              >
                {PROMPT}
              </span>
              <input
                ref={inputRef}
                id="terminal-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Terminal command input — type a command and press Enter"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="flex-1 bg-transparent font-mono text-[11px] sm:text-xs text-white outline-none caret-transparent placeholder-zinc-700 min-w-0"
                placeholder="type a command..."
              />
              {/* Block cursor */}
              <span
                className="w-[7px] h-3.5 bg-cyan-400 shrink-0 select-none"
                aria-hidden="true"
                style={{ animation:'blink 1s step-end infinite' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-2 bg-zinc-950/90 border-t border-zinc-800/60 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono text-zinc-700 tracking-wider select-none">
              <span>↑↓ HISTORY</span>
              <span className="hidden sm:inline">TAB COMPLETE</span>
              <span>ENTER RUN</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono select-none">
              <span className="text-zinc-700">{cmdHistory.length} CMD{cmdHistory.length !== 1 ? 'S' : ''}</span>
              <span className="text-cyan-800">●</span>
              <span className="text-cyan-700">SECURE.SESSION</span>
            </div>
          </div>
        </div>

        {/* Quick command pills — horizontal scroll on mobile */}
        <div className={`mt-5 transition-all duration-700 ease-out delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-700 mb-3 select-none">
            QUICK COMMANDS →
          </p>
          <div className="quick-pills flex gap-2 overflow-x-auto pb-2">
            {QUICK_COMMANDS.map(qcmd => (
              <button
                key={qcmd}
                onClick={() => runCmd(qcmd)}
                aria-label={`Run: ${qcmd}`}
                className="shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs tracking-wider rounded-lg border border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-cyan-700/60 hover:text-cyan-400 hover:bg-cyan-950/20 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {qcmd}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Injected styles */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Custom cyan scrollbar */
        .terminal-output::-webkit-scrollbar { width: 6px; }
        .terminal-output::-webkit-scrollbar-track { background: transparent; border-radius: 3px; }
        .terminal-output::-webkit-scrollbar-thumb {
          background: rgba(34,211,238,0.18);
          border-radius: 3px;
        }
        .terminal-output::-webkit-scrollbar-thumb:hover {
          background: rgba(34,211,238,0.5);
          box-shadow: 0 0 8px rgba(34,211,238,0.4);
        }
        .terminal-output {
          scrollbar-width: thin;
          scrollbar-color: rgba(34,211,238,0.18) transparent;
        }

        /* Hide quick-pill scrollbar */
        .quick-pills::-webkit-scrollbar { display: none; }
        .quick-pills { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 640px) {
          .terminal-output::-webkit-scrollbar { width: 3px; }
        }
      `}</style>
    </section>
  );
}
