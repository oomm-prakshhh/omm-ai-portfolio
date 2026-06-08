'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Command registry ──────────────────────────────────────────────────────────
const PROMPT = 'omm@ai:~$';

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'success' | 'accent' | 'divider' | 'empty';
  text: string;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function processCommand(raw: string): OutputLine[] {
  const cmd = raw.trim().toLowerCase();

  switch (cmd) {
    case 'help':
      return [
        { type: 'accent',   text: '╔══ OMM//AI COMMAND REGISTRY ══╗' },
        { type: 'empty',    text: '' },
        { type: 'success',  text: '  INFORMATION COMMANDS' },
        { type: 'output',   text: '  whoami          → Developer identity' },
        { type: 'output',   text: '  skills          → Technical stack' },
        { type: 'output',   text: '  projects        → Active builds' },
        { type: 'output',   text: '  mission         → Core directives' },
        { type: 'output',   text: '  profile         → Developer dossier' },
        { type: 'output',   text: '  timeline        → System history' },
        { type: 'output',   text: '  capabilities    → Skill categories' },
        { type: 'output',   text: '  version         → System version' },
        { type: 'output',   text: '  system-status   → Live system metrics' },
        { type: 'empty',    text: '' },
        { type: 'success',  text: '  NAVIGATION COMMANDS' },
        { type: 'output',   text: '  builds          → Scroll to System Builds' },
        { type: 'output',   text: '  contact         → Scroll to Contact' },
        { type: 'empty',    text: '' },
        { type: 'success',  text: '  EXTERNAL COMMANDS' },
        { type: 'output',   text: '  github          → Open GitHub repository' },
        { type: 'output',   text: '  linkedin        → Open LinkedIn profile' },
        { type: 'output',   text: '  resume          → View resume' },
        { type: 'empty',    text: '' },
        { type: 'success',  text: '  SYSTEM COMMANDS' },
        { type: 'output',   text: '  clear           → Clear terminal' },
        { type: 'output',   text: '  sudo *          → Escalate privileges 👁' },
        { type: 'empty',    text: '' },
        { type: 'accent',   text: '╚══════════════════════════════╝' },
      ];

    case 'whoami':
      return [
        { type: 'empty',   text: '' },
        { type: 'accent',  text: '  ██████  ███    ███  ███    ███' },
        { type: 'accent',  text: '  ██  ██  ████  ████  ████  ████' },
        { type: 'accent',  text: '  ██  ██  ██ ████ ██  ██ ████ ██' },
        { type: 'accent',  text: '  ██████  ██  ██  ██  ██  ██  ██' },
        { type: 'empty',   text: '' },
        { type: 'success', text: '  NAME     →  Omm Prakash Sahoo' },
        { type: 'success', text: '  ROLE     →  AI & Web Developer' },
        { type: 'output',  text: '  STATUS   →  SYSTEMS ONLINE' },
        { type: 'output',  text: '  BASE     →  Odisha, India' },
        { type: 'output',  text: '  FOCUS    →  Intelligent Systems & Immersive UX' },
        { type: 'output',  text: '  CLASS    →  Computer Science Student' },
        { type: 'empty',   text: '' },
      ];

    case 'skills':
      return [
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
      ];

    case 'projects':
    case 'builds':
      if (cmd === 'builds') {
        setTimeout(() => scrollToSection('builds'), 300);
      }
      return [
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
        { type: 'accent',  text: cmd === 'builds' ? '╚══ [Scrolling to Builds...]  ══╝' : '╚══════════════════════════╝' },
      ];

    case 'mission':
      return [
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
      ];

    case 'contact':
      setTimeout(() => scrollToSection('contact'), 300);
      return [
        { type: 'accent',  text: '╔══ COMMUNICATION NODES ══╗' },
        { type: 'empty',   text: '' },
        { type: 'success', text: '  EMAIL    →  ommprakashs648@gmail.com' },
        { type: 'success', text: '  GITHUB   →  github.com/oomm-prakshhh' },
        { type: 'success', text: '  LINKEDIN →  linkedin.com/in/omm-prakash-sahoo' },
        { type: 'empty',   text: '' },
        { type: 'output',  text: '  All nodes active. Response time: <24h' },
        { type: 'accent',  text: '╚═════════════════════════╝' },
        { type: 'output',  text: '  [Scrolling to Contact...]' },
      ];

    case 'profile':
      setTimeout(() => scrollToSection('about'), 300);
      return [
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
        { type: 'output',  text: '  [Scrolling to Profile...]' },
        { type: 'accent',  text: '╚═══════════════════════╝' },
      ];

    case 'capabilities':
      setTimeout(() => scrollToSection('capabilities'), 300);
      return [
        { type: 'accent',  text: '╔══ SYSTEM CAPABILITIES ══╗' },
        { type: 'empty',   text: '' },
        { type: 'success', text: '  CORE MODULES ACTIVE' },
        { type: 'output',  text: '  [████████████] AI Development    98%' },
        { type: 'output',  text: '  [███████████░] Frontend Dev      94%' },
        { type: 'output',  text: '  [██████████░░] 3D / WebGL        88%' },
        { type: 'output',  text: '  [█████████░░░] Backend Systems   82%' },
        { type: 'output',  text: '  [████████░░░░] DevOps & Cloud    75%' },
        { type: 'empty',   text: '' },
        { type: 'output',  text: '  [Scrolling to Capabilities...]' },
        { type: 'accent',  text: '╚══════════════════════════╝' },
      ];

    case 'timeline':
      setTimeout(() => scrollToSection('about'), 300);
      return [
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
        { type: 'output',  text: '  [Scrolling to Timeline...]' },
        { type: 'accent',  text: '╚════════════════════════╝' },
      ];

    case 'system-status':
      return [
        { type: 'accent',  text: '╔══ SYSTEM DIAGNOSTICS ══╗' },
        { type: 'empty',   text: '' },
        { type: 'success', text: '  AI CORE         ●  ACTIVE' },
        { type: 'success', text: '  NEURAL MODULES  ●  LOADED' },
        { type: 'success', text: '  NETWORK         ●  STABLE' },
        { type: 'success', text: '  SECURITY        ●  CLEARANCE VERIFIED' },
        { type: 'success', text: '  DATA STREAMS    ●  CONNECTED' },
        { type: 'success', text: '  UPTIME          ●  99.9%' },
        { type: 'empty',   text: '' },
        { type: 'output',  text: `  TIMESTAMP       →  ${new Date().toUTCString()}` },
        { type: 'output',  text: '  OS              →  OMM//AI v2.0.1-prod' },
        { type: 'output',  text: '  RUNTIME         →  Next.js 16 · React 19' },
        { type: 'output',  text: '  RENDERER        →  Three.js WebGL' },
        { type: 'empty',   text: '' },
        { type: 'accent',  text: '╚════════════════════════╝' },
      ];

    case 'version':
      return [
        { type: 'accent',  text: '  OMM//AI OPERATING SYSTEM' },
        { type: 'output',  text: '  Version    →  2.0.1-prod' },
        { type: 'output',  text: '  Build      →  2026.06' },
        { type: 'output',  text: '  Framework  →  Next.js 16.2.2 (Turbopack)' },
        { type: 'output',  text: '  Renderer   →  React Three Fiber · Three.js' },
        { type: 'output',  text: '  Deployed   →  Vercel Edge Network' },
        { type: 'output',  text: '  License    →  MIT · Personal Portfolio' },
      ];

    case 'github':
      setTimeout(() => window.open('https://github.com/oomm-prakshhh', '_blank'), 300);
      return [
        { type: 'success', text: '  Establishing connection to GitHub...' },
        { type: 'output',  text: '  Repository: github.com/oomm-prakshhh' },
        { type: 'accent',  text: '  ● Opening in new tab...' },
      ];

    case 'linkedin':
      setTimeout(() => window.open('https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/', '_blank'), 300);
      return [
        { type: 'success', text: '  Establishing connection to LinkedIn...' },
        { type: 'output',  text: '  Profile: linkedin.com/in/omm-prakash-sahoo' },
        { type: 'accent',  text: '  ● Opening in new tab...' },
      ];

    case 'resume':
      return [
        { type: 'output',  text: '  Resume module initializing...' },
        { type: 'error',   text: '  [404] Resume PDF not yet deployed to CDN.' },
        { type: 'output',  text: '  Contact ommprakashs648@gmail.com to request.' },
      ];

    case 'clear':
      return [{ type: 'empty', text: '__CLEAR__' }];

    case 'sudo reveal-secret':
    case 'sudo':
      return [
        { type: 'error',   text: '  [SUDO] Privilege escalation detected.' },
        { type: 'empty',   text: '' },
        { type: 'accent',  text: '  ⚠  CLASSIFIED INTEL UNLOCKED  ⚠' },
        { type: 'empty',   text: '' },
        { type: 'output',  text: '  "The best code is the code that makes' },
        { type: 'output',  text: '   someone feel something — wonder, delight,' },
        { type: 'output',  text: '   or that quiet satisfaction of a system' },
        { type: 'output',  text: '   working exactly as intended."' },
        { type: 'empty',   text: '' },
        { type: 'success', text: '                        — Omm Prakash Sahoo' },
        { type: 'empty',   text: '' },
        { type: 'accent',  text: '  You found the easter egg. Welcome to the core. 🌀' },
      ];

    case '':
      return [];

    default:
      return [
        { type: 'error',   text: `  command not found: ${raw.trim()}` },
        { type: 'output',  text: '  Type "help" to see available commands.' },
      ];
  }
}

