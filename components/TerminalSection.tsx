'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────
const TYPING_SPEED = 11;
const LINE_PAUSE   = 22;
const SESSION_KEY  = 'omm-terminal-v4';

const QUICK_COMMANDS = ['help', 'whoami', 'ls', 'system-status', 'matrix', 'coffee', 'date'];

const ALL_COMMANDS = [
  'help','whoami','pwd','ls','date','uname','clear','version','system-status',
  'cat profile.txt','cat mission.txt','cat skills.log','cat contact.json',
  'cat resume.pdf','cat readme.md',
  'cd projects','cd builds','cd jarvis','cd portfolio','cd chatbot','cd ..','cd ~',
  'projects','skills','mission','contact','builds','profile','capabilities','timeline',
  'github','linkedin','resume','open resume','download resume',
  'open portfolio','open jarvis','open chatbot',
  'sudo reveal-secret','hack nasa','coffee','matrix',
];

// ── Types ─────────────────────────────────────────────────────────────────────
type LineType   = 'input'|'output'|'error'|'success'|'accent'|'empty'|'matrix';
type OutputLine = { type: LineType; text: string; instant?: boolean };
type CmdResult  = { lines: OutputLine[]; effect?: () => void; newPath?: string[] };

type FSFile = { kind: 'file'; content: OutputLine[] };
type FSDir  = { kind: 'dir';  children: Record<string, FSNode> };
type FSNode = FSFile | FSDir;

