import Tooltip from "@/components/Tooltip";
import ReactDOM from "react-dom/client";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  main() {
    let tooltipDiv: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;

    function showTooltip(
      extractedContent: string,
      position: { x: number; y: number }
    ) {
      if (tooltipDiv) return;

      tooltipDiv = document.createElement("div");
      tooltipDiv.id = "nlpeek-tooltip";
      document.body.appendChild(tooltipDiv);

      root = ReactDOM.createRoot(tooltipDiv);
      root.render(<Tooltip text={extractedContent ?? ""} position={position} />);
    }

    function hideTooltip() {
      if (tooltipDiv) {
        root?.unmount();
        tooltipDiv.remove();
        tooltipDiv = null;
        root = null;
      }
    }

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "yellow";
        const rect: DOMRect = element.getBoundingClientRect();
        const position = {x: rect.left, y: rect.bottom};

        chrome.runtime.sendMessage({action: 'fetch-content', url: element.href}, (response) => {
          if(response?.extractedContent) {
            showTooltip(response.extractedContent, position);
          }
        })
      });

      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "";
        hideTooltip();
      });
    });
  },
});
