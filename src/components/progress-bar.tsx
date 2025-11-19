type ProgressBarProps = {
  progress: number;
  color?: string;
  height?: "sm" | "md";
};

const heightClasses = {
  sm: "h-1",
  md: "h-1.5",
};

export function ProgressBar({
  progress,
  color = "bg-accent",
  height = "md",
}: ProgressBarProps) {
  return (
    <div
      className={`${heightClasses[height]} overflow-hidden rounded-full bg-surface-elevated`}
    >
      <div
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
