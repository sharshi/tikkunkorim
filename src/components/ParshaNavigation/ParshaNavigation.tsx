import React, { useState, useEffect, useRef } from 'react';
import { seforim, parshios, aliyanames, aliyos } from '../../data/parshadata';
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
  const [selectedSefer, setSelectedSefer] = useState<string>(currentSefer || seforim[0]);
  const [selectedParsha, setSelectedParsha] = useState<string>(currentParsha || '');
  const [showAliyos, setShowAliyos] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Update selected items when current props change
  useEffect(() => {
    if (currentSefer && currentSefer !== selectedSefer) {
      setSelectedSefer(currentSefer);
    }
    if (currentParsha && currentParsha !== selectedParsha) {
      setSelectedParsha(currentParsha);
      setShowAliyos(true);
    }
  }, [currentSefer, currentParsha, selectedSefer, selectedParsha]);

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
    onToggle(); // Close menu after selection
  };

  const getCurrentAliyaData = () => {
    if (selectedParsha && aliyos[selectedParsha as keyof typeof aliyos]) {
      return aliyos[selectedParsha as keyof typeof aliyos];
    }
    return null;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="parsha-nav-backdrop" onClick={onToggle} />}
      
      {/* Menu Toggle Button */}
      <button 
        className={`parsha-nav-toggle ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label="Toggle Parsha Navigation"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Navigation Menu */}
      <div 
        ref={menuRef}
        className={`parsha-navigation ${isOpen ? 'open' : ''}`}
      >
        <div className="parsha-nav-header">
          <h2>ניווט פרשיות</h2>
          <button className="close-button" onClick={onToggle}>
            ✕
          </button>
        </div>

        <div className="parsha-nav-content">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="חפש פרשה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Current Selection Display */}
          {(currentSefer || currentParsha) && (
            <div className="current-selection">
              <span className="current-label">נבחר כעת:</span>
              <div className="current-path">
                {currentSefer && <span className="current-sefer">{currentSefer}</span>}
                {currentParsha && (
                  <>
                    <span className="separator">›</span>
                    <span className="current-parsha">{currentParsha}</span>
                  </>
                )}
                {currentAliya && (
                  <>
                    <span className="separator">›</span>
                    <span className="current-aliya">{aliyanames[currentAliya - 1]}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Seforim Selection */}
          <div className="nav-section">
            <h3>ספרים</h3>
            <div className="seforim-grid">
              {seforim.map((sefer) => (
                <button
                  key={sefer}
                  className={`sefer-button ${selectedSefer === sefer ? 'selected' : ''} ${currentSefer === sefer ? 'current' : ''}`}
                  onClick={() => handleSeferSelect(sefer)}
                  onMouseEnter={() => setHoveredItem(sefer)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="sefer-name">{sefer}</span>
                  <span className="sefer-count">
                    {parshios[sefer as keyof typeof parshios].length} פרשיות
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parshios Selection */}
          {selectedSefer && (
            <div className="nav-section">
              <h3>פרשיות - {selectedSefer}</h3>
              <div className="parshios-grid">
                {filteredParshios.map((parsha) => (
                  <button
                    key={parsha}
                    className={`parsha-button ${selectedParsha === parsha ? 'selected' : ''} ${currentParsha === parsha ? 'current' : ''}`}
                    onClick={() => handleParshaSelect(parsha)}
                    onMouseEnter={() => setHoveredItem(parsha)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="parsha-name">{parsha}</span>
                    {aliyos[parsha as keyof typeof aliyos] && (
                      <span className="aliya-indicator">🔹</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aliyos Selection */}
          {showAliyos && selectedParsha && getCurrentAliyaData() && (
            <div className="nav-section">
              <h3>עליות - {selectedParsha}</h3>
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
                      onMouseEnter={() => setHoveredItem(`${aliyaName}-${index}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span className="aliya-name">{aliyaName}</span>
                      <span className="aliya-range">
                        {(aliyaData as any)[aliyaKey]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="nav-section quick-actions">
            <h3>פעולות מהירות</h3>
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
                <span>🏠</span>
                התחלה
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
                <span>🔄</span>
                איפוס
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
