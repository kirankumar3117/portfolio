import { Shield, Globe, ShoppingCart, Flame, Users, Store, LucideIcon } from 'lucide-react';

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
  problemStatement?: string;
  solution?: string;
  technicalHighlights?: string[];
  futureScope?: string;
  repositories?: { name: string; url: string }[];
}

export const PROJECTS: Project[] = [
  {
    title: "Kiggidi",
    category: "B2B2C E-Commerce Platform",
    description:
      "A hyper-local B2B2C e-commerce ecosystem digitizing neighborhood Kirana stores and local merchants across India. Built as a mobile-first PWA, it enables 'Order & Pick on the Go' and rapid local delivery — empowering traditional businesses with a modern digital storefront without heavy platform commissions.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Supabase Auth", "Zustand", "Tailwind CSS", "PWA", "next-intl", "Framer Motion"],
    isConfidential: false,
    stats: "3M+ Target Households",
    icon: Store,
    color: "from-orange-500 to-red-500",
    liveUrl: "https://kiggidi.com",
    problemStatement:
      "Massive quick-commerce platforms (Swiggy Instamart, Blinkit) bypass existing neighbourhood Kirana stores, destroying livelihoods. Traditional merchants have no affordable way to go digital — existing SaaS platforms charge heavy commissions that wipe out thin grocery margins.",
    solution:
      "Architected a PWA-first platform that gives every Kirana owner a zero-commission digital storefront. Customers discover nearby stores via geolocation, place orders for pick-up or rapid local delivery, and the merchant dashboard syncs inventory in real time to prevent double-booking.",
    technicalHighlights: [
      "Mobile App Shell with persistent bottom navigation (Home, Search, Cart, Profile) and iOS safe-area insets — indistinguishable from a native app.",
      "Custom geolocation hooks capture HTML5 GPS coordinates, reverse-geocode to neighbourhood names, and calculate real-time distance to nearby stores.",
      "Offline-Resilient Service Worker (next-pwa) — serves a custom fallback UI on dropped connections and background-syncs cart actions once the network returns.",
      "Zustand modular slices (Cart Store, Location Store) for predictable, tree-shakeable client state without a bloated global store.",
      "Multi-language support via next-intl covering English, Hindi, and Telugu — built for India's linguistic diversity.",
      "Merchant Live Status Toggle: when a shop goes offline, the customer UI applies a grayscale filter to the store card, disables 'Shop Now', and shows a 'Closed / Offline' badge — powered by a real-time Supabase subscription.",
      "Vercel branch-mapped deployments: about.kiggidi.com serves the marketing site while develop/main handle the core PWA — zero downtime cross-branch shipping.",
    ],
    futureScope:
      "WhatsApp Business API order notifications, AI-powered demand forecasting for pre-stocking high-velocity SKUs, and a merchant loyalty rewards engine.",
  },

  {
    title: "Newgas — LPG Distribution ERP",
    category: "Enterprise Platform / Supply Chain",
    description:
      "The central nervous system for Newgas Cylinder Bottling Ltd. (Ghana), managing the entire LPG supply chain from bottling plant to last-mile delivery for 3M+ households. Built for Blue Ray Automation, this admin platform handles cylinder inventory, distributor management, KYC, and real-time fleet dispatch across Greater Accra.",
    tech: ["Vue.js", "Nuxt.js", "Pinia", "FastAPI", "PostgreSQL", "Supabase", "TypeScript"],
    isConfidential: true,
    stats: "$18.2M Funded — 3M+ Households",
    icon: Flame,
    color: "from-sky-500 to-indigo-600",
    problemStatement:
      "Ghana's traditional cylinder refilling model was dangerous and fraud-prone — roadside stations routinely underfilled cylinders and most households still burned charcoal. Newgas needed a digital platform to manage a complex, multi-tiered asset supply chain (plant → ecovault → distributor → customer) with strict KYC compliance and real-time fleet tracking.",
    solution:
      "Architected Nova Web Admin — a role-aware enterprise ERP handling the full cylinder lifecycle. Super Admins, Distributors, and Support Agents operate within granular RBAC gates. A global data-masking layer automatically redacts PII across the UI based on backend metadata, ensuring compliance with Ghana's data protection laws.",
    technicalHighlights: [
      "Custom multi-tab internal routing system using Nuxt.js + Pinia that perfectly preserves per-tab state — critical for distributors managing simultaneous orders across agencies.",
      "useMaskTransform composable — a global PII masking system that automatically detects and redacts phone numbers, GPS coordinates, and KYC documents across every component based on backend masked_key metadata.",
      "Granular RBAC across Onboarding, Roles, Product, and Exchange modules — Super Admins, Distributors, and Support Agents see and interact only with their authorized scope.",
      "Delivery & Fleet module tracking order assignment, dispatch ETAs, delivery attempts, and the 4-digit Order OTP required for physical cylinder handover.",
      "Complex cart state handling: payable_amount, discount, and tax_breakdown for both 12kg Steel and 6kg Composite cylinder SKUs — each carrying separate Gas Cost and Deposit Cost.",
      "UI bundle optimisation cutting package size by 15% for smooth performance on lower-end industrial hardware used at distributor depots.",
    ],
    futureScope:
      "WhatsApp OTP delivery integration, ML-powered cylinder demand forecasting per ecovault zone, and a mobile agent app for last-mile delivery drivers.",
  },

  {
    title: "Officeous — HRMS",
    category: "Enterprise HR Platform",
    description:
      "A comprehensive Human Resource Management System built for mid-to-large organisations. Handles the full employee lifecycle — onboarding, payroll, leave management, attendance, and performance reviews — behind a granular RBAC security engine that exposes only what each role is authorised to see.",
    tech: ["React", "Node.js", "PostgreSQL", "JWT", "Tailwind CSS", "Audit Logging"],
    isConfidential: true,
    stats: "Zero Security Incidents",
    icon: Users,
    color: "from-teal-500 to-cyan-500",
    liveUrl: "https://officeous.com",
    problemStatement:
      "HR platforms typically use coarse route-level permissions, meaning a Department Head either sees all salary data or none. Real organisations need nuanced access — e.g. 'view salary bands but not individual figures' — without engineering a new permission check for every new view.",
    solution:
      "Architected a resource-level IAM engine where permissions are declared at the data field level, not the route level. UI components dynamically render or redact based on the resolved permission set of the authenticated user, with every sensitive action written to an immutable audit log.",
    technicalHighlights: [
      "Resource-level RBAC: permissions enforced at the data-field level, enabling fine-grained control (e.g., view salary band vs. individual salary) without route duplication.",
      "Dynamic component rendering based on resolved permission sets — HR, Finance, Department Heads, and Employees each see a different, contextually correct UI from the same codebase.",
      "Immutable audit log capturing actor, action, resource, old value, and new value for every sensitive mutation — passed compliance audits without remediation.",
      "Role hierarchy with inheritance: Manager permissions are a strict superset of Employee, simplifying permission assignment without combinatorial explosion.",
    ],
    futureScope:
      "AI-assisted performance review summarisation, payroll auto-reconciliation with bank APIs, and mobile app for manager approvals on the go.",
  },

  {
    title: "Smart Kirana",
    category: "Full-Stack Engineering",
    description:
      "A hyper-local grocery platform designed for the Indian market, streamlining 'chitty' (handwritten list) ordering. Features a React Native app ecosystem (Customer & Shopkeeper apps) and Next.js web portals (Admin & Customer web) powered by a high-performance Python backend.",
    tech: ["FastAPI", "React Native", "Next.js", "PostgreSQL", "Docker", "JWT"],
    isConfidential: true,
    stats: "Multi-Platform App Ecosystem",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-500",
    problemStatement:
      "The Indian hyper-local grocery market relies heavily on 'chitty' (handwritten lists) and WhatsApp messages. Existing platforms force rigid digital catalogs that cause friction for both shopkeepers and customers.",
    solution:
      "Engineered a high-performance, multi-app ecosystem specifically catering to this behaviour, allowing seamless pre-order pickups and automated list digitization while maintaining strict data isolation between vendors.",
    technicalHighlights: [
      "Custom JWT Authentication using Phone Numbers (OTP) instead of emails to align with Indian consumer behaviour.",
      "Scalable Multipart File Upload system architecture specifically for handwritten list processing.",
      "Spatial Data (Latitude/Longitude) implementations in PostgreSQL for accurate shop discovery and radius-based filtering.",
      "Complex Many-to-Many relational database design handling Shop-to-Product bridging.",
      "Granular Role-Based Access Control (RBAC) guaranteeing data security and isolation across Customer, Shopkeeper, and Admin portals.",
    ],
    futureScope:
      "Upcoming AI-OCR integration for automated cart generation from images and WebSocket-based real-time order tracking.",
    repositories: [
      { name: "Backend Core API", url: "https://github.com/kirankumar3117/kmart-backend" },
      { name: "Customer Mobile App", url: "https://github.com/kirankumar3117/kart-mithra-mobile" },
      { name: "Shopkeeper Mobile App", url: "https://github.com/kirankumar3117/shopkeeper-mobile" },
    ],
  },

  {
    title: "Granular RBAC Security Engine",
    category: "System Security",
    description:
      "Architected a custom Identity & Access Management (IAM) system for HR payroll data. Implemented resource-level permission gates that dynamically render UI components based on user roles (Admin/Manager/Employee).",
    tech: ["React", "Node.js", "JWT", "Audit Logging", "Middleware"],
    isConfidential: true,
    stats: "Zero Breaches",
    icon: Shield,
    color: "from-purple-600 to-pink-500",
  },

  {
    title: "3D Interactive Portfolio",
    category: "Creative Engineering",
    description:
      "The site you are looking at right now. A showcase of WebGL performance, integrating React Three Fiber for 3D visuals and a Semantic AI chat agent powered by in-browser embeddings (all-MiniLM-L6-v2) — no API key required.",
    tech: ["R3F (Three.js)", "Tailwind", "Framer Motion", "Transformers.js", "EmailJS"],
    isConfidential: false,
    liveUrl: "#",
    githubUrl: "https://github.com/kirankumar3117/portfolio",
    stats: "100/100 Lighthouse",
    icon: Globe,
    color: "from-emerald-500 to-green-500",
  },
];
