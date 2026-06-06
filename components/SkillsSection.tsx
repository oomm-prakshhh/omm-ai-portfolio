'use client';

import { useEffect, useRef, useState } from 'react';

// ── Card data ──────────────────────────────────────────────────────────────────
const categories = [
  {
    id: '01',
    code: 'AI.SYS',
    label: 'Artificial Intelligence',
    statusLine: 'DYNAMIC STATUS : ACTIVE',
    subStatus: [
      { label: 'AI MODULES',     value: 'LOADED',  dot: 'cyan'   },
      { label: 'INFERENCE',      value: 'ONLINE',  dot: 'cyan'   },
    ],
    desc: 'Designing and deploying intelligent systems that reason, generate, and adapt.',
    accent: '#22d3ee',
    borderColor: 'border-cyan-500/25',
    textColor: 'text-cyan-400',
    badgeStyle: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400',
    glowStyle: 'hover:shadow-[0_0_50px_rgba(34,211,238,0.14),inset_0_0_40px_rgba(34,211,238,0.03)]',
    skills: [
      { name: 'Prompt Engineering', tag: 'LANG' },
      { name: 'AI APIs',            tag: 'NET'  },
      { name: 'AI Workflow Design', tag: 'ARCH' },
    ],
  },
  {
    id: '02',
    code: 'FE.SYS',
    label: 'Frontend Development',
    statusLine: 'RENDERING ENGINE : ONLINE',
    subStatus: [
      { label: 'UI SYSTEMS',  value: 'ACTIVE',  dot: 'blue'  },
      { label: 'RENDERER',    value: 'ONLINE',  dot: 'blue'  },
    ],
    desc: 'Building pixel-perfect, performant interfaces that run at the speed of thought.',
    accent: '#3b82f6',
    borderColor: 'border-blue-500/25',
    textColor: 'text-blue-400',
    badgeStyle: 'bg-blue-950/60 border-blue-500/30 text-blue-400',
    glowStyle: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.14),inset_0_0_40px_rgba(59,130,246,0.03)]',
    skills: [
      { name: 'HTML',         tag: 'CORE' },
      { name: 'CSS',          tag: 'CORE' },
      { name: 'JavaScript',   tag: 'LANG' },
      { name: 'React',        tag: 'LIB'  },
      { name: 'Next.js',      tag: 'FW'   },
      { name: 'Tailwind CSS', tag: 'UTIL' },
    ],
  },
  {
    id: '03',
    code: 'BE.SYS',
    label: 'Backend Development',
    statusLine: 'API STATUS : ONLINE',
    subStatus: [
      { label: 'DATABASE',   value: 'CONNECTED', dot: 'indigo' },
      { label: 'API LAYER',  value: 'ONLINE',    dot: 'indigo' },
    ],
    desc: 'Engineering resilient server-side systems and APIs that scale gracefully.',
    accent: '#818cf8',
    borderColor: 'border-indigo-500/25',
    textColor: 'text-indigo-400',
    badgeStyle: 'bg-indigo-950/60 border-indigo-500/30 text-indigo-400',
    glowStyle: 'hover:shadow-[0_0_50px_rgba(129,140,248,0.14),inset_0_0_40px_rgba(129,140,248,0.03)]',
    skills: [
      { name: 'Node.js',    tag: 'RT'   },
      { name: 'Express.js', tag: 'FW'   },
      { name: 'REST APIs',  tag: 'ARCH' },
      { name: 'MongoDB',    tag: 'DB'   },
    ],
  },
  {
    id: '04',
    code: 'LANG.SYS',
    label: 'Programming Languages',
    statusLine: 'RUNTIME STATUS : READY',
    subStatus: [
      { label: 'COMPILE LAYER', value: 'ACTIVE', dot: 'sky'  },
      { label: 'RUNTIME',       value: 'READY',  dot: 'sky'  },
    ],
    desc: 'Proficient across multiple paradigms — from systems-level to scripted intelligence.',
    accent: '#06b6d4',
    borderColor: 'border-cyan-600/20',
    textColor: 'text-cyan-500',
    badgeStyle: 'bg-cyan-900/40 border-cyan-600/30 text-cyan-500',
    glowStyle: 'hover:shadow-[0_0_50px_rgba(6,182,212,0.14),inset_0_0_40px_rgba(6,182,212,0.03)]',
    skills: [
      { name: 'Python',     tag: 'SCRIPT' },
      { name: 'JavaScript', tag: 'SCRIPT' },
      { name: 'Java',       tag: 'OOP'    },
      { name: 'C',          tag: 'SYS'    },
    ],
  },
];

const dotColors: Record<string, string> = {
  cyan:   '#22d3ee',
  blue:   '#3b82f6',
  indigo: '#818cf8',
  sky:    '#06b6d4',
};

