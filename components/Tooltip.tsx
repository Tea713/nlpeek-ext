import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import ProgressSpinner from "./ProgressSpinner";

interface TooltipProps {
  title: string;
  content: string;
  position?: { x: number; y: number };
  isLoading?: boolean;
  isVisible?: boolean; // Add this line
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  content,
  position = { x: 20, y: 20 },
  isLoading = false,
  isVisible: propIsVisible, // Rename to avoid conflict
}) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  
  // Use prop if provided, otherwise use internal state
  const isVisible = propIsVisible !== undefined ? propIsVisible : internalIsVisible;

  useEffect(() => {
    // Only trigger animation if no isVisible prop is provided
    if (propIsVisible === undefined) {
      requestAnimationFrame(() => {
        setInternalIsVisible(true);
      });
    }
  }, [propIsVisible]);

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    willChange: "transform",
    top: position.y,
    left: position.x,
    zIndex: 1000,
    overflowY: "auto",
    maxHeight: "min(300px, 60vh)",
    width: "min(24rem, 90vw)",
    backgroundColor: "rgba(30 41 59)",
    borderRadius: "0.75rem",
    padding: "1.25rem 1.5rem",
    color: "white",
    fontSize: "14px",
    boxShadow:
      "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    wordWrap: "break-word",
    lineHeight: 1.6,
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(96, 165, 250, 0.5) rgba(255, 255, 255, 0.1)",
    
    // Animation properties
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "scale(1) translateY(0)" : "scale(0.95) translateY(-30px)",
    transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    fontWeight: 600,
    color: "#60a5fa",
    borderBottom: "1px solid rgba(96, 165, 250, 0.3)",
    paddingBottom: "0.5rem",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    minHeight: isLoading ? "100px" : "auto",
    padding: "0.5rem 0",
  };

  return (
    <div style={tooltipStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <div style={contentStyle}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <ProgressSpinner
              size="lg"
              color="#60a5fa"
              label="Loading content..."
            />
          </div>
        ) : (
          <Typewriter
            options={{
              strings: content,
              autoStart: true,
              loop: false,
              delay: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tooltip;