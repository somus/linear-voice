/**
 * Content Script - Simplified
 * Handles voice command activation and execution in Linear.app
 */

import React from "react";
import ReactDOM from "react-dom/client";
import type { ToastHandle } from "@/components/toast";
import {
  devLog,
  getDefaultSettings,
  MESSAGE_TYPES,
  type Settings,
} from "@/config";
import { startRecording, stopRecording } from "@/core/audio";
import { executeShortcut, findShortcutById } from "@/core/shortcuts";
import App from "./app";

export default defineContentScript({
  matches: ["*://*.linear.app/*"],

  main(_ctx) {
    // Create toast ref
    const toastRef = React.createRef<ToastHandle>();

    // Create container for React app
    const container = document.createElement("div");
    container.id = "linearvoice-root";
    document.body.appendChild(container);

    // Mount React app
    const root = ReactDOM.createRoot(container);
    root.render(<App ref={toastRef} />);

    // ============================================================================
    // STATE
    // ============================================================================

    let settings: Settings = getDefaultSettings();
    let isRecording = false;
    let isProcessing = false;
    let abortController: AbortController | null = null;

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    /**
     * Initialize content script
     */
    async function init(): Promise<void> {
      // Load settings
      await loadSettings();

      // Setup keyboard listener
      setupKeyboardListener();

      // Listen for settings changes
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.settings) {
          const newSettings = changes.settings.newValue as Settings;
          if (newSettings) {
            const oldActivationKey = settings.activationKey;
            settings = newSettings;

            // If activation key changed, recreate keyboard listeners
            if (oldActivationKey !== newSettings.activationKey) {
              devLog.log(
                "[Content] Activation key changed from",
                oldActivationKey,
                "to",
                newSettings.activationKey
              );
              setupKeyboardListener();
            }
          }
        }
      });
    }

    /**
     * Load settings directly from storage
     */
    async function loadSettings(): Promise<void> {
      try {
        const result = await chrome.storage.local.get("settings");
        if (result.settings) {
          settings = { ...getDefaultSettings(), ...result.settings };
        } else {
          settings = getDefaultSettings();
        }
      } catch (error) {
        devLog.error("[Content] Failed to load settings:", error);
        settings = getDefaultSettings();
      }
    }

    // ============================================================================
    // KEYBOARD HANDLING
    // ============================================================================

    /**
     * Setup keyboard listener for activation key
     */
    function setupKeyboardListener(): void {
      // Abort previous listeners if they exist
      if (abortController) {
        devLog.log("[Content] Removing old keyboard listeners");
        abortController.abort();
      }

      // Create new abort controller for these listeners
      abortController = new AbortController();
      const signal = abortController.signal;

      const activationKey = settings.activationKey.toLowerCase();
      devLog.log(
        "[Content] Setting up keyboard listener for key:",
        activationKey
      );

      // Keydown handler
      const keydownHandler = async (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === activationKey) {
          const target = event.target as HTMLElement;
          if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
          ) {
            return;
          }

          if (isRecording || isProcessing) {
            return;
          }

          event.preventDefault();
          devLog.log("[Content] Activation key pressed:", activationKey);
          await startVoiceCommand();
        }
      };

      // Keyup handler
      const keyupHandler = async (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === activationKey && isRecording) {
          event.preventDefault();
          devLog.log("[Content] Activation key released:", activationKey);
          await stopVoiceCommand();
        }
      };

      // Add new listeners with abort signal
      document.addEventListener("keydown", keydownHandler, { signal });
      document.addEventListener("keyup", keyupHandler, { signal });
    }

    // ============================================================================
    // VOICE COMMAND FLOW
    // ============================================================================

    /**
     * Start voice command (key press)
     */
    async function startVoiceCommand(): Promise<void> {
      try {
        isRecording = true;

        // Show recording UI
        toastRef?.current?.show("Release key to process", "recording");

        // Start audio recording
        await startRecording();
      } catch (error) {
        devLog.error("[Content] Failed to start recording:", error);
        isRecording = false;
        toastRef?.current?.show(
          "Failed to start recording. Check microphone permissions.",
          "error"
        );
      }
    }

    /**
     * Stop voice command (key release)
     */
    async function stopVoiceCommand(): Promise<void> {
      try {
        isRecording = false;
        isProcessing = true;

        // Stop recording and get audio
        const audioBlob = await stopRecording();

        // Convert to base64
        const base64Audio = await blobToBase64(audioBlob);

        // Show transcribing state
        toastRef?.current?.show("Converting speech to text...", "transcribing");

        // Send to background for processing
        const response = await chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.TRANSCRIBE,
          payload: { audioData: base64Audio },
        });

        if (!response.success) {
          throw new Error(response.error || "Transcription failed");
        }

        const { transcription, intent } = response.data;

        // Show processing state
        toastRef?.current?.show(transcription.text, "processing");

        // Execute if shortcut found
        if (intent.shortcutId) {
          const shortcut = findShortcutById(intent.shortcutId);
          if (shortcut) {
            await executeShortcut(shortcut);
            toastRef?.current?.show(`Executed: ${shortcut.name}`, "complete");
          } else {
            toastRef?.current?.show(
              `Shortcut not found: ${intent.shortcutId}`,
              "error"
            );
          }
        } else {
          toastRef?.current?.show(
            `No matching command found for "${transcription.text}"`,
            "error"
          );
        }
      } catch (error) {
        devLog.error("[Content] Voice command failed:", error);
        toastRef?.current?.show(
          error instanceof Error ? error.message : "Command failed",
          "error"
        );
      } finally {
        isProcessing = false;
      }
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Convert blob to base64
     */
    function blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // ============================================================================
    // START
    // ============================================================================

    // Initialize when content script loads
    init().catch((error) => {
      devLog.error("[Content] Initialization failed:", error);
    });
  },
});
