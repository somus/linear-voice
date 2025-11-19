type ConfidenceSliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function ConfidenceSlider({
  value,
  onChange,
  min = 0.5,
  max = 1,
  step = 0.05,
}: ConfidenceSliderProps) {
  return (
    <div className="space-y-2">
      <label
        className="block font-semibold text-accent text-sm"
        htmlFor="confidenceThreshold"
      >
        Confidence Threshold
      </label>
      <input
        className="h-1.5 w-full cursor-pointer appearance-none rounded-[--radius-full] bg-surface [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-accent-hover"
        id="confidenceThreshold"
        max={max}
        min={min}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div className="flex items-center justify-between">
        <p className="text-text-tertiary text-xs">
          Matching accuracy threshold
        </p>
        <p className="font-bold text-accent text-sm">{value.toFixed(2)}</p>
      </div>
    </div>
  );
}
