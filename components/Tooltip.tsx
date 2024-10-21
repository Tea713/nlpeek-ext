import React from "react";

interface TooltipProps {
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ title, content, position }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        overflowY: "auto",
        maxHeight: "200px",
        width: "24rem",
        backgroundColor: "rgb(51 65 85)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        color: "white",
        fontSize: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{title}</h1>
      <div>{content}</div>
    </div>
  );
};

export default Tooltip;
