'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Github, Linkedin,
  Download, Calendar, Brain, MapPin
} from 'lucide-react';
import {
  initSemanticMatcher,
  findBestFlowSemantic,
  isSemanticReady,
} from '@/lib/semantic-matcher';

// ==================== CONVERSATION ENGINE ====================
const CONVERSATION_FLOWS = {
  welcome: {
    trigger: ['hi', 'hello', 'hey', 'start', 'sup', 'yo', 'who are you'],
    responses: [
      "Hey! 👋 I'm Kiran's AI twin — a digital stand-in while he's deep in a codebase somewhere.\n\nKiran is a **Lead Full-Stack Engineer** who went from Mechanical Engineering to architecting production systems used across India and Ghana. His latest projects include **Kiggidi** (a hyper-local B2B2C e-commerce PWA), **Newgas** (a $18.2M-funded LPG distribution ERP for Ghana), and **Officeous** (an enterprise HRMS).\n\nWhat do you want to dig into?",
      "Welcome! Good timing — Kiran's open to new opportunities and I know everything about his work.\n\nHe's built systems ranging from **offline-first PWAs** to **multi-tab enterprise ERPs** handling supply chains for thousands of distributors. He also spoke at **VueVerse Connect 2026** in Hyderabad.\n\nWhat are you curious about?"
    ],
    chips: ["Tell me about Kiggidi", "What is Newgas?", "Tech Stack & Skills", "Is he available?"]
  },

  kiggidi: {
    trigger: ['kiggidi', 'b2b2c', 'kirana store', 'pwa', 'offline', 'neighborhood', 'local delivery', 'service worker', 'zustand', 'supabase', 'next-intl', 'localization'],
    responses: [
      "Kiggidi is probably Kiran's most ambitious product — a **hyper-local B2B2C e-commerce ecosystem** that empowers traditional Kirana stores with a modern digital storefront, without charging them heavy commissions like Swiggy or Blinkit do.\n\n**The Core Idea**: Instead of replacing neighbourhood shops, Kiggidi gives them a digital layer. Customers find nearby stores by GPS, browse live inventory, and either pick up in-store or get rapid local delivery.\n\n**What makes it technically interesting:**\n• Built as a **PWA** — feels like a native app, installs from the browser, works offline\n• **Service Worker** (next-pwa) queues cart actions when the connection drops and syncs them back when it returns\n• Merchant **Live Status Toggle** — when a shop goes offline, the customer UI goes grayscale and disables checkout in real time via a Supabase subscription\n• **Multi-language** support out of the box: English, Hindi, Telugu via next-intl\n• **Zustand** modular slices for Cart and Location state — clean, tree-shakeable, no Redux overhead\n\nIt's live at kiggidi.com. Go check it out!",
      "Kiggidi started from a real frustration — quick-commerce giants were destroying neighbourhood Kirana stores by pulling customers away, not partnering with them.\n\nKiran's answer: **give Kirana owners a zero-commission digital storefront** that works on any phone, even on patchy rural internet.\n\n**The tech stack is genuinely interesting:**\n• **Next.js App Router + TypeScript** with a strict dark-mode semantic design system (brand orange #FF6B00)\n• **Supabase Auth** handles sessions, and real-time subscriptions power the merchant online/offline toggle\n• **Offline-first by design** — a custom service worker serves a fallback UI and background-syncs cart data once the network returns\n• **GPS geolocation hooks** reverse-geocode coordinates to neighbourhood names and rank nearby stores by distance\n• Deployed on **Vercel** with branch-mapped subdomains — about.kiggidi.com is the marketing site, develop/main is the live PWA\n\nThis is the kind of product that could genuinely change how millions of people shop locally."
    ],
    chips: ["What is Newgas?", "Tell me about Officeous HRMS", "His full tech stack", "Is he available?"]
  },

  newgas: {
    trigger: ['newgas', 'lpg', 'gas', 'ghana', 'cylinder', 'bottling', 'distributor', 'ecovault', 'multi-tab', 'nuxt', 'pinia', 'supply chain', 'blueray', 'blue ray'],
    responses: [
      "Newgas is one of the most complex systems Kiran has worked on — and the real-world stakes make it fascinating.\n\n**The Business**: Newgas Cylinder Bottling Ltd. in Ghana is solving a serious public health problem. Historically, people refilled dangerous old cylinders at roadside stations prone to fraud and underfilling. Newgas flipped the model — they own tens of thousands of high-quality cylinders, customers just exchange empty for pre-filled. They've secured **$18.2M in ESG funding** and are targeting **3M+ households** across Greater Accra.\n\n**What Kiran Built**: The Nova Web Admin — the central nervous system managing the entire supply chain from the Tema bottling plant to last-mile delivery. Think: cylinder inventory, distributor portals, KYC verification, fleet dispatch, and real-time order tracking.\n\n**The hard technical problems he solved:**\n• **Multi-tab state persistence** with Nuxt.js + Pinia — distributors manage simultaneous orders across agencies in multiple browser tabs, none of it gets lost\n• **useMaskTransform composable** — a global PII masking system that auto-detects and redacts phone numbers, GPS coordinates, and KYC documents across every component based on backend metadata\n• **Granular RBAC** across Onboarding, Roles, Products, and Exchange modules — Super Admins, Distributors, and Support Agents each get a completely different view of the same data\n• **4-digit Order OTP** system required at physical cylinder handover — prevents delivery fraud\n• Bundle optimised by **15%** for smooth performance on the lower-end hardware used at distributor depots\n\nThis isn't a CRUD app — it's industrial infrastructure.",
      "The Newgas story is genuinely impressive once you understand what's happening on the ground.\n\nGhana's cooking fuel problem: most households burn charcoal or wood (deforestation, indoor pollution), and the old cylinder-refill system was unsafe. Newgas built **automated bottling plants** that can fill thousands of cylinders per hour, then distribute them through a network of depots called **ecovaults**.\n\nKiran's job at Blue Ray Automation was to build the software that makes this whole machine run — the **Nova Web Admin** at admin.suntechplc.com.\n\nSome of the things he tackled:\n• Complex **Many-to-Many relationships**: orders reference both Gas Cost and a separate Cylinder Deposit (because Newgas owns the physical cylinder)\n• **KYC compliance** — customer data includes Ghana Post address codes, GPS coordinates, and identity documents. All of it needs to be masked appropriately based on who's viewing it\n• **Delivery routing** with assigned company, agent, preferred time slots, delivery charges, and OTP validation on handover\n• **Notification routing** — coordinating with backend to dispatch OTPs and order updates to the correct entity in the supply chain\n\nThe scale, the real-world impact, the technical complexity — it's the kind of project that sharpens an engineer fast."
    ],
    chips: ["Tell me about Kiggidi", "What is Officeous?", "His full tech stack", "Contact Kiran"]
  },

  smart_kirana: {
    trigger: ['smart kirana', 'chitty', 'react native', 'handwritten list', 'shopkeeper', 'kmart', 'multi-app'],
    responses: [
      "Smart Kirana was Kiran's first major product — and it's what made him think seriously about the Indian hyper-local market that eventually led to Kiggidi.\n\n**The Problem**: In India, people write grocery lists by hand ('chitty') or send WhatsApp messages to their local shop. Existing apps tried to force everyone into rigid digital catalogs, which shopkeepers hated.\n\n**What he built**: A full **multi-app ecosystem** — a React Native app for customers, a separate React Native app for shopkeepers, a Next.js admin portal, and a Next.js customer web app. All four powered by a single **FastAPI + PostgreSQL backend**.\n\n**Technical highlights:**\n• **Phone OTP JWT auth** instead of email — because that's what Indian users actually have and trust\n• **PostGIS spatial queries** for radius-based shop discovery (find stores within X km)\n• **Multipart file upload** for photographing handwritten lists (AI-OCR integration planned)\n• **RBAC with strict vendor isolation** — a shopkeeper can never see another shopkeeper's data\n\nIt's confidential (NDA), but the backend and mobile repos are on GitHub.",
    ],
    chips: ["Tell me about Kiggidi", "How does the backend work?", "See his tech stack", "Contact Kiran"]
  },

  officeous: {
    trigger: ['officeous', 'hrms', 'hr', 'human resource', 'payroll', 'leave', 'attendance', 'performance review', 'onboarding', 'employee'],
    responses: [
      "Officeous is Kiran's enterprise HRMS — built to handle the full employee lifecycle for mid-to-large organisations.\n\n**What it does**: Onboarding, payroll, leave management, attendance tracking, and performance reviews, all behind a **resource-level RBAC engine** that ensures people only see what they're supposed to see.\n\n**The interesting architectural decision**: Most HR platforms enforce permissions at the route level — you're either allowed into the payroll page or you're not. That's too coarse. A Department Head should be able to see salary *bands* but not *individual* salaries.\n\nKiran's solution: **field-level permissions**. The UI components dynamically render, redact, or disable based on the authenticated user's resolved permission set — all from the same codebase.\n\n**Other highlights:**\n• **Immutable audit log** — every sensitive mutation (who changed what, from what value to what value) is permanently recorded. Passed compliance audits without any remediation\n• **Role hierarchy with inheritance** — Manager is a strict superset of Employee, so you don't get combinatorial permission explosion\n• The system is live at **officeous.com**",
    ],
    chips: ["Tell me about Kiggidi", "What is Newgas?", "RBAC deep dive", "Contact Kiran"]
  },

  rbac: {
    trigger: ['rbac', 'security', 'role', 'access control', 'iam', 'permissions', 'audit', 'compliance', 'pii', 'masking'],
    responses: [
      "RBAC is a thread that runs through almost everything Kiran builds — and he's gone progressively deeper on it with each project.\n\n**Level 1 — Route-level (basic)**: You're allowed on this page or you're not. Fine for simple apps.\n\n**Level 2 — Resource-level (Officeous HRMS)**: Permissions are declared at the *data field* level. A Department Head sees salary bands but not individual salaries. The UI dynamically renders based on the resolved permission set — same codebase, completely different view per role. Every sensitive action hits an immutable audit log.\n\n**Level 3 — Global PII masking (Newgas)**: Built the **useMaskTransform composable** — a system that automatically detects and redacts personally identifiable information (phone numbers, GPS coordinates, KYC documents) across every UI component, driven by backend metadata. This was needed because Newgas handles sensitive customer data for millions of households under Ghana's data protection laws.\n\nThe progression from 'can this user see this page' to 'can this user see this specific field on this specific record, and is it masked based on their clearance level' is a pretty significant jump in architectural complexity.",
    ],
    chips: ["Tell me about Officeous", "What is Newgas?", "His engineering philosophy", "Get in touch"]
  },

  technical_deep: {
    trigger: ['how does', 'backend', 'spatial', 'fastapi', 'technical', 'architecture', 'database', 'postgres', 'postgis', 'api', 'websocket', 'real-time'],
    responses: [
      "Kiran tends to think about architecture the way a mechanical engineer thinks about a machine — every component needs to be optimized, and failure in one part shouldn't take down the whole system. Here's a cross-section across his projects:\n\n**Databases & Spatial Data (Smart Kirana)**\nPostgreSQL with PostGIS for radius-based shop discovery. Latitude/longitude queries that filter stores within X km of the customer's GPS location — not a simple WHERE clause, actual geospatial indexing.\n\n**State Without Servers (Newgas)**\nThe Nuxt + Pinia multi-tab persistence engine. Distributors need multiple browser tabs open simultaneously. Standard web apps lose state on tab switch. Kiran built a custom internal routing system that preserves per-tab state perfectly — think browser-side session isolation.\n\n**Real-time UX (Kiggidi)**\nSupabase subscriptions power the merchant Live Status Toggle. When a shop goes offline, every active customer session that has that shop in view gets a UI update instantly — grayscale filter, disabled checkout, 'Closed' badge — no polling, no refresh.\n\n**Security at the Data Layer**\nInstead of guarding routes, Kiran's RBAC implementations guard individual data fields. The API returns masked_key metadata and the UI decides what to render. This means a compromised frontend can't expose data the user wasn't cleared to see.",
    ],
    chips: ["RBAC deep dive", "Tell me about Kiggidi", "His full tech stack", "Hire Kiran"]
  },

  skills: {
    trigger: ['skill', 'stack', 'tech', 'technology', 'expertise', 'language', 'framework', 'tools', 'what can he do'],
    responses: [
      "Here's what Kiran actually works with day-to-day across his projects:\n\n**Frontend**\n• React.js / Next.js (App Router) — primary stack\n• React Native — built 2 production mobile apps\n• Vue.js / Nuxt.js — used in production at Blue Ray Automation\n• TypeScript — all projects\n• Framer Motion, Tailwind CSS, React Three Fiber (3D/WebGL)\n\n**State Management**\n• Zustand (Kiggidi), Pinia (Newgas/Vue), Redux\n\n**Backend**\n• Python / FastAPI — high-concurrency APIs\n• Node.js — event-driven architectures\n• PostgreSQL (with PostGIS for spatial data), MongoDB\n• Supabase (Auth + real-time subscriptions)\n\n**Infrastructure & Tooling**\n• Docker, Vercel, CI/CD pipelines\n• next-pwa (offline-first PWAs), next-intl (i18n)\n• PWA / Service Worker architecture\n\n**AI / ML**\n• In-browser semantic embeddings with Transformers.js (this chat widget uses it!)\n• Gemini API integration\n\nHe's strongest at **complex frontend architecture** — state management, performance, and multi-role UI systems — with solid backend depth.",
      "The honest answer: **React/Next.js is where he's most dangerous**, Vue/Nuxt is where he has the most production scars, and FastAPI is his preferred backend.\n\n**Frontend**: React, Next.js, React Native, Vue.js, Nuxt.js, TypeScript, Tailwind, Framer Motion, React Three Fiber\n**State**: Zustand, Pinia, Redux — he's used all three seriously\n**Backend**: FastAPI (Python), Node.js, PostgreSQL + PostGIS, MongoDB, Supabase\n**DevOps**: Docker, Vercel, GitHub Actions, branch-mapped deployments\n**PWA**: Service workers, offline caching, background sync, manifest configuration\n**Security**: RBAC engine design, JWT auth, PII masking, audit logging\n\nWhat's interesting is the breadth — most engineers go deep in one UI framework. Kiran has shipped to production in both React and Vue ecosystems."
    ],
    chips: ["Tell me about Kiggidi", "What is Newgas?", "The pivot story", "Is he available?"]
  },

  speaker: {
    trigger: ['vueverse', 'speaker', 'talk', 'conference', 'presentation', 'public speaking', 'hyderabad'],
    responses: [
      "Kiran spoke at **VueVerse Connect 2026** in Hyderabad — a conference for Vue.js developers — in February 2026.\n\nHis session was called **'From Idea to Impact: Building a Real-World Product End to End'**. He walked a live audience of 200+ engineers through the full product lifecycle: problem discovery, architecture decisions, and shipping to production.\n\nHe drew on real examples from **Smart Kirana** and **Newgas** to talk about the non-obvious parts of building production systems — things like why you design for the failure states first, how to make technical trade-offs when you have real users depending on you, and what it actually feels like to architect a platform that handles thousands of real transactions.\n\nGetting invited to speak as a self-taught engineer (Mechanical grad → bootcamp → Lead Dev) in front of CS graduates is kind of a full-circle moment.",
    ],
    chips: ["Tell me the pivot story", "See his projects", "Current availability", "Contact Kiran"]
  },

  pivot_story: {
    trigger: ['pivot', 'story', 'background', 'mechanical', 'journey', 'how did', 'education', 'masai', 'bootcamp', 'self-taught', 'career change'],
    responses: [
      "This is the part of Kiran's story that surprises most people.\n\nHe graduated as a **Mechanical Engineer** in 2023. Not a CS degree, not a coding minor — Mechanical Engineering. While his classmates were heading to factories and manufacturing firms, he was already spending more time debugging hobby projects than studying thermodynamics.\n\nHe made a call: **go all in on software**. He enrolled in a **1,200+ hour intensive MERN stack bootcamp at Masai School** — basically a compressed computer science education, competing against fresh CS graduates who'd been programming since school.\n\nHe finished in the **top 5% of his cohort** in Data Structures and Algorithms.\n\nThree years later: **Lead Developer** at Blue Ray Automation, **Employee of the Month** in 2024, building systems used across India and Ghana, and speaking at a Vue.js conference in Hyderabad.\n\nHis mechanical engineering background genuinely shows in how he thinks. He doesn't just write features — he engineers systems. Every component has a purpose, every interface has a contract, and failure modes are considered before the happy path.",
      "The short version: Mechanical Engineering degree → realised passion was in software → 1,200+ hour bootcamp → Lead Developer in 3 years.\n\nThe more interesting version: that mechanical engineering background is actually a **competitive advantage**. When Kiran looks at a codebase, he doesn't see files and functions — he sees a machine. Every module is a subsystem, every API boundary is a joint that needs to handle load, every state update is a force being transmitted through the system.\n\nThat mental model is why his RBAC implementations are granular instead of coarse, why he thinks about Newgas's multi-tab state as 'what happens when this component fails while the other is under load', and why Kiggidi was designed offline-first from day one instead of retrofitted later.\n\nSelf-taught doesn't mean self-limited. It means he chose this on purpose."
    ],
    chips: ["VueVerse talk", "See his achievements", "What makes him different?", "Get in touch"]
  },

  achievements: {
    trigger: ['achievement', 'award', 'recognition', 'accomplishment', 'employee of the month', 'promoted', 'promotion', 'impact'],
    responses: [
      "Here's the track record:\n\n🎤 **Speaker — VueVerse Connect 2026** (Hyderabad)\nDelivered 'From Idea to Impact' to 200+ Vue.js developers. First time speaking publicly as a self-taught engineer.\n\n🏆 **Employee of the Month — Dec 2024** (Blue Ray Automation)\nRecognised for shipping the RBAC security module ahead of schedule and cutting legacy app load times by 40%.\n\n⚡ **Lead Developer in 3 years**\nStarted as a junior engineer post-bootcamp. Now leading frontend architecture, mentoring juniors, and making system design calls.\n\n🌍 **Newgas ERP** — Platform serving a $18.2M-funded LPG network across Ghana, managing cylinder supply chains for 3M+ target households.\n\n🛒 **Kiggidi** — End-to-end B2B2C PWA live at kiggidi.com, targeting the underserved hyper-local Kirana market.\n\n🔒 **Zero security incidents** across all RBAC implementations — Officeous HRMS, Smart Kirana, and Newgas all passed their respective audits.\n\nThe common thread: he doesn't just deliver features, he delivers systems that hold up."
    ],
    chips: ["The pivot story", "Tell me about Kiggidi", "What is Newgas?", "Schedule a call"]
  },

  philosophy: {
    trigger: ['philosophy', 'approach', 'values', 'thinking', 'different', 'edge', 'what makes', 'mindset', 'how does he think'],
    responses: [
      "Kiran has a phrase he comes back to: **'Engineer the system, not just the feature.'**\n\nIt sounds simple but it shapes everything. When he built Kiggidi's offline support, he didn't add a 'no internet' error message — he built background sync so cart actions queue and replay when the connection returns. When he designed the Newgas RBAC, he didn't gate routes — he masked individual data fields based on clearance level.\n\nA few principles that show up consistently in his work:\n\n**Failure modes first**: He designs for what happens when things break before he designs the happy path. That's the mechanical engineer in him — you don't spec a bridge by how it works on a sunny day.\n\n**Business context, not just tickets**: He wants to understand why a feature exists before he builds it. The Newgas PII masking composable wasn't in the original spec — he identified the compliance risk and proposed the solution.\n\n**Performance is not optional**: 15% bundle reduction on Newgas wasn't a nice-to-have. Distributor depots run on ageing hardware. Slow software is broken software in that context.\n\n**Mentoring as leverage**: He actively mentors junior developers because he remembers being one, and because a team that understands the 'why' ships better than one that just follows tickets.",
    ],
    chips: ["The pivot story", "See his projects", "Current availability", "Contact Kiran"]
  },

  availability: {
    trigger: ['available', 'hire', 'open', 'looking', 'freelance', 'contract', 'remote', 'job', 'opportunity', 'work with', 'collaborate'],
    responses: [
      "Kiran is **actively open** to the right opportunity right now.\n\n✅ **Role type**: Senior / Lead Frontend or Full-Stack Engineering\n🌍 **Location**: Rajamahendravaram, India — open to fully remote or hybrid globally\n📋 **Engagement**: Full-time employment, long-term contract, or independent project\n\n**Where he does his best work:**\n• Products with real complexity — multi-role platforms, offline-first apps, supply chain systems\n• Teams that care about architecture, not just velocity\n• Greenfield builds or meaningful rewrites (not 'add a button' tickets)\n\n**Stack preference**: React/Next.js or Vue/Nuxt on the frontend, FastAPI or Node.js on the backend, PostgreSQL.\n\n**What he's NOT looking for**: pure maintenance work, agencies with 2-week sprints and no technical ownership, or roles where engineering is just ticket execution.\n\nIf you're building something that matters and needs an engineer who thinks in systems — he's worth a conversation.",
      "Short answer: **yes, he's open**.\n\nLonger answer: he's selective about what he takes on because he's currently doing meaningful work and isn't in a rush. The right opportunity would be a **senior/lead role** on a product with real technical depth — fintech, logistics, health, e-commerce infrastructure — somewhere that values architecture over just shipping features.\n\nFully remote works well for him. He's already shipped production systems for companies in India and Ghana from Rajamahendravaram, so time zones aren't a dealbreaker.\n\nBest move: send him a message directly. He responds fast."
    ],
    chips: ["Schedule a call", "Download CV", "Contact Kiran", "See his projects"]
  },

  contact: {
    trigger: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'connect', 'call', 'message', 'get in touch'],
    responses: [
      `Here's how to reach Kiran directly:\n\n📧 **Email**: ${process.env.NEXT_PUBLIC_EMAIL}\n📱 **WhatsApp**: https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}\n\n🔗 **LinkedIn**: ${process.env.NEXT_PUBLIC_LINKEDIN_URL}\n🐙 **GitHub**: ${process.env.NEXT_PUBLIC_GITHUB_URL}\n📅 **Book a call**: ${process.env.NEXT_PUBLIC_CALENDLY_URL}\n\nHe typically responds within a few hours. If you're reaching out about a role or project, a quick line about what you're building goes a long way — he's much more likely to engage with context than a cold 'are you open to opportunities?' ping.\n\nCurrently open to: Full-time, Long-term Contract, Independent Projects.`
    ],
    chips: ["Book a call", "Download resume", "See his projects", "What is he looking for?"]
  },

  default: {
    trigger: [],
    responses: [
      "I didn't quite catch that — let me point you somewhere useful.\n\nHere's what I know best:\n• **Kiggidi** — his B2B2C PWA for local Kirana stores\n• **Newgas** — LPG distribution ERP for Ghana ($18.2M funded)\n• **Officeous** — enterprise HRMS with resource-level RBAC\n• **Smart Kirana** — React Native multi-app grocery ecosystem\n• **Tech Stack** — React, Vue, FastAPI, Supabase, Zustand, PWA...\n• **The Pivot** — Mechanical Engineer to Lead Developer in 3 years\n• **VueVerse** — he spoke at the 2026 conference in Hyderabad\n• **Availability** — open to remote senior/lead roles\n\nWhat do you want to know more about?",
      "Not sure I have a perfect answer for that one. But here's what I can tell you about:\n\n→ **Projects**: Kiggidi, Newgas, Officeous HRMS, Smart Kirana\n→ **Skills**: React, Next.js, Vue, Nuxt, FastAPI, PostgreSQL, PWA\n→ **Story**: Mechanical Eng → bootcamp → Lead Dev in 3 years\n→ **Availability**: Yes, he's open to the right opportunity\n\nPick one and I'll go deep."
    ],
    chips: ["Tell me about Kiggidi", "What is Newgas?", "His tech stack", "Contact Kiran"]
  }
};

