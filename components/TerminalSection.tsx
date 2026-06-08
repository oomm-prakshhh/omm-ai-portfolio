'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────
const TYPING_SPEED = 12;
const LINE_PAUSE   = 25;
const SESSION_KEY  = 'omm-terminal-v3';
const HISTORY_KEY  = 'omm-cmd-history-v3';

// ── Virtual filesystem ────────────────────────────────────────────────────────
const FS: Record<string, { parent: string; dirs: string[]; files: string[] }> = {
  '~': {
    parent: '~',
    dirs:  ['projects', 'builds', 'skills'],
    files: ['profile.txt', 'mission.txt', 'skills.log', 'contact.json', 'resume.pdf'],
  },
  '~/projects': {
    parent: '~',
    dirs:  ['jarvis', 'portfolio', 'chatbot'],
    files: ['README.md'],
  },
  '~/builds': {
    parent: '~',
    dirs:  [],
    files: ['build.log', 'deploy.sh', 'vercel.json'],
  },
  '~/skills': {
    parent: '~',
    dirs:  [],
    files: ['ai.log', 'frontend.log', 'backend.log', 'tools.log'],
  },
  '~/projects/jarvis': {
    parent: '~/projects',
    dirs:  [],
    files: ['main.py', 'requirements.txt', 'config.json', 'README.md'],
  },
  '~/projects/portfolio': {
    parent: '~/projects',
    dirs:  ['components', 'app'],
    files: ['package.json', 'next.config.ts', 'README.md'],
  },
  '~/projects/chatbot': {
    parent: '~/projects',
    dirs:  [],
    files: ['index.js', 'server.js', 'config.json', 'README.md'],
  },
};

// Global commands always available regardless of cwd
const GLOBAL_COMMANDS = [
  'help','whoami','pwd','ls','date','uname','clear','version','system-status',
  'skills','mission','profile','timeline','capabilities','projects','builds',
  'contact','github','linkedin','resume','open resume','download resume',
  'open portfolio','open jarvis','open chatbot',
  'cat profile.txt','cat mission.txt','cat skills.log','cat contact.json',
  'sudo reveal-secret','hack nasa','coffee','matrix','cd ~','cd ..',
];

const QUICK_COMMANDS = ['help','whoami','ls','system-status','date','matrix','coffee'];

// ── Types ─────────────────────────────────────────────────────────────────────
type LineType   = 'input'|'output'|'error'|'success'|'accent'|'empty'|'matrix';
type OutputLine = { type: LineType; text: string; instant?: boolean };
type CmdResult  = { lines: OutputLine[]; effect?: () => void; newCwd?: string };

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

// ── Matrix lines ──────────────────────────────────────────────────────────────
function makeMatrixLines(): OutputLine[] {
  const pool = '01アイウエカキクケコサシスセタチツナニヌネノ▓░▒█│┼╬╫◈◉';
  return Array.from({ length: 15 }, () => {
    const len = 44 + Math.floor(Math.random() * 18);
    let row = '  ';
    for (let j = 0; j < len; j++) row += pool[Math.floor(Math.random() * pool.length)];
    return { type: 'matrix' as LineType, text: row, instant: true };
  });
}

// ── ls output (context-aware) ─────────────────────────────────────────────────
function getLsLines(cwd: string): OutputLine[] {
  const node = FS[cwd];
  if (!node) return [{ type: 'error', text: `  ls: ${cwd}: No such directory` }];
  const lines: OutputLine[] = [{ type: 'empty', text: '' }];
  node.dirs.forEach(d => lines.push({ type: 'success', text: `  📁  ${d}/` }));
  node.files.forEach(f => {
    const ext = f.split('.').pop() ?? '';
    const icon =
      ext === 'log' ? '📋' : ext === 'json' ? '⚙' : ext === 'md'  ? '📖' :
      ext === 'pdf' ? '📑' : ext === 'py'   ? '🐍' : ext === 'js'  ? '⚡' :
      ext === 'sh'  ? '⚡' : ext === 'ts'   ? '⚡' : '📄';
    lines.push({ type: 'output', text: `  ${icon}  ${f}` });
  });
  lines.push({ type: 'empty', text: '' });
  lines.push({ type: 'accent', text: `  ${node.dirs.length} dir(s), ${node.files.length} file(s)   pwd: ${cwd}` });
  lines.push({ type: 'empty', text: '' });
  return lines;
}

