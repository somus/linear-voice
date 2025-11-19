type ActivationKeyInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ActivationKeyInput({
  value,
  onChange,
}: ActivationKeyInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="block font-semibold text-accent text-sm"
        htmlFor="activation-key-input"
      >
        Activation Key
      </label>
      <input
        className="text w-full rounded-md border border-border bg-surface px-3 py-2.5 text-text-primary transition-all duration-150 placeholder:text-text-quaternary hover:border-border-hover hover:bg-surface-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-muted"
        id="activation-key-input"
        maxLength={1}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
        placeholder="r"
        type="text"
        value={value}
      />
      <p className="text-text-tertiary text-xs">
        Hold this key to record voice commands
      </p>
    </div>
  );
}