// ── Animated live clock ────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

// ── Animated counter (counts up once revealed) ─────────────────────────────────
function LiveCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let start = 0;
      const step = Math.ceil(target / 30);
      const id = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(id); }
        else setVal(start);
      }, 40);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Single blinking light ──────────────────────────────────────────────────────
function BlinkDot({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
        style={{ backgroundColor: color, animationDelay: `${delay}ms` }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

// ── Tiny horizontal data stream ────────────────────────────────────────────────
function DataStream({ color }: { color: string }) {
  return (
    <div className="relative w-full h-px overflow-hidden rounded-full bg-zinc-900">
      <div
        className="absolute top-0 h-full w-1/3 rounded-full animate-[datastream_2.5s_linear_infinite]"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
      />
    </div>
  );
}

// ── Card component ─────────────────────────────────────────────────────────────
function CapabilityPanel({ cat, delay }: { cat: typeof categories[0]; delay: number }) {
  const [active, setActive] = useState(false);
  const [tick, setTick] = useState(false);

  // Status light blink every 3 s
  useEffect(() => {
    const id = setInterval(() => setTick(p => !p), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border ${cat.borderColor} bg-zinc-950/80 backdrop-blur-md
          transition-all duration-500 cursor-default ${cat.glowStyle} hover:border-opacity-60 hover:scale-[1.015]`}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        {/* ── Gradient overlay on hover ── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${cat.accent}15 0%, transparent 50%, ${cat.accent}06 100%)` }}
        />

        {/* ── Subtle inner grid ── */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:18px_18px] opacity-25 group-hover:opacity-50 transition-opacity duration-500" />

        {/* ── Scan line sweep on hover ── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div
            className="absolute left-0 right-0 h-px animate-[scanline_3s_ease-in-out_infinite]"
            style={{ background: `linear-gradient(to right, transparent, ${cat.accent}60, transparent)` }}
          />
        </div>

        {/* ── Top scanning border line ── */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to right, transparent, ${cat.accent}, transparent)` }}
        />

        <div className="relative p-6">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BlinkDot color={cat.accent} delay={(parseInt(cat.id, 10) * 314) % 1000} />
                <span className="text-[10px] font-mono tracking-[0.35em] text-zinc-500">{cat.code}</span>
              </div>
              <h3 className={`text-xl font-bold tracking-tight text-white group-hover:${cat.textColor} transition-colors duration-300`}>
                {cat.label}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`font-mono text-2xl font-black leading-none opacity-10 group-hover:opacity-20 transition-opacity ${cat.textColor}`}>
                {cat.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono tracking-wider ${cat.badgeStyle}`}>
                <span
                  className="w-1 h-1 rounded-full inline-block"
                  style={{ backgroundColor: cat.accent, opacity: tick ? 1 : 0.3, transition: 'opacity 0.4s' }}
                />
                ACTIVE
              </span>
            </div>
          </div>

          {/* ── Live status line ── */}
          <div
            className="mb-3 px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-widest border"
            style={{ borderColor: `${cat.accent}20`, backgroundColor: `${cat.accent}06`, color: cat.accent }}
          >
            ▸ {cat.statusLine}
          </div>

          {/* ── Sub-status indicators ── */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {cat.subStatus.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-zinc-800/60 bg-zinc-900/40 px-2.5 py-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: dotColors[s.dot], opacity: tick ? 1 : 0.5, transition: 'opacity 0.6s' }}
                />
                <div className="min-w-0">
                  <div className="text-[9px] font-mono text-zinc-600 truncate">{s.label}</div>
                  <div className="text-[10px] font-mono font-semibold truncate" style={{ color: dotColors[s.dot] }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Data stream animation ── */}
          <div className="mb-4">
            <DataStream color={cat.accent} />
          </div>

          {/* ── Description ── */}
          <p className={`text-xs text-zinc-500 leading-relaxed mb-5 transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
            {cat.desc}
          </p>

          {/* ── Skill tags ── */}
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill, si) => (
              <div
                key={skill.name}
                className="group/tag relative flex items-center gap-1.5 rounded-lg border border-zinc-800
                  bg-zinc-900/50 px-3 py-1.5 transition-all duration-300 hover:bg-zinc-800/60"
                style={{ borderColor: active ? `${cat.accent}30` : undefined, transitionDelay: `${si * 25}ms` }}
              >
                <span
                  className="text-[9px] font-mono leading-none px-1 py-0.5 rounded"
                  style={{ backgroundColor: `${cat.accent}15`, color: cat.accent }}
                >
                  {skill.tag}
                </span>
                <span className="text-xs font-medium text-zinc-300 group-hover/tag:text-white transition-colors">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          {/* ── Footer row ── */}
          <div
            className="mt-5 pt-4 border-t flex items-center justify-between transition-colors duration-500"
            style={{ borderColor: active ? `${cat.accent}20` : 'rgba(255,255,255,0.04)' }}
          >
            <span className="text-[10px] font-mono text-zinc-600">
              <LiveCounter target={cat.skills.length} /> MODULES LOADED
            </span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(cat.skills.length, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-0.5 rounded-full transition-all duration-500"
                  style={{ backgroundColor: active ? cat.accent : 'rgba(255,255,255,0.08)', opacity: active ? 0.7 : 1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Moving grid background ─────────────────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] animate-[gridmove_20s_linear_infinite]"
        style={{
          backgroundImage: 'linear-gradient(to right,#22d3ee 1px,transparent 1px),linear-gradient(to bottom,#22d3ee 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

// ── Top system status bar ──────────────────────────────────────────────────────
function SystemStatusBar() {
  const [beat, setBeat] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setBeat(p => !p), 1500);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: 'SYSTEM STATUS', value: 'ONLINE',          dot: '#22d3ee' },
    { label: 'AI MODULES',    value: 'ACTIVE',          dot: '#3b82f6' },
    { label: 'NETWORK',       value: 'STABLE',          dot: '#818cf8' },
    { label: 'BUILD VERSION', value: '2026.06',         dot: '#06b6d4' },
  ];

  return (
    <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[50ms] mb-10">
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-4 py-3">
        {/* subtle scan across top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono tracking-widest">
              <span
                className="w-1.5 h-1.5 rounded-full transition-opacity duration-500"
                style={{ backgroundColor: item.dot, opacity: beat ? 1 : 0.25 }}
              />
              <span className="text-zinc-600">{item.label}</span>
              <span className="text-zinc-400">:</span>
              <span className="font-semibold" style={{ color: item.dot }}>{item.value}</span>
            </div>
          ))}

          {/* Live clock on the right */}
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse" />
            SYS.CLOCK : <span className="text-zinc-400"><LiveClock /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Terminal system info block ─────────────────────────────────────────────────
function SystemInfoBlock() {
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor(p => !p), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-[180ms] mb-14">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md font-mono text-xs">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800/60 bg-zinc-900/40 px-4 py-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[10px] text-zinc-500 tracking-widest">OMM//AI — system.info</span>
        </div>

        <div className="px-5 py-4 space-y-1.5 text-[11px]">
          <div className="text-zinc-600">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="flex gap-4">
            <span className="text-zinc-600 w-32 shrink-0">SYSTEM STATUS</span>
            <span className="text-zinc-500">:</span>
            <span className="text-cyan-400">ONLINE</span>
          </div>
          <div className="flex gap-4">
            <span className="text-zinc-600 w-32 shrink-0">AI MODULES</span>
            <span className="text-zinc-500">:</span>
            <span className="text-blue-400">ACTIVE</span>
          </div>
          <div className="flex gap-4">
            <span className="text-zinc-600 w-32 shrink-0">CURRENT FOCUS</span>
            <span className="text-zinc-500">:</span>
            <span className="text-indigo-400">AI + WEB DEVELOPMENT</span>
          </div>
          <div className="flex gap-4">
            <span className="text-zinc-600 w-32 shrink-0">VERSION</span>
            <span className="text-zinc-500">:</span>
            <span className="text-cyan-300">OMM//AI v1.0</span>
          </div>
          <div className="text-zinc-600">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="flex items-center gap-1 pt-0.5">
            <span className="text-cyan-500">▸</span>
            <span className="text-zinc-500">awaiting next command</span>
            <span
              className="inline-block w-2 h-3 bg-cyan-400 ml-1 transition-opacity duration-100"
              style={{ opacity: cursor ? 1 : 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-28"
    >
      {/* Animated moving grid */}
      <AnimatedGrid />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-blue-600/3 blur-[150px] pointer-events-none" />

      {/* Top + bottom border glow lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section heading ── */}
        <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out text-center mb-2">
          <span className="text-[10px] font-mono tracking-[0.5em] text-blue-400">{'//'} SYSTEM CAPABILITIES</span>
        </div>
        <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-75 text-center mb-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Capabilities</h2>
        </div>
        <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-100 text-center mb-10">
          <p className="text-lg text-zinc-400">Technologies powering my ideas.</p>
        </div>

        {/* ── System info terminal ── */}
        <SystemInfoBlock />

        {/* ── Top status bar ── */}
        <SystemStatusBar />

        {/* ── Capability panels ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat, i) => (
            <CapabilityPanel key={cat.id} cat={cat} delay={250 + i * 100} />
          ))}
        </div>

        {/* ── Footer divider ── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[700ms] mt-16 flex items-center gap-4 justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-500/30" />
          <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-700">CAPABILITY MATRIX LOADED</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-blue-500/30" />
        </div>
      </div>
    </section>
  );
}
