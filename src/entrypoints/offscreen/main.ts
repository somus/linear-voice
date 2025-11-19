/**
 * Offscreen Document
 * Handles AI model loading and processing (requires WebGPU for hardware acceleration)
 * All console logs are forwarded to background service worker for easy debugging
 */

import { initOffscreenLogger } from "@/utils/offscreen-logger";

// Initialize logger FIRST - all subsequent logs will be forwarded to background
initOffscreenLogger();

import {
  type AutomaticSpeechRecognitionPipelineType,
  env,
  type FeatureExtractionPipelineType,
  pipeline,
} from "@huggingface/transformers";
import { AUDIO, devLog, MESSAGE_TYPES, THRESHOLDS } from "@/config";
import { getAllShortcuts } from "@/core/shortcuts";

// Import pre-computed embeddings (generated via bun run generate:embeddings)
type PrecomputedEmbedding = {
  shortcutId: string;
  trigger: string;
  embedding: number[];
};

type PrecomputedEmbeddings = {
  default: {
    embeddings: Record<string, PrecomputedEmbedding>;
    model: string;
  };
};

let precomputedEmbeddings: PrecomputedEmbeddings | null = null;
try {
  precomputedEmbeddings = (await import(
    "@/data/trigger-embeddings.json"
  )) as PrecomputedEmbeddings;
} catch {
  devLog.warn(
    "[Offscreen] Pre-computed embeddings not found, will compute on startup"
  );
}

devLog.log("[Offscreen] Starting initialization...");

// Configure transformers.js for offscreen document
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

// Configure WASM paths for ONNX Runtime (required even for WebGPU)
// WebGPU uses ort-wasm-simd-threaded.jsep.wasm as part of ONNX Runtime infrastructure
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = false;
  env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL("wasm/");
}

// ============================================================================
// STATE
// ============================================================================

let asrPipeline: AutomaticSpeechRecognitionPipelineType | null = null;
let embeddingPipeline: FeatureExtractionPipelineType | null = null;
let currentASRModel: string | null = null;
let currentEmbeddingModel: string | null = null;

// WebGPU dtype configuration for Moonshine model
const WEBGPU_DTYPE_CONFIG = {
  encoder_model: "fp32",
  decoder_model_merged: "q4", // 4-bit quantization optimized for GPU
} as const;

// Pre-computed embeddings for all voice triggers
let triggerEmbeddings: Map<
  string,
  { shortcutId: string; trigger: string; embedding: number[] }
> | null = null;

devLog.log("[Offscreen] State initialized");

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Handle messages from background service worker
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  devLog.log("[Offscreen] Received message:", message.type);

  // Handle async
  handleMessage(message)
    .then((response) => {
      devLog.log("[Offscreen] Sending response for:", message.type);
      sendResponse(response);
    })
    .catch((error) => {
      devLog.error("[Offscreen] Message handler error:", error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    });

  // Return true to indicate async response
  return true;
});

type LoadModelsMessage = {
  type: typeof MESSAGE_TYPES.LOAD_MODELS;
  payload: {
    asrModel: string;
    embeddingModel: string;
  };
};

type TranscribeMessage = {
  type: typeof MESSAGE_TYPES.TRANSCRIBE;
  payload: {
    audioData: string;
  };
};

type IncomingMessage = LoadModelsMessage | TranscribeMessage;

type MessageResponse = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Handle message based on type
 */
function handleMessage(message: IncomingMessage): Promise<MessageResponse> {
  if (message.type === MESSAGE_TYPES.LOAD_MODELS) {
    return handleLoadModels(message.payload);
  }

  if (message.type === MESSAGE_TYPES.TRANSCRIBE) {
    return handleTranscribe(message.payload);
  }

  // This should never happen due to the type union, but handle it for safety
  const exhaustiveCheck: never = message;
  throw new Error(
    `Unknown message type: ${String((exhaustiveCheck as IncomingMessage).type)}`
  );
}

