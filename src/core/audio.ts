/**
 * Audio Recording - Simplified
 * Simple microphone recording using MediaRecorder API
 */

import { AUDIO, devLog } from "@/config";

// ============================================================================
// STATE
// ============================================================================

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let stream: MediaStream | null = null;
let recordingStartTime = 0;

// ============================================================================
// RECORDING
// ============================================================================

/**
 * Start recording from microphone
 */
export async function startRecording(): Promise<void> {
  if (mediaRecorder?.state === "recording") {
    return;
  }

  try {
    // Get microphone access
    stream = await navigator.mediaDevices.getUserMedia(AUDIO.CONSTRAINTS);

    // Create recorder
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    // Reset chunks
    audioChunks = [];

    // Collect audio data
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // Start recording
    mediaRecorder.start();
    recordingStartTime = Date.now();
  } catch (error) {
    devLog.error("[Audio] Failed to start recording:", error);
    throw new Error(
      error instanceof Error && error.name === "NotAllowedError"
        ? "Microphone permission denied"
        : "Failed to start recording"
    );
  }
}

/**
 * Stop recording and return audio blob
 */
export function stopRecording(): Promise<Blob> {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    throw new Error("Not recording");
  }

  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      reject(new Error("MediaRecorder is null"));
      return;
    }

    mediaRecorder.onstop = () => {
      // Create audio blob
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const duration = Date.now() - recordingStartTime;

      // Cleanup
      cleanup();

      // Check if recording is too short
      if (duration < 300) {
        reject(
          new Error(
            "Recording too short. Please hold the key for at least 0.5 seconds."
          )
        );
        return;
      }

      // Check if blob has data
      if (audioBlob.size < 100) {
        reject(
          new Error(
            "No audio captured. Please check your microphone and speak clearly."
          )
        );
        return;
      }

      resolve(audioBlob);
    };

    mediaRecorder.onerror = (_event) => {
      cleanup();
      reject(new Error("Recording error"));
    };

    mediaRecorder.stop();
  });
}

/**
 * Cleanup resources
 */
function cleanup(): void {
  // Stop all tracks
  if (stream) {
    for (const track of stream.getTracks()) {
      track.stop();
    }
    stream = null;
  }

  // Clear recorder
  mediaRecorder = null;
  audioChunks = [];
}
