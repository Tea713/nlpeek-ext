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

    function showTooltip(
      extractedContent: string,
      position: { x: number; y: number }
    ) {
      if (tooltipDiv) return;

      tooltipDiv = document.createElement("div");
      tooltipDiv.id = "nlpeek-tooltip";
      document.body.appendChild(tooltipDiv);

      root = ReactDOM.createRoot(tooltipDiv);
      root.render(
        <Tooltip text={extractedContent ?? ""} position={position} />
      );
    }

    function hideTooltip() {
      if (tooltipDiv) {
        root?.unmount();
        tooltipDiv.remove();
        tooltipDiv = null;
        root = null;
      }
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
        return DOMPurify.sanitize(article.content);
      } else {
        console.error("Fail to parse content.");
        return null;
      }
    }

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      element.addEventListener("mouseover", async () => {
        element.style.backgroundColor = "yellow";
        const rect: DOMRect = element.getBoundingClientRect();
        const position = { x: rect.left, y: rect.bottom };
        const url = element.href;
        const readabilityContent = await getReadabilityContent(url);
        if(readabilityContent) {
          showTooltip(readabilityContent, position);
        } else {
          console.error(`Fail to fetch content from ${url}.`)
        }
      });

      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "";
        hideTooltip();
      });
    });
  },
});
