import React, { useState } from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span>תיקון קוראים לתורה</span>
          <ul>
            <li>p78 - shiras hayam</li>
            <li>p85 another issue</li>
            <li>p133 third-to-last line pesucha issue (no space should be allowed so it can be open)</li>
            <li>p139</li>
            <li>p151</li>
            <li>p225</li>
            <li>p228</li>
            <li>p231</li>
            <li>p242, p243 - haazinu</li>
          </ul>
          <button 
            className="help-button"
            onClick={() => setShowHelp(!showHelp)}
          >
            עזרה
          </button>
        </div>
        
        {showHelp && (
          <div className="help-panel">
            <h4>קיצורי מקלדת:</h4>
            <ul>
              <li><kbd>←</kbd> או <kbd>H</kbd> - עמוד קודם</li>
              <li><kbd>→</kbd> או <kbd>L</kbd> - עמוד הבא</li>
              <li><kbd>N</kbd> או <kbd>Space</kbd> - הצג/הסתר ניקוד</li>
            </ul>
            
            <h4>שימוש במכשיר נייד:</h4>
            <ul>
              <li>הקש על הכפתורים בחלק העליון</li>
              <li>גלול כדי לקרוא את הטקסט</li>
              <li>השתמש בזום למסך קטן יותר</li>
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
};
