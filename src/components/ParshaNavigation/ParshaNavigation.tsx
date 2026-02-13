import React, { useState, useEffect, useRef } from 'react';
import { seforim, parshios, aliyanames, aliyos } from '../../data/parshadata';
import { useLanguage, interpolate } from '../../i18n';
import './ParshaNavigation.css';

interface ParshaNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onParshaSelect?: (sefer: string, parsha: string, aliya?: number) => void;
  currentSefer?: string;
  currentParsha?: string;
  currentAliya?: number;
  showNikud: boolean;
  wordGap: number;
  onToggleNikud: () => void;
  onAdjustWordGap: (change: number) => void;
}

export const ParshaNavigation: React.FC<ParshaNavigationProps> = ({
  isOpen,
  onToggle,
  onParshaSelect,
  currentSefer,
  currentParsha,
  currentAliya,
  showNikud,
  wordGap,
  onToggleNikud,
  onAdjustWordGap
}) => {
  const { t } = useLanguage();
  const [selectedSefer, setSelectedSefer] = useState<string>(currentSefer || seforim[0]);
  const [expandedParsha, setExpandedParsha] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync state when panel opens
  useEffect(() => {
    if (!isOpen) return;
    if (currentSefer) setSelectedSefer(currentSefer);
    if (currentParsha) {
      setExpandedParsha(currentParsha);
    } else {
      setExpandedParsha(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const handleSeferSelect = (sefer: string) => {
    setSelectedSefer(sefer);
    setExpandedParsha(null);
  };

  const handleParshaClick = (parsha: string) => {
    if (expandedParsha === parsha) {
      // Already expanded -- collapse
      setExpandedParsha(null);
    } else {
      // Expand + navigate to aliya 1
      setExpandedParsha(parsha);
      if (onParshaSelect) {
        onParshaSelect(selectedSefer, parsha);
      }
    }
  };

  const handleAliyaSelect = (parsha: string, aliyaIndex: number) => {
    if (onParshaSelect) {
      onParshaSelect(selectedSefer, parsha, aliyaIndex + 1);
    }
    onToggle(); // close panel
  };

  const seferParshios = parshios[selectedSefer as keyof typeof parshios] || [];

  return (
    <>
      {isOpen && <div className="parsha-nav-backdrop" onClick={onToggle} />}

      <button
        className={`parsha-nav-toggle ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      <div
        ref={menuRef}
        className={`parsha-navigation ${isOpen ? 'open' : ''}`}
      >
        <div className="parsha-nav-header">
          <h2>{t.parshaNavigation}</h2>
          <button className="close-button" onClick={onToggle}>&#x2715;</button>
        </div>

        <div className="parsha-nav-content">
          {/* Sefer pills */}
          <div className="sefer-pills">
            {seforim.map((sefer) => (
              <button
                key={sefer}
                className={`sefer-pill ${selectedSefer === sefer ? 'selected' : ''} ${currentSefer === sefer ? 'current' : ''}`}
                onClick={() => handleSeferSelect(sefer)}
              >
                <bdi>{sefer}</bdi>
              </button>
            ))}
          </div>

          {/* Parsha accordion list */}
          <div className="parsha-list">
            {seferParshios.map((parsha) => {
              const isExpanded = expandedParsha === parsha;
              const isCurrent = currentParsha === parsha;
              const aliyaData = aliyos[parsha as keyof typeof aliyos];

              return (
                <div key={parsha} className={`parsha-item ${isExpanded ? 'expanded' : ''} ${isCurrent ? 'current' : ''}`}>
                  <button
                    className="parsha-item-header"
                    onClick={() => handleParshaClick(parsha)}
                  >
                    <span className="parsha-item-name"><bdi>{parsha}</bdi></span>
                    <span className={`parsha-chevron ${isExpanded ? 'open' : ''}`}>&#x25B8;</span>
                  </button>

                  {isExpanded && aliyaData && (
                    <div className="aliya-list">
                      {aliyanames.map((name, idx) => {
                        const key = (idx + 1).toString();
                        const range = (aliyaData as any)[key];
                        if (!range) return null;

                        return (
                          <button
                            key={idx}
                            className={`aliya-row ${currentParsha === parsha && currentAliya === idx + 1 ? 'current' : ''}`}
                            onClick={() => handleAliyaSelect(parsha, idx)}
                          >
                            <span className="aliya-row-name"><bdi>{name}</bdi></span>
                            <span className="aliya-row-range">{range}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Display settings */}
          <div className="nav-display-settings">
            <h3>{t.displaySettings}</h3>

            <div className="display-setting-row">
              <span className="display-setting-label">{t.nikud}</span>
              <button
                className={`display-toggle ${showNikud ? 'on' : ''}`}
                onClick={onToggleNikud}
              >
                {showNikud ? t.on : t.off}
              </button>
            </div>

            {!showNikud && (
              <div className="display-setting-row">
                <span className="display-setting-label">{interpolate(t.maxGap, { gap: wordGap })}</span>
                <div className="display-gap-controls">
                  <button
                    className="display-gap-btn"
                    onClick={() => onAdjustWordGap(-0.5)}
                    disabled={wordGap <= 1}
                  >
                    -
                  </button>
                  <span className="display-gap-val">{wordGap.toFixed(1)}</span>
                  <button
                    className="display-gap-btn"
                    onClick={() => onAdjustWordGap(0.5)}
                    disabled={wordGap >= 6}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
