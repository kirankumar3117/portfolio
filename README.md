# Kiran Kumar | Senior Full-Stack Engineer — Portfolio

![Portfolio Preview](https://softwareguru.in/opengraph-image)

> A high-performance, interactive 3D portfolio built with **Next.js 15 (App Router)**, **React Three Fiber**, and **TypeScript**. Engineered to demonstrate enterprise-grade architecture, creative WebGL work, and a fully autonomous AI agent — all in a single deployable unit.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-softwareguru.in-6d28d9?style=for-the-badge&logo=vercel&logoColor=white)](https://softwareguru.in)
[![CI](https://github.com/kirankumar3117/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/kirankumar3117/portfolio/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ✨ Key Technical Features

### 🧠 1. "Local Brain" AI Agent — Zero-Latency Heuristic Engine

The chat widget is **not just a thin API wrapper**. It is a two-layer intelligence system:

| Layer | Description | Trigger |
|---|---|---|
| **Heuristic Engine** | Keyword-pattern matching running 100% in-browser. Zero network round-trips, zero latency. | Always-on fallback |
| **Gemini 1.5 Flash** | Google Generative AI via a stateless Next.js `/api/chat` route with a massive custom `SYSTEM_PROMPT` embedding Kiran's full resume and engineering philosophy. | When API key is present & network is available |

**Design insight:** The fallback isn't a degraded experience — it's a first-class local brain that answers the most common visitor questions (stack, experience, availability) instantly, without ever exposing the API key in the client bundle.

---

### 🌍 2. Interactive 3D Hero — React Three Fiber

Real-time WebGL rendered directly in the React tree using `@react-three/fiber` and `@react-three/drei`.

- **`MeshDistortMaterial`** creates a fluid, organic animation loop at a locked 60 FPS.
- The canvas degrades gracefully on devices that don't support WebGL, falling back to a static gradient — no JavaScript errors, no blank screens.
- The 3D layer is entirely isolated in `components/Hero3D.tsx` and has zero coupling to the data layer or AI widget.

---

### 🏗️ 3. Enterprise Project Showcase — NDA-Safe Architecture

A cleanly-typed, data-driven showcase (`data/projects.ts` → `ProjectShowcase.tsx`) purpose-built to handle both public and confidential work:

| Feature | Implementation |
|---|---|
| **Confidential flag** | `isConfidential: true` replaces all links with an `Enterprise / NDA` badge. No source code or live URLs are ever exposed for protected work. |
| **Deep Dive Modals** | `AnimatePresence`-powered overlay renders per-project `problemStatement`, `solution`, `technicalHighlights`, and multi-repo link maps — a full case study without leaving the page. |
| **Glassmorphism cards** | `backdrop-blur`, Framer Motion staggered grid, and per-project gradient theming. |

**Projects currently showcased:**

- 🛒 **Smart Kirana** — Multi-platform hyper-local grocery ecosystem (React Native + FastAPI + PostgreSQL)
- 🚚 **Smart Kirana Pre-Order System** — Digital pre-order architecture for semi-urban grocery stores (Next.js + Node.js + PostgreSQL)
- 📊 **SHIPLOG — UAT Intelligence** — Internal release intelligence platform *(Enterprise / NDA)*
- 🔐 **Granular RBAC Security Engine** — Custom IAM for HR payroll data *(Enterprise / NDA)*
- 🌐 **This Portfolio** — The site you are reading right now

---

### ⚙️ 4. CI/CD — GitHub Actions Automation

Every push and pull request to `main` triggers a full quality gate via `.github/workflows/ci.yml`:

```
Push / PR to main
       │
       ▼
  npm ci  (clean install from lock file)
       │
       ├── ESLint  (eslint-config-next)
       │
       ├── TypeScript  (tsc --noEmit)
       │
       └── Next.js Build  (npm run build)
```

No deployment happens unless all three gates pass. The `GEMINI_API_KEY` is intentionally **not** required for the build step — the heuristic fallback guarantees the build succeeds without secrets in CI.

---

### 🚀 5. Aggressive SEO Engine

Google-first engineering baked into the Next.js `RootLayout`:

- **JSON-LD Structured Data** — `Person` + `Organization` schemas for Knowledge Panel eligibility.
- **Long-tail keyword targeting** — Geo-modifiers for the Indian & global market (`software india`, `software guru`, etc.).
- **Strict canonical tagging** — `sitemap.ts` + `alternates` metadata locked to `https://softwareguru.in` to prevent duplicate-content penalties.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| 3D Graphics | React Three Fiber / Drei |
| AI — Cloud | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| AI — Local | Custom heuristic keyword engine (zero-dependency) |
| Email | EmailJS (`@emailjs/browser`) |
| Deployment | Vercel Edge Network |
| CI/CD | GitHub Actions |

---

## ⚡ Local Development

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10

### Steps

```bash
# 1. Clone
git clone https://github.com/kirankumar3117/portfolio.git
cd portfolio

# 2. Install (exact versions from lock file)
npm ci

# 3. Configure environment
cp .env.example .env.local
# → Set GEMINI_API_KEY to your Google AI Studio key
#   (optional — the Local Brain heuristic engine works without it)

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

> **Tip:** The AI chat widget works immediately without a key — the heuristic engine handles all common queries locally. Add a key only if you want to test Gemini streaming responses.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build (also runs type-check) |
| `npm run lint` | Run ESLint across the project |
| `npx tsc --noEmit` | Standalone TypeScript type-check |

---

## 👤 About

**Kiran Kumar** — Senior Full-Stack Engineer based in Hyderabad, India.  
Mechanical Engineering graduate turned software architect. Passionate about shipping high-impact products end to end.

- 🌐 **Portfolio:** [softwareguru.in](https://softwareguru.in)
- 💼 **LinkedIn:** [linkedin.com/in/kirankumar3117](https://linkedin.com/in/kirankumar3117)
- 🐙 **GitHub:** [github.com/kirankumar3117](https://github.com/kirankumar3117)

---

*Built with purpose. Shipped with precision.*