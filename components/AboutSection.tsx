'use client';

import { useEffect, useRef, useState } from 'react';

const focusTags = [
  { label: 'Artificial Intelligence', color: '#22d3ee', code: 'AI.SYS' },
  { label: 'Web Development',         color: '#3b82f6', code: 'WEB.SYS' },
  { label: 'Interactive Experiences', color: '#8b5cf6', code: 'EXP.SYS' },
];

const learningStack = [
  { label: 'AI Systems',               icon: '◈', color: '#22d3ee' },
  { label: 'Full Stack Development',   icon: '◉', color: '#3b82f6' },
  { label: 'Modern Web Technologies',  icon: '◐', color: '#8b5cf6' },
];

const timelineItems = [
  { year: '2023', event: 'Began B.Tech Computer Science journey', code: 'INIT' },
  { year: '2024', event: 'Explored AI, ML, and Web Development',  code: 'LEARN' },
  { year: '2025', event: 'Launched first AI-powered projects',    code: 'BUILD' },
  { year: '2026', event: 'Expanding systems & pushing boundaries',code: 'SCALE' },
];



export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-28 border-t border-zinc-900"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[140px] pointer-events-none" />

      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ────────────────────────────────────── */}
        <div className="mb-16">
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out mb-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">
              {'// DEVELOPER PROFILE'}
            </span>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-75 mb-6 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">
              The engineer behind{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                OMM//AI
              </span>
            </h2>
            {/* Profile ID Badge */}
            <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500 border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 rounded backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>PROFILE_ID: <span className="text-cyan-400">OMM-8849-SEC4</span></span>
            </div>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-100 flex items-center gap-6">
            <div className="w-12 h-px bg-cyan-500/50" />
            <p className="text-sm font-mono tracking-widest text-zinc-500 uppercase">
              Subject.Dossier {'//'}  ACCESS GRANTED
            </p>
          </div>
        </div>

        {/* ── Main Dossier Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── Left Panel: Core Records (3/5 width) ─────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Core Fields Card */}
            <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-100">
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-500">SUBJECT.RECORDS // CORE_DATA</span>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span className="w-2 h-2 rounded-full bg-cyan-500/70" />
                  </div>
                </div>

                {/* Scanline sweep */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    className="w-full h-[1px] absolute"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.15), transparent)',
                      animation: 'scanline 6s infinite linear',
                    }}
                  />
                </div>

                <div className="p-5 space-y-0 divide-y divide-zinc-900/80">
                  {[
                    { key: 'NAME',   val: 'Omm Prakash Sahoo',      accent: '#22d3ee', id: 'name' },
                    { key: 'ROLE',   val: 'AI & Web Developer',      accent: '#3b82f6', id: 'role' },
                    { key: 'STATUS', val: 'ONLINE',                  accent: '#22d3ee', id: 'status', isPulse: true },
                    { key: 'MISSION',val: 'Building intelligent systems that combine creativity, engineering, and innovation.', accent: '#8b5cf6', id: 'mission' },
                  ].map(({ key, val, accent, id, isPulse }) => (
                    <div
                      key={id}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-4 group/field cursor-default"
                      onMouseEnter={() => setHoveredField(id)}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      <span
                        className="text-[9px] font-mono tracking-[0.35em] text-zinc-600 pt-0.5 min-w-[80px] group-hover/field:text-zinc-500 transition-colors"
                      >
                        {key}
                      </span>
                      <div className="flex-1 flex items-center gap-3">
                        {isPulse && (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                          </span>
                        )}
                        <span
                          className="text-sm font-mono font-semibold transition-colors duration-300"
                          style={{ color: hoveredField === id ? accent : '#a1a1aa' }}
                        >
                          {val}
                        </span>
                      </div>
                      {/* Row glow underline on hover */}
                      <div
                        className="hidden sm:block h-px w-0 self-center transition-all duration-500"
                        style={{
                          width: hoveredField === id ? '24px' : '0',
                          background: `linear-gradient(to right, ${accent}, transparent)`,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-150">
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-600">FOCUS.MODULES</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {focusTags.map((f) => (
                    <div
                      key={f.code}
                      className="group/tag flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 cursor-default"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: f.color }}
                      />
                      <span className="text-[11px] font-mono text-zinc-400 group-hover/tag:text-zinc-200 transition-colors">
                        {f.label}
                      </span>
                      <span
                        className="text-[9px] font-mono opacity-40 group-hover/tag:opacity-70 transition-opacity"
                        style={{ color: f.color }}
                      >
                        [{f.code}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-200">
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md p-5">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-600">SYSTEM.TIMELINE</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent" />
                </div>
                <div className="relative space-y-0">
                  {/* Vertical line */}
                  <div className="absolute left-[34px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/40 via-blue-500/20 to-transparent" />
                  {timelineItems.map((item, i) => (
                    <div key={item.year} className="flex gap-4 items-start py-3 group/tl">
                      {/* Year bubble */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <div
                          className="w-[68px] text-center text-[9px] font-mono font-bold tracking-widest py-1 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-500 group-hover/tl:text-cyan-400 group-hover/tl:border-cyan-900 transition-all duration-300"
                        >
                          {item.year}
                        </div>
                      </div>
                      {/* Event */}
                      <div className="flex-1 pt-1 space-y-0.5">
                        <span
                          className="text-[9px] font-mono tracking-widest text-zinc-700 group-hover/tl:text-cyan-600 transition-colors"
                          style={{ transitionDelay: `${i * 30}ms` }}
                        >
                          [{item.code}]
                        </span>
                        <p className="text-xs text-zinc-500 group-hover/tl:text-zinc-300 transition-colors">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Status & Learning (2/5 width) ───────── */}
          <div className="lg:col-span-2 space-y-4">



            {/* Classification Tags */}
            <div className="reveal opacity-0 translate-x-6 transition-all duration-700 ease-out delay-200">
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-600">CLEARANCE.TAGS</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: 'LEVEL.01.DEV',    color: '#22d3ee' },
                    { tag: 'CORE.AI',         color: '#8b5cf6' },
                    { tag: 'CLASS.SYSTEMS',   color: '#3b82f6' },
                    { tag: 'AUTH.BUILDER',    color: '#22d3ee' },
                    { tag: 'SYS.ENGINEER',    color: '#f59e0b' },
                    { tag: 'OPEN.SOURCE',     color: '#10b981' },
                  ].map(({ tag, color }) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-2 py-1 rounded border border-zinc-900 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200 cursor-default"
                      style={{ color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Learning */}
            <div className="reveal opacity-0 translate-x-6 transition-all duration-700 ease-out delay-[250ms]">
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
                <div className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-500">CURRENT.LEARNING</span>
                </div>
                <div className="p-5 space-y-3">
                  {learningStack.map((item, i) => (
                    <div
                      key={item.label}
                      className="group/learn flex items-center gap-3 cursor-default"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <span
                        className="text-base shrink-0 transition-all duration-300 group-hover/learn:scale-110"
                        style={{ color: item.color }}
                      >
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-mono text-zinc-500 group-hover/learn:text-zinc-200 transition-colors duration-300 truncate block">
                          {item.label}
                        </span>
                        <div
                          className="h-px w-0 group-hover/learn:w-full transition-all duration-500 mt-1"
                          style={{ background: `linear-gradient(to right, ${item.color}60, transparent)` }}
                        />
                      </div>
                      <span
                        className="text-[8px] font-mono opacity-0 group-hover/learn:opacity-60 transition-opacity duration-300"
                        style={{ color: item.color }}
                      >
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="reveal opacity-0 translate-x-6 transition-all duration-700 ease-out delay-[300ms]">
              <div className="relative overflow-hidden rounded-xl border border-emerald-900/30 bg-emerald-950/10 backdrop-blur-md p-5">
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-emerald-600">AVAILABILITY</span>
                    <p className="text-sm font-mono font-semibold text-emerald-400">
                      Open to Collaborations
                    </p>
                    <p className="text-[10px] font-mono text-zinc-600">
                      AI projects · Web development · Open source
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer log line ───────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[400ms] mt-12 flex items-center gap-4 justify-between border-t border-zinc-900 pt-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-600">END OF DOSSIER // SUBJECT.OMM-8849</span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-500/60">ACCESS.LEVEL: AUTHORIZED</span>
        </div>
      </div>
    </section>
  );
}
