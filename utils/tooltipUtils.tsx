import ReactDOM from "react-dom/client";
import Tooltip from "@/components/Tooltip";

let tooltipDiv: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;
let currentTitle: string = "";
let currentPosition: { x: number; y: number } = { x: 0, y: 0 };

export function showTooltip(
  title: string,
  content: string,
  position: { x: number; y: number }
) {
  if (tooltipDiv) return;

  tooltipDiv = document.createElement("div");
  tooltipDiv.id = "nlpeek-tooltip";
  document.body.appendChild(tooltipDiv);

  currentTitle = title;
  currentPosition = position;
  root = ReactDOM.createRoot(tooltipDiv);
  root.render(<Tooltip title={title} content={content} position={position} />);

  return tooltipDiv;
}

export function updateToolTipContent(newTitle: string, newContent: string) {
  if (root && tooltipDiv) {
    currentTitle = newTitle;
    root.render(
      <Tooltip
        title={newTitle}
        content={newContent}
        position={currentPosition}
      />
    );
  }
}

export function hideToolTip() {
  if (tooltipDiv) {
    root?.unmount();
    tooltipDiv.remove();
    tooltipDiv = null;
    root = null;
  }
}
