import dynamic from "next/dynamic";
import AICore from "@/components/AICore";

// Dynamically import below-the-fold components to reduce initial bundle size
const AboutSection = dynamic(() => import("@/components/AboutSection"));
const MissionSection = dynamic(() => import("@/components/MissionSection"));
const SkillsSection = dynamic(() => import("@/components/SkillsSection"));
const BuildsSection = dynamic(() => import("@/components/BuildsSection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-black text-white min-h-screen">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

        {/* Tech grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center min-h-[70vh]">

            {/* Left Side: Brand Content */}
            <div className="flex flex-col space-y-6 md:space-y-8 text-left z-10 animate-fade-in-up">

              {/* Availability Badge */}
              <div className="inline-flex self-start items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                SYSTEMS ONLINE • READY FOR COLLABORATION
              </div>

              {/* Name & Title */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100">
                  Omm Prakash Sahoo
                </h1>
                <p className="text-xl sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  AI &amp; Web Developer
                </p>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-4 max-w-lg">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-300 leading-tight">
                  Building intelligent AI systems and immersive web experiences for the future.
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
                  I am a Computer Science student passionate about AI, modern web development,
                  and creating innovative digital experiences. I focus on building intelligent
                  applications and interactive user interfaces.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#builds"
                  className="group relative flex h-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-8 font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  <span className="relative z-10">Explore My Work</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-500 group-hover:translate-x-0" />
                </a>
                <a
                  href="#contact"
                  className="flex h-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40 backdrop-blur-md px-8 font-semibold text-zinc-300 transition-all hover:bg-zinc-900/60 hover:text-white hover:border-zinc-700 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  Contact Me
                </a>
              </div>
            </div>

            {/* Right Side: 3D AI Core */}
            <div className="flex justify-center lg:justify-end z-10 animate-fade-in-right">
              <AICore />
            </div>
          </div>

        </div>
      </div>

      {/* ── System Builds Section ───────────────────────────────────── */}
      <BuildsSection />

      {/* ── Mission Section ─────────────────────────────────────────── */}
      <MissionSection />

      {/* ── Skills Command Center ──────────────────────────────────── */}
      <SkillsSection />

      {/* ── About Section ──────────────────────────────────────────── */}
      <div className="relative w-full bg-black overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <AboutSection />
      </div>

      {/* ── Contact Section ─────────────────────────────────────────── */}
      <ContactSection />

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
