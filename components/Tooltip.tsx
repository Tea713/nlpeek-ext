import React from 'react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="h-28 w-96 bg-black rounded-sm p-0.5 border-2 border-slate-400">
      <p>{text}</p>
    </div>
  );
};

export default Tooltip;