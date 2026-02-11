import React, { useState } from 'react';
import { useLanguage } from '../../i18n';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span>{t.tikkunForTorah}</span>
          <button
            className="help-button"
            onClick={() => setShowHelp(!showHelp)}
          >
            {t.help}
          </button>
        </div>

        {showHelp && (
          <div className="help-panel">
            <h4>{t.keyboardShortcuts}</h4>
            <ul>
              <li><kbd>&larr;</kbd> / <kbd>H</kbd> &mdash; {t.prevPage}</li>
              <li><kbd>&rarr;</kbd> / <kbd>L</kbd> &mdash; {t.nextPage}</li>
              <li><kbd>N</kbd> / <kbd>Space</kbd> &mdash; {t.toggleNikud}</li>
            </ul>

            <h4>{t.mobileUsage}</h4>
            <ul>
              <li>{t.mobileTapButtons}</li>
              <li>{t.mobileScrollText}</li>
              <li>{t.mobileZoom}</li>
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
};
