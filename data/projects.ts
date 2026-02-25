import { Database, Shield, Globe, ShoppingCart, LucideIcon } from 'lucide-react';

export interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  isConfidential: boolean;
  stats: string;
  icon: LucideIcon;
  color: string;
  liveUrl?: string;
  githubUrl?: string;
  // Deep Dive Details (Optional for now)
  problemStatement?: string;
  solution?: string;
  technicalHighlights?: string[];
  futureScope?: string;
  repositories?: { name: string; url: string }[];
}

// --- DATA: YOUR REAL PROJECTS ---
export const PROJECTS: Project[] = [
  {
    title: "Smart Kirana",
    category: "Full-Stack Engineering",
    description: "A hyper-local grocery platform designed for the Indian market, streamlining 'chitty' (handwritten list) ordering. Features a React Native app ecosystem (Customer & Shopkeeper apps) and Next.js web portals (Admin & Customer web) powered by a high-performance Python backend.",
    tech: ["FastAPI", "React Native", "Next.js", "PostgreSQL", "Docker", "JWT"],
    isConfidential: true,
    stats: "Multi-Platform App Ecosystem",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-500",
    problemStatement: "The Indian hyper-local grocery market relies heavily on 'chitty' (handwritten lists) and WhatsApp messages. Existing platforms force rigid digital catalogs that cause friction for both shopkeepers and customers.",
    solution: "Engineered a high-performance, multi-app ecosystem specifically catering to this behavior, allowing seamless pre-order pickups and automated list digitization while maintaining strict data isolation between vendors.",
    technicalHighlights: [
      "Custom JWT Authentication using Phone Numbers (OTP) instead of emails to align with Indian consumer behavior.",
      "Scalable Multipart File Upload system architecture specifically for handwritten list processing.",
      "Spatial Data (Latitude/Longitude) implementations in PostgreSQL for accurate shop discovery and radius-based filtering.",
      "Complex Many-to-Many relational database design handling Shop-to-Product bridging.",
      "Granular Role-Based Access Control (RBAC) guaranteeing data security and isolation across Customer, Shopkeeper, and Admin portals."
    ],
    futureScope: "Upcoming AI-OCR integration for automated cart generation from images and WebSocket-based real-time order tracking.",
    repositories: [
      { name: "Backend Core API", url: "https://github.com/kirankumar3117/kmart-backend" },
      { name: "Customer Mobile App", url: "https://github.com/kirankumar3117/kart-mithra-mobile" },
      { name: "Shopkeeper Mobile App", url: "https://github.com/kirankumar3117/shopkeeper-mobile" }
    ]
  },
  {
    title: "Granular RBAC Security Engine",
    category: "System Security",
    description: "Architected a custom Identity & Access Management (IAM) system for HR payroll data. Implemented resource-level permission gates that dynamically render UI components based on user roles (Admin/Manager/Employee).",
    tech: ["React", "Node.js", "JWT", "Audit Logging", "Middleware"],
    isConfidential: true,
    stats: "Zero Breaches",
    icon: Shield,
    color: "from-purple-600 to-pink-500"
  },
  {
    title: "3D Interactive Portfolio",
    category: "Creative Engineering",
    description: "The site you are looking at right now. A showcase of WebGL performance, integrating React Three Fiber for 3D visuals and a custom-built 'Local LLM' chat agent running entirely in the browser.",
    tech: ["R3F (Three.js)", "Tailwind", "Framer Motion", "EmailJS"],
    isConfidential: false, // Shows Code links
    liveUrl: "#",
    githubUrl: "https://github.com/kirankumar3117/portfolio",
    stats: "100/100 Lighthouse",
    icon: Globe,
    color: "from-emerald-500 to-green-500"
  }
];
