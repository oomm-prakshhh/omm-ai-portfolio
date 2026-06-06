'use client';

import { useEffect, useRef } from 'react';

const navLinks = [
  { label: 'Mission', href: '#mission' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'System Builds', href: '#builds' },
  { label: 'Profile', href: '#profile' },
  { label: 'Contact', href: '#contact' },
];

const techStack = [
  { label: 'Next.js', accent: '#22d3ee' },
  { label: 'React Three Fiber', accent: '#a78bfa' },
  { label: 'GSAP', accent: '#34d399' },
  { label: 'Tailwind CSS', accent: '#38bdf8' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }),
      { threshold: 0.1 }
    );
    footerRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black overflow-hidden border-t border-zinc-900"
    >
      {/* ── Ambient glows ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full bg-cyan-600/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-blue-600/[0.03] blur-[120px] pointer-events-none" />

      {/* ── Micro-grid background ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* ── Top system divider ────────────────────────────────────── */}
      <div className="relative flex items-center gap-4 px-4 sm:px-6 lg:px-8 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-cyan-500/60">SYS.FOOTER.ACTIVE</span>
          <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* ── Main footer grid ──────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* ── LEFT: Brand ───────────────────────────────────────── */}
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out space-y-5">
            {/* Logo */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-cyan-400" />
                </div>
                <span className="text-lg font-extrabold tracking-widest text-white font-mono">
                  OMM
                  <span className="text-cyan-400">{'//'}</span>
                  AI
                </span>
              </div>
              <div className="text-[8px] font-mono tracking-[0.4em] text-zinc-700 pl-8">
                OPERATING.SYSTEM.v1.0
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs font-light">
              Engineering intelligent systems and immersive digital experiences for the next generation.
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-emerald-500">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* ── CENTER: Navigation ────────────────────────────────── */}
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-100 space-y-5">
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-[0.45em] text-cyan-400">
                QUICK.NAVIGATION
              </span>
              <div className="w-8 h-px bg-cyan-500/40 mt-1" />
            </div>

            <nav className="space-y-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 py-1.5 transition-all duration-300"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span className="w-0 h-px bg-cyan-400 group-hover:w-4 transition-all duration-300 ease-out" />
                  <span className="text-[11px] font-mono tracking-widest text-zinc-500 group-hover:text-cyan-400 transition-colors duration-300">
                    {link.label.toUpperCase()}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {'//'}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* ── RIGHT: System Info ────────────────────────────────── */}
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-200 space-y-5">
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-[0.45em] text-cyan-400">
                SYSTEM.INFORMATION
              </span>
              <div className="w-8 h-px bg-cyan-500/40 mt-1" />
            </div>

            {/* System data panel */}
            <div className="rounded-lg border border-zinc-900 bg-zinc-950/50 backdrop-blur-md overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-900 bg-zinc-950/80">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="ml-2 text-[8px] font-mono text-zinc-700 tracking-widest">SYS.MONITOR</span>
              </div>

              {/* Data rows */}
              <div className="divide-y divide-zinc-900/50">
                {[
                  { key: 'STATUS', value: 'ONLINE', color: '#22d3ee' },
                  { key: 'VERSION', value: 'OMM//AI v1.0', color: '#a78bfa' },
                  { key: 'UPTIME', value: '99.9%', color: '#34d399' },
                  { key: 'CORE', value: 'AI.ACTIVE', color: '#f59e0b' },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between px-3 py-2.5 group hover:bg-zinc-900/30 transition-colors duration-200">
                    <span className="text-[9px] font-mono text-zinc-700 tracking-widest">
                      {row.key}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: row.color }} />
                      <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: row.color }}>
                        {row.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div className="reveal opacity-0 transition-all duration-700 ease-out delay-300 mt-14 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-900" />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
            </div>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[350ms]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Copyright */}
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-[11px] font-mono text-zinc-500 tracking-wide">
                © 2026{' '}
                <span className="text-zinc-300">Omm Prakash Sahoo</span>
              </p>
              <p className="text-[9px] font-mono text-zinc-800 tracking-widest">
                ALL RIGHTS RESERVED {'// OMM//AI SYSTEMS'}
              </p>
            </div>

            {/* Tech stack chips */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
              <span className="text-[8px] font-mono text-zinc-800 tracking-widest mr-1">
                BUILT.WITH
              </span>
              {techStack.map((tech) => (
                <div
                  key={tech.label}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-900 bg-zinc-950/60 hover:border-zinc-700 transition-all duration-300 cursor-default"
                >
                  <span
                    className="w-1 h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: tech.accent }}
                  />
                  <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors tracking-wide">
                    {tech.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom terminal line ──────────────────────────────────── */}
      <div className="relative border-t border-zinc-900/50 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <span className="text-[8px] font-mono text-zinc-800 tracking-[0.3em]">
          {'> OMM//AI.OS TERMINAL — SESSION END'}
        </span>
        <span className="text-[8px] font-mono text-cyan-500/30 tracking-[0.3em]">
          EOF
        </span>
      </div>
    </footer>
  );
}
