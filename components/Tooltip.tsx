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
        position: "absolute",
        willChange: "transform",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        overflowY: "auto",
        maxHeight: "min(200px, 60vh)",
        width: "min(24rem, 90vw)",
        backgroundColor: "rgb(51 65 85)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        color: "white",
        fontSize: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "opacity 0.2s ease-in-out",
        opacity: 1,
        wordWrap: "break-word",
        lineHeight: 1.5,
      }}
    >
      <h1
        style={{
          fontSize: "1.25rem",
          marginBottom: "0.5rem",
          fontWeight: 600,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "white",
        }}
      >
        {title}
      </h1>
      <div style={{ fontSize: "0.875rem", color: "inherit" }}>{content}</div>
    </div>
  );
};

export default Tooltip;
