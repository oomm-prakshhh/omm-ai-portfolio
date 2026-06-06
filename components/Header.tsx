'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-0 text-lg font-black tracking-tight transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm"
          >
            <span className="text-white">OMM</span>
            <span className="text-zinc-600 font-light mx-0.5 group-hover:text-zinc-400 transition-colors duration-300">{'//'}</span>
            <span className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-300">AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
          <Link href="#builds"       className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">Builds</Link>
          <Link href="#mission"      className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">Mission</Link>
          <Link href="#capabilities" className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">Capabilities</Link>
          <Link href="#about"        className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">Profile</Link>
          <Link href="#contact"      className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">Contact</Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-300 hover:text-white relative z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-md" 
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu-drawer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col gap-1.5 w-6 items-end">
            <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'opacity-0' : 'w-4'}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        id="mobile-menu-drawer"
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center px-8 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className={`flex flex-col gap-8 text-2xl font-bold tracking-tight transition-transform duration-500 delay-100 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-10'}`}
        >
          <Link href="#builds" onClick={closeMenu} className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">
            <span className="text-xs font-mono text-cyan-500 group-hover:opacity-100 opacity-0 transition-opacity">01</span>
            System Builds
          </Link>
          <Link href="#mission" onClick={closeMenu} className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">
            <span className="text-xs font-mono text-cyan-500 group-hover:opacity-100 opacity-0 transition-opacity">02</span>
            Mission
          </Link>
          <Link href="#capabilities" onClick={closeMenu} className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">
            <span className="text-xs font-mono text-cyan-500 group-hover:opacity-100 opacity-0 transition-opacity">03</span>
            Capabilities
          </Link>
          <Link href="#about" onClick={closeMenu} className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">
            <span className="text-xs font-mono text-cyan-500 group-hover:opacity-100 opacity-0 transition-opacity">04</span>
            Profile
          </Link>
          <Link href="#contact" onClick={closeMenu} className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:rounded-sm">
            <span className="text-xs font-mono text-cyan-500 group-hover:opacity-100 opacity-0 transition-opacity">05</span>
            Contact
          </Link>
        </div>
        
        {/* Mobile footer system info */}
        <div className={`absolute bottom-10 left-8 right-8 flex items-center justify-between border-t border-zinc-900 pt-6 transition-all duration-500 delay-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-500">SYSTEM: ONLINE</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-500/50">OMM//AI v1.0</span>
        </div>
      </div>
    </header>
  );
}
