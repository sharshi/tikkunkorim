import React from 'react';
import { ParshaLocation } from '../../utils/navigationUtils';
import './Header.css';

interface HeaderProps {
  currentAmud: number;
  totalAmudim: number;
  showNikud: boolean;
  wordGap: number;
  currentParsha?: ParshaLocation;
  onNavigateAmud: (direction: 'next' | 'prev') => void;
  onToggleNikud: () => void;
  onAdjustWordGap: (change: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAmud,
  totalAmudim,
  showNikud,
  wordGap,
  currentParsha,
  onNavigateAmud,
  onToggleNikud,
  onAdjustWordGap
}) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="title-section">
          <strong>תִּקּוּן קוֹרִאים</strong>
          {currentParsha && (
            <div className="parsha-info">
              <span className="sefer">{currentParsha.sefer}</span>
              <span className="separator">•</span>
              <span className="parsha">{currentParsha.parsha}</span>
              {currentParsha.aliya && (
                <>
                  <span className="separator">•</span>
                  <span className="aliya">עליה {currentParsha.aliya}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="navigation-hints">
          <div className="keyboard-hints">
            <span>← → עמוד</span>
            <span>↑ ↓ פרשה</span>
            <span>N נקוד</span>
          </div>
          {currentParsha && (
            <div className="navigation-status">
              <span className="status-indicator">🔗</span>
              <span>ניווט פעיל</span>
            </div>
          )}
        </div>
        
        <div className="amud-info">
          עמוד {currentAmud} מתוך {totalAmudim}
        </div>
        {/* <div className="navigation">
          <button 
            onClick={() => onNavigateAmud('prev')}
            disabled={currentAmud <= 1}
            className="nav-button"
          >
            &lt;&lt;
          </button>
          <span className="amud-info">
            Amud {currentAmud} of {totalAmudim}
          </span>
          <button 
            onClick={() => onNavigateAmud('next')}
            disabled={currentAmud >= totalAmudim}
            className="nav-button"
          >
            &gt;&gt;
          </button>
        </div> */}
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
