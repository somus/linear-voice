type UsageInstructionsProps = {
  activationKey: string;
};

export function UsageInstructions({ activationKey }: UsageInstructionsProps) {
  return (
    <div className="border-border border-t pt-4">
      <div className="rounded-md border border-border-subtle bg-surface p-3 text-sm text-text-secondary">
        <p className="mb-2 font-semibold text-accent">How to use:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Hold{" "}
            <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs">
              {activationKey.toUpperCase()}
            </code>{" "}
            key to record
          </li>
          <li>Release to process command</li>
          <li>Works only on linear.app</li>
        </ul>
      </div>
    </div>
  );
}
