import Tooltip from "@/components/Tooltip";
import { createRoot } from "react-dom/client";
import "@/assets/main.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  main() {
    document.querySelectorAll("a").forEach((element) => {
      let tooltipContainer: HTMLDivElement | null = null;
      let root: ReturnType<typeof createRoot> | null = null;

      element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "yellow";
        tooltipContainer = document.createElement("div");
        tooltipContainer.style.position = "absolute";
        tooltipContainer.style.zIndex = "1000";
        document.body.appendChild(tooltipContainer);

        const rect = element.getBoundingClientRect();
        tooltipContainer.style.left = `${rect.left + window.scrollX}px`;
        tooltipContainer.style.top = `${rect.top + window.scrollY - 112}px`;

        root = createRoot(tooltipContainer);
        root.render(<Tooltip text={element.textContent ?? ""} />);
      });

      element.addEventListener("mouseout", () => {
        if (tooltipContainer) {
          element.style.backgroundColor = "";
          root?.unmount();
          tooltipContainer.remove();
          tooltipContainer = null;
          root = null;
        }
      });
    });
  },
});
