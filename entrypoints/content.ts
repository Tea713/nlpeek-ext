import { showTooltip, hideToolTip } from "@/utils/tooltipUtils";
import { getReadabilityContent } from "@/utils/readabilityUtils";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  main() {
    let summarizationEnabled: boolean = false;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "summarization-state") {
        summarizationEnabled = message.isOn;
        console.log(`Summarization enabled: ${summarizationEnabled}`);
      }
    });

    chrome.storage.sync.get(["summarizationEnabled"], (result) => {
      summarizationEnabled = result.summarizationEnabled || false;
    });

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      element.addEventListener("mouseover", async () => {
        if (!summarizationEnabled) return;
        element.style.backgroundColor = "yellow";
        const rect: DOMRect = element.getBoundingClientRect();
        const position: { x: number; y: number } = {
          x: rect.left,
          y: rect.bottom,
        };
        const url: string = element.href;
        const readabilityContent = await getReadabilityContent(url);
        if (readabilityContent) {
          showTooltip(readabilityContent, position);
        }
      });

      element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "";
        hideToolTip();
      });
    });
  },
});
