'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Configuration ──────────────────────────────────────────────────────────────
const PROMPT = 'omm@ai:~$';

// Commands available for tab-autocomplete
const ALL_COMMANDS = [
  'help', 'whoami', 'projects', 'skills', 'mission', 'contact', 'builds',
  'profile', 'capabilities', 'timeline', 'github', 'linkedin', 'resume',
  'version', 'system-status', 'clear', 'sudo reveal-secret',
];

const QUICK_COMMANDS = ['help', 'whoami', 'skills', 'system-status', 'projects', 'sudo reveal-secret'];

// ── Types ─────────────────────────────────────────────────────────────────────
type OutputLine = {
  type: 'input' | 'output' | 'error' | 'success' | 'accent' | 'empty';
  text: string;
};

// ── Client-side only helpers (never called during SSR render) ─────────────────
function clientScrollTo(id: string) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clientOpen(url: string) {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ── Command processor — returns lines + optional side-effect callback ──────────
function processCommand(raw: string): { lines: OutputLine[]; effect?: () => void } {
  const cmd = raw.trim().toLowerCase();

  switch (cmd) {
    case 'help':
      return {
        lines: [
          { type: 'accent',  text: '╔══ OMM//AI COMMAND REGISTRY ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  INFORMATION COMMANDS' },
          { type: 'output',  text: '  whoami        → Developer identity' },
          { type: 'output',  text: '  skills        → Technical stack' },
          { type: 'output',  text: '  projects      → Active builds' },
          { type: 'output',  text: '  mission       → Core directives' },
          { type: 'output',  text: '  profile       → Developer dossier' },
          { type: 'output',  text: '  timeline      → System history' },
          { type: 'output',  text: '  capabilities  → Skill categories' },
          { type: 'output',  text: '  version       → System version' },
          { type: 'output',  text: '  system-status → Live system metrics' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  NAVIGATION COMMANDS' },
          { type: 'output',  text: '  builds        → Scroll to System Builds' },
          { type: 'output',  text: '  contact       → Scroll to Contact' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  EXTERNAL COMMANDS' },
          { type: 'output',  text: '  github        → Open GitHub repository' },
          { type: 'output',  text: '  linkedin      → Open LinkedIn profile' },
          { type: 'output',  text: '  resume        → View resume' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  SYSTEM COMMANDS' },
          { type: 'output',  text: '  clear         → Clear terminal' },
          { type: 'output',  text: '  sudo *        → Escalate privileges 👁' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '╚══════════════════════════════╝' },
        ],
      };

    case 'whoami':
      return {
        lines: [
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  ██████  ███    ███  ███    ███' },
          { type: 'accent',  text: '  ██  ██  ████  ████  ████  ████' },
          { type: 'accent',  text: '  ██  ██  ██ ████ ██  ██ ████ ██' },
          { type: 'accent',  text: '  ██████  ██  ██  ██  ██  ██  ██' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  NAME    →  Omm Prakash Sahoo' },
          { type: 'success', text: '  ROLE    →  AI & Web Developer' },
          { type: 'output',  text: '  STATUS  →  SYSTEMS ONLINE' },
          { type: 'output',  text: '  BASE    →  Odisha, India' },
          { type: 'output',  text: '  FOCUS   →  Intelligent Systems & Immersive UX' },
          { type: 'output',  text: '  CLASS   →  Computer Science Student' },
          { type: 'empty',   text: '' },
        ],
      };

    case 'skills':
      return {
        lines: [
          { type: 'accent',  text: '╔══ TECHNICAL STACK ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  AI & MACHINE LEARNING' },
          { type: 'output',  text: '  ▸ Python  ▸ AI APIs  ▸ Speech Recognition  ▸ NLP' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  WEB & FRONTEND' },
          { type: 'output',  text: '  ▸ JavaScript  ▸ TypeScript  ▸ React  ▸ Next.js' },
          { type: 'output',  text: '  ▸ Three.js  ▸ React Three Fiber  ▸ GSAP' },
          { type: 'output',  text: '  ▸ Tailwind CSS  ▸ HTML5  ▸ CSS3' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  BACKEND & TOOLS' },
          { type: 'output',  text: '  ▸ Node.js  ▸ Git  ▸ GitHub  ▸ Vercel' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '╚═════════════════════╝' },
        ],
      };

    case 'projects':
      return {
        lines: [
          { type: 'accent',  text: '╔══ ACTIVE SYSTEM BUILDS ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-01] JARVIS AI ASSISTANT' },
          { type: 'output',  text: '  Voice-controlled AI command interface' },
          { type: 'output',  text: '  Stack: Python · Speech Recognition · AI APIs' },
          { type: 'output',  text: '  Status: ● DEPLOYED  │  v1.2.0-stable' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-02] AI CHATBOT PLATFORM' },
          { type: 'output',  text: '  Real-time conversational AI system' },
          { type: 'output',  text: '  Stack: React · Node.js · JavaScript · AI APIs' },
          { type: 'output',  text: '  Status: ● IN DEVELOPMENT  │  v0.8.5-dev' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-03] 3D PORTFOLIO SYSTEM' },
          { type: 'output',  text: '  Immersive portfolio with 3D AI Core' },
          { type: 'output',  text: '  Stack: Next.js · React Three Fiber · GSAP' },
          { type: 'output',  text: '  Status: ● ONLINE  │  v2.0.1-prod' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '╚══════════════════════════╝' },
        ],
      };

    case 'builds':
      return {
        lines: [
          { type: 'accent',  text: '╔══ ACTIVE SYSTEM BUILDS ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-01] JARVIS AI ASSISTANT' },
          { type: 'output',  text: '  Voice-controlled AI command interface' },
          { type: 'output',  text: '  Stack: Python · Speech Recognition · AI APIs' },
          { type: 'output',  text: '  Status: ● DEPLOYED  │  v1.2.0-stable' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-02] AI CHATBOT PLATFORM' },
          { type: 'output',  text: '  Real-time conversational AI system' },
          { type: 'output',  text: '  Stack: React · Node.js · JavaScript · AI APIs' },
          { type: 'output',  text: '  Status: ● IN DEVELOPMENT  │  v0.8.5-dev' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  [BLD-03] 3D PORTFOLIO SYSTEM' },
          { type: 'output',  text: '  Immersive portfolio with 3D AI Core' },
          { type: 'output',  text: '  Stack: Next.js · React Three Fiber · GSAP' },
          { type: 'output',  text: '  Status: ● ONLINE  │  v2.0.1-prod' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  [Scrolling to Builds...]' },
        ],
        effect: () => setTimeout(() => clientScrollTo('builds'), 300),
      };

    case 'mission':
      return {
        lines: [
          { type: 'accent',  text: '╔══ CORE DIRECTIVES ══╗' },
          { type: 'empty',   text: '' },
          { type: 'output',  text: '  To engineer intelligent systems that bridge' },
          { type: 'output',  text: '  the gap between human intent and machine' },
          { type: 'output',  text: '  capability — creating experiences that feel' },
          { type: 'output',  text: '  alive, immersive, and purposeful.' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  PRIMARY OBJECTIVES' },
          { type: 'output',  text: '  01 → Build AI-powered applications' },
          { type: 'output',  text: '  02 → Create immersive web experiences' },
          { type: 'output',  text: '  03 → Advance human-computer interaction' },
          { type: 'output',  text: '  04 → Continuously evolve & learn' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '╚══════════════════════╝' },
        ],
      };

    case 'contact':
      return {
        lines: [
          { type: 'accent',  text: '╔══ COMMUNICATION NODES ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  EMAIL    →  ommprakashs648@gmail.com' },
          { type: 'success', text: '  GITHUB   →  github.com/oomm-prakshhh' },
          { type: 'success', text: '  LINKEDIN →  linkedin.com/in/omm-prakash-sahoo' },
          { type: 'empty',   text: '' },
          { type: 'output',  text: '  All nodes active. Response time: <24h' },
          { type: 'accent',  text: '  [Scrolling to Contact...]' },
        ],
        effect: () => setTimeout(() => clientScrollTo('contact'), 300),
      };

    case 'profile':
      return {
        lines: [
          { type: 'accent',  text: '╔══ DEVELOPER DOSSIER ══╗' },
          { type: 'empty',   text: '' },
          { type: 'output',  text: '  PROFILE_ID  →  OPS-2004-AI' },
          { type: 'output',  text: '  CLEARANCE   →  SYSTEM ARCHITECT' },
          { type: 'output',  text: '  STATUS      →  ● ONLINE' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  CLASSIFICATION TAGS' },
          { type: 'output',  text: '  #AI-Engineer  #Web-Developer' },
          { type: 'output',  text: '  #3D-Specialist  #CS-Student' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  [Scrolling to Profile...]' },
        ],
        effect: () => setTimeout(() => clientScrollTo('about'), 300),
      };

    case 'capabilities':
      return {
        lines: [
          { type: 'accent',  text: '╔══ SYSTEM CAPABILITIES ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  CORE MODULES ACTIVE' },
          { type: 'output',  text: '  [████████████] AI Development    98%' },
          { type: 'output',  text: '  [███████████░] Frontend Dev      94%' },
          { type: 'output',  text: '  [██████████░░] 3D / WebGL        88%' },
          { type: 'output',  text: '  [█████████░░░] Backend Systems   82%' },
          { type: 'output',  text: '  [████████░░░░] DevOps & Cloud    75%' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  [Scrolling to Capabilities...]' },
        ],
        effect: () => setTimeout(() => clientScrollTo('capabilities'), 300),
      };

    case 'timeline':
      return {
        lines: [
          { type: 'accent',  text: '╔══ SYSTEM HISTORY LOG ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  2022  →  First line of code written' },
          { type: 'output',  text: '         Python fundamentals & algorithms' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  2023  →  Web development initiated' },
          { type: 'output',  text: '         HTML · CSS · JavaScript mastered' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  2024  →  React & Next.js deployed' },
          { type: 'output',  text: '         Full-stack applications built' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  2025  →  AI integration milestone' },
          { type: 'output',  text: '         JARVIS AI Assistant launched' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  2026  →  OMM//AI PORTFOLIO ONLINE' },
          { type: 'accent',  text: '         This very moment ◈' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  [Scrolling to Timeline...]' },
        ],
        effect: () => setTimeout(() => clientScrollTo('about'), 300),
      };

    case 'system-status':
      return {
        lines: [
          { type: 'accent',  text: '╔══ SYSTEM DIAGNOSTICS ══╗' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '  AI CORE         ●  ACTIVE' },
          { type: 'success', text: '  NEURAL MODULES  ●  LOADED' },
          { type: 'success', text: '  NETWORK         ●  STABLE' },
          { type: 'success', text: '  SECURITY        ●  CLEARANCE VERIFIED' },
          { type: 'success', text: '  DATA STREAMS    ●  CONNECTED' },
          { type: 'success', text: '  UPTIME          ●  99.9%' },
          { type: 'empty',   text: '' },
          { type: 'output',  text: '  OS      →  OMM//AI v2.0.1-prod' },
          { type: 'output',  text: '  RUNTIME →  Next.js 16 · React 19' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '╚════════════════════════╝' },
        ],
      };

    case 'version':
      return {
        lines: [
          { type: 'accent',  text: '  OMM//AI OPERATING SYSTEM' },
          { type: 'output',  text: '  Version    →  2.0.1-prod' },
          { type: 'output',  text: '  Build      →  2026.06' },
          { type: 'output',  text: '  Framework  →  Next.js 16.2.2 (Turbopack)' },
          { type: 'output',  text: '  Renderer   →  React Three Fiber · Three.js' },
          { type: 'output',  text: '  Deployed   →  Vercel Edge Network' },
        ],
      };

    case 'github':
      return {
        lines: [
          { type: 'success', text: '  Establishing connection to GitHub...' },
          { type: 'output',  text: '  Repository: github.com/oomm-prakshhh' },
          { type: 'accent',  text: '  ● Opening in new tab...' },
        ],
        effect: () => setTimeout(() => clientOpen('https://github.com/oomm-prakshhh'), 200),
      };

    case 'linkedin':
      return {
        lines: [
          { type: 'success', text: '  Establishing connection to LinkedIn...' },
          { type: 'output',  text: '  Profile: linkedin.com/in/omm-prakash-sahoo' },
          { type: 'accent',  text: '  ● Opening in new tab...' },
        ],
        effect: () => setTimeout(() => clientOpen('https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/'), 200),
      };

    case 'resume':
      return {
        lines: [
          { type: 'output',  text: '  Resume module initializing...' },
          { type: 'error',   text: '  [404] Resume PDF not yet deployed to CDN.' },
          { type: 'output',  text: '  Contact ommprakashs648@gmail.com to request.' },
        ],
      };

    case 'clear':
      return { lines: [{ type: 'empty', text: '__CLEAR__' }] };

    case 'sudo reveal-secret':
    case 'sudo':
      return {
        lines: [
          { type: 'error',   text: '  [SUDO] Privilege escalation detected.' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  ⚠  CLASSIFIED INTEL UNLOCKED  ⚠' },
          { type: 'empty',   text: '' },
          { type: 'output',  text: '  "The best code is the code that makes' },
          { type: 'output',  text: '   someone feel something — wonder, delight,' },
          { type: 'output',  text: '   or that quiet satisfaction of a system' },
          { type: 'output',  text: '   working exactly as intended."' },
          { type: 'empty',   text: '' },
          { type: 'success', text: '                   — Omm Prakash Sahoo' },
          { type: 'empty',   text: '' },
          { type: 'accent',  text: '  You found the easter egg. Welcome to the core. 🌀' },
        ],
      };

    case '':
      return { lines: [] };

    default:
      return {
        lines: [
          { type: 'error',  text: `  command not found: ${raw.trim()}` },
          { type: 'output', text: '  Type "help" to see available commands.' },
        ],
      };
  }
}

// ── Terminal line renderer ────────────────────────────────────────────────────
function TerminalLine({ line }: { line: OutputLine }) {
  const colors: Record<string, string> = {
    input:   'text-white',
    output:  'text-zinc-400',
    error:   'text-red-400',
    success: 'text-emerald-400',
    accent:  'text-cyan-400',
    empty:   'h-1',
  };
  return (
    <div
      className={`font-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-words ${colors[line.type] ?? 'text-zinc-400'}`}
      style={line.type === 'accent' ? { textShadow: '0 0 8px rgba(34,211,238,0.45)' } : {}}
    >
      {line.text}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function TerminalSection() {
  const [history,    setHistory   ] = useState<OutputLine[]>([]);
  const [input,      setInput     ] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [visible,    setVisible   ] = useState(false);
  const [booted,     setBooted    ] = useState(false);

  const histIdxRef = useRef(-1);
  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Viewport reveal ────────────────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Boot animation — fires once when visible ───────────────────────────────
  useEffect(() => {
    if (!visible || booted) return;
    setBooted(true);

    const bootLines: OutputLine[] = [
      { type: 'accent',  text: '╔═══════════════════════════════════════════╗' },
      { type: 'accent',  text: '║          OMM//AI  TERMINAL v2.0           ║' },
      { type: 'accent',  text: '╚═══════════════════════════════════════════╝' },
      { type: 'empty',   text: '' },
      { type: 'output',  text: '  Booting OMM//AI Operating System...' },
      { type: 'output',  text: '  Loading neural modules.............. [OK]' },
      { type: 'output',  text: '  Verifying security clearance........ [OK]' },
      { type: 'output',  text: '  Establishing data streams........... [OK]' },
      { type: 'empty',   text: '' },
      { type: 'success', text: '  ● TERMINAL INTERFACE ONLINE' },
      { type: 'output',  text: '  Type "help" for available commands.' },
      { type: 'empty',   text: '' },
    ];

    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const addNext = () => {
      if (idx >= bootLines.length) return;
      setHistory(prev => [...prev, bootLines[idx]]);
      idx++;
      timer = setTimeout(addNext, idx < 4 ? 55 : 90);
    };
    timer = setTimeout(addNext, 300);
    return () => clearTimeout(timer);
  }, [visible, booted]);

  // ── Auto-scroll on new output ──────────────────────────────────────────────
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // ── Core command runner — takes a string, not dependent on input state ─────
  const runCmd = useCallback((raw: string) => {
    const trimmed = raw.trim();

    // Echo prompt line
    const echo: OutputLine = { type: 'input', text: `${PROMPT} ${trimmed}` };

    const { lines, effect } = processCommand(trimmed);

    // Handle clear
    if (lines[0]?.text === '__CLEAR__') {
      setHistory([]);
      return;
    }

    setHistory(prev => [...prev, echo, ...lines]);

    // Update command history
    if (trimmed) {
      setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
      histIdxRef.current = -1;
    }

    // Run any side-effect (scroll, window.open) safely after state update
    if (effect) effect();
  }, []);

  // ── Execute input field command ────────────────────────────────────────────
  const executeInput = useCallback(() => {
    const val = input;
    setInput('');
    histIdxRef.current = -1;
    runCmd(val);
  }, [input, runCmd]);

  // ── Keyboard handler ────────────────────────────────────────────────────────
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
      const match = ALL_COMMANDS.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
      if (match) setInput(match);
    }
  }, [executeInput, input, cmdHistory]);

  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-labelledby="terminal-heading"
      className="relative w-full bg-black overflow-hidden py-28 border-t border-zinc-900"
    >
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />

      {/* Cyber grid */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className={`mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">
              {'// TERMINAL_INTERFACE'}
            </span>
          </div>
          <h2 id="terminal-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Interactive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              OS Terminal.
            </span>
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-12 h-px bg-cyan-500/50" />
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl">
              A fully functional command-line interface. Type{' '}
              <code className="text-cyan-400 font-mono text-sm bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">help</code>{' '}
              to explore all commands.
            </p>
          </div>
        </div>

        {/* Terminal window */}
        <div
          className={`rounded-xl overflow-hidden border border-zinc-800 transition-all duration-700 ease-out delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ boxShadow: '0 0 80px rgba(34,211,238,0.06), inset 0 0 40px rgba(34,211,238,0.02)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-xl">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-cyan-400/80" />
            <div className="flex-1 flex justify-center">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-zinc-600 select-none">
                OMM//AI — TERMINAL_INTERFACE v2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-600 tracking-wider select-none">LIVE</span>
            </div>
          </div>

          {/* Scanlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-b-xl"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)' }}
          />

          {/* Output log */}
          <div
            ref={outputRef}
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
            aria-relevant="additions"
            className="relative bg-zinc-950/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto space-y-0.5 cursor-text"
            style={{ height: '420px', maxHeight: '60vh' }}
          >
            {history.map((line, i) => (
              <TerminalLine key={i} line={line} />
            ))}

            {/* Input row — always at the bottom of the log */}
            <div className="flex items-center gap-2 pt-1" aria-label="Command input row">
              <span
                className="font-mono text-[11px] sm:text-xs text-cyan-400 shrink-0 select-none"
                style={{ textShadow: '0 0 8px rgba(34,211,238,0.6)' }}
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
                className="flex-1 bg-transparent font-mono text-[11px] sm:text-xs text-white outline-none caret-cyan-400 placeholder-zinc-700 min-w-0"
                placeholder="enter command..."
              />
              <span
                className="w-[7px] h-3.5 bg-cyan-400 shrink-0 select-none"
                aria-hidden="true"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-zinc-950/90 border-t border-zinc-800/60 backdrop-blur-xl">
            <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-mono text-zinc-700 tracking-wider select-none">
              <span>↑↓ HISTORY</span>
              <span>TAB AUTOCOMPLETE</span>
              <span>ENTER EXECUTE</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono tracking-wider select-none">
              <span className="text-zinc-700">{cmdHistory.length} CMD{cmdHistory.length !== 1 ? 'S' : ''} RUN</span>
              <span className="text-cyan-700">SECURE.SESSION</span>
            </div>
          </div>
        </div>

        {/* Quick command pills */}
        <div className={`mt-6 transition-all duration-700 ease-out delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-700 mb-3 select-none">
            QUICK COMMANDS →
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMANDS.map(qcmd => (
              <button
                key={qcmd}
                onClick={() => runCmd(qcmd)}
                aria-label={`Run command: ${qcmd}`}
                className="px-3 py-1.5 font-mono text-[10px] sm:text-xs tracking-wider rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-cyan-700/60 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {qcmd}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Cursor blink keyframe */}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}
