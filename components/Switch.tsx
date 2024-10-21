import { useState } from "react";
import { summarizationEnabled } from "@/utils/storage";

export default function Switch() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    summarizationEnabled.getValue().then((result) => {
      setIsOn(result || false);
    });
  }, []);

  const toggleSwitch = () => {
    setIsOn((prevState) => {
      const newState = !prevState;
      summarizationEnabled.setValue(newState);
      return newState;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <label
        className={`relative inline-flex items-center cursor-pointer w-40 h-20 rounded-full p-2 transition-colors duration-300 ease-in-out ${
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
          className={`absolute left-2 w-16 h-16 rounded-full transition-transform duration-300 ease-in-out transform ${
            isOn ? "translate-x-20 bg-white" : "translate-x-0 bg-gray-100"
          }`}
        ></span>
        <span className="sr-only">{isOn ? "On" : "Off"}</span>
      </label>
      <div className="mt-4 text-3xl font-bold relative">
        <span
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isOn ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          OFF
        </span>
        <span
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isOn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          ON
        </span>
      </div>
    </div>
  );
}