// ============================================================================
// MODEL LOADING
// ============================================================================

/**
 * Verify WebGPU availability (required for LinearVoice)
 */
async function verifyWebGPU(): Promise<void> {
  devLog.log("[Offscreen] Verifying WebGPU availability...");

  if (!("gpu" in navigator)) {
    throw new Error("WebGPU not supported in this browser");
  }

  const gpu = (
    navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown> };
    }
  ).gpu;

  if (!gpu) {
    throw new Error("WebGPU not available");
  }

  const adapter = await gpu.requestAdapter();
  if (!adapter) {
    throw new Error("WebGPU adapter not available");
  }

  devLog.log("[Offscreen] ✅ WebGPU available, using GPU acceleration");
}

/**
 * Send progress update to background (which relays to popup)
 */
function sendProgress(
  modelType: "asr" | "embedding",
  progress: number,
  status: string
): void {
  chrome.runtime
    .sendMessage({
      type: MESSAGE_TYPES.MODEL_PROGRESS,
      payload: {
        modelType,
        progress: Math.round(progress),
        status,
      },
    })
    .catch(() => {
      // Background might not be ready, ignore
    });
}

type ProgressInfo = {
  status: string;
  progress?: number;
  file?: string;
  loaded?: number;
  total?: number;
};

/**
 * Handle model loading request
 */
