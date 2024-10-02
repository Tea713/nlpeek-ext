import "./App.css";
import BigSwitch from "@/components/BigSwitch";

function App() {
  return (
    <div className="w-[320px] h-[380px] flex flex-col justify-center bg-slate-950">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">NLPeek</h1>
      </header>
      <main className="flex-grow p-8">
        <BigSwitch />
      </main>
      <footer className="bg-slate-800 w-full p-4">
        <div>aboutaboutaboutsettingsettingsetting</div>
      </footer>
    </div>
  );
}

export default App;
