'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const builds = [
  {
    id: '01',
    code: 'BLD.01 // JARVIS',
    title: 'JARVIS AI ASSISTANT',
    status: 'DEPLOYED',
    statusDot: '#22d3ee',
    desc: 'Voice-controlled AI assistant capable of executing commands, processing requests, and improving productivity.',
    class: 'SYS.VOICE',
    tech: ['Python', 'Speech Recognition', 'AI APIs'],
    accent: '#22d3ee',
    launchDate: 'OCT 2025',
    version: 'v1.2.0-stable',
    image: '/builds/jarvis.png',
    viewUrl: '#',
    sourceUrl: 'https://github.com/oomm-prakshhh',
  },
  {
    id: '02',
    code: 'BLD.02 // CHAT.AI',
    title: 'AI CHATBOT PLATFORM',
    status: 'IN DEVELOPMENT',
    statusDot: '#eab308',
    desc: 'Conversational AI platform designed to deliver intelligent real-time interactions.',
    class: 'SYS.NLP',
    tech: ['JavaScript', 'React', 'Node.js', 'AI APIs'],
    accent: '#eab308',
    launchDate: 'FEB 2026',
    version: 'v0.8.5-dev',
    image: '/builds/chatbot.png',
    viewUrl: '#',
    sourceUrl: 'https://github.com/oomm-prakshhh',
  },
  {
    id: '03',
    code: 'BLD.03 // PORTFOLIO',
    title: '3D PORTFOLIO SYSTEM',
    status: 'ONLINE',
    statusDot: '#3b82f6',
    desc: 'Interactive portfolio experience combining AI-inspired design, modern web technologies, and immersive 3D elements.',
    class: 'SYS.WEB',
    tech: ['Next.js', 'React Three Fiber', 'GSAP'],
    accent: '#3b82f6',
    launchDate: 'JUN 2026',
    version: 'v2.0.1-prod',
    image: '/builds/portfolio.png',
    viewUrl: 'http://localhost:3000',
    sourceUrl: 'https://github.com/oomm-prakshhh',
  },
];

