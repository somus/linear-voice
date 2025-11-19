import { Spinner } from "./spinner";

type StatusBadgeProps = {
  status: "ready" | "loading";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-success-border bg-success-muted px-2 py-1 font-medium text-success text-xs">
        <svg
          aria-label="Ready"
          className="h-3 w-3"
          fill="currentColor"
          role="img"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            fillRule="evenodd"
          />
        </svg>
        Ready
      </span>
    );
  }

  return (
    <span className="items-centers inline-flex gap-1.5 rounded border border-accent-muted bg-surface-elevated px-2 py-1 font-medium text-accent text-xs">
      <Spinner size="sm" />
      Loading...
    </span>
  );
}