async function handleLoadModels(payload: {
  asrModel: string;
  embeddingModel: string;
}): Promise<MessageResponse> {
  const { asrModel, embeddingModel } = payload;
  const startTime = performance.now();
  devLog.log("[Offscreen] Loading models:", { asrModel, embeddingModel });

  try {
    // Verify WebGPU is available
    const gpuStart = performance.now();
    await verifyWebGPU();
    devLog.log(
      `[Offscreen] ⏱️  WebGPU verified in ${(performance.now() - gpuStart).toFixed(0)}ms`
    );

    // Load ASR model
    if (!asrPipeline || currentASRModel !== asrModel) {
      const asrStart = performance.now();
      devLog.log("[Offscreen] Loading ASR model:", asrModel);
      sendProgress("asr", 0, "Starting ASR model download...");

      // Moonshine requires separate dtypes for encoder and decoder models
      const pipelineOptions = {
        dtype: WEBGPU_DTYPE_CONFIG,
        device: "webgpu" as const,
        progress_callback: (progress: ProgressInfo) => {
          if (progress.status === "progress" && progress.progress) {
            const percent = progress.progress;
            devLog.log(`[Offscreen] ASR download progress: ${percent}%`);
            sendProgress("asr", percent, `Downloading ASR model: ${percent}%`);
          } else if (progress.status === "done") {
            devLog.log("[Offscreen] ASR model download complete");
            sendProgress("asr", 100, "ASR model loaded");
          }
        },
      };

      const loadedPipeline = await pipeline(
        "automatic-speech-recognition",
        asrModel,
        pipelineOptions
      );
      asrPipeline = loadedPipeline as AutomaticSpeechRecognitionPipelineType;

      currentASRModel = asrModel;
      const asrTime = (performance.now() - asrStart) / 1000;
      devLog.log(`[Offscreen] ✅ ASR pipeline ready in ${asrTime.toFixed(2)}s`);

      // Warmup: Run dummy inference to compile WebGPU shaders
      const warmupStart = performance.now();
      devLog.log("[Offscreen] Compiling WebGPU shaders...");
      await asrPipeline(new Float32Array(AUDIO.SAMPLE_RATE));
      const warmupTime = (performance.now() - warmupStart) / 1000;
      devLog.log(
        `[Offscreen] ✅ WebGPU shaders compiled in ${warmupTime.toFixed(2)}s`
      );

      sendProgress("asr", 100, "ASR model ready");
    } else {
      devLog.log("[Offscreen] ASR model already loaded");
      sendProgress("asr", 100, "ASR model already loaded");
    }

    // Load Embedding model
    if (!embeddingPipeline || currentEmbeddingModel !== embeddingModel) {
      const embeddingStart = performance.now();
      devLog.log("[Offscreen] Loading embedding model:", embeddingModel);
      sendProgress("embedding", 0, "Starting embedding model download...");

      // Embedding model uses FP32 for WebGPU
      const pipelineOptions = {
        dtype: "fp32" as const,
        device: "webgpu" as const,
        progress_callback: (progress: ProgressInfo) => {
          if (progress.status === "progress" && progress.progress) {
            const percent = progress.progress;
            devLog.log(`[Offscreen] Embedding download progress: ${percent}%`);
            sendProgress(
              "embedding",
              percent,
              `Downloading embedding model: ${percent}%`
            );
          } else if (progress.status === "done") {
            devLog.log("[Offscreen] Embedding model download complete");
            sendProgress("embedding", 100, "Embedding model loaded");
          }
        },
      };

      const loadedPipeline = await pipeline(
        "feature-extraction",
        embeddingModel,
        pipelineOptions
      );
      embeddingPipeline = loadedPipeline as FeatureExtractionPipelineType;

      currentEmbeddingModel = embeddingModel;
      const embeddingTime = (performance.now() - embeddingStart) / 1000;
      devLog.log(
        `[Offscreen] ✅ Embedding pipeline ready in ${embeddingTime.toFixed(2)}s`
      );

      // Pre-compute embeddings for matching
      const matchingStart = performance.now();
      await initializeMatching();
      const matchingTime = (performance.now() - matchingStart) / 1000;
      devLog.log(
        `[Offscreen] ⏱️  Matching initialized in ${matchingTime.toFixed(2)}s`
      );

      sendProgress("embedding", 100, "Embedding model ready");
    } else {
      devLog.log("[Offscreen] Embedding model already loaded");
      sendProgress("embedding", 100, "Embedding model already loaded");
    }

    const totalTime = (performance.now() - startTime) / 1000;
    devLog.log(
      `[Offscreen] ✅ All models loaded successfully in ${totalTime.toFixed(2)}s`
    );
    return { success: true };
  } catch (error) {
    devLog.error("[Offscreen] Model loading failed:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Failed to load models";

    // Send error progress
    sendProgress("asr", 0, `Error: ${errorMsg}`);
    sendProgress("embedding", 0, `Error: ${errorMsg}`);

    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Load pre-computed embeddings from bundled JSON
 */
function loadPrecomputedEmbeddings(): Map<
  string,
  { shortcutId: string; trigger: string; embedding: number[] }
> {
  const embeddings = new Map<
    string,
    { shortcutId: string; trigger: string; embedding: number[] }
  >();

  if (precomputedEmbeddings?.default?.embeddings) {
    for (const [key, value] of Object.entries(
      precomputedEmbeddings.default.embeddings
    )) {
      embeddings.set(key, value);
    }
    devLog.log(
      `[Offscreen] ✅ Loaded ${embeddings.size} pre-computed embeddings (model: ${precomputedEmbeddings.default.model})`
    );
  }

  return embeddings;
}

/**
 * Compute embeddings on-demand for all shortcuts
 */
async function computeEmbeddings(
  shortcuts: Shortcut[]
): Promise<
  Map<string, { shortcutId: string; trigger: string; embedding: number[] }>
> {
  const embeddings = new Map<
    string,
    { shortcutId: string; trigger: string; embedding: number[] }
  >();

  devLog.log(
    "[Offscreen] Computing embeddings on startup (consider running: bun run generate:embeddings)..."
  );

  for (const shortcut of shortcuts) {
    for (const trigger of shortcut.voiceTriggers) {
      const embedding = await getEmbedding(trigger);
      const key = `${shortcut.id}:${trigger}`;
      embeddings.set(key, {
        shortcutId: shortcut.id,
        trigger,
        embedding,
      });
    }
  }

  devLog.log(`[Offscreen] Computed ${embeddings.size} embeddings`);
  return embeddings;
}

/**
 * Initialize embedding-based matching
 */
async function initializeMatching(): Promise<void> {
  const startTime = performance.now();
  devLog.log("[Offscreen] Initializing embedding matching...");
  const shortcuts = getAllShortcuts();

  // Load embeddings (pre-computed or compute on-demand)
  if (embeddingPipeline) {
    const embeddingStart = performance.now();

    // Try loading pre-computed embeddings first
    if (precomputedEmbeddings?.default?.embeddings) {
      triggerEmbeddings = loadPrecomputedEmbeddings();
    } else {
      // Fallback: compute embeddings on startup (slower)
      triggerEmbeddings = await computeEmbeddings(shortcuts);
    }

    const embeddingTime = (performance.now() - embeddingStart).toFixed(0);
    devLog.log(`[Offscreen] ⏱️  Embeddings ready in ${embeddingTime}ms`);
  }

  const totalTime = (performance.now() - startTime).toFixed(0);
  devLog.log(`[Offscreen] ⏱️  Total matching setup: ${totalTime}ms`);
}

type EmbeddingResult = {
  data: Float32Array | number[];
};

/**
 * Get embedding for a text string
 */
async function getEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    throw new Error("Embedding pipeline not loaded");
  }

  const result = (await embeddingPipeline(text, {
    pooling: "mean",
    normalize: true,
  })) as EmbeddingResult;

  // Convert to regular array
  return Array.from(result.data);
}

/**
 * Calculate cosine similarity between two embeddings
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

type ASRResult = {
  text: string;
  chunks?: Array<{ text: string; timestamp: [number, number | null] }>;
};

type TranscriptionResult = {
  text: string;
  confidence: number;
  model: string;
};

/**
 * Handle transcription request
 */
async function handleTranscribe(payload: {
  audioData: string;
}): Promise<MessageResponse> {
  const { audioData } = payload;
  const startTime = performance.now();
  devLog.log("[Offscreen] Transcription request received");

  if (!asrPipeline) {
    devLog.error("[Offscreen] ASR model not loaded");
    return {
      success: false,
      error: "ASR model not loaded",
    };
  }

  // Get shortcuts directly from the shortcuts module
  const shortcuts = getAllShortcuts();

  try {
    // Convert base64 to blob
    const blobStart = performance.now();
    const audioBlob = base64ToBlob(audioData);
    devLog.log(
      `[Offscreen] ⏱️  Audio blob created (${audioBlob.size} bytes) in ${(performance.now() - blobStart).toFixed(0)}ms`
    );

    // Step 1: Transcribe audio to text
    const decodeStart = performance.now();
    const audioDataArray = await blobToAudio(audioBlob);
    devLog.log(
      `[Offscreen] ⏱️  Audio decoded (${audioDataArray.length} samples) in ${(performance.now() - decodeStart).toFixed(0)}ms`
    );

    const transcribeOptions = {
      return_timestamps: false,
    };

    const transcribeStart = performance.now();
    devLog.log("[Offscreen] Starting transcription...");
    const result = (await asrPipeline(audioDataArray, transcribeOptions)) as
      | string
      | ASRResult;

    const text = typeof result === "string" ? result : result.text || "";
    const confidence = calculateConfidence(text);
    const transcribeTime = (performance.now() - transcribeStart) / 1000;

    devLog.log(
      `[Offscreen] ⏱️  Transcription completed in ${transcribeTime.toFixed(2)}s: "${text}" (confidence: ${confidence.toFixed(2)})`
    );

    // Check if transcription is empty
    if (!text.trim()) {
      devLog.warn("[Offscreen] Empty transcription");
      return {
        success: false,
        error:
          "No speech detected. Please speak clearly into your microphone and hold the key longer.",
      };
    }

    const transcription: TranscriptionResult = {
      text: text.trim(),
      confidence,
      model: currentASRModel || "unknown",
    };

    // Step 2: Process intent to find matching shortcut
    const intentStart = performance.now();
    devLog.log("[Offscreen] Processing intent...");
    const intent = await processIntent(transcription.text, shortcuts);
    const intentTime = (performance.now() - intentStart).toFixed(0);
    devLog.log(`[Offscreen] ⏱️  Intent matched in ${intentTime}ms:`, intent);

    const totalTime = (performance.now() - startTime).toFixed(0);
    devLog.log(`[Offscreen] ✅ Total transcription pipeline: ${totalTime}ms`);

    return {
      success: true,
      data: {
        transcription,
        intent,
      },
    };
  } catch (error) {
    devLog.error("[Offscreen] Transcription failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transcription failed",
    };
  }
}

// ============================================================================
// AUDIO PROCESSING
// ============================================================================

/**
 * Convert audio blob to Float32Array for model input
 */
async function blobToAudio(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext({ sampleRate: AUDIO.SAMPLE_RATE });
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const audioData = audioBuffer.getChannelData(0);
  await audioContext.close();
  return audioData;
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  // Decode base64
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "audio/webm" });
}

