'use client';

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  isTyping?: boolean;
};

const PREDEFINED_QUESTIONS = [
  "Who is Omm?",
  "What projects has he built?",
  "What technologies does he use?",
  "What is OMM//AI?",
  "How can I contact him?",
  "What is he currently learning?",
];

const RESPONSES: Record<string, string> = {
  "Who is Omm?": "Omm Prakash Sahoo is a creative software engineer focused on building intelligent systems and immersive digital experiences. He blends AI-driven logic with premium aesthetics.",
  "What projects has he built?": "Key systems include:\n- JARVIS AI ASSISTANT (Voice-controlled AI)\n- AI CHATBOT PLATFORM (Conversational AI)\n- 3D PORTFOLIO SYSTEM (Immersive Web)",
  "What technologies does he use?": "His core stack includes Python, JavaScript, TypeScript, React, Next.js, Node.js, React Three Fiber (Three.js), GSAP, and various AI APIs.",
  "What is OMM//AI?": "OMM//AI is a personal operating system and digital identity framework. It represents the intersection of artificial intelligence, modern web technologies, and futuristic design aesthetics.",
  "How can I contact him?": "You can reach him via:\n- Email: ommprakashs648@gmail.com\n- GitHub: https://github.com/oomm-prakshhh\n- LinkedIn: https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/",
  "What is he currently learning?": "He is continuously expanding his knowledge in advanced AI model integration, WebGL/Three.js for complex 3D rendering, and system architecture for scalable web applications.",
};

const BOOT_SEQUENCE = [
  "> Initializing OMM//AI...",
  "> Loading profile database...",
  "> Verifying communication protocols...",
  "> Connection established.",
];

const WELCOME_MESSAGE = `OMM//AI Assistant Online.

I can provide information about:
- Omm Prakash Sahoo
- Projects
- Technologies
- Mission
- Contact Information

Select a query to continue.`;

