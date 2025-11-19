import { useEffect, useState } from "react";
import { devLog, MESSAGE_TYPES, type Settings } from "@/config";

export type ModelProgress = {
  modelType: "asr" | "embedding";
  progress: number;
  status: string;
};

export function useModelProgress() {
  const [asrProgress, setAsrProgress] = useState<ModelProgress>({
    modelType: "asr",
    progress: 0,
    status: "Checking...",
  });

  const [embeddingProgress, setEmbeddingProgress] = useState<ModelProgress>({
    modelType: "embedding",
    progress: 0,
    status: "Checking...",
  });

  // Listen for model progress updates
  useEffect(() => {
    const messageListener = (message: {
      type: string;
      payload?: { modelType: string; progress: number; status: string };
    }) => {
      if (message.type === MESSAGE_TYPES.MODEL_PROGRESS) {
        const { modelType, progress, status } = message.payload || {};

        if (modelType === "asr" && typeof progress === "number" && status) {
          setAsrProgress({ modelType, progress, status });
        } else if (
          modelType === "embedding" &&
          typeof progress === "number" &&
          status
        ) {
          setEmbeddingProgress({ modelType, progress, status });
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  async function checkModelStatus(settings: Settings) {
    try {
      // Trigger model loading check - this will send progress updates
      // If models are already loaded, we'll get 100% progress immediately
      await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.LOAD_MODELS,
        payload: { settings },
      });
    } catch (err) {
      devLog.error("Failed to check model status:", err);
      // Set error state
      setAsrProgress({
        modelType: "asr",
        progress: 0,
        status: "Error checking status",
      });
      setEmbeddingProgress({
        modelType: "embedding",
        progress: 0,
        status: "Error checking status",
      });
    }
  }

  const isLoading =
    asrProgress.progress < 100 || embeddingProgress.progress < 100;
  const modelsReady =
    asrProgress.progress === 100 && embeddingProgress.progress === 100;

  return {
    asrProgress,
    embeddingProgress,
    isLoading,
    modelsReady,
    checkModelStatus,
  };
}
