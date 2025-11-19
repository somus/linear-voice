/**
 * Background Service Worker
 * Coordinates between popup/content scripts and offscreen document
 * Offscreen document handles AI models (supports dynamic imports & WebGPU)
 */

import {
  devLog,
  getDefaultSettings,
  MESSAGE_TYPES,
  type Settings,
} from "@/config";
import { handleOffscreenLog } from "@/utils/offscreen-logger";

export default defineBackground(() => {
  // ============================================================================
  // STATE
  // ============================================================================

  let currentSettings: Settings = getDefaultSettings();
  let offscreenReady = false;

  // ============================================================================
  // OFFSCREEN DOCUMENT MANAGEMENT
  // ============================================================================

  /**
   * Create offscreen document if it doesn't exist
   */
  async function setupOffscreenDocument() {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
    });

    if (existingContexts.length > 0) {
      devLog.log("[Background] Offscreen document already exists");
      offscreenReady = true;
      return;
    }

    devLog.log("[Background] Creating offscreen document...");

    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["DOM_SCRAPING"], // Closest reason for AI processing
      justification:
        "Load AI models using transformers.js (requires dynamic imports and WebGPU)",
    });

    offscreenReady = true;
    devLog.log("[Background] Offscreen document created");
  }

  /**
   * Ensure offscreen document is ready before sending messages
   */
  async function ensureOffscreenReady(): Promise<void> {
    if (!offscreenReady) {
      await setupOffscreenDocument();
      // Give it a moment to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize on extension install/update
   */
  chrome.runtime.onInstalled.addListener(async () => {
    devLog.log("[Background] Extension installed/updated");

    // Load settings
    try {
      const stored = await chrome.storage.local.get("settings");
      if (stored.settings) {
        currentSettings = { ...getDefaultSettings(), ...stored.settings };
      } else {
        // Save defaults
        await chrome.storage.local.set({ settings: currentSettings });
      }

      // Setup offscreen document
      await setupOffscreenDocument();

      // Auto-load models in offscreen
      devLog.log("[Background] Auto-loading models in offscreen...");
      chrome.runtime
        .sendMessage({
          type: MESSAGE_TYPES.LOAD_MODELS,
          payload: {
            asrModel: currentSettings.asrModel,
            embeddingModel: currentSettings.embeddingModel,
          },
        })
        .then(() => {
          devLog.log("[Background] Model loading initiated");
          // Show notification
          chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icon/128.png"),
            title: "LinearVoice Ready",
            message:
              "Voice commands are ready to use! Press R on Linear.app to speak.",
            priority: 1,
          });
        })
        .catch((error) => {
          devLog.error("[Background] Auto-load failed:", error);
          chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icon/128.png"),
            title: "LinearVoice Error",
            message: "Failed to load models. Please check your connection.",
            priority: 2,
          });
        });
    } catch (error) {
      devLog.error("[Background] Failed to load settings:", error);
    }
  });

  /**
   * Initialize on extension startup (browser launch)
   */
  chrome.runtime.onStartup.addListener(async () => {
    devLog.log("[Background] Extension startup");

    try {
      const stored = await chrome.storage.local.get("settings");
      if (stored.settings) {
        currentSettings = { ...getDefaultSettings(), ...stored.settings };
      }

      await setupOffscreenDocument();

      // Load models in offscreen
      await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.LOAD_MODELS,
        payload: {
          asrModel: currentSettings.asrModel,
          embeddingModel: currentSettings.embeddingModel,
        },
      });

      devLog.log("[Background] Models loaded on startup");
    } catch (error) {
      devLog.error("[Background] Startup model load failed:", error);
    }
  });

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  /**
   * Handle messages from content script, popup, and offscreen document
   */
  chrome.runtime.onMessage.addListener(
    (message: { type: string; payload?: unknown }, _sender, sendResponse) => {
      // Check if this is a log message from offscreen
      // Type assertion is safe because handleOffscreenLog checks message.type
      if (
        handleOffscreenLog(message as Parameters<typeof handleOffscreenLog>[0])
      ) {
        // Log message handled, don't send response
        return false;
      }

      // Handle other messages async
      handleMessage(message)
        .then((response) => sendResponse(response))
        .catch((error) => {
          devLog.error("[Background] Message handler error:", error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        });

      // Return true to indicate async response
      return true;
    }
  );

  /**
   * Handle message based on type
   */
  function handleMessage(message: {
    type: string;
    payload?: unknown;
  }): Promise<unknown> {
    switch (message.type) {
      case MESSAGE_TYPES.TRANSCRIBE:
        return handleTranscribe(message.payload);

      case MESSAGE_TYPES.LOAD_MODELS:
        return handleLoadModels(message.payload);

      case MESSAGE_TYPES.GET_SETTINGS:
        return handleGetSettings();

      case MESSAGE_TYPES.MODEL_PROGRESS:
        // Relay progress from offscreen to popup
        return Promise.resolve({ success: true });

      default:
        devLog.warn("[Background] Unknown message type:", message.type);
        throw new Error(`Unknown message type: ${message.type}`);
    }
  }

  // ============================================================================
  // MESSAGE HANDLERS
  // ============================================================================

  /**
   * Handle transcription request - forward to offscreen
   */
  async function handleTranscribe(payload: unknown): Promise<unknown> {
    devLog.log(
      "[Background] Transcription request, forwarding to offscreen..."
    );

    await ensureOffscreenReady();

    // Forward to offscreen document
    return chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.TRANSCRIBE,
      payload,
    });
  }

  /**
   * Handle model loading request - forward to offscreen
   */
  async function handleLoadModels(payload: unknown): Promise<unknown> {
    devLog.log(
      "[Background] Model loading request, forwarding to offscreen..."
    );

    // Type guard for settings payload
    if (payload && typeof payload === "object" && "settings" in payload) {
      // Update internal state only - popup handles saving to storage
      currentSettings = {
        ...currentSettings,
        ...(payload.settings as Partial<Settings>),
      };
    }

    await ensureOffscreenReady();

    // Forward to offscreen document with model paths
    return chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOAD_MODELS,
      payload: {
        asrModel: currentSettings.asrModel,
        embeddingModel: currentSettings.embeddingModel,
      },
    });
  }

  /**
   * Handle get settings request
   */
  async function handleGetSettings(): Promise<unknown> {
    try {
      const stored = await chrome.storage.local.get("settings");
      const settings = stored.settings || getDefaultSettings();
      return { success: true, data: settings };
    } catch (error) {
      devLog.error("[Background] Failed to get settings:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get settings",
      };
    }
  }

  devLog.log("[Background] Service worker ready");
});
