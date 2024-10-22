interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (target: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange }) => {
  return (
    <div className="relative pt-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">{min}ms</span>
        <span className="text-xs text-gray-400">{max}ms</span>
      </div>
    </div>
  );
};

export default Slider;
