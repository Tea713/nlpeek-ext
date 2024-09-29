import React from "react";

interface TooltipProps {
  text: string | null;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div
      style={{
        height: "7rem",
        width: "24rem",
        backgroundColor: "rgb(51 65 85)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        color: "white",
        overflowY: "scroll",
        fontSize: "12px"
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Tooltip;