/**
 * Calculate confidence score (simple heuristic)
 */
function calculateConfidence(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  // Base confidence
  let confidence = 0.8;

  // Penalize very short text
  if (text.length < 5) {
    confidence -= 0.2;
  }

  // Penalize lots of special characters (likely gibberish)
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialChars > text.length * 0.3) {
    confidence -= 0.3;
  }

  return Math.max(0, Math.min(1, confidence));
}

// ============================================================================
// INTENT PROCESSING
// ============================================================================

type Shortcut = {
  id: string;
  name: string;
  description: string;
  voiceTriggers: string[];
};

type IntentResult = {
  shortcutId: string | null;
  confidence: number;
  matchedTrigger?: string;
};

/**
 * Process intent and match to shortcut using Fuse.js and embeddings
 */
async function processIntent(
  text: string,
  _shortcuts: Shortcut[]
): Promise<IntentResult> {
  // Reject empty input
  const trimmed = text.trim();
  if (!trimmed) {
    return { shortcutId: null, confidence: 0 };
  }

  // Embedding matching (semantic similarity)
  if (embeddingPipeline && triggerEmbeddings) {
    try {
      const embeddingMatch = await findEmbeddingMatch(trimmed);
      if (embeddingMatch) {
        devLog.log("[Offscreen] Embedding match found:", embeddingMatch);
        return embeddingMatch;
      }
    } catch (error) {
      devLog.error("[Offscreen] Embedding matching failed:", error);
    }
  }

  devLog.log("[Offscreen] No match found for:", trimmed);
  return { shortcutId: null, confidence: 0 };
}

/**
 * Find match using embedding similarity
 */
async function findEmbeddingMatch(text: string): Promise<IntentResult | null> {
  if (!(embeddingPipeline && triggerEmbeddings)) {
    return null;
  }

  try {
    // Get embedding for user's speech
    const textEmbedding = await getEmbedding(text);

    // Find best matching trigger
    let bestMatch: {
      shortcutId: string;
      trigger: string;
      similarity: number;
    } | null = null;

    for (const entry of Array.from(triggerEmbeddings.entries())) {
      const [_key, { shortcutId, trigger, embedding }] = entry;
      const similarity = cosineSimilarity(textEmbedding, embedding);

      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { shortcutId, trigger, similarity };
      }
    }

    // Return match if above threshold
    if (
      bestMatch &&
      bestMatch.similarity >= THRESHOLDS.MIN_EMBEDDING_SIMILARITY
    ) {
      return {
        shortcutId: bestMatch.shortcutId,
        confidence: bestMatch.similarity,
        matchedTrigger: bestMatch.trigger,
      };
    }

    return null;
  } catch (error) {
    devLog.error("[Offscreen] Embedding match failed:", error);
    return null;
  }
}

devLog.log("[Offscreen] Ready to receive messages");