// ── Context-aware tab completions ─────────────────────────────────────────────
function getCompletions(partial: string, cwd: string): string[] {
  const lower = partial.toLowerCase();
  const node = FS[cwd];
  const dynamic = [
    ...(node?.dirs.map(d => `cd ${d}`)   ?? []),
    ...(node?.files.map(f => `cat ${f}`) ?? []),
    ...(node?.dirs.map(d => `open ${d}`) ?? []),
  ];
  return [...new Set([...GLOBAL_COMMANDS, ...dynamic])].filter(
    c => c.startsWith(lower) && c !== lower
  );
}

// ── Command processor ─────────────────────────────────────────────────────────
function processCommand(raw: string, cwd: string): CmdResult {
  const cmd = raw.trim().toLowerCase();

  // ── cd handling (before switch) ───────────────────────────────────────────
  if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd /' || cmd === 'cd ~/') {
    return { lines: [], newCwd: '~' };
  }
  if (cmd === 'cd ..') {
    const parent = FS[cwd]?.parent ?? '~';
    return { lines: [{ type: 'output', text: `  ↑ ${parent}` }], newCwd: parent };
  }
  if (cmd.startsWith('cd ')) {
    const target = cmd.slice(3).trim();
    const rel    = cwd === '~' ? `~/${target}` : `${cwd}/${target}`;
    if (FS[rel])     return { lines: [], newCwd: rel };
    if (FS[target])  return { lines: [], newCwd: target };
    return { lines: [
      { type: 'error',  text: `  cd: ${target}: No such directory` },
      { type: 'output', text: `  Dirs here: ${FS[cwd]?.dirs.map(d => d + '/').join('  ') || 'none'}` },
    ]};
  }

  switch (cmd) {

    // ── help ──
    case 'help': return { lines: [
      { type:'accent',  text:'╔════════════════════════════════════════╗' },
      { type:'accent',  text:'║      OMM//AI  COMMAND  REGISTRY        ║' },
      { type:'accent',  text:'╚════════════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'success', text:'  FILESYSTEM' },
      { type:'output',  text:'  pwd · ls · cd <dir> · cd .. · cat <file>' },
      { type:'empty',   text:'' },
      { type:'success', text:'  SYSTEM' },
      { type:'output',  text:'  date · uname · version · system-status · clear' },
      { type:'empty',   text:'' },
      { type:'success', text:'  INFORMATION' },
      { type:'output',  text:'  whoami · skills · mission · profile · timeline' },
      { type:'output',  text:'  capabilities · projects · cat profile.txt' },
      { type:'output',  text:'  cat mission.txt · cat skills.log · cat contact.json' },
      { type:'empty',   text:'' },
      { type:'success', text:'  NAVIGATION' },
      { type:'output',  text:'  builds · contact · github · linkedin' },
      { type:'output',  text:'  resume · open portfolio · open jarvis · open chatbot' },
      { type:'empty',   text:'' },
      { type:'success', text:'  EASTER EGGS  🥚' },
      { type:'output',  text:'  sudo reveal-secret · hack nasa · coffee · matrix' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  TAB autocomplete  ↑↓ history  ENTER run' },
      { type:'accent',  text:'  Try: cd projects → ls → open jarvis' },
      { type:'empty',   text:'' },
    ]};

    // ── whoami ──
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

    // ── pwd ──
    case 'pwd': return { lines: [
      { type:'output', text: cwd === '~'
          ? '  /home/omm'
          : `  /home/omm/${cwd.slice(2)}` },
    ]};

    // ── ls ──
    case 'ls': return { lines: getLsLines(cwd) };

    // ── date ──
    case 'date': return { lines: [
      { type:'output', text:`  ${getDate()}` },
      { type:'accent', text:'  IST (UTC+5:30) | OMM//AI System Clock' },
    ]};

    // ── uname ──
    case 'uname': return { lines: [
      { type:'output', text:'  OMM//AI OS v2.0.1-prod' },
      { type:'output', text:'  Kernel: OMM-AI-CORE/2.0.1' },
      { type:'output', text:'  Arch:   WebAssembly / JavaScript / AI' },
      { type:'output', text:'  Build:  Next.js 16 · React 19 · Three.js' },
    ]};

    // ── cat profile.txt ──
    case 'cat profile.txt': return { lines: [
      { type:'accent',  text:'  ╔══ /home/omm/profile.txt ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  PROFILE_ID  →  OPS-2004-AI' },
      { type:'output',  text:'  NAME        →  Omm Prakash Sahoo' },
      { type:'output',  text:'  ROLE        →  AI & Web Developer' },
      { type:'output',  text:'  LOCATION    →  Odisha, India' },
      { type:'output',  text:'  EMAIL       →  ommprakashs648@gmail.com' },
      { type:'output',  text:'  GITHUB      →  github.com/oomm-prakshhh' },
      { type:'output',  text:'  PORTFOLIO   →  omm-ai-portfolio.vercel.app' },
      { type:'empty',   text:'' },
      { type:'success', text:'  EXPERTISE' },
      { type:'output',  text:'  → AI/ML Systems Development' },
      { type:'output',  text:'  → Full Stack Web Development' },
      { type:'output',  text:'  → 3D Graphics & WebGL (Three.js)' },
      { type:'output',  text:'  → Immersive UI/UX Engineering' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  CLEARANCE   →  SYSTEM ARCHITECT' },
      { type:'output',  text:'  STATUS      →  ● ONLINE' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ╚══════════════════════════╝' },
    ]};

    // ── cat mission.txt ──
    case 'cat mission.txt': return { lines: [
      { type:'accent',  text:'  ╔══ /home/omm/mission.txt ══╗' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  To engineer intelligent systems that bridge' },
      { type:'output',  text:'  the gap between human intent and machine' },
      { type:'output',  text:'  capability — creating experiences that feel' },
      { type:'output',  text:'  alive, immersive, and purposeful.' },
      { type:'empty',   text:'' },
      { type:'success', text:'  DIRECTIVES' },
      { type:'output',  text:'  01 → Build AI-powered applications' },
      { type:'output',  text:'  02 → Create immersive web experiences' },
      { type:'output',  text:'  03 → Advance human-computer interaction' },
      { type:'output',  text:'  04 → Continuously evolve & learn' },
      { type:'output',  text:'  05 → Ship products that make a difference' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  STATUS: MISSION ACTIVE ◈' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ╚═══════════════════════════╝' },
    ]};

    // ── cat skills.log ──
    case 'cat skills.log': return { lines: [
      { type:'accent',  text:'  ╔══ /home/omm/skills.log ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [AI & MACHINE LEARNING]' },
      { type:'output',  text:'  Python · AI APIs · Speech Recognition' },
      { type:'output',  text:'  NLP · Prompt Engineering · LLM Integration' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [FRONTEND]' },
      { type:'output',  text:'  JavaScript · TypeScript · React · Next.js' },
      { type:'output',  text:'  Three.js · R3F · GSAP · Tailwind · HTML · CSS' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [BACKEND & TOOLS]' },
      { type:'output',  text:'  Node.js · REST APIs · Git · GitHub · Vercel' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [3D & GRAPHICS]' },
      { type:'output',  text:'  Three.js · WebGL · Shaders · R3F · Blender' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  LAST UPDATED: 2026.06' },
      { type:'accent',  text:'  ╚══════════════════════════╝' },
    ]};

    // ── cat contact.json ──
    case 'cat contact.json': return { lines: [
      { type:'accent',  text:'  ╔══ /home/omm/contact.json ══╗' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  {' },
      { type:'success', text:'    "email":     "ommprakashs648@gmail.com",' },
      { type:'success', text:'    "github":    "github.com/oomm-prakshhh",' },
      { type:'success', text:'    "linkedin":  "linkedin.com/in/omm-prakash-sahoo",' },
      { type:'success', text:'    "portfolio": "omm-ai-portfolio.vercel.app",' },
      { type:'output',  text:'    "response":  "<24 hours",' },
      { type:'output',  text:'    "status":    "● OPEN TO OPPORTUNITIES"' },
      { type:'output',  text:'  }' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ╚══════════════════════════════╝' },
    ]};

    case 'cat resume.pdf': return { lines: [
      { type:'error',  text:'  cat: resume.pdf: Binary file — cannot display.' },
      { type:'output', text:'  Use: open resume  or  download resume' },
    ]};

    case 'cat readme.md': return { lines: [
      { type:'accent',  text:'  # OMM//AI Portfolio' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  Futuristic AI-themed portfolio built with' },
      { type:'output',  text:'  Next.js, Three.js, and React Three Fiber.' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  GitHub: github.com/oomm-prakshhh/omm-ai-portfolio' },
    ]};

    // ── skills ──
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
      { type:'accent',  text:'  Tip: cat skills.log for full breakdown' },
      { type:'accent',  text:'╚═════════════════════╝' },
    ]};

    // ── mission ──
    case 'mission': return { lines: [
      { type:'output',  text:'  To engineer intelligent systems that bridge' },
      { type:'output',  text:'  the gap between human intent and machine' },
      { type:'output',  text:'  capability — creating experiences that feel' },
      { type:'output',  text:'  alive, immersive, and purposeful.' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Tip: cat mission.txt for full details' },
    ]};

    // ── projects ──
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
      { type:'accent',  text:'  Tip: cd projects → ls → open <name>' },
      { type:'accent',  text:'╚═══════════════════════╝' },
    ]};

    // ── builds ──
    case 'builds': return {
      lines: [
        { type:'accent', text:'  [Navigating to System Builds...]' },
        { type:'output', text:'  open portfolio · open jarvis · open chatbot' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    // ── open commands ──
    case 'open portfolio': return {
      lines: [
        { type:'success', text:'  ● Accessing: 3D Portfolio System' },
        { type:'output',  text:'  Stack:  Next.js · Three.js · React Three Fiber' },
        { type:'output',  text:'  Status: ● ONLINE  v2.0.1-prod' },
        { type:'output',  text:'  URL:    omm-ai-portfolio.vercel.app' },
        { type:'accent',  text:'  [Scrolling to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open jarvis': return {
      lines: [
        { type:'success', text:'  ● Accessing: JARVIS AI Assistant' },
        { type:'output',  text:'  Stack:  Python · Speech Recognition · AI APIs' },
        { type:'output',  text:'  Status: ● DEPLOYED  v1.2.0-stable' },
        { type:'output',  text:'  Path:   ~/projects/jarvis' },
        { type:'accent',  text:'  [Scrolling to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open chatbot': return {
      lines: [
        { type:'success', text:'  ● Accessing: AI Chatbot Platform' },
        { type:'output',  text:'  Stack:  React · Node.js · AI APIs' },
        { type:'output',  text:'  Status: ● IN DEVELOPMENT  v0.8.5-dev' },
        { type:'output',  text:'  Path:   ~/projects/chatbot' },
        { type:'accent',  text:'  [Scrolling to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    // ── resume ──
    case 'resume':
    case 'open resume':
    case 'download resume': return { lines: [
      { type:'accent',  text:'  ╔══ RESUME.PDF ══╗' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  Name: Omm Prakash Sahoo' },
      { type:'output',  text:'  Role: AI & Web Developer' },
      { type:'empty',   text:'' },
      { type:'error',   text:'  [STATUS] PDF not yet deployed to CDN.' },
      { type:'empty',   text:'' },
      { type:'success', text:'  REQUEST VIA:' },
      { type:'output',  text:'  → ommprakashs648@gmail.com' },
      { type:'output',  text:'  → linkedin.com/in/omm-prakash-sahoo' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  ╚═════════════════╝' },
    ]};

    // ── contact ──
    case 'contact': return {
      lines: [
        { type:'accent',  text:'╔══ COMMUNICATION NODES ══╗' },
        { type:'empty',   text:'' },
        { type:'success', text:'  EMAIL    →  ommprakashs648@gmail.com' },
        { type:'success', text:'  GITHUB   →  github.com/oomm-prakshhh' },
        { type:'success', text:'  LINKEDIN →  linkedin.com/in/omm-prakash-sahoo' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Response time: <24h' },
        { type:'accent',  text:'  Tip: cat contact.json for structured data' },
        { type:'accent',  text:'  [Scrolling to Contact...]' },
      ],
      effect: () => setTimeout(() => clientScroll('contact'), 200),
    };

    // ── profile ──
    case 'profile': return {
      lines: [
        { type:'accent', text:'  [Scrolling to Developer Profile...]' },
        { type:'output', text:'  Tip: cat profile.txt for full dossier.' },
      ],
      effect: () => setTimeout(() => clientScroll('about'), 200),
    };

    // ── capabilities ──
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

    // ── timeline ──
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

    // ── system-status ──
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

    // ── version ──
    case 'version': return { lines: [
      { type:'accent',  text:'  OMM//AI OPERATING SYSTEM' },
      { type:'output',  text:'  Version  →  2.0.1-prod' },
      { type:'output',  text:'  Build    →  2026.06' },
      { type:'output',  text:'  Runtime  →  Next.js 16.2.2 · React 19' },
      { type:'output',  text:'  Renderer →  Three.js · React Three Fiber' },
      { type:'output',  text:'  Host     →  Vercel Edge Network' },
    ]};

    // ── github ──
    case 'github': return {
      lines: [
        { type:'success', text:'  Connecting to GitHub...' },
        { type:'output',  text:'  Repo: github.com/oomm-prakshhh' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://github.com/oomm-prakshhh'), 200),
    };

    // ── linkedin ──
    case 'linkedin': return {
      lines: [
        { type:'success', text:'  Connecting to LinkedIn...' },
        { type:'output',  text:'  Profile: linkedin.com/in/omm-prakash-sahoo' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/'), 200),
    };

    // ── clear ──
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
      { type:'output',  text:'  More: "The best code makes someone feel' },
      { type:'output',  text:'   something — wonder, delight, or that quiet' },
      { type:'output',  text:'   satisfaction of a system working exactly' },
      { type:'output',  text:'   as intended."' },
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
      { type:'output',  text:'  Fun fact: Built on coffee & code.' },
    ]};

    case 'matrix': return { lines: [
      { type:'empty',   text:'' },
      ...makeMatrixLines(),
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Wake up, Neo...', instant: true },
      { type:'accent',  text:'  Follow the cyan rabbit. 🐇', instant: true },
      { type:'success', text:'  The Matrix has you.', instant: true },
      { type:'empty',   text:'' },
    ]};

    case '': return { lines: [] };

    // ── default ──────────────────────────────────────────────────────────────
    default: {
      if (cmd.startsWith('cat ')) {
        const file = cmd.slice(4).trim();
        return { lines: [
          { type:'error',  text:`  cat: ${file}: No such file or no content defined` },
          { type:'output', text:'  Readable: profile.txt · mission.txt · skills.log · contact.json' },
        ]};
      }
      if (cmd.startsWith('open ')) {
        return { lines: [
          { type:'error',  text:`  open: "${cmd.slice(5)}": not found` },
          { type:'output', text:'  Try: open portfolio · open jarvis · open chatbot · open resume' },
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
  const [cwd,        setCwd       ] = useState('~');
  const [history,    setHistory   ] = useState<OutputLine[]>([]);
  const [typingLine, setTypingLine] = useState<OutputLine | null>(null);
  const [input,      setInput     ] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [visible,    setVisible   ] = useState(false);
  const [booted,     setBooted    ] = useState(false);

  const histIdxRef    = useRef(-1);
  const outputRef     = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);
  const sectionRef    = useRef<HTMLElement>(null);
  const pendingRef    = useRef<OutputLine[]>([]);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef     = useRef(false);
  const onCompleteRef = useRef<(() => void) | null>(null);
  // Keep cwd in a ref so runCmd stays stable but always sees latest cwd
  const cwdRef        = useRef(cwd);
  useEffect(() => { cwdRef.current = cwd; }, [cwd]);

  // ── Load persistent command history after hydration ───────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
      if (Array.isArray(saved) && saved.length > 0) setCmdHistory(saved);
    } catch {}
  }, []);

  // ── Persist command history ───────────────────────────────────────────────
  useEffect(() => {
    if (!cmdHistory.length) return;
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(cmdHistory.slice(0, 50))); }
    catch {}
  }, [cmdHistory]);

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

  // ── Typing engine ─────────────────────────────────────────────────────────
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
      if (next.instant || next.type === 'empty' || !next.text) {
        setHistory(prev => [...prev, next]);
        timerRef.current = setTimeout(tick, next.instant ? 40 : LINE_PAUSE);
        return;
      }
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

  const flushTyping = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    activeRef.current = false;
    onCompleteRef.current = null;
    const rem = [...pendingRef.current];
    pendingRef.current = [];
    if (rem.length) setHistory(prev => [...prev, ...rem]);
    setTypingLine(null);
  }, []);

  // ── Core command runner ───────────────────────────────────────────────────
  const runCmd = useCallback((raw: string) => {
    flushTyping();
    const trimmed     = raw.trim();
    const currentCwd  = cwdRef.current;
    const currentPrompt = `omm@ai:${currentCwd}$`;
    const echo: OutputLine = { type: 'input', text: `${currentPrompt} ${trimmed}` };
    const { lines, effect, newCwd } = processCommand(trimmed, currentCwd);

    if (lines[0]?.text === '__CLEAR__') { setHistory([]); return; }

    setHistory(prev => [...prev, echo]);
    if (trimmed) {
      setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
      histIdxRef.current = -1;
    }
    if (newCwd !== undefined) setCwd(newCwd);
    pendingRef.current = [...lines];
    processQueue();
    if (effect) effect();
  }, [flushTyping, processQueue]);

  // ── Execute from input field ──────────────────────────────────────────────
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

    onCompleteRef.current = () => {
      const { lines } = processCommand('help', '~');
      const echo: OutputLine = { type: 'input', text: 'omm@ai:~$ help' };
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
      const matches = getCompletions(lower, cwd);
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        flushTyping();
        const matchLines: OutputLine[] = [
          { type:'output', text:`  Matches for "${lower}":` },
          ...matches.slice(0, 8).map(m => ({ type:'accent' as LineType, text:`  → ${m}` })),
          ...(matches.length > 8
            ? [{ type:'output' as LineType, text:`  ... and ${matches.length - 8} more` }]
            : []),
          { type:'empty', text:'' },
        ];
        setHistory(prev => [...prev, ...matchLines]);
      }
    }
  }, [executeInput, input, cmdHistory, cwd, flushTyping]);

  // Computed prompt — updates reactively with cwd
  const prompt = `omm@ai:${cwd}$`;

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

        {/* Section header */}
        <div className={`mb-10 sm:mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 mb-4">{'// TERMINAL_INTERFACE'}</p>
          <h2 id="terminal-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Interactive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              OS Terminal.
            </span>
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-px bg-cyan-500/50 shrink-0" />
            <p className="text-sm sm:text-lg text-zinc-400 max-w-xl">
              Full CLI with filesystem navigation.{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">help</code>{' '}
              · <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">TAB</code>{' '}
              · <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">cd projects</code>
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
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-zinc-600 select-none truncate">
                {prompt} — TERMINAL_INTERFACE v2.0
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
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)' }}
          />

          {/* Output area */}
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

            {/* Prompt input row */}
            <div className="flex items-center gap-2 mt-2 mb-1">
              <span
                className="font-mono text-[11px] sm:text-xs text-cyan-400 shrink-0 select-none"
                style={{ textShadow: '0 0 8px rgba(34,211,238,0.6)' }}
                aria-hidden="true"
              >
                {prompt}
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
              <span
                className="w-[7px] h-3.5 bg-cyan-400 shrink-0 select-none"
                aria-hidden="true"
                style={{ animation: 'blink 1s step-end infinite' }}
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
              <span className="text-zinc-600">{cwd}</span>
              <span className="text-zinc-800">|</span>
              <span className="text-zinc-700">{cmdHistory.length} CMD{cmdHistory.length !== 1 ? 'S' : ''}</span>
              <span className="text-cyan-800">●</span>
              <span className="text-cyan-700">SECURE</span>
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
        .terminal-output::-webkit-scrollbar { width: 6px; }
        .terminal-output::-webkit-scrollbar-track { background: transparent; border-radius: 3px; }
        .terminal-output::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.18); border-radius: 3px; }
        .terminal-output::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); box-shadow: 0 0 8px rgba(34,211,238,0.4); }
        .terminal-output { scrollbar-width: thin; scrollbar-color: rgba(34,211,238,0.18) transparent; }
        .quick-pills::-webkit-scrollbar { display: none; }
        .quick-pills { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 640px) { .terminal-output::-webkit-scrollbar { width: 3px; } }
      `}</style>
    </section>
  );
}
