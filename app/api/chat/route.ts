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

// ── Error classifier ──────────────────────────────────────────────────────────
function classifyGeminiError(err: unknown): { message: string; status: number } {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('invalid api key')) {
    return { message: 'Invalid Gemini API key. Verify GEMINI_API_KEY in your Vercel environment variables.', status: 401 };
  }
  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
    return { message: 'Gemini API quota exceeded. Please try again later.', status: 429 };
  }
  if (lower.includes('permission') || lower.includes('forbidden') || lower.includes('403')) {
    return { message: 'Gemini API access denied. Check your API key permissions.', status: 403 };
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('enotfound')) {
    return { message: 'Network error reaching Gemini API. Check your connection.', status: 503 };
  }
  // Surface the real Gemini error message for any other case
  return { message: `Gemini error: ${msg}`, status: 503 };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {

  // Read API key exclusively from environment — no fallbacks, no hardcoded values
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error('[OMM//AI] GEMINI_API_KEY is not set in environment variables.');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured. Add it to Vercel Environment Variables.' },
      { status: 500 }
    );
  }

  // Parse request body
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  const { message, history = [] } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message field is required.' }, { status: 400 });
  }

  if (message.trim().length > 1000) {
    return NextResponse.json({ error: 'Message too long. Maximum 1000 characters.' }, { status: 400 });
  }

  // Call Gemini — pass the key as-is, let the SDK handle auth
  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build multi-turn history
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

    const result = await chat.sendMessage(message.trim());
    const response = result.response.text();

    return NextResponse.json({ response }, { status: 200 });

  } catch (err: unknown) {
    const { message: errMsg, status } = classifyGeminiError(err);
    console.error('[OMM//AI] Gemini API error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: errMsg }, { status });
  }
}