// ── Virtual Filesystem ────────────────────────────────────────────────────────
const ROOT_FS: FSDir = {
  kind: 'dir',
  children: {
    'profile.txt': { kind: 'file', content: [
      { type:'accent',  text:'  ╔══════════════════════════════════╗' },
      { type:'accent',  text:'  ║      profile.txt — OMM//AI       ║' },
      { type:'accent',  text:'  ╚══════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'success', text:'  IDENTITY' },
      { type:'output',  text:'  Name      :  Omm Prakash Sahoo' },
      { type:'output',  text:'  Handle    :  oomm-prakshhh' },
      { type:'output',  text:'  Role      :  AI & Web Developer' },
      { type:'output',  text:'  Class     :  Computer Science Student' },
      { type:'output',  text:'  Base      :  Odisha, India' },
      { type:'empty',   text:'' },
      { type:'success', text:'  CONTACT' },
      { type:'output',  text:'  Email     :  ommprakashs648@gmail.com' },
      { type:'output',  text:'  GitHub    :  github.com/oomm-prakshhh' },
      { type:'output',  text:'  LinkedIn  :  linkedin.com/in/omm-prakash-sahoo' },
      { type:'empty',   text:'' },
      { type:'success', text:'  SYSTEM STATUS' },
      { type:'output',  text:'  Clearance :  SYSTEM ARCHITECT' },
      { type:'output',  text:'  Online    :  ● ACTIVE' },
      { type:'output',  text:'  Available :  YES — response < 24h' },
      { type:'empty',   text:'' },
    ]},
    'mission.txt': { kind: 'file', content: [
      { type:'accent',  text:'  ╔══════════════════════════════════╗' },
      { type:'accent',  text:'  ║      mission.txt — OMM//AI       ║' },
      { type:'accent',  text:'  ╚══════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  To engineer intelligent systems that bridge' },
      { type:'output',  text:'  the gap between human intent and machine' },
      { type:'output',  text:'  capability — creating experiences that feel' },
      { type:'output',  text:'  alive, immersive, and purposeful.' },
      { type:'empty',   text:'' },
      { type:'success', text:'  CORE DIRECTIVES' },
      { type:'output',  text:'  01  Build AI-powered applications' },
      { type:'output',  text:'  02  Create immersive web experiences' },
      { type:'output',  text:'  03  Advance human-computer interaction' },
      { type:'output',  text:'  04  Continuously evolve & learn' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  "Code is poetry written for machines,' },
      { type:'accent',  text:'   but felt by humans."' },
      { type:'empty',   text:'' },
    ]},
    'skills.log': { kind: 'file', content: [
      { type:'accent',  text:'  ╔══════════════════════════════════╗' },
      { type:'accent',  text:'  ║      skills.log — OMM//AI        ║' },
      { type:'accent',  text:'  ╚══════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [LOADED] AI & MACHINE LEARNING' },
      { type:'output',  text:'  ▸ Python              ████████████  98%' },
      { type:'output',  text:'  ▸ AI APIs             ███████████░  94%' },
      { type:'output',  text:'  ▸ Speech Recognition  ██████████░░  88%' },
      { type:'output',  text:'  ▸ NLP / Prompt Eng    █████████░░░  82%' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [LOADED] FRONTEND' },
      { type:'output',  text:'  ▸ React / Next.js     ████████████  96%' },
      { type:'output',  text:'  ▸ TypeScript          ███████████░  92%' },
      { type:'output',  text:'  ▸ Three.js / WebGL    ██████████░░  88%' },
      { type:'output',  text:'  ▸ CSS / Tailwind      ████████████  97%' },
      { type:'output',  text:'  ▸ GSAP Animations     █████████░░░  84%' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [LOADED] BACKEND & TOOLING' },
      { type:'output',  text:'  ▸ Node.js             ████████░░░░  78%' },
      { type:'output',  text:'  ▸ Git & GitHub        ████████████  99%' },
      { type:'output',  text:'  ▸ Vercel / CI-CD      ███████████░  92%' },
      { type:'empty',   text:'' },
    ]},
    'contact.json': { kind: 'file', content: [
      { type:'accent',  text:'  // contact.json' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  {' },
      { type:'success', text:'    "name"      : "Omm Prakash Sahoo",' },
      { type:'output',  text:'    "role"      : "AI & Web Developer",' },
      { type:'output',  text:'    "email"     : "ommprakashs648@gmail.com",' },
      { type:'output',  text:'    "github"    : "github.com/oomm-prakshhh",' },
      { type:'output',  text:'    "linkedin"  : "linkedin.com/in/omm-prakash-sahoo",' },
      { type:'output',  text:'    "location"  : "Odisha, India",' },
      { type:'output',  text:'    "status"    : "ACTIVE",' },
      { type:'success', text:'    "available" : true,' },
      { type:'output',  text:'    "response"  : "< 24 hours"' },
      { type:'accent',  text:'  }' },
      { type:'empty',   text:'' },
    ]},
    'resume.pdf': { kind: 'file', content: [
      { type:'output', text:'  Attempting to render resume.pdf...' },
      { type:'error',  text:'  [BINARY] Cannot display PDF in terminal.' },
      { type:'output', text:'  Use: open resume   — to view in browser' },
      { type:'output', text:'  Use: download resume — to download' },
    ]},
    'projects': { kind: 'dir', children: {
      'readme.md': { kind: 'file', content: [
        { type:'accent',  text:'  # projects/README.md' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Active OMM//AI project directories.' },
        { type:'empty',   text:'' },
        { type:'success', text:'  PROJECTS' },
        { type:'accent',  text:'  📁  jarvis/      Voice-controlled AI Assistant' },
        { type:'accent',  text:'  📁  portfolio/   3D Immersive Portfolio System' },
        { type:'accent',  text:'  📁  chatbot/     Real-time AI Chatbot Platform' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Navigate: cd jarvis · cd portfolio · cd chatbot' },
        { type:'empty',   text:'' },
      ]},
      'jarvis': { kind: 'dir', children: {
        'readme.md': { kind: 'file', content: [
          { type:'accent',  text:'  # JARVIS AI ASSISTANT' },
          { type:'empty',   text:'' },
          { type:'output',  text:'  Voice-controlled AI command interface.' },
          { type:'output',  text:'  Understands natural language, executes' },
          { type:'output',  text:'  system tasks, and answers queries.' },
          { type:'empty',   text:'' },
          { type:'success', text:'  TECH STACK' },
          { type:'output',  text:'  ▸ Python 3.11' },
          { type:'output',  text:'  ▸ SpeechRecognition' },
          { type:'output',  text:'  ▸ pyttsx3 (TTS engine)' },
          { type:'output',  text:'  ▸ OpenAI / AI APIs' },
          { type:'output',  text:'  ▸ Custom NLP pipeline' },
          { type:'empty',   text:'' },
          { type:'success', text:'  STATUS' },
          { type:'output',  text:'  Version  :  v1.2.0-stable' },
          { type:'output',  text:'  Stage    :  ● DEPLOYED' },
          { type:'output',  text:'  Tests    :  92% coverage' },
          { type:'output',  text:'  Uptime   :  99.7%' },
          { type:'empty',   text:'' },
        ]},
      }},
      'portfolio': { kind: 'dir', children: {
        'readme.md': { kind: 'file', content: [
          { type:'accent',  text:'  # 3D PORTFOLIO SYSTEM' },
          { type:'empty',   text:'' },
          { type:'output',  text:'  Immersive OS-themed portfolio with a 3D' },
          { type:'output',  text:'  AI core, cinematic boot sequence, and' },
          { type:'output',  text:'  this interactive terminal interface.' },
          { type:'empty',   text:'' },
          { type:'success', text:'  TECH STACK' },
          { type:'output',  text:'  ▸ Next.js 16.2.2 (Turbopack)' },
          { type:'output',  text:'  ▸ React 19 + TypeScript' },
          { type:'output',  text:'  ▸ React Three Fiber + Three.js' },
          { type:'output',  text:'  ▸ GSAP Animations' },
          { type:'output',  text:'  ▸ Vercel Edge Network' },
          { type:'empty',   text:'' },
          { type:'success', text:'  STATUS' },
          { type:'output',  text:'  Version  :  v2.0.1-prod' },
          { type:'output',  text:'  Stage    :  ● ONLINE' },
          { type:'output',  text:'  Uptime   :  99.9%' },
          { type:'output',  text:'  URL      :  omm-ai-portfolio.vercel.app' },
          { type:'empty',   text:'' },
        ]},
      }},
      'chatbot': { kind: 'dir', children: {
        'readme.md': { kind: 'file', content: [
          { type:'accent',  text:'  # AI CHATBOT PLATFORM' },
          { type:'empty',   text:'' },
          { type:'output',  text:'  Real-time conversational AI with context' },
          { type:'output',  text:'  awareness, multi-turn dialogue, and' },
          { type:'output',  text:'  streaming response output.' },
          { type:'empty',   text:'' },
          { type:'success', text:'  TECH STACK' },
          { type:'output',  text:'  ▸ React + JavaScript' },
          { type:'output',  text:'  ▸ Node.js REST API' },
          { type:'output',  text:'  ▸ OpenAI / AI APIs' },
          { type:'output',  text:'  ▸ WebSocket (streaming)' },
          { type:'empty',   text:'' },
          { type:'success', text:'  STATUS' },
          { type:'output',  text:'  Version  :  v0.8.5-dev' },
          { type:'output',  text:'  Stage    :  ● IN DEVELOPMENT' },
          { type:'output',  text:'  ETA      :  Q3 2026' },
          { type:'empty',   text:'' },
        ]},
      }},
    }},
    'builds': { kind: 'dir', children: {
      'readme.md': { kind: 'file', content: [
        { type:'accent',  text:'  # builds/README.md' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Deployed and active build records.' },
        { type:'empty',   text:'' },
        { type:'success', text:'  [BLD-01] jarvis/     ● DEPLOYED    v1.2.0' },
        { type:'success', text:'  [BLD-02] chatbot/    ● IN DEV      v0.8.5' },
        { type:'success', text:'  [BLD-03] portfolio/  ● ONLINE      v2.0.1' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  cd ../projects — for detailed project info' },
        { type:'empty',   text:'' },
      ]},
    }},
  },
};

// ── FS helpers ────────────────────────────────────────────────────────────────
function getNodeAtPath(path: string[]): FSNode | null {
  let node: FSNode = ROOT_FS;
  for (const seg of path) {
    if (node.kind !== 'dir') return null;
    const child: FSNode = (node as FSDir).children[seg];
    if (!child) return null;
    node = child;
  }
  return node;
}

function getPrompt(path: string[]): string {
  return path.length === 0 ? 'omm@ai:~$' : `omm@ai:~/${path.join('/')}$`;
}

function fileIcon(name: string): string {
  const ext = name.split('.').pop() ?? '';
  const map: Record<string, string> = { txt:'📋', log:'📊', json:'🔧', md:'📑', pdf:'📕' };
  return map[ext] ?? '📄';
}

function fileLineType(name: string): LineType {
  const ext = name.split('.').pop() ?? '';
  if (ext === 'log')  return 'success';
  if (ext === 'json') return 'accent';
  if (ext === 'pdf')  return 'error';
  return 'output';
}

function lsOutput(dir: FSDir): OutputLine[] {
  const entries = Object.entries(dir.children);
  const dirs  = entries.filter(([, v]) => v.kind === 'dir').map(([k]) => k).sort();
  const files = entries.filter(([, v]) => v.kind === 'file').map(([k]) => k).sort();
  const lines: OutputLine[] = [{ type:'empty', text:'' }];
  dirs.forEach(d  => lines.push({ type:'accent', text:`  📁  ${d}/` }));
  files.forEach(f => lines.push({ type: fileLineType(f), text:`  ${fileIcon(f)}  ${f}` }));
  lines.push({ type:'empty', text:'' });
  return lines;
}

// ── Client-safe helpers ───────────────────────────────────────────────────────
function clientScroll(id: string) {
  if (typeof window === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
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

// ── Matrix generator ──────────────────────────────────────────────────────────
function makeMatrixLines(): OutputLine[] {
  const pool = '01アイウエカキクケコサシスタチツナニヌネノ▓░▒█│┼╬◈◉';
  return Array.from({ length: 15 }, () => {
    const len = 44 + Math.floor(Math.random() * 18);
    let row = '  ';
    for (let j = 0; j < len; j++) row += pool[Math.floor(Math.random() * pool.length)];
    return { type: 'matrix' as LineType, text: row, instant: true };
  });
}

// ── Command processor ─────────────────────────────────────────────────────────
function processCommand(raw: string, path: string[]): CmdResult {
  const trimmed  = raw.trim();
  const lower    = trimmed.toLowerCase();
  const parts    = trimmed.split(/\s+/);
  const verb     = parts[0]?.toLowerCase() ?? '';
  const argRaw   = parts.slice(1).join(' ').trim();

  // ── Filesystem-aware commands ─────────────────────────────────────────────
  if (verb === 'ls') {
    const node = getNodeAtPath(path);
    if (!node || node.kind !== 'dir') return { lines:[{ type:'error', text:'  Not a directory.' }] };
    return { lines: lsOutput(node as FSDir) };
  }

  if (verb === 'pwd') {
    const p = path.length === 0 ? '/home/omm' : `/home/omm/${path.join('/')}`;
    return { lines:[{ type:'output', text:`  ${p}` }] };
  }

  if (verb === 'cd') {
    const target = argRaw || '~';
    if (target === '~' || target === '') {
      return { lines:[], newPath:[] };
    }
    if (target === '..') {
      if (path.length === 0) return { lines:[{ type:'error', text:'  Already at home directory.' }] };
      return { lines:[], newPath: path.slice(0, -1) };
    }
    const node = getNodeAtPath(path);
    if (!node || node.kind !== 'dir') return { lines:[{ type:'error', text:`  cd: not in a directory` }] };
    const child = (node as FSDir).children[target];
    if (!child) return { lines:[{ type:'error', text:`  cd: ${target}: No such directory` },
                                { type:'output', text:'  Type "ls" to see available directories.' }] };
    if (child.kind !== 'dir') return { lines:[{ type:'error', text:`  cd: ${target}: Not a directory` }] };
    return { lines:[], newPath:[...path, target] };
  }

  if (verb === 'cat') {
    const filename = argRaw;
    if (!filename) return { lines:[{ type:'error', text:'  Usage: cat <filename>' }] };
    const node = getNodeAtPath(path);
    if (!node || node.kind !== 'dir') return { lines:[{ type:'error', text:'  Not in a directory.' }] };
    const file = (node as FSDir).children[filename];
    if (!file) return { lines:[
      { type:'error',  text:`  cat: ${filename}: No such file` },
      { type:'output', text:'  Type "ls" to see available files.' },
    ]};
    if (file.kind === 'dir') return { lines:[{ type:'error', text:`  cat: ${filename}: Is a directory` }] };
    return { lines:(file as FSFile).content };
  }

  // ── Static command registry ───────────────────────────────────────────────
  switch (lower) {

    case 'help': return { lines:[
      { type:'accent',  text:'╔══════════════════════════════════════════╗' },
      { type:'accent',  text:'║        OMM//AI  COMMAND  REGISTRY        ║' },
      { type:'accent',  text:'╚══════════════════════════════════════════╝' },
      { type:'empty',   text:'' },
      { type:'success', text:'  FILESYSTEM' },
      { type:'output',  text:'  ls              → list current directory' },
      { type:'output',  text:'  pwd             → print working directory' },
      { type:'output',  text:'  cd <dir>        → change directory' },
      { type:'output',  text:'  cd ..           → go up one level' },
      { type:'output',  text:'  cat <file>      → read file contents' },
      { type:'empty',   text:'' },
      { type:'success', text:'  SYSTEM' },
      { type:'output',  text:'  date · uname · version · system-status · clear' },
      { type:'empty',   text:'' },
      { type:'success', text:'  INFORMATION' },
      { type:'output',  text:'  whoami · skills · mission · profile · timeline' },
      { type:'output',  text:'  capabilities · projects · resume' },
      { type:'empty',   text:'' },
      { type:'success', text:'  NAVIGATION' },
      { type:'output',  text:'  builds · contact · github · linkedin' },
      { type:'output',  text:'  open portfolio · open jarvis · open chatbot' },
      { type:'output',  text:'  open resume · download resume' },
      { type:'empty',   text:'' },
      { type:'success', text:'  EASTER EGGS  🥚' },
      { type:'output',  text:'  sudo reveal-secret · hack nasa · coffee · matrix' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  TAB autocomplete  ↑↓ history  ENTER run' },
      { type:'empty',   text:'' },
    ]};

    case 'whoami': return { lines:[
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
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Tip: cat profile.txt — full dossier' },
      { type:'empty',   text:'' },
    ]};

    case 'date': return { lines:[
      { type:'output', text:`  ${getDate()}` },
      { type:'accent', text:'  IST (UTC+5:30) · OMM//AI System Clock' },
    ]};

    case 'uname': return { lines:[
      { type:'output', text:'  OMM//AI OS v2.0.1-prod' },
      { type:'output', text:'  Kernel : OMM-AI-CORE/2.0.1' },
      { type:'output', text:'  Arch   : WebAssembly / JavaScript / AI' },
      { type:'output', text:'  Build  : Next.js 16 · React 19 · Three.js' },
    ]};

    case 'skills': return { lines:[
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
      { type:'accent',  text:'  Tip: cat skills.log — detailed breakdown' },
      { type:'empty',   text:'' },
    ]};

    case 'mission': return { lines:[
      { type:'output',  text:'  To engineer intelligent systems that bridge' },
      { type:'output',  text:'  the gap between human intent and machine' },
      { type:'output',  text:'  capability — alive, immersive, purposeful.' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Tip: cat mission.txt — full manifesto' },
      { type:'empty',   text:'' },
    ]};

    case 'projects': return { lines:[
      { type:'accent',  text:'╔══ PROJECT MANIFEST ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  [01] JARVIS      ● DEPLOYED   →  cd projects/jarvis' },
      { type:'success', text:'  [02] CHATBOT     ● IN DEV     →  cd projects/chatbot' },
      { type:'success', text:'  [03] PORTFOLIO   ● ONLINE     →  cd projects/portfolio' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'  Or: cd projects  then  ls  then  cat readme.md' },
      { type:'empty',   text:'' },
    ]};

    case 'builds': return {
      lines:[
        { type:'accent', text:'  [Navigating to System Builds...]' },
        { type:'output', text:'  Try: open portfolio · open jarvis · open chatbot' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open portfolio': return {
      lines:[
        { type:'success', text:'  ● Accessing: 3D Portfolio System' },
        { type:'output',  text:'  Stack: Next.js · Three.js · React Three Fiber' },
        { type:'output',  text:'  Status: ● ONLINE  v2.0.1-prod' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open jarvis': return {
      lines:[
        { type:'success', text:'  ● Accessing: JARVIS AI Assistant' },
        { type:'output',  text:'  Stack: Python · Speech Recognition · AI APIs' },
        { type:'output',  text:'  Status: ● DEPLOYED  v1.2.0-stable' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open chatbot': return {
      lines:[
        { type:'success', text:'  ● Accessing: AI Chatbot Platform' },
        { type:'output',  text:'  Stack: React · Node.js · AI APIs' },
        { type:'output',  text:'  Status: ● IN DEVELOPMENT  v0.8.5-dev' },
        { type:'accent',  text:'  [Navigating to project...]' },
      ],
      effect: () => setTimeout(() => clientScroll('builds'), 200),
    };

    case 'open resume':
    case 'download resume':
    case 'resume': return { lines:[
      { type:'output', text:'  Locating resume.pdf on CDN...' },
      { type:'error',  text:'  [404] Resume not yet deployed.' },
      { type:'output', text:'  Contact: ommprakashs648@gmail.com to request a copy.' },
    ]};

    case 'contact': return {
      lines:[
        { type:'accent',  text:'╔══ COMMUNICATION NODES ══╗' },
        { type:'empty',   text:'' },
        { type:'success', text:'  EMAIL    →  ommprakashs648@gmail.com' },
        { type:'success', text:'  GITHUB   →  github.com/oomm-prakshhh' },
        { type:'success', text:'  LINKEDIN →  linkedin.com/in/omm-prakash-sahoo' },
        { type:'empty',   text:'' },
        { type:'output',  text:'  Response time: <24h' },
        { type:'output',  text:'  Tip: cat contact.json — machine-readable' },
        { type:'accent',  text:'  [Navigating to Contact...]' },
      ],
      effect: () => setTimeout(() => clientScroll('contact'), 200),
    };

    case 'profile': return {
      lines:[
        { type:'accent', text:'  [Navigating to Developer Profile...]' },
        { type:'output', text:'  Tip: cat profile.txt — detailed view' },
      ],
      effect: () => setTimeout(() => clientScroll('about'), 200),
    };

    case 'capabilities': return { lines:[
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

    case 'timeline': return { lines:[
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

    case 'system-status': return { lines:[
      { type:'accent',  text:'╔══ SYSTEM DIAGNOSTICS ══╗' },
      { type:'empty',   text:'' },
      { type:'success', text:'  AI CORE         ●  ACTIVE' },
      { type:'success', text:'  NEURAL MODULES  ●  LOADED' },
      { type:'success', text:'  NETWORK         ●  STABLE' },
      { type:'success', text:'  SECURITY        ●  VERIFIED' },
      { type:'success', text:'  DATA STREAMS    ●  CONNECTED' },
      { type:'success', text:'  FILESYSTEM      ●  MOUNTED' },
      { type:'empty',   text:'' },
      { type:'output',  text:'  OS      →  OMM//AI v2.0.1-prod' },
      { type:'output',  text:'  RUNTIME →  Next.js 16 · React 19' },
      { type:'empty',   text:'' },
      { type:'accent',  text:'╚════════════════════════╝' },
    ]};

    case 'version': return { lines:[
      { type:'accent',  text:'  OMM//AI OPERATING SYSTEM' },
      { type:'output',  text:'  Version  →  2.0.1-prod' },
      { type:'output',  text:'  Build    →  2026.06' },
      { type:'output',  text:'  Runtime  →  Next.js 16.2.2 · React 19' },
      { type:'output',  text:'  Renderer →  Three.js · React Three Fiber' },
      { type:'output',  text:'  Host     →  Vercel Edge Network' },
    ]};

    case 'github': return {
      lines:[
        { type:'success', text:'  Connecting to GitHub...' },
        { type:'output',  text:'  Repo: github.com/oomm-prakshhh' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://github.com/oomm-prakshhh'), 200),
    };

    case 'linkedin': return {
      lines:[
        { type:'success', text:'  Connecting to LinkedIn...' },
        { type:'output',  text:'  Profile: linkedin.com/in/omm-prakash-sahoo' },
        { type:'accent',  text:'  ● Opening in new tab...' },
      ],
      effect: () => setTimeout(() => clientOpen('https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/'), 200),
    };

    case 'clear': return { lines:[{ type:'empty', text:'__CLEAR__' }] };

    // ── Easter eggs ──────────────────────────────────────────────────────────
    case 'sudo reveal-secret':
    case 'sudo': return { lines:[
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

    case 'hack nasa': return { lines:[
      { type:'output', text:'  Locating NASA servers...' },
      { type:'output', text:'  Bypassing firewall layer 1...' },
      { type:'output', text:'  Bypassing firewall layer 2...' },
      { type:'empty',  text:'' },
      { type:'error',  text:'  ██  ACCESS DENIED  ██' },
      { type:'error',  text:'  Intrusion logged. FBI notified. (Just kidding 😎)' },
      { type:'empty',  text:'' },
      { type:'accent', text:'  Nice try. Build cool things instead 🚀' },
    ]};

    case 'coffee': return { lines:[
      { type:'output',  text:'  ☕  Brewing system coffee...' },
      { type:'output',  text:'  ████████████████  100%' },
      { type:'empty',   text:'' },
      { type:'success', text:'  ☕ System energy restored +100' },
      { type:'accent',  text:'  AI core running at peak capacity.' },
      { type:'output',  text:'  Fun fact: This portfolio runs on coffee & code.' },
    ]};

    case 'matrix': {
      return { lines:[
        { type:'empty',   text:'' },
        ...makeMatrixLines(),
        { type:'empty',   text:'' },
        { type:'accent',  text:'  Wake up, Neo...', instant:true },
        { type:'accent',  text:'  Follow the cyan rabbit. 🐇', instant:true },
        { type:'success', text:'  The Matrix has you.', instant:true },
        { type:'empty',   text:'' },
      ]};
    }

    case '': return { lines:[] };

    default: {
      if (verb === 'open') return { lines:[
        { type:'error',  text:`  open: "${argRaw}": not found` },
        { type:'output', text:'  Try: open portfolio · open jarvis · open chatbot · open resume' },
      ]};
      return { lines:[
        { type:'error',  text:`  command not found: ${trimmed}` },
        { type:'output', text:'  Type "help" for all commands. TAB to autocomplete.' },
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
    matrix:  'text-cyan-500 opacity-70',
  };
  const glow: Partial<Record<string, React.CSSProperties>> = {
    accent:  { textShadow:'0 0 8px rgba(34,211,238,0.45)' },
    matrix:  { textShadow:'0 0 5px rgba(34,211,238,0.55)' },
    success: { textShadow:'0 0 6px rgba(52,211,153,0.25)' },
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
          style={{ animation:'blink 0.8s step-end infinite' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TerminalSection() {
  const [history,     setHistory    ] = useState<OutputLine[]>([]);
  const [typingLine,  setTypingLine ] = useState<OutputLine | null>(null);
  const [input,       setInput      ] = useState('');
  const [cmdHistory,  setCmdHistory ] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [visible,     setVisible    ] = useState(false);
  const [booted,      setBooted     ] = useState(false);

  const histIdxRef    = useRef(-1);
  const currentPathRef= useRef<string[]>([]);
  const outputRef     = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);
  const sectionRef    = useRef<HTMLElement>(null);
  const pendingRef    = useRef<OutputLine[]>([]);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef     = useRef(false);
  const onCompleteRef = useRef<(() => void) | null>(null);

  // Keep ref in sync with state
  useEffect(() => { currentPathRef.current = currentPath; }, [currentPath]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
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
        timerRef.current = setTimeout(tick, next.instant ? 38 : LINE_PAUSE);
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
    const path    = currentPathRef.current;
    const trimmed = raw.trim();
    const prompt  = getPrompt(path);
    const echo: OutputLine = { type:'input', text:`${prompt} ${trimmed}` };
    const { lines, effect, newPath } = processCommand(trimmed, path);

    if (lines[0]?.text === '__CLEAR__') { setHistory([]); return; }

    setHistory(prev => [...prev, echo]);
    if (trimmed) {
      setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
      histIdxRef.current = -1;
    }
    if (newPath !== undefined) {
      setCurrentPath(newPath);
      currentPathRef.current = newPath;
    }
    if (lines.length > 0) {
      pendingRef.current = [...lines];
      processQueue();
    }
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
        { type:'success', text:'  ● SESSION RESTORED — filesystem mounted.' },
        { type:'output',  text:'  Type "help" or "ls" to explore.' },
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
      { type:'output',  text:'mounting virtual filesystem...' },
      { type:'output',  text:'verifying access credentials...' },
      { type:'output',  text:'syncing system data...' },
      { type:'empty',   text:'' },
      { type:'success', text:'● filesystem mounted at /home/omm' },
      { type:'success', text:'● terminal ready.' },
      { type:'empty',   text:'' },
    ];

    onCompleteRef.current = () => {
      const path = currentPathRef.current;
      const echo: OutputLine = { type:'input', text:`${getPrompt(path)} help` };
      const { lines } = processCommand('help', path);
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

      const path = currentPathRef.current;
      const dirNode = getNodeAtPath(path);
      const curDir = dirNode?.kind === 'dir' ? (dirNode as FSDir) : null;

      // Smart cd completion
      if (lower.startsWith('cd ')) {
        const partial = lower.slice(3);
        const dirs = curDir
          ? Object.entries(curDir.children)
              .filter(([k, v]) => v.kind === 'dir' && k.startsWith(partial))
              .map(([k]) => k)
          : [];
        if (dirs.length === 1) { setInput(`cd ${dirs[0]}`); return; }
        if (dirs.length > 1) {
          flushTyping();
          setHistory(prev => [...prev,
            { type:'output', text:`  Directories:` },
            ...dirs.map(d => ({ type:'accent' as LineType, text:`  → ${d}/` })),
            { type:'empty', text:'' },
          ]);
          return;
        }
      }

      // Smart cat completion
      if (lower.startsWith('cat ')) {
        const partial = lower.slice(4);
        const files = curDir
          ? Object.entries(curDir.children)
              .filter(([k, v]) => v.kind === 'file' && k.startsWith(partial))
              .map(([k]) => k)
          : [];
        if (files.length === 1) { setInput(`cat ${files[0]}`); return; }
        if (files.length > 1) {
          flushTyping();
          setHistory(prev => [...prev,
            { type:'output', text:`  Files:` },
            ...files.map(f => ({ type: fileLineType(f) as LineType, text:`  ${fileIcon(f)} ${f}` })),
            { type:'empty', text:'' },
          ]);
          return;
        }
      }

      // Static command completion
      const matches = ALL_COMMANDS.filter(c => c.startsWith(lower) && c !== lower);
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        flushTyping();
        setHistory(prev => [...prev,
          { type:'output', text:`  Matches for "${lower}":` },
          ...matches.map(m => ({ type:'accent' as LineType, text:`  → ${m}` })),
          { type:'empty', text:'' },
        ]);
      }
    }
  }, [executeInput, input, cmdHistory, flushTyping]);

  const prompt = getPrompt(currentPath);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-labelledby="terminal-heading"
      className="relative w-full bg-black overflow-hidden py-20 sm:py-28 border-t border-zinc-900"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`mb-10 sm:mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 mb-4">{'// TERMINAL_INTERFACE'}</p>
          <h2 id="terminal-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Interactive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">OS Terminal.</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-cyan-500/50 shrink-0" />
            <p className="text-sm sm:text-lg text-zinc-400 max-w-xl">
              Virtual filesystem with{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">ls</code>,{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">cd</code>, and{' '}
              <code className="text-cyan-400 font-mono text-xs bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">cat</code>.{' '}
              <span className="text-zinc-600">TAB autocompletes.</span>
            </p>
          </div>
        </div>

        {/* Terminal window */}
        <div
          className={`rounded-xl overflow-hidden border border-zinc-800 transition-all duration-700 ease-out delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ boxShadow:'0 0 80px rgba(34,211,238,0.07), inset 0 0 40px rgba(34,211,238,0.02)' }}
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
                {prompt.replace('$', '')} — OMM//AI TERMINAL v2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-600 tracking-wider select-none">LIVE</span>
            </div>
          </div>

          {/* Scanlines */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-b-xl"
            style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)' }} />

          {/* Output */}
          <div
            ref={outputRef}
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
            aria-relevant="additions"
            className="terminal-output relative bg-zinc-950/95 backdrop-blur-md px-4 sm:px-5 pt-4 pb-2 overflow-y-auto cursor-text"
            style={{ height:'clamp(300px, 50vh, 480px)' }}
          >
            <div className="space-y-[2px]">
              {history.map((line, i) => <TerminalLine key={i} line={line} />)}
              {typingLine && <TerminalLine line={typingLine} isTyping />}
            </div>

            {/* Prompt row */}
            <div className="flex items-center gap-2 mt-2 mb-1">
              <span
                className="font-mono text-[11px] sm:text-xs text-cyan-400 shrink-0 select-none whitespace-nowrap"
                style={{ textShadow:'0 0 8px rgba(34,211,238,0.6)' }}
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
              <span className="w-[7px] h-3.5 bg-cyan-400 shrink-0 select-none" aria-hidden="true"
                style={{ animation:'blink 1s step-end infinite' }} />
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
              <span className="text-zinc-600 font-mono">
                {currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~'}
              </span>
              <span className="text-cyan-900">●</span>
              <span className="text-zinc-700">{cmdHistory.length} CMD{cmdHistory.length !== 1 ? 'S' : ''}</span>
            </div>
          </div>
        </div>

        {/* Quick command pills */}
        <div className={`mt-5 transition-all duration-700 ease-out delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-700 mb-3 select-none">QUICK COMMANDS →</p>
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

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .terminal-output::-webkit-scrollbar { width: 6px; }
        .terminal-output::-webkit-scrollbar-track { background: transparent; }
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
