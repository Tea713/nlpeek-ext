import "./App.css";
import Switch from "@/components/Switch";
import Button from "@/components/Button";
import Slider from "@/components/Slider";
import { useState } from "react";
import {
  summarizationEnabled,
  currentHoverInDelay,
  currentHoverOutDelay,
  currentSummaryLength,
} from "@/utils/storage";

function App() {
  const [isSummarizationOn, setIsSummarizationOn] = useState(false);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [hoverInDelay, setHoverInDelay] = useState(500);
  const [hoverOutDelay, setHoverOutDelay] = useState(300);

  useEffect(() => {
    summarizationEnabled.getValue().then((result) => {
      setIsSummarizationOn(result);
    });
    currentSummaryLength.getValue().then((result) => {
      setSummaryLength(result);
    });
    currentHoverInDelay.getValue().then((result) => {
      setHoverInDelay(result);
    });
    currentHoverOutDelay.getValue().then((result) => {
      setHoverOutDelay(result);
    });
  }, []);

  const toggleSummarization = () => {
    setIsSummarizationOn((prevState) => {
      const newState = !prevState;
      summarizationEnabled.setValue(newState);
      return newState;
    });
  };

  const changeSummaryLength = (newLength: string) => {
    setSummaryLength(newLength);
    currentSummaryLength.setValue(newLength);
  };

  const changeHoverInDelay = (newHoverInDelay: number) => {
    setHoverInDelay(newHoverInDelay);
    currentHoverInDelay.setValue(newHoverInDelay);
  };

  const changeHoverOutDelay = (newHoverOutDelay: number) => {
    setHoverOutDelay(newHoverOutDelay);
    currentHoverOutDelay.setValue(newHoverOutDelay);
  };

  return (
    <div className="w-[320px] flex flex-col justify-center bg-slate-950">
      <header className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-xl font-bold">NLPeek</h1>
      </header>
      <main className="flex-grow">
        <div className="flex justify-between items-center m-4 bg-slate-800 rounded-md px-2 py-4">
          <div className="relative overflow-hidden">
            <span className="text-sm font-medium">Link summarization is </span>
            <span
              className={`text-sm font-medium inline-block transition-all duration-300 ease-in-out ${
                isSummarizationOn
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform -translate-y-full absolute"
              }`}
            >
              ON
            </span>
            <span
              className={`text-sm font-medium inline-block transition-all duration-300 ease-in-out ${
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
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Summary Length</div>
            <div className="flex space-x-2">
              <Button
                active={summaryLength === "short"}
                onClick={() => changeSummaryLength("short")}
              >
                Short
              </Button>
              <Button
                active={summaryLength === "medium"}
                onClick={() => changeSummaryLength("medium")}
              >
                Medium
              </Button>
              <Button
                active={summaryLength === "long"}
                onClick={() => changeSummaryLength("long")}
              >
                Long
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Hover Delay: {hoverInDelay}ms
            </div>
            <Slider
              min={200}
              max={3000}
              step={200}
              value={hoverInDelay}
              onChange={changeHoverInDelay}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Hover Out Delay: {hoverOutDelay}ms
            </div>
            <Slider
              min={200}
              max={3000}
              step={200}
              value={hoverOutDelay}
              onChange={changeHoverOutDelay}
            />
          </div>
        </div>
      </main>
      <footer className="bg-slate-900 w-full p-4 flex justify-end gap-2">
        <span className="material-symbols-outlined">help</span>
        <span className="material-symbols-outlined">bug_report</span>
      </footer>
    </div>
  );
}

export default App;
