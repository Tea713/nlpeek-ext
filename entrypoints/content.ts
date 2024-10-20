import { showTooltip, hideToolTip } from "@/utils/tooltipUtils";
import { getReadabilityContent } from "@/utils/readabilityUtils";
import { summarize } from "@/utils/summarizationUtils";
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
      let hoverTimeout: NodeJS.Timeout;

      element.addEventListener("mouseover", async () => {
        if (!summarizationEnabled) return;

        hoverTimeout = setTimeout(async () => {
          const rect: DOMRect = element.getBoundingClientRect();
          const position: { x: number; y: number } = {
            x: rect.left,
            y: rect.bottom,
          };
          try {
            const url: string = element.href;
            const readabilityContent: {
              title: string;
              content: string;
            } | null = await getReadabilityContent(url);
            if (!readabilityContent) {
              return;
            }
            const summarizedContent = await summarize(
              readabilityContent.content
            );
            if (!summarizedContent) {
              return;
            }
            showTooltip(readabilityContent.title, summarizedContent, position);
          } catch (error) {
            console.error(`Error: ${error}`);
          }
        }, 1000);
      });

      element.addEventListener("mouseout", () => {
        clearTimeout(hoverTimeout);
        hideToolTip();
      });
    });
  },
});