// ==================== RESPONSE MATCHER ====================
const findBestResponse = (query: string) => {
  const lowerQuery = query.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  Object.entries(CONVERSATION_FLOWS).forEach(([, flow]) => {
    if (!flow.trigger) return;

    const score = flow.trigger.filter(keyword =>
      lowerQuery.includes(keyword)
    ).length;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = flow;
    }
  });

  return bestMatch || CONVERSATION_FLOWS.default;
};

// ==================== TYPING ANIMATION ====================
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 w-fit">
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
    <span className="text-xs text-gray-400 ml-2">Thinking...</span>
  </div>
);

// ==================== MAIN COMPONENT ====================
export default function KiranAITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load semantic model when widget first opens
  useEffect(() => {
    if (isOpen && !isSemanticReady()) {
      initSemanticMatcher(() => setAiReady(true));
    } else if (isOpen && isSemanticReady()) {
      setAiReady(true);
    }
  }, [isOpen]);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeFlow = CONVERSATION_FLOWS.welcome;
      const randomWelcome = welcomeFlow.responses[Math.floor(Math.random() * welcomeFlow.responses.length)];

      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          text: randomWelcome,
          sender: 'bot',
          chips: welcomeFlow.chips
        }]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle sending message
  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Try real AI backend first
      const res = await fetch('/api/chat', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }) 
      });

      if (!res.ok) {
         throw new Error('Fallback to heuristic engine');
      }

      const data = await res.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.text,
        sender: 'bot',
        chips: ["Tell me more", "Tech Stack", "Contact Kiran"] // Give default chips for AI outputs
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      // Try semantic matching first, fall back to keyword heuristic
      const semanticKey = await findBestFlowSemantic(text);
      const matchedFlow = semanticKey
        ? CONVERSATION_FLOWS[semanticKey as keyof typeof CONVERSATION_FLOWS]
        : findBestResponse(text);

      const response = Array.isArray(matchedFlow.responses)
        ? matchedFlow.responses[Math.floor(Math.random() * matchedFlow.responses.length)]
        : matchedFlow.responses;

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        chips: matchedFlow.chips
      };

      setMessages(prev => [...prev, botMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- UPDATED TEXT FORMATTER (HANDLES LINKS & BOLD) ---
  const formatText = (text: string) => {
    // Regex to detect URLs (http/https/www) and Emails
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

    return text.split('\n').map((line, i) => (
      <span key={i} className="block mb-2 last:mb-0 break-words">
        {line.split(' ').map((word, j) => {
          // 1. Check for Bold (**text**)
          if (word.startsWith('**') && word.endsWith('**')) {
            return <strong key={j} className="text-blue-400 font-semibold">{word.slice(2, -2)} </strong>;
          }
          // 2. Check for Links/Emails
          if (word.match(urlRegex)) {
            const isEmail = word.includes('@');
            const href = isEmail ? `mailto:${word}` : (word.startsWith('http') ? word : `https://${word}`);
            return (
              <a
                key={j}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-300 underline-offset-2 transition-colors"
              >
                {word}
              </a>
            );
          }
          return word + ' ';
        })}
      </span>
    ));
  };

  // Quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'download':
        window.open(process.env.NEXT_PUBLIC_RESUME_URL || '', '_blank');
        break;
      case 'github':
        window.open(process.env.NEXT_PUBLIC_GITHUB_URL || '', '_blank');
        break;
      case 'linkedin':
        window.open(process.env.NEXT_PUBLIC_LINKEDIN_URL || '', '_blank');
        break;
      case 'schedule':
        window.open(process.env.NEXT_PUBLIC_CALENDLY_URL || '', '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${process.env.NEXT_PUBLIC_EMAIL || ''}`;
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-[350px] md:w-[400px] h-[600px] bg-[#0a0a0c]/95 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >
            {/* Header */}
            <div className="relative p-5 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-white/5">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/30">
                      <Brain className="text-white w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">Kiran's AI Twin</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Lead Full-Stack Engineer</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/10">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        <span className="text-[9px] text-green-400 font-semibold uppercase tracking-wide">Online</span>
                      </div>
                      {aiReady ? (
                        <div className="flex items-center gap-1 bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/10">
                          <div className="w-1 h-1 bg-purple-400 rounded-full" />
                          <span className="text-[9px] text-purple-400 font-semibold uppercase tracking-wide">Semantic AI</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" />
                          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Loading AI...</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <MapPin size={10} />
                        <span>Remote</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { id: 'github', icon: Github, label: 'Code' },
                  { id: 'linkedin', icon: Linkedin, label: 'Link' },
                  { id: 'schedule', icon: Calendar, label: 'Meet' },
                  { id: 'download', icon: Download, label: 'CV' }
                ].map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg py-2 transition-all group"
                  >
                    <action.icon size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-[9px] text-gray-500 group-hover:text-gray-300 font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] ${msg.sender === 'bot' ? 'space-y-2' : ''}`}>
                    {/* Message bubble */}
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20'
                      : 'bg-[#1a1a1c] text-gray-200 border border-white/5 rounded-bl-none'
                      }`}>
                      {formatText(msg.text)}
                    </div>

                    {/* Suggestion chips */}
                    {msg.sender === 'bot' && msg.chips && idx === messages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-2"
                      >
                        {msg.chips.map((chip: string, chipIdx: number) => (
                          <motion.button
                            key={chip}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + chipIdx * 0.1 }}
                            onClick={() => handleSend(chip)}
                            className="text-[11px] bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 text-gray-400 hover:text-blue-300 px-3 py-1.5 rounded-full transition-all font-medium"
                          >
                            {chip}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/40 border-t border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 bg-[#1a1a1c] border border-white/5 rounded-xl px-4 py-1 focus-within:border-blue-500/30 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything..."
                  autoComplete="off"
                  className="flex-1 bg-transparent text-[13px] py-3 text-white placeholder-gray-600 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="text-blue-500 hover:text-blue-400 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors p-1.5 hover:bg-blue-500/10 rounded-lg"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-gray-700 text-center mt-2 font-medium">
                {aiReady ? 'Powered by Semantic Embeddings • Private & Secure' : 'Powered by Local AI Logic • Private & Secure'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -20, 20, -15, 0] // 1. The "Jump" animation keyframes
        }}
        transition={{ 
          type: "spring",
          damping: 20,
          stiffness: 300,
          y: { delay: 1.5, duration: 1, times: [0, 0.2, 0.5, 0.8, 1] } // Delays the jump by 1.5s
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/30 overflow-hidden group border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={26} />
              
              {/* 2. The "1" Notification Badge (Replaces the green dot) */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.2, type: "spring" }} // Pops in right after the jump
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0c] shadow-sm z-10"
              >
                1
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}