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
  onToggleNikud,
  onAdjustWordGap
}) => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <header className="header">
      <div className="header-content">
        {/* Mobile: parsha + aliya only. Tablet+: title . sefer . parsha . aliya */}
        <div className="header-location">
          <span className="header-expanded header-title">{t.appTitle}</span>
          {currentParsha && (
            <>
              <span className="header-expanded header-sep">&middot;</span>
              <span className="header-expanded header-sefer"><bdi>{currentParsha.sefer}</bdi></span>
              <span className="header-expanded header-sep">&middot;</span>
              <span className="header-parsha"><bdi>{currentParsha.parsha}</bdi></span>
              {currentParsha.aliya && (
                <>
                  <span className="header-sep">&middot;</span>
                  <span className="header-aliya">{interpolate(t.aliya, { n: currentParsha.aliya })}</span>
                </>
              )}
            </>
          )}
        </div>

        <div className="header-controls">
          {/* Amud counter -- tablet+ */}
          <span className="header-amud-info">
            {interpolate(t.pageOf, { current: currentAmud, total: totalAmudim })}
          </span>

          {/* Nikud toggle -- always visible */}
          <button onClick={onToggleNikud} className="header-btn header-btn-nikud">
            {t.nikud} {showNikud ? t.on : t.off}
          </button>

          {/* Word gap -- tablet+ */}
          {!showNikud && (
            <div className="header-word-gap">
              <button
                onClick={() => onAdjustWordGap(-0.5)}
                disabled={wordGap <= 1}
                className="header-gap-btn"
              >
                -
              </button>
              <span className="header-gap-val">{wordGap.toFixed(1)}</span>
              <button
                onClick={() => onAdjustWordGap(0.5)}
                disabled={wordGap >= 6}
                className="header-gap-btn"
              >
                +
              </button>
            </div>
          )}

          {/* Language toggle -- always visible */}
          <button onClick={toggleLanguage} className="header-btn header-btn-lang">
            {t.languageToggle}
          </button>

          {/* Keyboard hints -- desktop only */}
          <div className="header-keyboard-hints">
            <span>{t.keyboardHintPage}</span>
            <span>{t.keyboardHintParsha}</span>
            <span>{t.keyboardHintNikud}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
