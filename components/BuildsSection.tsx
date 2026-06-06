'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const builds = [
  {
    id: '01',
    code: 'BLD.01 // JARVIS',
    title: 'JARVIS AI ASSISTANT',
    status: 'DEPLOYED',
    statusDot: '#22d3ee', // cyan
    desc: 'Voice-controlled AI assistant capable of executing commands, processing requests, and improving productivity.',
    class: 'SYS.VOICE',
    tech: ['Python', 'Speech Recognition', 'AI APIs'],
    accent: '#22d3ee', // cyan
    launchDate: 'OCT 2025',
    version: 'v1.2.0-stable',
    image: '/builds/jarvis.png',
  },
  {
    id: '02',
    code: 'BLD.02 // CHAT.AI',
    title: 'AI CHATBOT PLATFORM',
    status: 'IN DEVELOPMENT',
    statusDot: '#eab308', // yellow
    desc: 'Conversational AI platform designed to deliver intelligent real-time interactions.',
    class: 'SYS.NLP',
    tech: ['JavaScript', 'React', 'Node.js', 'AI APIs'],
    accent: '#eab308', // yellow
    launchDate: 'FEB 2026',
    version: 'v0.8.5-dev',
    image: '/builds/chatbot.png',
  },
  {
    id: '03',
    code: 'BLD.03 // PORTFOLIO',
    title: '3D PORTFOLIO SYSTEM',
    status: 'ONLINE',
    statusDot: '#3b82f6', // blue
    desc: 'Interactive portfolio experience combining AI-inspired design, modern web technologies, and immersive 3D elements.',
    class: 'SYS.WEB',
    tech: ['Next.js', 'React Three Fiber', 'GSAP'],
    accent: '#3b82f6', // blue
    launchDate: 'JUN 2026',
    version: 'v2.0.1-prod',
    image: '/builds/portfolio.png',
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
          
          {/* Visual Preview Area */}
          <div className="relative w-full md:w-[280px] lg:w-[340px] h-48 md:h-auto overflow-hidden bg-zinc-950 shrink-0 border-b md:border-b-0 md:border-r border-zinc-900/60">
            {/* Project Image - transitions from low-saturation thumbnail to bright live image on hover */}
            <Image
              src={build.image}
              alt={build.title}
              fill
              className="object-cover transition-all duration-700 ease-in-out filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
            />
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Color tint overlay */}
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: build.accent }}
            />

            {/* Scanline Sweep animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="w-full h-[2px] bg-cyan-400/30 shadow-[0_0_8px_cyan] absolute top-0 animate-[scanline_4s_infinite_linear] group-hover:animate-[scanline_2s_infinite_linear]"
                style={{ 
                  backgroundColor: `${build.accent}30`, 
                  boxShadow: `0 0 8px ${build.accent}` 
                }} 
              />
            </div>

            {/* HUD Indicators - interactive reveal */}
            <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-40 group-hover:opacity-100 transition-opacity duration-500 font-mono text-[9px] pointer-events-none">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 tracking-wider">SYS.CAM_0{build.id}</span>
                <span className="text-zinc-500 bg-black/60 px-1 py-0.5 rounded border border-zinc-900">{build.class}</span>
              </div>
              
              {/* Target reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                <div 
                  className="w-3.5 h-3.5 border border-zinc-700 rounded-full opacity-60 group-hover:border-cyan-400/40 group-hover:scale-110 transition-all duration-500" 
                  style={{ borderColor: `${build.accent}60` }}
                />
                <div className="w-6 h-px bg-zinc-800 absolute group-hover:bg-cyan-500/20" style={{ backgroundColor: `${build.accent}20` }} />
                <div className="h-6 w-px bg-zinc-800 absolute group-hover:bg-cyan-500/20" style={{ backgroundColor: `${build.accent}20` }} />
              </div>

              <div className="flex justify-between items-end">
                <div className="flex gap-2">
                  <span className="text-emerald-400 flex items-center gap-1 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    REC
                  </span>
                  <span className="text-zinc-600">1080p@60</span>
                </div>
                <span className="text-zinc-600 bg-black/60 px-1 py-0.5 rounded border border-zinc-900">[SYS_ACTIVE]</span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute bottom-3 left-3 bg-black/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400 tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              SIMULATOR
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

            {/* Bottom Tech stack & logs row */}
            <div className="mt-8 pt-4 border-t border-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">TECH_STACK //</span>
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

              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors self-end sm:self-auto">
                <span>CONNECT_LINK</span>
                <span className="animate-pulse">_</span>
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
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
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
