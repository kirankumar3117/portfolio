// Semantic similarity matcher using all-MiniLM-L6-v2 (~30MB, runs in browser)
// Falls back gracefully if model hasn't loaded yet

type FeatureExtractionPipeline = (
  text: string,
  options: { pooling: string; normalize: boolean }
) => Promise<{ data: Float32Array }>;

// Natural language descriptions for each conversation flow
const FLOW_DESCRIPTIONS: Record<string, string> = {
  welcome: "greeting hello hi welcome start who are you",
  kiggidi:
    "Kiggidi B2B2C e-commerce PWA Kirana store local delivery offline service worker Zustand Supabase next-intl geolocation neighborhood grocery",
  newgas:
    "Newgas LPG gas cylinder Ghana bottling plant distributor ecovault supply chain ERP Nuxt Pinia multi-tab Blue Ray Automation",
  smart_kirana:
    "Smart Kirana grocery React Native multi-app ecosystem chitty handwritten list shopkeeper customer FastAPI PostGIS India",
  officeous:
    "Officeous HRMS HR human resources payroll leave attendance performance review employee management",
  speaker:
    "VueVerse conference speaker talk presentation public speaking Hyderabad Vue.js",
  technical_deep:
    "technical architecture backend database PostgreSQL PostGIS spatial data FastAPI real-time API how does it work internals",
  rbac:
    "RBAC security role based access control IAM permissions PII masking audit compliance data protection",
  skills:
    "skills technology stack expertise React Vue Python Node.js PWA Zustand Pinia Supabase frameworks tools languages",
  pivot_story:
    "career story background mechanical engineering pivot journey Masai School bootcamp self-taught how did he start coding",
  achievements:
    "achievements awards recognition employee of month promotion accomplishments track record impact",
  philosophy:
    "engineering philosophy approach values thinking mindset what makes him different edge systems thinking",
  availability:
    "available hire open looking job freelance contract remote work opportunity collaborate",
  contact:
    "contact email phone WhatsApp reach connect call schedule meet get in touch",
};

let extractor: FeatureExtractionPipeline | null = null;
const flowEmbeddings: Record<string, number[]> = {};
let isReady = false;
let isLoading = false;

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function initSemanticMatcher(
  onProgress?: (ready: boolean) => void
): Promise<void> {
  if (isReady || isLoading) return;
  isLoading = true;

  try {
    const { pipeline } = await import("@huggingface/transformers");

    extractor = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )) as unknown as FeatureExtractionPipeline;

    // Pre-compute embeddings for all flows
    for (const [key, description] of Object.entries(FLOW_DESCRIPTIONS)) {
      const output = await extractor(description, {
        pooling: "mean",
        normalize: true,
      });
      flowEmbeddings[key] = Array.from(output.data);
    }

    isReady = true;
    onProgress?.(true);
  } catch (err) {
    console.warn("Semantic matcher failed to load, using keyword fallback:", err);
  } finally {
    isLoading = false;
  }
}

export function isSemanticReady(): boolean {
  return isReady;
}

// Returns the best matching flow key, or null if confidence is too low / model not ready
export async function findBestFlowSemantic(
  query: string
): Promise<string | null> {
  if (!isReady || !extractor) return null;

  const output = await extractor(query, { pooling: "mean", normalize: true });
  const queryEmbedding = Array.from(output.data) as number[];

  let bestKey: string | null = null;
  let bestScore = 0.35; // Minimum confidence threshold

  for (const [key, embedding] of Object.entries(flowEmbeddings)) {
    if (key === "welcome") continue; // welcome is triggered by UI, not query matching
    const score = cosineSimilarity(queryEmbedding, embedding);
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey;
}