// Helper to convert URLs and Emails into clickable terminal-style links
function formatText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

  const parts = text.split(new RegExp(`(${urlRegex.source}|${emailRegex.source})`, 'gi')).filter(Boolean);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 hover:decoration-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
          {part}
        </a>
      );
    }
    if (emailRegex.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 hover:decoration-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Memoize individual messages to prevent re-rendering the entire list every 30ms during typing
const MessageItem = React.memo(function MessageItem({ msg }: { msg: Message }) {
  if (msg.sender === 'system') {
    return (
      <div className="text-zinc-500 text-[10px] tracking-wider">
        {msg.text}
      </div>
    );
  }

  return (
    <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
      <span className={`text-[9px] mb-1 opacity-50 tracking-widest ${msg.sender === 'user' ? 'text-zinc-400' : 'text-cyan-500'}`}>
        {msg.sender === 'user' ? 'USER' : 'SYSTEM'}
      </span>
      <div 
        className={`p-3 rounded-lg leading-relaxed whitespace-pre-wrap ${
          msg.sender === 'user' 
            ? 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-tr-none' 
            : 'bg-cyan-950/20 text-cyan-50 border border-cyan-900/30 rounded-tl-none'
        }`}
        style={msg.sender === 'ai' ? { boxShadow: 'inset 0 0 10px rgba(34,211,238,0.05)' } : {}}
      >
        {formatText(msg.text)}
        {msg.isTyping && <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-500 animate-pulse align-middle" />}
      </div>
    </div>
  );
});

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle Boot Sequence on first open
  useEffect(() => {
    if (isOpen && !hasBooted) {
      setHasBooted(true);
      setIsTyping(true);

      let bootIndex = 0;
      
      const bootInterval = setInterval(() => {
        if (bootIndex < BOOT_SEQUENCE.length) {
          const text = BOOT_SEQUENCE[bootIndex];
          setMessages(prev => [...prev, { id: `boot-${Date.now()}`, sender: 'system', text }]);
          bootIndex++;
        } else {
          clearInterval(bootInterval);
          // Show welcome message
          setTimeout(() => {
            const welcomeId = Date.now().toString();
            setMessages(prev => [...prev, { id: welcomeId, sender: 'ai', text: '', isTyping: true }]);
            
            let charIndex = 0;
            const typingInterval = setInterval(() => {
              if (charIndex < WELCOME_MESSAGE.length) {
                const currentText = WELCOME_MESSAGE.substring(0, charIndex + 1);
                setMessages(prev => prev.map(msg => 
                  msg.id === welcomeId ? { ...msg, text: currentText } : msg
                ));
                charIndex++;
              } else {
                clearInterval(typingInterval);
                setMessages(prev => prev.map(msg => 
                  msg.id === welcomeId ? { ...msg, isTyping: false } : msg
                ));
                setIsTyping(false);
              }
            }, 30); // Fast typing for welcome
          }, 500);
        }
      }, 600); // Delay between boot lines
    }
  }, [isOpen, hasBooted]);

  const handleQuestionClick = (question: string) => {
    if (isTyping) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate thinking/typing delay
    setTimeout(() => {
      const responseText = RESPONSES[question] || "I don't have data on that query.";
      const aiMsgId = (Date.now() + 1).toString();
      
      // Start typing effect for AI response
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '', isTyping: true }]);
      
      let charIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (charIndex < responseText.length) {
          const currentText = responseText.substring(0, charIndex + 1);
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: currentText } : msg
          ));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, isTyping: false } : msg
          ));
          setIsTyping(false);
        }
      }, 40); // 40ms typing speed

    }, 800); // Initial processing delay
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
      
      {/* Assistant Panel */}
      <div 
        id="ai-assistant-panel"
        className={`mb-4 w-[95vw] sm:w-[400px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl transition-all duration-500 origin-bottom-right flex flex-col ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto h-[80vh] sm:h-[550px] max-h-[85vh]' : 'scale-90 opacity-0 pointer-events-none h-0'
        }`}
        style={{
          boxShadow: isOpen ? '0 10px 40px -10px rgba(34,211,238,0.15), 0 0 20px -2px rgba(34,211,238,0.1)' : 'none'
        }}
      >
        {/* Header - Status Bar */}
        <div className="flex flex-col border-b border-zinc-900 bg-zinc-900/40 shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-mono text-xs tracking-widest text-zinc-200 font-bold">OMM{'//'}AI ASSISTANT</span>
              </div>
              <div className="flex gap-3 text-[9px] font-mono tracking-wider text-zinc-500 mt-1">
                <span>STATUS: <span className="text-emerald-400">ONLINE</span></span>
                <span>DB: LOADED</span>
                <span>v1.0</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Disconnect and close assistant"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-700/50 hover:border-cyan-500/50 bg-black/50 hover:bg-cyan-950/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transition-opacity duration-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:bg-cyan-400 transition-colors shadow-[0_0_4px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 group-hover:text-cyan-300 transition-colors">DISCONNECT</span>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div aria-live="polite" aria-atomic="false" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-[11px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
          
          {isTyping && !messages[messages.length - 1]?.isTyping && (
             <div className="self-start flex flex-col gap-2 p-2">
               <span className="text-[9px] text-cyan-500/70 tracking-widest animate-pulse">SYSTEM_TYPING...</span>
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input / Suggestions Area */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex flex-wrap gap-2 shrink-0 max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
          {PREDEFINED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuestionClick(q)}
              disabled={isTyping}
              className={`text-[10px] font-mono px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                ${isTyping ? 'opacity-30 cursor-not-allowed' : 'hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_15px_rgba(34,211,238,0.15)]'}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        aria-label="Toggle AI Assistant"
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center border border-cyan-500/30 bg-zinc-950 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
        style={{
          boxShadow: '0 0 20px rgba(34,211,238,0.15), inset 0 0 10px rgba(34,211,238,0.1)',
        }}
      >
        {/* Glow behind button */}
        <div className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md" style={{ backgroundColor: 'rgba(34,211,238,0.3)' }} />
        
        {/* Inner rotating dash ring */}
        <div className="absolute inset-1 rounded-full border border-dashed border-cyan-500/40 animate-[spin_10s_linear_infinite]" />
        
        {/* Icon */}
        <svg 
          aria-hidden="true"
          className="relative z-10 w-6 h-6 text-cyan-400" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>

        {/* Status dot */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-zinc-950"></span>
        </span>
      </button>
      
    </div>
  );
}
