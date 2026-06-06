'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Canvas element with SSR disabled to prevent hydration errors.
const AICoreCanvas = dynamic(() => import('./AICoreCanvas'), {
  ssr: false,
  loading: () => (
    <div className="relative flex items-center justify-center w-full h-[320px] sm:h-[420px] md:h-[500px]">
      {/* Background glow layers */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/5 blur-[80px] animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-cyan-400/5 blur-[60px] animate-pulse [animation-delay:1s]" />
      
      {/* Visual Loader */}
      <div className="relative w-48 h-48 rounded-full border border-cyan-500/10 bg-zinc-950/20 backdrop-blur-md flex items-center justify-center">
        <span className="text-zinc-500 text-xs font-mono tracking-widest animate-pulse">INIT 3D CORE...</span>
      </div>
    </div>
  )
});

export default function AICore() {
  return <AICoreCanvas />;
}
