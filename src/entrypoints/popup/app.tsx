import { useEffect } from "react";
import { useModelProgress } from "@/hooks/use-model-progress";
import { useSettings } from "@/hooks/use-settings";
import { useWebGPU } from "@/hooks/use-web-gpu";
import { ActivationKeyInput } from "./components/activation-key-input";
import { ConfidenceSlider } from "./components/confidence-slider";
import { LoadingScreen } from "./components/loading-screen";
import { ModelStatusCard } from "./components/model-status-card";
import { SaveButton } from "./components/save-button";
import { UsageInstructions } from "./components/usage-instructions";
import { WebGPUErrorScreen } from "./components/web-gpu-error-screen";

export default function App() {
  const { supported: webGPUSupported } = useWebGPU();
  const { settings, setSettings, saveSettings, isSaving } = useSettings();
  const {
    asrProgress,
    embeddingProgress,
    isLoading,
    modelsReady,
    checkModelStatus,
  } = useModelProgress();

  // Check model status after settings are loaded
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    // Only check model status if WebGPU is supported
    if (webGPUSupported) {
      checkModelStatus(settings);
    }
  }, [webGPUSupported]);

  // Show loading state while checking WebGPU support
  if (webGPUSupported === null) {
    return <LoadingScreen />;
  }

  // Show error screen if WebGPU is not supported
  if (webGPUSupported === false) {
    return <WebGPUErrorScreen />;
  }

  // Normal UI - WebGPU available
  return (
    <div className="min-w-[380px] bg-background p-5">
      <h1 className="mb-1 font-bold text-accent text-xl">LinearVoice</h1>
      <p className="mb-6 text-sm text-text-tertiary">
        Control Linear with your voice
      </p>

      <ModelStatusCard
        asrProgress={asrProgress}
        embeddingProgress={embeddingProgress}
        isLoading={isLoading}
        modelsReady={modelsReady}
      />

      <div className="space-y-5">
        <ActivationKeyInput
          onChange={(value) =>
            setSettings({ ...settings, activationKey: value })
          }
          value={settings.activationKey}
        />

        <ConfidenceSlider
          onChange={(value) =>
            setSettings({ ...settings, confidenceThreshold: value })
          }
          value={settings.confidenceThreshold}
        />

        <SaveButton isSaving={isSaving} onSave={saveSettings} />

        <UsageInstructions activationKey={settings.activationKey} />
      </div>
    </div>
  );
}
