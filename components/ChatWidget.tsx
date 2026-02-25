'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Github, Linkedin,
  Download, Calendar, Brain, MapPin
} from 'lucide-react';

// ==================== CONVERSATION ENGINE ====================
const CONVERSATION_FLOWS = {
  welcome: {
    trigger: ['hi', 'hello', 'hey', 'start', 'sup', 'yo'],
    responses: [
      "Hey there! 👋 I'm Kiran's AI twin—think of me as your friendly guide to his engineering journey.\n\nI can walk you through his **crown jewel project** (Smart Kirana), his massive **logistics platform** (NEWGAS), dive into his **mechanical-to-software pivot story**, or explore what makes him tick as an engineer.\n\nWhat sparks your curiosity?",
      "Welcome! 🚀 Great timing—Kiran's currently open for high-impact remote roles and independent projects.\n\nI know everything about his work: from architecting **hyper-local multi-app ecosystems** to his philosophy on clean code.\n\nWhere should we start?"
    ],
    chips: ["Tell me about Smart Kirana", "What is NEWGAS?", "Tech Stack & Skills", "Is he available?"]
  },

  smart_kirana: {
    trigger: ['smart', 'kirana', 'grocery', 'chitty', 'project', 'crown jewel', 'biggest', 'main project', 'react native', 'rn', 'ecosystem'],
    responses: [
      "Ah, Smart Kirana—Kiran's **magnum opus**! ��🔥\n\nImagine building the digital backbone for the hyper-local Indian grocery market. This isn't just a web app; it's a full **multi-app ecosystem**.\n\n**The Challenge**: The market relies heavily on 'chitty' (handwritten lists) and WhatsApp. Traditional rigid digital catalogs caused massive friction for shopkeepers.\n\n**Kiran's Solution**: He architected a scalable platform featuring **React Native apps** (for Customers & Shopkeepers) and **Next.js web portals** (for Admins), all backed by a high-performance **FastAPI / PostgreSQL** engine.\n\n**Impact**: It digitizes handwritten lists via upcoming AI-OCR, utilizes OTP JWT Auth tailored for Indian consumers, and uses spatial data (PostGIS) for accurate shop discovery.\n\nThis project showcases his ability to **engineer complex ecosystems, not just write isolated code**."
    ],
    chips: ["How does the backend work?", "What is NEWGAS?", "Tech stack details", "Contact Kiran"]
  },

  newgas: {
    trigger: ['newgas', 'lpg', 'erp', 'gas', 'logistics', 'multi-tab', 'nuxt', 'pinia'],
    responses: [
      "NEWGAS is a massive **mission-critical logistics platform** Kiran built for Blue Ray Automation. 🚚💨\n\nImagine handling LPG distribution for **thousands of agencies** like HP Gas. It's industrial-grade infrastructure.\n\n**The Challenge**: Distributors juggled multiple orders and inventory checks simultaneously. Standard web apps would lose data when switching tabs, crippling productivity.\n\n**Kiran's Solution**: He architected a custom **multi-tab internal routing system** using Nuxt.js + Pinia that perfectly preserves state across tabs. It revolutionized their workflow.\n\n**Performance**: He rigorously optimized the app, slashing the UI bundle size by **15%** for smooth performance on lower-end industrial hardware.\n\nIt's a prime example of his deep focus on **user-centric systems engineering**."
    ],
    chips: ["Tell me about Smart Kirana", "Technical Architecture", "The Pivot Story", "Contact Kiran"]
  },

  technical_deep: {
    trigger: ['how does', 'backend', 'spatial', 'fastapi', 'technical', 'architecture', 'database', 'postgres', 'postgis'],
    responses: [
      "Great question! Here's the technical magic behind Smart Kirana:\n\n**Database & Discovery**: He implemented PostgreSQL with **Spatial Data (PostGIS)** to handle latitude/longitude mapping, enabling exact radius-based shop filtering for hyper-local delivery.\n\n**Security & Auth**: recognizing that Indian consumers prefer phone numbers over emails, he discarded standard auth for a custom **Phone OTP JWT system** combined with granular RBAC to ensure strict data isolation between vendors.\n\n**File Processing**: He set up a scalable multipart upload architecture specifically tuned to process and ingest images of handwritten 'chitty' lists seamlessly.\n\nThis is **systems thinking** in action—coming from mechanical engineering, he views software architectures like machines where every sub-system must work friction-free.\n\nWant to see his other technical wins?"
    ],
    chips: ["Yes, show me more", "What's his tech stack?", "RBAC security project", "Hire Kiran"]
  },

  rbac: {
    trigger: ['rbac', 'security', 'role', 'access', 'control', 'hrms', 'payroll'],
    responses: [
      "Ah yes, the **RBAC Security System**—where Kiran's systems thinking really shines! 🔒\n\n**The Challenge**: Build an internal HRMS that handles sensitive payroll data across multiple administrative levels (HR, Finance, Department Heads, Employees).\n\n**The Problem**: Traditional role systems were too rigid. Real organizations have nuanced permissions—like \"can view salary ranges but not individual salaries.\"\n\n**Kiran's Solution**: Architected a **granular RBAC engine** with:\n• Role hierarchies with inheritance\n• Resource-level permissions (not just route-level)\n• Dynamic permission checks at the component level\n• Audit logging for all sensitive operations\n\n**Business Impact**: Zero security incidents, passed compliance audits, and gave admins fine-grained control without engineering bottlenecks.\n\nThis is the kind of **enterprise-grade thinking** that separates senior engineers from the rest."
    ],
    chips: ["More achievements", "Work philosophy", "Tech stack", "Get in touch"]
  },

  skills: {
    trigger: ['skill', 'stack', 'tech', 'technology', 'react', 'vue', 'python', 'node', 'expertise'],
    responses: [
      "Kiran's arsenal is built for **high-performance, scalable systems**:\n\n**Frontend Mastery**:\n• React.js (Next.js) & React Native—expert-level\n• Vue.js (Nuxt.js)\n• State Management: Pinia, Redux, Zustand\n• Real-time 3D: React Three Fiber\n\n**Backend Power**:\n• Python (FastAPI)—RESTful APIs, high-concurrency\n• Node.js—event-driven architectures\n• Database: PostgreSQL (PostGIS), MongoDB\n\n**Specializations**:\n• Multi-platform app ecosystems\n• RBAC security systems\n• Performance optimization & Spatial Data\n\nHe doesn't just use these tools—he **engineers solutions** with them."
    ],
    chips: ["Smart Kirana details", "Work availability", "The pivot story", "Download resume"]
  },

  pivot_story: {
    trigger: ['pivot', 'story', 'background', 'mechanical', 'journey', 'how did', 'education', 'masai'],
    responses: [
      "This is where it gets inspiring! 💡\n\n**The Setup**: Kiran graduated as a **Mechanical Engineer** in 2023. But while his peers were heading to factories, he realized his passion was in the **logic and scalability of software**.\n\n**The Grit**: He dove into a **1200+ hour intensive MERN bootcamp** at Masai School—basically compressed CS education while competing against CS grads.\n\n**The Result**: Within 3 years, he's not just competing—he's **leading them**. Promoted to Lead Developer, Employee of the Month 2024, architecting complex, multi-app ecosystems.\n\n**His Edge**: That mechanical engineering background? It's his superpower. He doesn't just \"write code\"—he **engineers systems** where every component is optimized for performance.\n\nFrom machines to software machines. Pretty cool, right?"
    ],
    chips: ["What makes him different?", "Current availability", "See his achievements", "Get in touch"]
  },

  achievements: {
    trigger: ['achievement', 'award', 'recognition', 'accomplishment', 'employee', 'promoted'],
    responses: [
      "Kiran's track record speaks volumes:\n\n🏆 **Employee of the Month (2024)** - Blue Ray Automation\n  Recognized for exceptional delivery and technical leadership\n\n⚡ **Rapid Promotion** - Lead Developer in 3 years\n  Started as a junior, now mentoring teams and architecting enterprise systems\n\n🛒 **Systems Architecture** - Built Smart Kirana ecosystem\n  Designed a React Native & Next.js platform powered by FastAPI\n\n🚀 **Logistics Infrastructure** - Architected NEWGAS ERP\n  Solved complex multi-tab state persistence for thousands of daily users\n\n🔒 **Security Architecture** - Built custom RBAC system\n  Secured sensitive HRMS payroll data across multiple admin levels\n\nThese aren't just bullet points—they're proof of **high-impact engineering**."
    ],
    chips: ["Work philosophy", "What's NEWGAS?", "Tech expertise", "Schedule a call"]
  },

  philosophy: {
    trigger: ['philosophy', 'approach', 'values', 'thinking', 'different', 'edge', 'what makes'],
    responses: [
      "Kiran's engineering philosophy is refreshingly clear:\n\n**\"Engineering First, Code Second\"**\nHe views software like a mechanical system—every component must be optimized for friction-free operation.\n\n**Core Values**:\n✨ **Performance-Obsessed** - If it's not fast, it's not done\n🏗️ **Clean Architecture** - \"Unmaintainable code is Day 1 technical debt\"\n🎯 **Business-Aware** - Technical choices must drive business outcomes\n🔄 **Systems Thinking** - Understanding how all parts interact\n\nHe bridges the gap between **engineering excellence** and **business impact**."
    ],
    chips: ["Career goals", "Contact information", "See projects", "Availability"]
  },

  availability: {
    trigger: ['available', 'hire', 'open', 'looking', 'freelance', 'contract', 'remote', 'job'],
    responses: [
      "Perfect timing! Kiran is **actively open** to high-impact opportunities:\n\n✅ **Primary Focus**: Senior Frontend / Full-Stack Engineering roles\n📍 **Work Model**: 100% Remote, Hybrid, or Independent/Contract\n🌍 **Location**: Rajamahendravaram, India (but fully location-agnostic)\n\n**Dream Projects**:\n• Complex multi-app ecosystems\n• Fintech engines\n• Logistics/supply chain systems\n• Anything requiring high-concurrency + deep state management\n\n**Tech Stack Preference**:\n• React/Next.js or React Native\n• Python (FastAPI) or Node.js backends\n• PostgreSQL, MongoDB\n\nHe's not just looking for a job—he's looking for **engineering challenges that matter**."
    ],
    chips: ["Schedule a call", "Download CV", "Email Kiran", "GitHub profile"]
  },

  contact: {
    trigger: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'connect', 'call'],
    responses: [
      `Let's connect! Here's how to reach Kiran directly:\n\n📧 **Email**: ${process.env.NEXT_PUBLIC_EMAIL}\n📱 **WhatsApp**: Click here to chat: https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}\n\n🔗 **Professional Links**:\n• LinkedIn: ${process.env.NEXT_PUBLIC_LINKEDIN_URL}\n• GitHub: ${process.env.NEXT_PUBLIC_GITHUB_URL}\n\n📅 **Schedule a call**: ${process.env.NEXT_PUBLIC_CALENDLY_URL}\n\n💼 **Current Status**: Open to Full-time, Contract, and Independent projects\n\nDon't hesitate—he's friendly, professional, and genuinely passionate about solving hard problems.`
    ],
    chips: ["Schedule call now", "Download resume", "Back to start", "See achievements"]
  },

  default: {
    trigger: [],
    responses: [
      "Hmm, I want to give you the best info! 🤔\n\nI can tell you about:\n• **Smart Kirana** - His multi-app ecosystem project\n• **NEWGAS ERP** - His massive logistics platform\n• **Tech Stack** - React Native, FastApi, PostgreSQL, and more\n• **The Pivot** - Mechanical engineer to software lead\n• **Availability** - He's open to remote/contract work\n• **Contact** - Get in touch directly\n\nWhat interests you most?"
    ],
    chips: ["Smart Kirana project", "NEWGAS project", "Pivot story", "Contact Kiran"]
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
       // 2. Fallback to heuristic system (Zero external cost / handles missing API keys)
       // Simulate thinking delay so it still feels natural
       await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

       const matchedFlow = findBestResponse(text);
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
                Powered by Local AI Logic • Private & Secure
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