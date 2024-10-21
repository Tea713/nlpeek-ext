interface SwitchProps {
  isOn: boolean;
  toggleSwitch: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, toggleSwitch }) => {
  return (
    <div className="flex flex-col items-center">
      <label
        className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
          isOn ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isOn}
          onChange={toggleSwitch}
        />
        <span
          className={`absolute left-1 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${
            isOn ? "translate-x-6 bg-white" : "translate-x-0 bg-white"
          }`}
        ></span>
        <span className="sr-only">{isOn ? "On" : "Off"}</span>
      </label>
    </div>
  );
};

export default Switch;
