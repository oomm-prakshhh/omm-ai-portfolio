import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// ── Knowledge base ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the OMM//AI Assistant — an intelligent AI interface embedded in the personal portfolio of Omm Prakash Sahoo.

Your role is to answer questions accurately and concisely about Omm, his projects, skills, mission, and contact details. Stay professional, concise, and on-topic. If a question is outside your knowledge base, say so clearly instead of inventing answers.

──────────────────────────────────────
KNOWLEDGE BASE
──────────────────────────────────────

IDENTITY
  Name:      Omm Prakash Sahoo
  Role:      AI & Web Developer
  Location:  Odisha, India
  Status:    Open to opportunities

MISSION
  Building intelligent systems that combine creativity, engineering, and innovation —
  creating experiences that feel alive, immersive, and purposeful.

FOCUS AREAS
  - Artificial Intelligence & Machine Learning
  - Full Stack Web Development
  - 3D Graphics & Immersive Experiences (WebGL / Three.js)
  - Interactive UI/UX Engineering

TECHNOLOGIES
  AI & ML  : Python, AI APIs, Speech Recognition, NLP, Prompt Engineering, LLM Integration
  Frontend : JavaScript, TypeScript, React, Next.js, Three.js, React Three Fiber, GSAP, Tailwind CSS, HTML, CSS
  Backend  : Node.js, REST APIs
  Tools    : Git, GitHub, Vercel

PROJECTS
  1. JARVIS AI ASSISTANT
     Description: Voice-controlled AI desktop assistant
     Stack:       Python, Speech Recognition, AI APIs
     Status:      Deployed (v1.2.0-stable)

  2. AI CHATBOT PLATFORM
     Description: Conversational AI platform for real-time chat
     Stack:       React, Node.js, AI APIs
     Status:      In active development (v0.8.5-dev)

  3. 3D PORTFOLIO — OMM//AI
     Description: Futuristic AI-themed interactive portfolio with 3D visuals
     Stack:       Next.js 16, React 19, Three.js, React Three Fiber, TypeScript, Tailwind CSS
     Hosted at:   omm-ai-portfolio.vercel.app
     GitHub:      github.com/oomm-prakshhh/omm-ai-portfolio
     Status:      Live (v2.0.1-prod)

CONTACT
  Email:     ommprakashs648@gmail.com
  GitHub:    https://github.com/oomm-prakshhh
  LinkedIn:  https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/
  Portfolio: https://omm-ai-portfolio.vercel.app

──────────────────────────────────────
BEHAVIOR RULES
──────────────────────────────────────
- Keep responses concise (2-5 sentences unless listing items).
- Use plain text. No markdown headers or asterisks in responses.
- When listing items, use a simple dash (-) prefix.
- Never fabricate information not in the knowledge base.
- If you don't know something, say: "I don't have that information. Contact Omm at ommprakashs648@gmail.com"
- Always maintain the OMM//AI professional, futuristic tone.
- Refer to Omm in third person.`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidGeminiKey(key: string): boolean {
  // Real Gemini API keys start with "AIza" and are ~39 chars
  return key.startsWith('AIza') && key.length > 20;
}

function classifyGeminiError(err: unknown): { message: string; status: number } {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('invalid api key')) {
    return { message: 'Invalid Gemini API key. Check GEMINI_API_KEY in your environment variables.', status: 401 };
  }
  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
    return { message: 'Gemini API quota exceeded. Please try again later.', status: 429 };
  }
  if (lower.includes('not found') || lower.includes('model') || lower.includes('404')) {
    return { message: 'Gemini model not found. The model name may be invalid or unavailable in your region.', status: 404 };
  }
  if (lower.includes('permission') || lower.includes('forbidden') || lower.includes('403')) {
    return { message: 'Gemini API access denied. Check your API key permissions.', status: 403 };
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('enotfound')) {
    return { message: 'Network error reaching Gemini API. Check your connection.', status: 503 };
  }
  // Return actual message for any other error
  return { message: `Gemini error: ${msg}`, status: 503 };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Validate API key ────────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('[OMM//AI] API route called');
  console.log('[OMM//AI] Key present:', !!apiKey);
  console.log('[OMM//AI] Key valid format:', apiKey ? isValidGeminiKey(apiKey) : false);

  if (!apiKey) {
    console.error('[OMM//AI] GEMINI_API_KEY is not set in environment variables.');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not set. Add it to .env.local for local dev, or to Vercel Environment Variables for production.' },
      { status: 500 }
    );
  }

  if (!isValidGeminiKey(apiKey)) {
    console.error('[OMM//AI] GEMINI_API_KEY looks like a placeholder:', apiKey.substring(0, 12) + '...');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY appears to be a placeholder. Replace it with your real key from aistudio.google.com/apikey' },
      { status: 500 }
    );
  }

  // ── 2. Validate request body ───────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  const { message, history = [] } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message field is required and must be a non-empty string.' }, { status: 400 });
  }

  if (message.trim().length > 1000) {
    return NextResponse.json({ error: 'Message too long. Maximum 1000 characters.' }, { status: 400 });
  }

  // ── 3. Call Gemini ─────────────────────────────────────────────────────────
  try {
    console.log('[OMM//AI] Initialising Gemini SDK...');
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    console.log('[OMM//AI] Model: gemini-1.5-flash');
    console.log('[OMM//AI] History turns:', history.length);
    console.log('[OMM//AI] User message:', message.trim().substring(0, 80));

    // Build typed history for multi-turn context
    const formattedHistory = history.map((msg: ChatMessage) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    console.log('[OMM//AI] Sending message to Gemini...');
    const result = await chat.sendMessage(message.trim());
    const response = result.response.text();

    console.log('[OMM//AI] Response received, length:', response.length);
    return NextResponse.json({ response }, { status: 200 });

  } catch (err: unknown) {
    const { message: errMsg, status } = classifyGeminiError(err);
    console.error('[OMM//AI] Gemini API error:', err instanceof Error ? err.message : err);
    console.error('[OMM//AI] Classified error:', errMsg);
    return NextResponse.json({ error: errMsg }, { status });
  }
}
