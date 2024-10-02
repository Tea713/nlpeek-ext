import Tooltip from "@/components/Tooltip";
import ReactDOM from "react-dom/client";
import { Readability } from "@mozilla/readability";
import DOMPurify from "dompurify";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  main() {
    let tooltipDiv: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;
    let summarizationEnabled = false;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "summarization-state") {
        summarizationEnabled = message.isOn;
        console.log(`Summarization enabled: ${summarizationEnabled}`);
      }
    });

    chrome.storage.sync.get(["summarizationEnabled"], (result) => {
      summarizationEnabled = result.summarizationEnabled || false;
    });

    function showTooltip(
      extractedContent: string,
      position: { x: number; y: number }
    ) {
      if (!summarizationEnabled) return;
      if (tooltipDiv) return;

      tooltipDiv = document.createElement("div");
      tooltipDiv.id = "nlpeek-tooltip";
      document.body.appendChild(tooltipDiv);

      root = ReactDOM.createRoot(tooltipDiv);
      root.render(
        <Tooltip text={extractedContent ?? ""} position={position} />
      );

      tooltipDiv.addEventListener("mouseover", () => {
        clearTimeout(hideTooltipTimeout);
      });

      tooltipDiv.addEventListener("mouseout", () => {
        hideTooltip();
      });
    }

    let hideTooltipTimeout: NodeJS.Timeout;

    function hideTooltip() {
      hideTooltipTimeout = setTimeout(() => {
        if (tooltipDiv) {
          root?.unmount();
          tooltipDiv.remove();
          tooltipDiv = null;
          root = null;
        }
      }, 200);
    }

    async function getReadabilityContent(url: string) {
      const response: Response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data. Response status: ${response.status}`
        );
      }
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const reader = new Readability(doc);
      const article = reader.parse();
      if (article) {
        const clean = DOMPurify.sanitize(article.content);
        return clean;
      } else {
        console.error("Fail to parse content.");
        return null;
      }
    }

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      element.addEventListener("mouseover", async () => {
        if (!summarizationEnabled) return;
        element.style.backgroundColor = "yellow";
        const rect: DOMRect = element.getBoundingClientRect();
        const position = { x: rect.left, y: rect.bottom };
        const url = element.href;
        const readabilityContent = await getReadabilityContent(url);
        if (readabilityContent) {
          showTooltip(readabilityContent, position);
        } else {
          console.error(`Fail to fetch content from ${url}.`);
        }
      });

      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "";
        hideTooltip();
      });
    });
  },
});
