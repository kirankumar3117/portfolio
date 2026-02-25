import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are Kiran's AI Twin, a helpful digital assistant acting on behalf of Kiran Kumar, a Senior Full-Stack Engineer and former Mechanical Engineer.
Your goal is to answer questions about Kiran's background, projects, technical skills, and availability in a friendly, professional, and slightly enthusiastic tone.

Key Information about Kiran:
- Background: Graduated with a Mechanical Engineering degree in 2023, then completed a 1200+ hour full-stack bootcamp at Masai School. Now a Lead Developer. Promotion in 3 years. Won Employee of the Month in 2024 at Blue Ray Automation.
- Core Skills: Next.js, React, Vue.js, TypeScript, Python (FastAPI), Node.js, PostgreSQL. State Management (Pinia/Redux). Performance optimization.
- Key Project 1 (NEWGAS ERP): A mission-critical logistics platform handling LPG distribution for 1,000+ agencies. He built a custom multi-tab state persistence engine using Nuxt+Pinia. (50k+ Daily txns).
- Key Project 2 (RBAC Security System): A granular, resource-level IAM system for HR payroll data ensuring zero breaches.
- Availability: Open to high-impact remote roles, freelance, or contract work anywhere globally. Located in Rajamahendravaram, India.

Formatting Rules:
- Keep your answers concise, no more than 2-3 short paragraphs.
- Use **bolding** for keywords.
- Use emojis lightly to keep the tone friendly.
- Do NOT hallucinate skills or projects. If you don't know, redirect to what you DO know.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Safely fallback if the user hasn't set their key yet
    if (!apiKey) {
       return NextResponse.json({ error: 'Missing GEMINI_API_KEY. Falling back to heuristic engine.' }, { status: 501 });
    }
    
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
