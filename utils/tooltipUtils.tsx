import ReactDOM from "react-dom/client";
import Tooltip from "@/components/Tooltip";

let tooltipDiv: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;
let hideTooltipTimeout: NodeJS.Timeout;

export function showTooltip(
  content: string,
  position: { x: number; y: number }
) {
  if (tooltipDiv) return;

  tooltipDiv = document.createElement("div");
  tooltipDiv.id = "nlpeek-tooltip";
  document.body.appendChild(tooltipDiv);

  root = ReactDOM.createRoot(tooltipDiv);
  root.render(<Tooltip text={content ?? ""} position={position} />);

  tooltipDiv.addEventListener("mouseover", () => {
    clearTimeout(hideTooltipTimeout);
  });

  tooltipDiv.addEventListener("mouseout", () => {
    hideToolTip();
  });
}

export function hideToolTip() {
  hideTooltipTimeout = setTimeout(() => {
    if (tooltipDiv) {
      root?.unmount();
      tooltipDiv.remove();
      tooltipDiv = null;
      root = null;
    }
  }, 300);
}
