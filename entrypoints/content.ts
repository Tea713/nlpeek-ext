import {
  showTooltip,
  hideToolTip,
  updateToolTipContent,
} from "@/utils/tooltipUtils";
import { summarizationEnabled } from "@/utils/storage";
import { getReadabilityContent } from "@/utils/readabilityUtils";
import { summarize } from "@/utils/summarizationUtils";
import { storage } from "wxt/storage";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main() {
    let summarizationIsEnabled: boolean | null =
      await summarizationEnabled.getValue();

    storage.watch<boolean>("sync:summarizationEnabled", async () => {
      summarizationIsEnabled = await summarizationEnabled.getValue();
    });

    const handleMouseEvents = (element: HTMLAnchorElement) => {
      let hoverTimeout: number;

      element.addEventListener("mouseover", () => {
        if (!summarizationIsEnabled) return;

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
