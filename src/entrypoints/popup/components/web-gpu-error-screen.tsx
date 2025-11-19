import { useWebGPU } from "@/hooks/use-web-gpu";

export function WebGPUErrorScreen() {
  const { recheckWebGPU } = useWebGPU();
  return (
    <div className="min-w-[400px] max-w-[450px] bg-background p-6">
      <div className="space-y-4">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-error-border bg-error-muted">
            <svg
              aria-label="Error Icon"
              className="h-8 w-8 text-error"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="mb-2 font-semibold text-text-primary text-xl">
            WebGPU Not Supported
          </h1>
          <p className="text text-text-secondary">
            LinearVoice requires WebGPU for hardware-accelerated AI inference
          </p>
        </div>

        {/* Requirements */}
        <div className="rounded-md border border-border bg-[--color-surface] p-4">
          <h2 className="mb-3 font-semibold text-sm text-text-primary">
            System Requirements
          </h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <svg
                aria-label="Chrome 124+ or Edge 124+"
                className="mt-0.5 h-5 w-5 shrink-0 text-text-tertiary"
                fill="currentColor"
                role="img"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  fillRule="evenodd"
                />
              </svg>
              <span>
                <strong>Chrome 124+</strong> or <strong>Edge 124+</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                aria-label="Updated GPU drivers"
                className="mt-0.5 h-5 w-5 shrink-0 text-text-tertiary"
                fill="currentColor"
                role="img"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  fillRule="evenodd"
                />
              </svg>
              <span>Updated GPU drivers</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                aria-label="Hardware-accelerated graphics enabled"
                className="mt-0.5 h-5 w-5 shrink-0 text-text-tertiary"
                fill="currentColor"
                role="img"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  fillRule="evenodd"
                />
              </svg>
              <span>Hardware-accelerated graphics enabled</span>
            </li>
          </ul>
        </div>

        {/* Instructions */}
        <div className="rounded-md border border-accent-muted bg-surface-elevated p-4">
          <h3 className="mb-2 font-semibold text-sm text-text-primary">
            How to fix this:
          </h3>
          <ol className="ml-4 list-decimal space-y-2 text-sm text-text-secondary">
            <li>Update your browser to the latest version</li>
            <li>
              Visit{" "}
              <a
                className="font-mono text-accent underline hover:no-underline"
                href="chrome://gpu"
                rel="noopener noreferrer"
                target="_blank"
              >
                chrome://gpu
              </a>
            </li>
            <li>Check if "WebGPU" shows as "Hardware accelerated"</li>
            <li>If not, update your GPU drivers and restart your browser</li>
          </ol>
        </div>

        {/* Retry button */}
        <button
          className="w-full rounded-md bg-accent px-4 py-2.5 font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.98]"
          onClick={recheckWebGPU}
          type="button"
        >
          Retry Detection
        </button>

        {/* Footer */}
        <p className="text-center text-text-tertiary">
          Released April 2024 • Required for on-device AI
        </p>
      </div>
    </div>
  );
}
