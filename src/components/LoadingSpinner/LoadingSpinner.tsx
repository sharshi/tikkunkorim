import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'טוען...', 
  size = 'medium' 
}) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-circle"></div>
      <div className="spinner-text">{message}</div>
    </div>
  );
};
