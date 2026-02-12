import React, { useState, useEffect, useRef } from 'react';
import { seforim, parshios, aliyanames, aliyos } from '../../data/parshadata';
import { useLanguage, interpolate } from '../../i18n';
import './ParshaNavigation.css';

interface ParshaNavigationProps {
  onParshaSelect?: (sefer: string, parsha: string, aliya?: number) => void;
  currentParsha?: string;
  currentSefer?: string;
  currentAliya?: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const ParshaNavigation: React.FC<ParshaNavigationProps> = ({
  onParshaSelect,
  currentParsha,
  currentSefer,
  currentAliya,
  isOpen,
  onToggle
}) => {
  const { t } = useLanguage();
  const [selectedSefer, setSelectedSefer] = useState<string>(currentSefer || seforim[0]);
  const [selectedParsha, setSelectedParsha] = useState<string>(currentParsha || '');
  const [showAliyos, setShowAliyos] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync menu with the user's current position when the menu opens.
  // While browsing the menu, internal state is independent of app state.
  useEffect(() => {
    if (!isOpen) return;
    if (currentSefer) setSelectedSefer(currentSefer);
    if (currentParsha) {
      setSelectedParsha(currentParsha);
      setShowAliyos(true);
    } else {
      setSelectedParsha('');
      setShowAliyos(false);
    }
    setSearchTerm('');
    // Only re-sync when the menu opens, not when currentSefer/currentParsha change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  // Filter parshios based on search term
  const filteredParshios = selectedSefer
    ? parshios[selectedSefer as keyof typeof parshios].filter(parsha =>
        parsha.includes(searchTerm) || parsha.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSeferSelect = (sefer: string) => {
    setSelectedSefer(sefer);
    setSelectedParsha('');
    setShowAliyos(false);
    setSearchTerm('');
  };

  const handleParshaSelect = (parsha: string) => {
    setSelectedParsha(parsha);
    setShowAliyos(true);
    if (onParshaSelect) {
      onParshaSelect(selectedSefer, parsha);
    }
  };

  const handleAliyaSelect = (aliyaIndex: number) => {
    if (onParshaSelect && selectedParsha) {
      onParshaSelect(selectedSefer, selectedParsha, aliyaIndex + 1);
    }
    onToggle();
  };

  const getCurrentAliyaData = () => {
    if (selectedParsha && aliyos[selectedParsha as keyof typeof aliyos]) {
      return aliyos[selectedParsha as keyof typeof aliyos];
    }
    return null;
  };

  return (
    <>
      {isOpen && <div className="parsha-nav-backdrop" onClick={onToggle} />}

      <button
        className={`parsha-nav-toggle ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label="Toggle Parsha Navigation"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div
        ref={menuRef}
        className={`parsha-navigation ${isOpen ? 'open' : ''}`}
      >
        <div className="parsha-nav-header">
          <h2>{t.parshaNavigation}</h2>
          <button className="close-button" onClick={onToggle}>
            &#x2715;
          </button>
        </div>

        <div className="parsha-nav-content">
          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder={t.searchParsha}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Current selection */}
          {(currentSefer || currentParsha) && (
            <div className="current-selection">
              <span className="current-label">{t.currentlySelected}</span>
              <div className="current-path">
                {currentSefer && <span className="current-sefer"><bdi>{currentSefer}</bdi></span>}
                {currentParsha && (
                  <>
                    <span className="separator">&rsaquo;</span>
                    <span className="current-parsha"><bdi>{currentParsha}</bdi></span>
                  </>
                )}
                {currentAliya && (
                  <>
                    <span className="separator">&rsaquo;</span>
                    <span className="current-aliya"><bdi>{aliyanames[currentAliya - 1]}</bdi></span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Seforim */}
          <div className="nav-section">
            <h3>{t.sefarim}</h3>
            <div className="seforim-grid">
              {seforim.map((sefer) => (
                <button
                  key={sefer}
                  className={`sefer-button ${selectedSefer === sefer ? 'selected' : ''} ${currentSefer === sefer ? 'current' : ''}`}
                  onClick={() => handleSeferSelect(sefer)}
                >
                  <span className="sefer-name"><bdi>{sefer}</bdi></span>
                  <span className="sefer-count">
                    {interpolate(t.parshaCount, { count: parshios[sefer as keyof typeof parshios].length })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parshios */}
          {selectedSefer && (
            <div className="nav-section">
              <h3>{t.parshios} &mdash; <bdi>{selectedSefer}</bdi></h3>
              <div className="parshios-grid">
                {filteredParshios.map((parsha) => (
                  <button
                    key={parsha}
                    className={`parsha-button ${selectedParsha === parsha ? 'selected' : ''} ${currentParsha === parsha ? 'current' : ''}`}
                    onClick={() => handleParshaSelect(parsha)}
                  >
                    <span className="parsha-name"><bdi>{parsha}</bdi></span>
                    {aliyos[parsha as keyof typeof aliyos] && (
                      <span className="aliya-indicator" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aliyos */}
          {showAliyos && selectedParsha && getCurrentAliyaData() && (
            <div className="nav-section">
              <h3>{t.aliyos} &mdash; <bdi>{selectedParsha}</bdi></h3>
              <div className="aliyos-grid">
                {aliyanames.map((aliyaName, index) => {
                  const aliyaData = getCurrentAliyaData();
                  const aliyaKey = (index + 1).toString();
                  const hasData = aliyaData && (aliyaData as any)[aliyaKey];

                  if (!hasData) return null;

                  return (
                    <button
                      key={index}
                      className={`aliya-button ${currentAliya === index + 1 ? 'current' : ''}`}
                      onClick={() => handleAliyaSelect(index)}
                    >
                      <span className="aliya-name"><bdi>{aliyaName}</bdi></span>
                      <span className="aliya-range">
                        {(aliyaData as any)[aliyaKey]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="nav-section quick-actions">
            <h3>{t.quickActions}</h3>
            <div className="quick-actions-grid">
              <button
                className="quick-action-button"
                onClick={() => {
                  setSelectedSefer(seforim[0]);
                  setSelectedParsha(parshios[seforim[0] as keyof typeof parshios][0]);
                  if (onParshaSelect) {
                    onParshaSelect(seforim[0], parshios[seforim[0] as keyof typeof parshios][0], 1);
                  }
                  onToggle();
                }}
              >
                {t.start}
              </button>
              <button
                className="quick-action-button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSefer(seforim[0]);
                  setSelectedParsha('');
                  setShowAliyos(false);
                }}
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
