'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Sender = 'user' | 'ai' | 'system';

type Message = {
  id: string;
  sender: Sender;
  text: string;
  isTyping?: boolean;
  isError?: boolean;
};

type HistoryEntry = {
  role: 'user' | 'model';
  parts: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const PREDEFINED_QUESTIONS = [
  'Who is Omm?',
  'What projects has he built?',
  'What technologies does he use?',
  'What is OMM//AI?',
  'How can I contact him?',
  'What is he currently learning?',
];

const BOOT_SEQUENCE = [
  '> Initializing OMM//AI...',
  '> Loading profile database...',
  '> Connecting to AI core...',
  '> Connection established.',
];

const WELCOME_MESSAGE = `OMM//AI Assistant Online.

I am powered by Google Gemini and trained on Omm's knowledge base.

I can answer questions about:
- Omm Prakash Sahoo
- Projects & tech stack
- Mission & focus areas
- Contact information

Type a question or select one below.`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatText(text: string): React.ReactNode[] {
  const urlRegex   = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const combined   = new RegExp(`(${urlRegex.source}|${emailRegex.source})`, 'gi');
  const parts      = text.split(combined).filter(Boolean);

  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 hover:decoration-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
          {part}
        </a>
      );
    }
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`}
          className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 hover:decoration-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── MessageItem component ─────────────────────────────────────────────────────
const MessageItem = React.memo(function MessageItem({ msg }: { msg: Message }) {
  if (msg.sender === 'system') {
    return (
      <div className="text-zinc-500 text-[10px] tracking-wider font-mono">
        {msg.text}
      </div>
    );
  }

  const isUser = msg.sender === 'user';

  return (
    <div className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
      <span className={`text-[9px] mb-1 opacity-50 tracking-widest font-mono ${isUser ? 'text-zinc-400' : 'text-cyan-500'}`}>
        {isUser ? 'USER' : 'OMM//AI'}
      </span>
      <div
        className={`p-3 rounded-lg leading-relaxed whitespace-pre-wrap text-[11px] font-mono ${
          isUser
            ? 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-tr-none'
            : msg.isError
            ? 'bg-red-950/30 text-red-300 border border-red-900/40 rounded-tl-none'
            : 'bg-cyan-950/20 text-cyan-50 border border-cyan-900/30 rounded-tl-none'
        }`}
        style={!isUser && !msg.isError ? { boxShadow: 'inset 0 0 10px rgba(34,211,238,0.05)' } : {}}
      >
        {formatText(msg.text)}
        {msg.isTyping && (
          <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-500 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
});

// ── Main component ────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [isOpen,    setIsOpen   ] = useState(false);
  const [messages,  setMessages ] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [inputText, setInputText] = useState('');
  // Conversation history for multi-turn context sent to API
  const historyRef    = useRef<HistoryEntry[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && hasBooted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasBooted]);

  // Boot sequence on first open
  useEffect(() => {
    if (!isOpen || hasBooted) return;
    setHasBooted(true);
    setIsLoading(true);

    let bootIndex = 0;
    const bootInterval = setInterval(() => {
      if (bootIndex < BOOT_SEQUENCE.length) {
        const text = BOOT_SEQUENCE[bootIndex];
        setMessages(prev => [...prev, { id: uid(), sender: 'system', text }]);
        bootIndex++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => {
          const welcomeId = uid();
          setMessages(prev => [...prev, { id: welcomeId, sender: 'ai', text: '', isTyping: true }]);
          let charIndex = 0;
          const typingInterval = setInterval(() => {
            if (charIndex < WELCOME_MESSAGE.length) {
              const currentText = WELCOME_MESSAGE.substring(0, charIndex + 1);
              setMessages(prev => prev.map(m => m.id === welcomeId ? { ...m, text: currentText } : m));
              charIndex++;
            } else {
              clearInterval(typingInterval);
              setMessages(prev => prev.map(m => m.id === welcomeId ? { ...m, isTyping: false } : m));
              setIsLoading(false);
            }
          }, 18);
        }, 400);
      }
    }, 550);
  }, [isOpen, hasBooted]);

  // ── Core send function — calls the secure API route ───────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInputText('');

    // Append user bubble
    const userMsg: Message = { id: uid(), sender: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Optimistic AI bubble (typing indicator)
    const aiId = uid();
    setMessages(prev => [...prev, { id: aiId, sender: 'ai', text: '', isTyping: true }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyRef.current,
        }),
      });

      const data: { response?: string; error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const responseText = data.response ?? 'No response received.';

      // Update conversation history for multi-turn context
      const newHistory: HistoryEntry[] = [
        ...historyRef.current,
        { role: 'user'  as const, parts: trimmed },
        { role: 'model' as const, parts: responseText },
      ];
      historyRef.current = newHistory.slice(-20); // keep last 10 turns

      // Typewrite the response into the bubble
      let charIndex = 0;
      const typeSpeed = Math.max(8, Math.min(25, Math.floor(2400 / responseText.length)));

      const typingInterval = setInterval(() => {
        if (charIndex < responseText.length) {
          const currentText = responseText.substring(0, charIndex + 1);
          setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: currentText } : m));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setMessages(prev => prev.map(m => m.id === aiId ? { ...m, isTyping: false } : m));
          setIsLoading(false);
          inputRef.current?.focus();
        }
      }, typeSpeed);

    } catch (err: unknown) {
      const errorText = err instanceof Error
        ? err.message
        : 'Connection failed. Please try again.';

      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, text: `⚠ ${errorText}`, isTyping: false, isError: true }
          : m
      ));
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">

      {/* ── Assistant Panel ── */}
      <div
        id="ai-assistant-panel"
        className={`mb-4 w-[95vw] sm:w-[420px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl transition-all duration-500 origin-bottom-right flex flex-col ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto h-[80vh] sm:h-[580px] max-h-[85vh]'
            : 'scale-90 opacity-0 pointer-events-none h-0'
        }`}
        style={{ boxShadow: isOpen ? '0 10px 40px -10px rgba(34,211,238,0.15), 0 0 20px -2px rgba(34,211,238,0.1)' : 'none' }}
      >
        {/* ── Header ── */}
        <div className="flex flex-col border-b border-zinc-900 bg-zinc-900/40 shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="font-mono text-xs tracking-widest text-zinc-200 font-bold">
                  OMM{'//'}AI ASSISTANT
                </span>
              </div>
              <div className="flex gap-3 text-[9px] font-mono tracking-wider text-zinc-500 mt-1">
                <span>STATUS: <span className="text-emerald-400">ONLINE</span></span>
                <span>POWERED BY: <span className="text-cyan-500">GEMINI</span></span>
                <span>v2.0</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Disconnect and close assistant"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-700/50 hover:border-cyan-500/50 bg-black/50 hover:bg-cyan-950/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transition-opacity duration-500 rounded" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:bg-cyan-400 transition-colors shadow-[0_0_4px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 group-hover:text-cyan-300 transition-colors">
                DISCONNECT
              </span>
            </button>
          </div>
        </div>

        {/* ── Chat area ── */}
        <div
          role="log"
          aria-label="AI assistant conversation"
          aria-live="polite"
          aria-atomic="false"
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-[11px] chat-scrollbar"
        >
          {messages.map(msg => (
            <MessageItem key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator while waiting for API (before optimistic bubble appears) */}
          {isLoading && !messages[messages.length - 1]?.isTyping && (
            <div className="self-start flex flex-col gap-2 p-2">
              <span className="text-[9px] text-cyan-500/70 tracking-widest animate-pulse font-mono">
                SYSTEM_PROCESSING...
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Text input ── */}
        <div className="px-3 pt-2 pb-1 border-t border-zinc-900 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 focus-within:border-cyan-700/60 transition-colors px-3 py-2">
            <span className="text-[9px] font-mono text-cyan-600 shrink-0 tracking-widest select-none">
              INPUT&gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isLoading ? 'Processing...' : 'Ask anything about Omm...'}
              aria-label="Type your question for the AI assistant"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={1000}
              className="flex-1 bg-transparent font-mono text-[11px] text-zinc-200 placeholder-zinc-600 outline-none disabled:opacity-40 min-w-0"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message"
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded bg-cyan-500/10 border border-cyan-700/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-90"
            >
              {/* Send icon */}
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <p className="text-[8px] font-mono text-zinc-700 mt-1 ml-1 select-none">
            ENTER to send · Gemini AI · Knowledge limited to Omm&apos;s profile
          </p>
        </div>

        {/* ── Quick question pills ── */}
        <div className="p-3 pt-1 border-t border-zinc-900/50 bg-zinc-950 flex flex-wrap gap-2 shrink-0 max-h-[130px] overflow-y-auto chat-scrollbar">
          {PREDEFINED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              aria-label={`Ask: ${q}`}
              className={`text-[10px] font-mono px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                ${isLoading
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_15px_rgba(34,211,238,0.15)]'}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        aria-label="Toggle AI Assistant"
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center border border-cyan-500/30 bg-zinc-950 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
          isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'
        }`}
        style={{ boxShadow: '0 0 20px rgba(34,211,238,0.15), inset 0 0 10px rgba(34,211,238,0.1)' }}
      >
        <div className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-cyan-400/30" />
        <div className="absolute inset-1 rounded-full border border-dashed border-cyan-500/40 animate-[spin_10s_linear_infinite]" />
        <svg aria-hidden="true" className="relative z-10 w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-zinc-950" />
        </span>
      </button>

      {/* ── Scrollbar styles ── */}
      <style>{`
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.15); border-radius: 2px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.4); }
        .chat-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(34,211,238,0.15) transparent; }
      `}</style>
    </div>
  );
}
