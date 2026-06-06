import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-0 text-lg font-black tracking-tight transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          >
            <span className="text-white">OMM</span>
            <span className="text-zinc-600 font-light mx-0.5 group-hover:text-zinc-400 transition-colors duration-300">{'//'}</span>
            <span className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-300">AI</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
          <Link href="#builds"       className="hover:text-white transition-colors duration-200">Builds</Link>
          <Link href="#mission"      className="hover:text-white transition-colors duration-200">Mission</Link>
          <Link href="#capabilities" className="hover:text-white transition-colors duration-200">Capabilities</Link>
          <Link href="#about"        className="hover:text-white transition-colors duration-200">Profile</Link>
          <Link href="#contact"      className="hover:text-white transition-colors duration-200">Contact</Link>
        </nav>
        <button className="md:hidden text-zinc-300 hover:text-white" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </header>
  );
}
