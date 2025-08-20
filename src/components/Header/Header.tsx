import React from 'react';
import './Header.css';

interface HeaderProps {
  currentAmud: number;
  totalAmudim: number;
  showNikud: boolean;
  wordGap: number;
  onNavigateAmud: (direction: 'next' | 'prev') => void;
  onToggleNikud: () => void;
  onAdjustWordGap: (change: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAmud,
  totalAmudim,
  showNikud,
  wordGap,
  onNavigateAmud,
  onToggleNikud,
  onAdjustWordGap
}) => {
  return (
    <div className="header">
      <div className="header-content">
        <strong>תִּקּוּן קוֹרִאים</strong>
        <div className="navigation">
          <button 
            onClick={() => onNavigateAmud('prev')}
            disabled={currentAmud <= 1}
            className="nav-button"
          >
            &lt;&lt;
          </button>
          <span className="amud-info">
            [Amud {currentAmud} of {totalAmudim}]
          </span>
          <button 
            onClick={() => onNavigateAmud('next')}
            disabled={currentAmud >= totalAmudim}
            className="nav-button"
          >
            &gt;&gt;
          </button>
        </div>
        <div className="controls">
          <button onClick={onToggleNikud} className="control-button">
            Nikud {showNikud ? 'ON' : 'OFF'}
          </button>
          {!showNikud && (
            <div className="word-gap-controls">
              <button 
                onClick={() => onAdjustWordGap(-0.5)}
                disabled={wordGap <= 1}
                className="gap-button"
              >
                [-]
              </button>
              <span className="gap-display">[max gap: {wordGap}]</span>
              <button 
                onClick={() => onAdjustWordGap(0.5)}
                disabled={wordGap >= 6}
                className="gap-button"
              >
                [+]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
