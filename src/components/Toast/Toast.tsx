import React, { useState, useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  show?: boolean;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  show = false,
  onHide
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onHide?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible || !message) return null;

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-show' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && '✓'}
          {type === 'info' && 'ℹ'}
          {type === 'warning' && '⚠'}
          {type === 'error' && '✗'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};
