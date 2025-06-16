import React from 'react';
import { tikun } from '../data/tikun';
import { aliyos } from '../data/aliyos';
import { parshios } from '../data/parshios';

interface TextViewProps {
  parsha: string | null;
  aliya: number | null;
  onBack: () => void;
  showNikud: boolean;
  setShowNikud: (val: boolean) => void;
  textSize: 'reg' | 'large' | 'xLarge';
}

// Add type for tikun
type TikunType = typeof tikun;

function getText(parsha: string | null, aliya: number | null): string {
  if (!parsha || !aliya) return '';
  const sefer = Object.keys(parshios).find(sefer => parshios[sefer].includes(parsha));
  if (!sefer || !(tikun as TikunType)[sefer] || !aliyos[parsha] || !aliyos[parsha][aliya]) return '';
  const range = aliyos[parsha][aliya];
  // input = 6:1 16:17 or 17:8 18:5
  const [start, end] = range.split(' ');
  const [startPerek, startPasuk] = start.split(':').map(Number);
  const [endPerek, endPasuk] = end.split(':').map(Number);
  let txt = '';
  let perekObj = (tikun as TikunType)[sefer][startPerek];
  if (startPerek === endPerek) {
    for (let i = startPasuk; i <= endPasuk; i++) {
      txt += (perekObj[i] || '') + ' ';
    }
  } else {
    // go through start perek
    for (let i = startPasuk; perekObj && perekObj[i]; i++) {
      txt += perekObj[i] + ' ';
    }
    // go through middle perakim
    for (let p = startPerek + 1; p < endPerek; p++) {
      perekObj = (tikun as TikunType)[sefer][p];
      for (let i = 1; perekObj && perekObj[i]; i++) {
        txt += perekObj[i] + ' ';
      }
    }
    // go through end perek
    perekObj = (tikun as TikunType)[sefer][endPerek];
    for (let i = 1; i <= endPasuk; i++) {
      txt += (perekObj[i] || '') + ' ';
    }
  }
  return txt.trim();
}

function stripNikud(text: string): string {
  // Remove Hebrew nikud (Unicode range 0591-05C7)
  return text.replace(/[\u0591-\u05C7]/g, '');
}

function renderWithNikudSpans(text: string) {
  // Hebrew nikud Unicode: \u0591-\u05C7, maqaf (U+05BE) and paseq (U+05C0) are visible separators
  return Array.from(text).map((char, i) => {
    if (char === '\u05BE' || char === '־' || char === '\u05C0' || char === '׀' || char === '׃') {
      // Maqaf (Hebrew hyphen) or Paseq
      return <span key={i} className="hebrew-separator">{char}</span>;
    } else if (/[\u0591-\u05C7]/.test(char)) {
      return <span key={i} className="nikud-char">{char}</span>;
    } else {
      return char;
    }
  });
}

const TextView: React.FC<TextViewProps> = ({ parsha, aliya, onBack, showNikud, setShowNikud, textSize }) => {
  let text = getText(parsha, aliya);
  return (
    <div>
      <p>{parsha}, {aliya}</p>
      <div
        className={`tikun-text-view text-size-${textSize}${!showNikud ? ' hide-nikud' : ''}`}
        onClick={() => setShowNikud(!showNikud)}
        style={{ cursor: 'pointer' }}
        title="הצג/הסתר ניקוד"
      >
        {renderWithNikudSpans(text) || '—'}
      </div>
    </div>
  );
};

export default TextView;
