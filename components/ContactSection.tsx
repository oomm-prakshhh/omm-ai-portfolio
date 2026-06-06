'use client';

import { useEffect, useRef, useState } from 'react';

const channels = [
  {
    id: 'email',
    node: 'EMAIL_NODE',
    label: 'Direct Transmission',
    value: 'ommprakashs648@gmail.com',
    href: 'mailto:ommprakashs648@gmail.com',
    status: 'ACTIVE',
    statusColor: '#22d3ee',
    protocol: 'SMTP.SECURE',
    latency: '< 24H',
    accent: '#22d3ee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'github',
    node: 'GITHUB_REPOSITORY',
    label: 'Code Repository',
    value: 'github.com/oomm-prakshhh',
    href: 'https://github.com/oomm-prakshhh',
    status: 'ONLINE',
    statusColor: '#a78bfa',
    protocol: 'GIT.API.V3',
    latency: 'REALTIME',
    accent: '#a78bfa',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    node: 'LINKEDIN_NETWORK',
    label: 'Professional Network',
    value: 'linkedin.com/in/omm-prakash-sahoo',
    href: 'https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/',
    status: 'CONNECTED',
    statusColor: '#3b82f6',
    protocol: 'NET.PROFESSIONAL',
    latency: 'ACTIVE',
    accent: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

function ChannelCard({ ch, delay }: { ch: typeof channels[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const [ping, setPing] = useState(false);

  // Periodic ping pulse — deterministic timing from delay offset
  useEffect(() => {
    const id = setInterval(() => {
      setPing(true);
      setTimeout(() => setPing(false), 600);
    }, 3000 + delay);
    return () => clearInterval(id);
  }, [delay]);

  return (
    <div
      className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/*
        The <a> IS the card — no inner wrapper div.
        Every pixel of the card surface triggers the link.
        cursor-pointer + will-change-transform ensure snappy, reliable interaction.
      */}
      <a
        href={ch.href}
        target={ch.id !== 'email' ? '_blank' : undefined}
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-md cursor-pointer will-change-transform transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/30 hover:scale-[1.015] hover:-translate-y-1.5 active:scale-[0.99] active:translate-y-0 active:duration-100"
        style={{
          boxShadow: hovered
            ? `0 12px 48px -10px ${ch.accent}30, 0 0 0 1px ${ch.accent}18`
            : '0 2px 8px -2px rgba(0,0,0,0.5)',
        }}
      >
        {/* Animated inset glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 50px ${ch.accent}12` }}
        />

        {/* Background micro-grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

        {/* Scanline sweep on hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="w-full h-px absolute top-0"
            style={{
              background: `linear-gradient(to right, transparent, ${ch.accent}50, transparent)`,
              animation: 'scanline 3s infinite linear',
            }}
          />
        </div>

        {/* Left accent bar — slides down on hover */}
        <div
          className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-500 ease-out pointer-events-none"
          style={{ backgroundColor: ch.accent }}
        />

        {/* Bottom accent sweep line */}
        <div
          className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-700 ease-in-out pointer-events-none"
          style={{ background: `linear-gradient(to right, ${ch.accent}, ${ch.accent}00)` }}
        />

        {/* ── Card Content ───────────────────────────────────────── */}
        <div className="relative p-6 flex flex-col sm:flex-row sm:items-center gap-5">

          {/* Icon node */}
          <div
            className="relative shrink-0 w-12 h-12 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center transition-all duration-500 group-hover:border-zinc-600"
            style={{
              color: hovered ? ch.accent : '#71717a',
              boxShadow: hovered ? `0 0 24px ${ch.accent}35` : 'none',
            }}
          >
            {ch.icon}
            {/* Periodic ping ring */}
            {ping && (
              <span
                className="absolute inset-0 rounded-lg border animate-ping"
                style={{ borderColor: `${ch.accent}55` }}
              />
            )}
          </div>

          {/* Main text */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-[9px] font-mono tracking-[0.4em] font-bold transition-colors duration-300"
                style={{ color: hovered ? ch.accent : '#52525b' }}
              >
                {ch.node}
              </span>
              <span className="text-[9px] font-mono text-zinc-800">{'///'}</span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-700">
                {ch.protocol}
              </span>
            </div>

            <p className="text-sm font-mono font-semibold text-zinc-300 group-hover:text-white transition-colors duration-300 truncate">
              {ch.value}
            </p>

            <p className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
              {ch.label}
            </p>
          </div>

          {/* Right metadata */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
            {/* Status badge */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ backgroundColor: ch.statusColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ backgroundColor: ch.statusColor }}
                />
              </span>
              <span
                className="text-[9px] font-mono font-bold tracking-widest"
                style={{ color: ch.statusColor }}
              >
                {ch.status}
              </span>
            </div>

            {/* Response latency */}
            <div className="text-[9px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">
              RESP:{' '}
              <span style={{ color: hovered ? ch.accent : undefined }}>
                {ch.latency}
              </span>
            </div>

            {/* Arrow — slides right on hover */}
            <div
              className="group-hover:translate-x-1.5 transition-transform duration-300"
              style={{ color: hovered ? ch.accent : '#3f3f46' }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-28 border-t border-zinc-900"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-cyan-600/[0.04] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.04] blur-[140px] pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="mb-16">
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out mb-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">
              {'// COMMUNICATION.NODES'}
            </span>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-75 mb-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
              Initiate a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                connection.
              </span>
            </h2>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-100 flex items-center gap-6">
            <div className="w-12 h-px bg-cyan-500/50" />
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl">
              Select a channel to establish contact. All nodes are monitored and active.
            </p>
          </div>
        </div>

        {/* ── System Status Bar ──────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-150 mb-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 rounded-lg border border-zinc-900 bg-zinc-950/50 backdrop-blur-md font-mono text-[9px] tracking-widest">
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>COMM.STATUS: <span className="text-cyan-400">ONLINE</span></span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <span>NODES.ACTIVE: <span className="text-white">03</span></span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <span>ENCRYPTION: <span className="text-emerald-400">ENABLED</span></span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 sm:ml-auto">
              <span>UPTIME: <span className="text-blue-400">99.9%</span></span>
            </div>
          </div>
        </div>

        {/* ── Channel Cards ──────────────────────────────────────── */}
        <div className="space-y-4">
          {channels.map((ch, i) => (
            <ChannelCard key={ch.id} ch={ch} delay={200 + i * 100} />
          ))}
        </div>

        {/* ── Footer log line ────────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[600ms] mt-14 flex items-center justify-between border-t border-zinc-900 pt-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-700">
            END OF COMM.LOG // NODE.COUNT: 03
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-500/50">
            SECURE.CHANNEL.ACTIVE
          </span>
        </div>
      </div>
    </section>
  );
}
