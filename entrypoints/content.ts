// content.ts
import {
  showTooltip,
  hideToolTip,
  updateToolTipContent,
} from "@/utils/tooltipUtils";
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

    const handleMouseEvents = (element: HTMLAnchorElement) => {
      let hoverTimeout: number;

      element.addEventListener("mouseover", () => {
        if (!summarizationEnabled) return;

        hoverTimeout = window.setTimeout(async () => {
          const rect: DOMRect = element.getBoundingClientRect();
          const position: { x: number; y: number } = {
            x: rect.left,
            y: rect.bottom,
          };
          const url: string = element.href;
          const linkText = element.textContent || url;

          showTooltip(linkText, "Loading...", position);

          try {
            const readabilityContent: {
              title: string;
              content: string;
            } | null = await getReadabilityContent(url);
            if (!readabilityContent) {
              updateToolTipContent(linkText, "Error fetching content.");
              return;
            }

            const summarizedContent = await summarize(
              readabilityContent.content
            );
            if (!summarizedContent) {
              updateToolTipContent(
                readabilityContent.title,
                "Error summarizing content."
              );
              return;
            }

            // Update tooltip with summarized content
            updateToolTipContent(readabilityContent.title, summarizedContent);
          } catch (error) {
            console.error(`Error: ${error}`);
            updateToolTipContent(linkText, "Error fetching summary.");
          }
        }, 1000);
      });

      element.addEventListener("mouseout", () => {
        clearTimeout(hoverTimeout);
        hideToolTip();
      });
    };

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      handleMouseEvents(element);
    });
  },
});
