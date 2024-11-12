import ReactDOM from "react-dom/client";
import Tooltip from "@/components/Tooltip";

interface Position {
  x: number;
  y: number;
}

function calculateTooltipPosition(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Initial position below the element
  let x = rect.left + scrollX;
  let y = rect.bottom + scrollY + 5; // 5px offset
  
  // Create dummy element to get tooltip dimensions
  const dummy = document.createElement('div');
  dummy.style.visibility = 'hidden';
  dummy.style.position = 'absolute';
  dummy.className = 'tooltip';
  document.body.appendChild(dummy);
  const tooltipWidth = dummy.offsetWidth;
  const tooltipHeight = dummy.offsetHeight;
  document.body.removeChild(dummy);
  
  // Check right boundary
  if (rect.left + tooltipWidth > viewportWidth) {
    x = rect.right - tooltipWidth + scrollX;
  }
  
  // Check bottom boundary
  if (rect.bottom + tooltipHeight > viewportHeight) {
    y = rect.top - tooltipHeight + scrollY - 5;
  }
  
  return { x, y };
}

let tooltipDiv: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;
let currentTitle: string = "";
let currentPosition: Position = { x: 0, y: 0 };

export function showTooltip(
  title: string,
  content: string,
  element: HTMLElement
) {
  if (tooltipDiv) return;
  const position = calculateTooltipPosition(element);

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
