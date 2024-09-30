import React from "react";

interface TooltipProps {
  text: string | null;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ text, position }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        overflowY: "scroll",
        height: "7rem",
        width: "24rem",
        backgroundColor: "rgb(51 65 85)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        color: "white",
        fontSize: "12px",
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Tooltip;