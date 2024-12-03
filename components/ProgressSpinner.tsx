import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

const ProgressSpinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'white', label = 'Loading...' }) => {
  const sizeValues = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const spinnerSize = sizeValues[size];
  const borderWidth = spinnerSize / 8;

  const spinnerStyle: React.CSSProperties = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `${borderWidth}px solid ${color}`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    boxSizing: 'border-box',
    animation: 'spinner 1s linear infinite'
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div
        style={spinnerStyle}
        role="status"
        aria-label={label}
      >
        <span style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          padding: '0', 
          margin: '-1px', 
          overflow: 'hidden', 
          clip: 'rect(0, 0, 0, 0)', 
          whiteSpace: 'nowrap', 
          borderWidth: '0' 
        }}>
          {label}
        </span>
      </div>
      <style>
        {`
          @keyframes spinner {
            to {transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default ProgressSpinner;