// ── Terminal Line component ───────────────────────────────────────────────────
function TerminalLine({ line }: { line: OutputLine }) {
  const colors: Record<string, string> = {
    input:   'text-white',
    output:  'text-zinc-400',
    error:   'text-red-400',
    success: 'text-emerald-400',
    accent:  'text-cyan-400',
    divider: 'text-zinc-700',
    empty:   '',
  };
  return (
    <div
      className={`font-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-all ${colors[line.type] ?? 'text-zinc-400'}`}
      style={line.type === 'accent' ? { textShadow: '0 0 8px rgba(34,211,238,0.5)' } : {}}
    >
      {line.text}
    </div>
  );
}

// ── Main terminal section ─────────────────────────────────────────────────────
export default function TerminalSection() {
  const [history,    setHistory   ] = useState<OutputLine[]>([]);
  const [input,      setInput     ] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const histIdxRef = useRef(-1);
  const [visible,    setVisible   ] = useState(false);
  const [booted,     setBooted    ] = useState(false);

  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Viewport reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Boot animation — runs once when section comes into view
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

    let i = 0;
    const addLine = () => {
      if (i >= bootLines.length) return;
      setHistory(prev => [...prev, bootLines[i]]);
      i++;
      setTimeout(addLine, i < 4 ? 60 : 100);
    };
    setTimeout(addLine, 300);
  }, [visible, booted]);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const execute = useCallback(() => {
    const raw = input.trim();

    // Add to cmd history
    if (raw) {
      setCmdHistory(prev => [raw, ...prev.slice(0, 49)]);
    }
    histIdxRef.current = -1;
    setInput('');

    // Echo the prompt line
    const echo: OutputLine = { type: 'input', text: `${PROMPT} ${raw}` };

    const result = processCommand(raw);

    // Handle clear
    if (result[0]?.text === '__CLEAR__') {
      setHistory([]);
      return;
    }

    setHistory(prev => [...prev, echo, ...result]);
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      execute();
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
      // Simple autocomplete
      const commands = ['help','whoami','projects','skills','mission','contact','builds',
        'profile','capabilities','timeline','github','linkedin','resume','version',
        'system-status','clear','sudo reveal-secret'];
      const match = commands.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  }, [execute, input, cmdHistory]);

  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-labelledby="terminal-title"
      className="relative w-full bg-black overflow-hidden py-28 border-t border-zinc-900"
    >
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />

      {/* Animated grid */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className={`mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">
              {'// TERMINAL_INTERFACE'}
            </span>
          </div>
          <h2 id="terminal-title" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
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
          className={`rounded-xl overflow-hidden border border-zinc-800 transition-all duration-700 ease-out delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ boxShadow: '0 0 80px rgba(34,211,238,0.06), 0 0 200px rgba(59,130,246,0.04), inset 0 0 40px rgba(34,211,238,0.02)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-xl">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-default" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-default" />
            <div className="w-3 h-3 rounded-full bg-cyan-400/80 hover:bg-cyan-400 transition-colors cursor-default" />
            <div className="flex-1 flex justify-center">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-zinc-600 select-none">
                OMM//AI — TERMINAL_INTERFACE v2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-600 tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Scanline overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)',
              borderRadius: '0 0 12px 12px',
            }}
          />

          {/* Output area */}
          <div
            ref={outputRef}
            className="relative bg-zinc-950/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto space-y-0.5 cursor-text"
            style={{ height: '420px', maxHeight: '60vh' }}
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
          >
            {history.map((line, i) => (
              <TerminalLine key={i} line={line} />
            ))}

            {/* Input row */}
            <div className="flex items-center gap-2 pt-1">
              <span
                className="font-mono text-[11px] sm:text-xs text-cyan-400 shrink-0 select-none"
                style={{ textShadow: '0 0 8px rgba(34,211,238,0.6)' }}
              >
                {PROMPT}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="flex-1 bg-transparent font-mono text-[11px] sm:text-xs text-white outline-none caret-cyan-400 placeholder-zinc-700 min-w-0"
                placeholder="enter command..."
              />
              {/* Blinking cursor */}
              <span
                className="w-[7px] h-3.5 bg-cyan-400 shrink-0"
                aria-hidden="true"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            </div>
          </div>

          {/* Footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-zinc-950/90 border-t border-zinc-800/60 backdrop-blur-xl">
            <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-mono text-zinc-700 tracking-wider">
              <span>↑↓ HISTORY</span>
              <span>TAB AUTOCOMPLETE</span>
              <span>ENTER EXECUTE</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono tracking-wider">
              <span className="text-zinc-700">{cmdHistory.length} CMD{cmdHistory.length !== 1 ? 'S' : ''} RUN</span>
              <span className="text-cyan-600">SECURE.SESSION</span>
            </div>
          </div>
        </div>

        {/* Quick command pills */}
        <div className={`mt-6 transition-all duration-700 ease-out delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-700 mb-3">QUICK COMMANDS →</p>
          <div className="flex flex-wrap gap-2">
            {['help','whoami','skills','system-status','projects','sudo reveal-secret'].map(cmd => (
              <button
                key={cmd}
                onClick={() => { setInput(cmd); setTimeout(() => { setInput(''); execute(); }, 0);
                  // Execute directly
                  const echo: OutputLine = { type: 'input', text: `${PROMPT} ${cmd}` };
                  const result = processCommand(cmd);
                  if (result[0]?.text === '__CLEAR__') { setHistory([]); return; }
                  setHistory(prev => [...prev, echo, ...result]);
                  if (cmd) setCmdHistory(prev => [cmd, ...prev.slice(0, 49)]);
                }}
                className="px-3 py-1.5 font-mono text-[10px] sm:text-xs tracking-wider rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-cyan-700/60 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Injected keyframe for cursor blink */}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}
