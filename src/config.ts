/**
 * LinearVoice Configuration
 * Single source of truth for all extension configuration
 */

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Development mode flag
 * Enables verbose logging and debug features
 */
export const IS_DEV =
  import.meta.env.MODE === "development" || import.meta.env.DEV;

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

export const MODELS = {
  ASR: {
    MOONSHINE: {
      path: "onnx-community/moonshine-base-ONNX",
    },
  },
  EMBEDDING: {
    MINILM: {
      path: "Xenova/all-MiniLM-L6-v2",
    },
  },
} as const;

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

export const DEFAULTS = {
  // Voice activation
  activationKey: "r",

  // Models
  asrModel: MODELS.ASR.MOONSHINE.path,
  embeddingModel: MODELS.EMBEDDING.MINILM.path,

  // Processing
  confidenceThreshold: 0.7,
} as const;

// ============================================================================
// PROCESSING THRESHOLDS
// ============================================================================

export const THRESHOLDS = {
  // Embedding similarity threshold (0-1)
  MIN_EMBEDDING_SIMILARITY: 0.65,
} as const;

// ============================================================================
// AUDIO CONFIGURATION
// ============================================================================

export const AUDIO = {
  SAMPLE_RATE: 16_000,
  CONSTRAINTS: {
    audio: {
      channelCount: 1,
      sampleRate: 16_000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  },
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI = {
  TOAST_DURATION: 2000,

  STATES: {
    RECORDING: "recording",
    TRANSCRIBING: "transcribing",
    PROCESSING: "processing",
    COMPLETE: "complete",
    ERROR: "error",
  } as const,
} as const;

// ============================================================================
// MESSAGE TYPES (for chrome.runtime messaging)
// ============================================================================

export const MESSAGE_TYPES = {
  // Content -> Background
  TRANSCRIBE: "TRANSCRIBE",
  LOAD_MODELS: "LOAD_MODELS",
  GET_SETTINGS: "GET_SETTINGS",

  // Background -> Popup (for progress updates)
  MODEL_PROGRESS: "MODEL_PROGRESS",
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type UIState = (typeof UI.STATES)[keyof typeof UI.STATES];

export type Settings = {
  activationKey: string;
  asrModel: string;
  embeddingModel: string;
  confidenceThreshold: number;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get default settings
 */
export function getDefaultSettings(): Settings {
  return {
    activationKey: DEFAULTS.activationKey,
    asrModel: DEFAULTS.asrModel,
    embeddingModel: DEFAULTS.embeddingModel,
    confidenceThreshold: DEFAULTS.confidenceThreshold,
  };
}

/**
 * Check if WebGPU is supported
 */
export async function isWebGPUSupported(): Promise<boolean> {
  if (!("gpu" in navigator)) {
    return false;
  }
  try {
    const gpu = (
      navigator as Navigator & {
        gpu?: { requestAdapter: () => Promise<unknown> };
      }
    ).gpu;
    if (!gpu) {
      return false;
    }
    const adapter = await gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

/**
 * Conditional logging utilities
 * Only logs in development mode
 */
export const devLog = {
  log: (...args: unknown[]) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (IS_DEV) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (IS_DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (IS_DEV) {
      console.debug(...args);
    }
  },
};
