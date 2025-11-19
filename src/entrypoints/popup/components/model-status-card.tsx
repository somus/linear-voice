import { StatusBadge } from "@/components/status-badge";
import type { ModelProgress } from "@/hooks/use-model-progress";
import { ProgressIndicator } from "./progress-indicator";

type ModelStatusCardProps = {
  asrProgress: ModelProgress;
  embeddingProgress: ModelProgress;
  isLoading: boolean;
  modelsReady: boolean;
};

export function ModelStatusCard({
  asrProgress,
  embeddingProgress,
  isLoading,
  modelsReady,
}: ModelStatusCardProps) {
  return (
    <div className="mb-6 rounded-md border-2 border-accent bg-surface p-4 shadow-[0_0_20px_rgba(116,98,255,0.15)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-accent text-sm">Model Status</h2>
        <div className="flex items-center gap-2">
          {modelsReady && <StatusBadge status="ready" />}
          {isLoading && <StatusBadge status="loading" />}
        </div>
      </div>

      <div className="space-y-3">
        <ProgressIndicator
          label="Speech Recognition"
          progress={asrProgress.progress}
          status={asrProgress.status}
        />
        <ProgressIndicator
          label="Intent Matching"
          progress={embeddingProgress.progress}
          status={embeddingProgress.status}
        />
      </div>

      {modelsReady && (
        <div className="mt-3 border-border border-t pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Inference Backend:</span>
            <span className="font-medium text-green-400">
              ✓ WebGPU (Hardware Accelerated)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
