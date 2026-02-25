# Kiran Kumar | Senior Full-Stack Engineer Portfolio

![Portfolio Preview](https://softwareguru.in/opengraph-image)

> A high-performance, interactive 3D portfolio built with Next.js 15, React Three Fiber, and TypeScript. Designed to showcase enterprise-grade architecture skills and creative engineering.

## 🚀 Live Demo
Visit the live site: **[https://softwareguru.in](https://softwareguru.in)**

---

## ✨ Key Technical Features

### 1. 🧠 "True AI Twin" Widget (Gemini 1.5 Flash)
A highly responsive digital assistant powered by Google's Generative AI (`@google/generative-ai`), acting as a digital twin.
- **Next.js API Routes**: Built a stateless `/api/chat` route to stream low-latency AI responses based on a massive customized `SYSTEM_PROMPT` containing Kiran's resume and philosophy.
- **Graceful Fallback**: If the `GEMINI_API_KEY` is missing or the external network fails, the system instantly switches to a zero-latency heuristic (keyword-matching) module to ensure visitors never see an error state.

### 2. 🎨 Enterprise Project Showcase Architecture
A specialized, cleanly-typed component design (`ProjectShowcase.tsx` & `data/projects.ts`) to handle NDA-protected work.
- **Glassmorphism & Micro-animations**: Extensive use of `backdrop-blur` and Framer Motion staggered grid animations for a premium, tactile UX.
- **Deep Dive Modals**: For case studies like *Smart Kirana*, clicking "Read Case Study" opens a sleek `AnimatePresence` modal overlay mapping specific problem statements, solution architectures, technical highlights, and multi-repository links mapping a full-stack ecosystem.

### 3. 🚀 Aggressive SEO Engine Takeover
Google-first engineering built into the Next.js `RootLayout`.
- **JSON-LD Structured Data**: Hand-coded `Person` and `Organization` schemas injected natively to explicitly trigger Google Knowledge Panels.
- **Massive Metadata Targeting**: Dynamically localized geo-modifiers targeting the Indian & global markets, heavily scoring for long-tail keywords like `software india` and `software guru`.
- **Strict Canonical Tagging**: Custom overrides in `sitemap.ts` and `alternates` metadata strictly mapping to `https://softwareguru.in` to block duplicate content penalties.

### 4. 🌍 3D Interactive Hero Canvas
- Real-time fluid simulation utilizing `react-three-fiber` and custom shaders (`MeshDistortMaterial`) rendering flawlessly at 60 FPS on both WebGL and mobile browsers.

---

## 🛠️ Tech Stack Ecosystem

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** Strict TypeScript
- **Machine Learning Integration:** Google Gemini SDK (`1.5 Flash`)
- **Styling:** Vanilla Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber / Drei
- **Deployment:** Vercel Edge Network

---

## ⚡ Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kirankumar3117/portfolio.git
   cd portfolio
   ```

2. **Set up your environment variables:**
   Create a `.env` file in the root directory and configure it (check `app/api/chat/route.ts` for the required Gemini keys if testing the true AI).
   ```env
   GEMINI_API_KEY=your_google_ai_studio_key_here
   ```

3. **Install exactly and deploy:**
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.