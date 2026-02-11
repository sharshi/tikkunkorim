import React from 'react';
import { ParshaLocation } from '../../utils/navigationUtils';
import { useLanguage, interpolate } from '../../i18n';
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
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="header">
      <div className="header-content">
        <div className="title-section">
          <strong>{t.appTitle}</strong>
          {currentParsha && (
            <div className="parsha-info">
              <span className="sefer"><bdi>{currentParsha.sefer}</bdi></span>
              <span className="separator">&middot;</span>
              <span className="parsha"><bdi>{currentParsha.parsha}</bdi></span>
              {currentParsha.aliya && (
                <>
                  <span className="separator">&middot;</span>
                  <span className="aliya">{interpolate(t.aliya, { n: currentParsha.aliya })}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="navigation-hints">
          <div className="keyboard-hints">
            <span>{t.keyboardHintPage}</span>
            <span>{t.keyboardHintParsha}</span>
            <span>{t.keyboardHintNikud}</span>
          </div>
          {currentParsha && (
            <div className="navigation-status">
              <span className="status-dot" />
              <span>{t.navigationActive}</span>
            </div>
          )}
        </div>

        <div className="amud-info">
          {interpolate(t.pageOf, { current: currentAmud, total: totalAmudim })}
        </div>

        <div className="controls">
          <button onClick={toggleLanguage} className="control-button lang-toggle">
            {t.languageToggle}
          </button>
          <button onClick={onToggleNikud} className="control-button">
            {t.nikud} {showNikud ? t.on : t.off}
          </button>
          {!showNikud && (
            <div className="word-gap-controls">
              <button
                onClick={() => onAdjustWordGap(-0.5)}
                disabled={wordGap <= 1}
                className="gap-button"
              >
                -
              </button>
              <span className="gap-display">{interpolate(t.maxGap, { gap: wordGap })}</span>
              <button
                onClick={() => onAdjustWordGap(0.5)}
                disabled={wordGap >= 6}
                className="gap-button"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
