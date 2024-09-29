import Tooltip from "../components/Tooltip";
import { createRoot } from "react-dom/client";
import React from "react";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Hello content.");

    document.querySelectorAll("a").forEach((element) => {
      let tooltipContainer: HTMLDivElement | null = null;

      element.addEventListener("mouseover", () => {
        tooltipContainer = document.createElement("div");
        tooltipContainer.style.position = "absolute";
        tooltipContainer.style.zIndex = "1000";
        document.body.appendChild(tooltipContainer);

        const rect = element.getBoundingClientRect();
        tooltipContainer.style.left = `${rect.left + window.scrollX}px`;
        tooltipContainer.style.top = `${rect.top + window.scrollY - 30}px`; // Adjust the position as needed

        const root = createRoot(tooltipContainer);
        root.render(<Tooltip text="Tooltip test text" />);
      });

      element.addEventListener("mouseout", () => {
        if (tooltipContainer) {
          tooltipContainer.remove();
          tooltipContainer = null;
        }
      });
    });
  },
});
