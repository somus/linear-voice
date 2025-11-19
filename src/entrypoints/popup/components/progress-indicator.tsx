import { ProgressBar } from "@/components/progress-bar";

type ProgressIndicatorProps = {
  label: string;
  progress: number;
  status: string;
};

export function ProgressIndicator({
  label,
  progress,
  status,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-text-secondary">{label}</span>
        <span className="font-semibold text-accent">{progress}%</span>
      </div>
      <ProgressBar progress={progress} />
      <p className="text-text-tertiary text-xs">{status}</p>
    </div>
  );
}