function BuildCard({ build, delay }: { build: typeof builds[0]; delay: number }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.015] hover:border-zinc-800 hover:bg-zinc-900/20 hover:shadow-2xl cursor-default"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        style={{
          boxShadow: active
            ? `0 10px 40px -10px ${build.accent}12, 0 0 20px -2px ${build.accent}0a`
            : 'none',
        }}
      >
        {/* Animated border glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 30px ${build.accent}15` }}
        />

        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-stretch">
          
          {/* ── Visual Preview Panel ──────────────────────────────── */}
          <div className="relative w-full md:w-[300px] lg:w-[360px] h-56 md:h-auto overflow-hidden bg-black shrink-0 border-b md:border-b-0 md:border-r border-zinc-900/60">

            {/* Image — grayscale at rest, full colour + zoom on hover */}
            <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-[1.08]">
              <Image
                src={build.image}
                alt={`Project preview for ${build.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                className="object-cover transition-all duration-700 ease-in-out filter grayscale contrast-110 brightness-60 group-hover:grayscale-0 group-hover:brightness-100"
              />
            </div>

            {/* Dark vignette base */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />

            {/* Accent-coloured edge glow — intensifies on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
              style={{ boxShadow: `inset 0 0 60px ${build.accent}25` }}
            />

            {/* Micro-grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-60" />

            {/* ── Corner HUD Brackets ─────────────────────────── */}
            {/* Top-left */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="w-4 h-4 border-t border-l transition-all duration-500 group-hover:w-5 group-hover:h-5" style={{ borderColor: build.accent }} />
            </div>
            {/* Top-right */}
            <div className="absolute top-3 right-3 pointer-events-none">
              <div className="w-4 h-4 border-t border-r transition-all duration-500 group-hover:w-5 group-hover:h-5" style={{ borderColor: build.accent }} />
            </div>
            {/* Bottom-left */}
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <div className="w-4 h-4 border-b border-l transition-all duration-500 group-hover:w-5 group-hover:h-5" style={{ borderColor: build.accent }} />
            </div>
            {/* Bottom-right */}
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <div className="w-4 h-4 border-b border-r transition-all duration-500 group-hover:w-5 group-hover:h-5" style={{ borderColor: build.accent }} />
            </div>

            {/* Scanline sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="w-full h-[2px] absolute top-0 animate-[scanline_5s_infinite_linear] group-hover:animate-[scanline_2.5s_infinite_linear] transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, transparent, ${build.accent}60, transparent)`,
                  boxShadow: `0 0 10px ${build.accent}`,
                }}
              />
            </div>

            {/* ── Removed excessive HUD overlays for cleaner aesthetic ── */}

            {/* Project label chip — bottom-left overlay */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 border px-3 py-1 rounded-full text-[8px] font-mono tracking-[0.3em] bg-black/80 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-all duration-500"
              style={{ borderColor: `${build.accent}40`, color: build.accent }}
            >
              {build.code}
            </div>
          </div>


          {/* Right main content and metadata column */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative">
            <div className="space-y-4">
              
              {/* Top metadata records row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-zinc-900/80 pb-4 text-[10px] font-mono text-zinc-500 tracking-wider">
                <div>
                  <span className="text-zinc-600">SYS_ID:</span> <span style={{ color: build.accent }} className="font-bold">BLD-0{build.id}</span>
                </div>
                <div>
                  <span className="text-zinc-600">VERSION:</span> <span className="text-zinc-400">{build.version}</span>
                </div>
                <div>
                  <span className="text-zinc-600">LAUNCH:</span> <span className="text-zinc-400">{build.launchDate}</span>
                </div>
                
                <div className="flex items-center gap-1.5 sm:ml-auto">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: build.statusDot }}
                    />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: build.statusDot }} />
                  </span>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    {build.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-zinc-100 transition-colors">
                  {build.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                  {build.desc}
                </p>
              </div>
            </div>

            {/* Bottom: Tech stack + CTA Buttons */}
            <div className="mt-8 pt-4 border-t border-zinc-900/80 flex flex-col gap-5">

              {/* Tech stack */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">TECH_STACK {'// '}</span>
                <div className="flex flex-wrap gap-1.5">
                  {build.tech.map((t, i) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-900 bg-zinc-950/80 text-zinc-400 transition-all duration-300 group-hover:border-zinc-800 group-hover:text-zinc-300"
                      style={{ transitionDelay: active ? `${i * 30}ms` : '0ms' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">

                {/* Primary — VIEW BUILD */}
                <a
                  href={build.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View build for ${build.title}`}
                  className="group/btn relative flex items-center justify-center gap-2 h-10 px-6 rounded-lg overflow-hidden font-mono text-[11px] tracking-widest font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  style={{
                    border: `1px solid ${build.accent}50`,
                    color: '#09090b',
                    boxShadow: `0 0 14px ${build.accent}20`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${build.accent}50, 0 0 6px ${build.accent}30`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${build.accent}20`;
                  }}
                >
                  {/* Fill background */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ backgroundColor: build.accent }}
                  />
                  {/* Hover shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    {/* Launch icon */}
                    <svg aria-hidden="true" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 shrink-0">
                      <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    VIEW BUILD
                  </span>
                </a>

                {/* Secondary — SOURCE CODE */}
                <a
                  href={build.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View source code for ${build.title}`}
                  className="group/src relative flex items-center justify-center gap-2 h-10 px-6 rounded-lg overflow-hidden font-mono text-[11px] tracking-widest font-bold backdrop-blur-md bg-zinc-950/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  style={{
                    border: `1px solid ${build.accent}25`,
                    color: build.accent,
                    boxShadow: `inset 0 0 16px ${build.accent}05`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${build.accent}60`;
                    el.style.boxShadow = `inset 0 0 24px ${build.accent}12, 0 0 16px ${build.accent}15`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${build.accent}25`;
                    el.style.boxShadow = `inset 0 0 16px ${build.accent}05`;
                  }}
                >
                  {/* Hover inset glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/src:opacity-100 transition-opacity duration-400"
                    style={{ background: `radial-gradient(ellipse at center, ${build.accent}08 0%, transparent 70%)` }}
                  />
                  <span className="relative flex items-center gap-2">
                    {/* GitHub-style icon */}
                    <svg aria-hidden="true" viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path d="M7 0C3.13 0 0 3.13 0 7c0 3.09 2.01 5.72 4.79 6.65.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.03-.78-1.03-.64-.44.05-.43.05-.43.71.05 1.08.73 1.08.73.63 1.08 1.65.77 2.05.59.06-.46.25-.77.45-.95-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.39.72-1.88-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.92.72A6.7 6.7 0 0 1 7 3.4c.59 0 1.19.08 1.74.23 1.33-.9 1.92-.72 1.92-.72.38.96.14 1.67.07 1.85.45.49.72 1.11.72 1.88 0 2.7-1.64 3.29-3.21 3.47.25.22.48.65.48 1.31v1.95c0 .19.13.41.48.34A7.004 7.004 0 0 0 14 7c0-3.87-3.13-7-7-7z" />
                    </svg>
                    SOURCE CODE
                  </span>
                </a>
              </div>
            </div>

            {/* Bottom Accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-in-out"
              style={{ background: `linear-gradient(to right, ${build.accent}00, ${build.accent}, ${build.accent}00)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="builds"
      aria-labelledby="builds-title"
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-28 border-t border-zinc-900"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out mb-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">
              {'//'} SYSTEM BUILDS
            </span>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-75 mb-6">
            <h2 id="builds-title" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
              Transforming concepts into intelligent systems.
            </h2>
          </div>
          <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out delay-100 flex items-center gap-6">
            <div className="w-12 h-px bg-cyan-500/50" />
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl">
              A collection of AI experiments, software systems, and digital experiences engineered to solve real-world problems.
            </p>
          </div>
        </div>

        {/* Builds List */}
        <div className="space-y-6">
          {builds.map((build, i) => (
            <BuildCard key={build.id} build={build} delay={150 + i * 100} />
          ))}
        </div>

        {/* Footer info line */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[500ms] mt-16 flex items-center gap-4 justify-between border-t border-zinc-900 pt-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-600">END OF BUILDS LOG</span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-500">SYSTEM.MEM: 2.4TB AVAILABLE</span>
        </div>
      </div>
    </section>
  );
}
