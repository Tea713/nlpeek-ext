import {
  showTooltip,
  hideToolTip,
  updateToolTipContent,
} from "@/utils/tooltipUtils";
import { fetchTooltipContent } from "@/utils/fetchContentUtils";
import {
  summarizationEnabled,
  currentHoverInDelay,
  currentHoverOutDelay,
  currentSummaryLength,
} from "@/utils/storage";
import { storage } from "wxt/storage";
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

      const clearAllTimeouts = () => {
        clearTimeout(hoverInTimeout);
        clearTimeout(hoverOutTimeout);
      };

      const initializeToolTip = (tooltipDiv: HTMLDivElement | undefined) => {
        tooltipDiv?.addEventListener("mouseover", () => {
          clearAllTimeouts();
        });

        tooltipDiv?.addEventListener("mouseout", () => {
          clearAllTimeouts();
          hoverOutTimeout = window.setTimeout(async () => {
            hideToolTip();
          }, hoverOutDelay);
        });
      };

      element.addEventListener("mouseover", () => {
        if (!summarizationIsEnabled) return;

        clearAllTimeouts();
        hoverInTimeout = window.setTimeout(async () => {
          const url: string = element.href;
          const anchorText = element.textContent || url;

          let tooltipDiv = showTooltip(anchorText, "", element, true);
          initializeToolTip(tooltipDiv);

          const result = await fetchTooltipContent(
            url,
            anchorText,
            summaryLength
          );

          updateToolTipContent(result.title, result.content);
        }, hoverInDelay);
      });

      element.addEventListener("mouseout", () => {
        clearAllTimeouts();
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
