import { Spinner } from "@/components/spinner";

export function LoadingScreen() {
  return (
    <div className="flex min-h-[300px] min-w-[380px] items-center justify-center bg-background p-5">
      <div className="text-center">
        <Spinner className="mx-auto mb-3 text-text-tertiary" size="md" />
        <p className="text-sm text-text-secondary">
          Checking system compatibility...
        </p>
      </div>
    </div>
  );
}
