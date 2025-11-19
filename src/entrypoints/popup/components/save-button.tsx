type SaveButtonProps = {
  isSaving: boolean;
  onSave: () => void;
};

export function SaveButton({ isSaving, onSave }: SaveButtonProps) {
  return (
    <button
      className="text w-full rounded-md bg-accent px-4 py-2.5 font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isSaving}
      onClick={onSave}
      type="button"
    >
      {isSaving ? "Saved" : "Save Settings"}
    </button>
  );
}
