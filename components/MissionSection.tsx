'use client';

import { useEffect, useRef } from 'react';

const pillars = [
  {
    id: '01',
    label: 'Artificial Intelligence',
    desc:  'Building intelligent systems — from language models to computer vision — that think, adapt, and evolve.',
    color: 'cyan',
    icon:  '⬡',
  },
  {
    id: '02',
    label: 'Software Engineering',
    desc:  'Architecting robust, scalable software that performs reliably and stands the test of real-world demands.',
    color: 'blue',
    icon:  '⬢',
  },
  {
    id: '03',
    label: 'Web Technologies',
    desc:  'Crafting immersive, interactive frontends that blur the line between application and experience.',
    color: 'indigo',
    icon:  '◈',
  },
];

const indicators = [
  { label: 'Focus',     value: 'AI + Web',  accent: '#22d3ee' },
  { label: 'Drive',     value: 'Innovation', accent: '#3b82f6' },
  { label: 'Approach',  value: 'Full-Stack', accent: '#818cf8' },
  { label: 'Mindset',   value: 'Builder',   accent: '#06b6d4' },
];

const colorMap: Record<string, { border: string; glow: string; text: string; badge: string }> = {
  cyan:   { border: 'border-cyan-500/25',   glow: 'shadow-[0_0_25px_rgba(34,211,238,0.08)]',  text: 'text-cyan-400',   badge: 'bg-cyan-950/50 border-cyan-500/20' },
  blue:   { border: 'border-blue-500/25',   glow: 'shadow-[0_0_25px_rgba(59,130,246,0.08)]',  text: 'text-blue-400',   badge: 'bg-blue-950/50 border-blue-500/20' },
  indigo: { border: 'border-indigo-500/25', glow: 'shadow-[0_0_25px_rgba(129,140,248,0.08)]', text: 'text-indigo-400', badge: 'bg-indigo-950/50 border-indigo-500/20' },
};

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-28"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/4 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section label ────────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-5 transition-all duration-700 ease-out flex flex-col items-center text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-500 mb-3">
            {'//'} CORE DIRECTIVE
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Mission
          </h2>
          {/* Glowing divider */}
          <div className="mt-5 flex items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cyan-500/60" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <div className="w-32 h-px bg-gradient-to-r from-blue-500/60 via-cyan-500/30 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-blue-500/40" />
          </div>
        </div>

        {/* ── Headline ─────────────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-100 text-center mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
              Engineering intelligent digital experiences
            </span>
            <br />
            <span className="text-zinc-300">
              through AI and modern web technologies.
            </span>
          </h3>
        </div>

        {/* ── Mission statement ─────────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-150 text-center mb-20">
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            My goal is to combine artificial intelligence, software engineering, and modern web technologies
            to create innovative products that solve real-world problems.
          </p>
        </div>

        {/* ── Data indicators bar ───────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out delay-200 mb-20">
          <div className="flex flex-wrap justify-center gap-3">
            {indicators.map(ind => (
              <div
                key={ind.label}
                className="group flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-4 py-2 transition-all duration-300 hover:border-zinc-700"
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ backgroundColor: ind.accent }}
                  />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: ind.accent }} />
                </span>
                <span className="text-xs text-zinc-500 font-mono tracking-wide">{ind.label}</span>
                <span className="text-xs font-semibold text-zinc-200">{ind.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Animated vertical timeline ────────────────────────── */}
        <div className="relative">
          {/* Central vertical line */}
          <div className="reveal opacity-0 transition-all duration-1000 ease-out delay-300 absolute left-1/2 -translate-x-1/2 top-0 w-px h-full">
            <div className="w-full h-full bg-gradient-to-b from-cyan-500/60 via-blue-500/30 to-transparent" />
          </div>

          <div className="space-y-10">
            {pillars.map((pillar, i) => {
              const c = colorMap[pillar.color];
              const isEven = i % 2 === 0;
              return (
                <div
                  key={pillar.id}
                  className={`reveal opacity-0 transition-all duration-700 ease-out ${
                    isEven ? 'translate-x-[-24px]' : 'translate-x-[24px]'
                  }`}
                  style={{ transitionDelay: `${300 + i * 120}ms` }}
                >
                  <div className={`flex items-center gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>

                    {/* Card */}
                    <div className={`flex-1 group relative overflow-hidden rounded-2xl border ${c.border} bg-zinc-950/70 backdrop-blur-md p-6 transition-all duration-300 hover:scale-[1.02] ${c.glow} hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] cursor-default max-w-sm ${isEven ? 'ml-auto' : 'mr-auto'}`}>
                      {/* Inner grid */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:18px_18px]" />

                      {/* Top row */}
                      <div className="relative flex items-start justify-between mb-3">
                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${c.badge} ${c.text}`}>
                          <span className="text-base leading-none">{pillar.icon}</span>
                          {pillar.id}
                        </div>
                        <span className={`text-xs font-mono tracking-widest ${c.text} opacity-50 mt-0.5`}>
                          LAYER_{pillar.id}
                        </span>
                      </div>

                      <h4 className={`relative text-lg font-bold tracking-tight text-white mb-2 group-hover:${c.text} transition-colors duration-300`}>
                        {pillar.label}
                      </h4>
                      <p className="relative text-sm text-zinc-400 leading-relaxed">{pillar.desc}</p>

                      {/* Bottom glow accent */}
                      <div className={`absolute -bottom-5 ${isEven ? '-right-5' : '-left-5'} w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}
                        style={{ backgroundColor: pillar.color === 'cyan' ? '#22d3ee' : pillar.color === 'blue' ? '#3b82f6' : '#818cf8' }}
                      />
                    </div>

                    {/* Timeline node */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className={`w-4 h-4 rounded-full border-2 ${c.border.replace('/25', '/80')} bg-zinc-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]`}>
                        <div className="absolute inset-1 rounded-full animate-pulse"
                          style={{ backgroundColor: pillar.color === 'cyan' ? '#22d3ee' : pillar.color === 'blue' ? '#3b82f6' : '#818cf8' }}
                        />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom glowing divider ────────────────────────────── */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 ease-out delay-[600ms] mt-20 flex items-center justify-center gap-4">
          <div className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-cyan-500/40" />
          <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-600">END DIRECTIVE</span>
          <div className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-blue-500/40" />
        </div>

      </div>
    </section>
  );
}
