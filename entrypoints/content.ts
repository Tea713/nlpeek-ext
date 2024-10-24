import {
  showTooltip,
  hideToolTip,
  updateToolTipContent,
} from "@/utils/tooltipUtils";
import {
  summarizationEnabled,
  currentHoverInDelay,
  currentHoverOutDelay,
  currentSummaryLength,
} from "@/utils/storage";
import { getReadabilityContent } from "@/utils/readabilityUtils";
import { storage } from "wxt/storage";
import { summarize } from "@/utils/summarizationUtils";
import { getCachedSummary, setCachedSummary } from "@/utils/cache";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main() {
    let summarizationIsEnabled: boolean = await summarizationEnabled.getValue();
    let summaryLength: string = await currentSummaryLength.getValue();
    let hoverInDelay: number = await currentHoverInDelay.getValue();
    let hoverOutDelay: number = await currentHoverOutDelay.getValue();

    storage.watch<boolean>("sync:summarizationEnabled", async () => {
      summarizationIsEnabled = await summarizationEnabled.getValue();
    });
    storage.watch<string>("sync:currentSummaryLength", async () => {
      summaryLength = await currentSummaryLength.getValue();
    });
    storage.watch<number>("sync:currentHoverInDelay", async () => {
      hoverInDelay = await currentHoverInDelay.getValue();
    });
    storage.watch<number>("sync:currentHoverOutDelay", async () => {
      hoverOutDelay = await currentHoverOutDelay.getValue();
    });

    const handleMouseEvents = (element: HTMLAnchorElement) => {
      let hoverInTimeout: number;
      let hoverOutTimeout: number;

      element.addEventListener("mouseover", () => {
        if (!summarizationIsEnabled) return;

        clearTimeout(hoverOutTimeout);
        hoverInTimeout = window.setTimeout(async () => {
          const rect: DOMRect = element.getBoundingClientRect();
          const position: { x: number; y: number } = {
            x: rect.left,
            y: rect.bottom,
          };
          const url: string = element.href;
          const linkText = element.textContent || url;

          let tooltipDiv = showTooltip(linkText, "Loading...", position);
          tooltipDiv?.addEventListener("mouseover", () => {
            clearTimeout(hoverOutTimeout);
          });

          tooltipDiv?.addEventListener("mouseout", () => {
            clearTimeout(hoverInTimeout);
            hoverOutTimeout = window.setTimeout(async () => {
              hideToolTip();
            }, hoverOutDelay);
          });

          try {
            const readabilityContent: {
              title: string;
              content: string;
            } | null = await getReadabilityContent(url);
            if (!readabilityContent) {
              updateToolTipContent(linkText, "Error fetching content.");
              return;
            }

            const cached = await getCachedSummary(url, summaryLength);
            if (cached) {
              updateToolTipContent(readabilityContent.title, cached);
              return;
            }

            const summarizedContent = await summarize(
              readabilityContent.content,
              summaryLength
            );
            if (!summarizedContent) {
              updateToolTipContent(
                readabilityContent.title,
                "Error summarizing content."
              );
              return;
            }

            updateToolTipContent(readabilityContent.title, summarizedContent);
            setCachedSummary(url, summaryLength, summarizedContent);
          } catch (error) {
            console.error(`Error: ${error}`);
            updateToolTipContent(linkText, "Error fetching summary.");
          }
        }, hoverInDelay);
      });

      element.addEventListener("mouseout", () => {
        clearTimeout(hoverInTimeout);
        hoverOutTimeout = window.setTimeout(async () => {
          hideToolTip();
        }, hoverOutDelay);
      });
    };

    document.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      handleMouseEvents(element);
    });
  },
});
