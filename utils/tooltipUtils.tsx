import ReactDOM from "react-dom/client";
import Tooltip from "@/components/Tooltip";

interface Position {
  x: number;
  y: number;
}

let tooltipDiv: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;
let currentTitle: string = "";
let currentPosition: Position = { x: 0, y: 0 };

function calculateTooltipPosition(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let x = rect.left + scrollX;
  let y = rect.bottom + scrollY + 5; // 5px offset

  return { x, y };
}

export function showTooltip(
  title: string,
  content: string,
  element: HTMLElement,
  isLoading: boolean
) {
  if (tooltipDiv) return;
  const position = calculateTooltipPosition(element);

  tooltipDiv = document.createElement("div");
  tooltipDiv.id = "nlpeek-tooltip";
  document.body.appendChild(tooltipDiv);

  currentTitle = title;
  currentPosition = position;
  root = ReactDOM.createRoot(tooltipDiv);
  root.render(<Tooltip title={title} content={content} position={position} isLoading={isLoading}/>);

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
  if (tooltipDiv && root) {
    // First render with animation state
    root.render(
      <Tooltip
        title={currentTitle}
        content=""
        position={currentPosition}
        isVisible={false}
      />
    );

    // Wait for animation to complete before removing
    setTimeout(() => {
      root?.unmount();
      tooltipDiv?.remove();
      tooltipDiv = null;
      root = null;
    }, 200); // Match this with the transition duration
  }
}
