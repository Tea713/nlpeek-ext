import "./App.css";
import Switch from "@/components/Switch";
import { useState } from "react";
import { summarizationEnabled } from "@/utils/storage";

function App() {
  const [isSummarizationOn, setIsSummarizationOn] = useState(false);

  useEffect(() => {
    summarizationEnabled.getValue().then((result) => {
      setIsSummarizationOn(result || false);
    });
  }, []);

  const toggleSummarization = () => {
    setIsSummarizationOn((prevState) => {
      const newState = !prevState;
      summarizationEnabled.setValue(newState);
      return newState;
    });
  };

  return (
    <div className="w-[320px] h-[380px] flex flex-col justify-center bg-slate-950">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">NLPeek</h1>
      </header>
      <main className="flex-grow px-4 py-2">
        <div className="flex justify-between items-center border-2 border-gray-500 rounded-md p-2">
          <div className="relative overflow-hidden">
            <span className="text-sm font-normal">Link summarization is </span>
            <span
              className={`text-sm font-normal inline-block transition-all duration-300 ease-in-out ${
                isSummarizationOn
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform -translate-y-full absolute"
              }`}
            >
              ON
            </span>
            <span
              className={`text-sm font-normal inline-block transition-all duration-300 ease-in-out ${
                !isSummarizationOn
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-full absolute"
              }`}
            >
              OFF
            </span>
          </div>
          <Switch isOn={isSummarizationOn} toggleSwitch={toggleSummarization} />
        </div>
      </main>
      <footer className="bg-slate-800 w-full p-4">
        <div>aboutaboutaboutsettingsettingsetting</div>
      </footer>
    </div>
  );
}

export default App;
