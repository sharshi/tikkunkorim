import { LehaderesLetter } from '../types';

// Note: Avoid random glyph substitutions that can change layout unpredictably.
// Any custom glyph shaping should be handled by the font itself, not via HTML entities.

// Remove nikud (vowel points) from Hebrew text
export const removeNikud = (text: string): string => {
  // Hebrew vowel points range: U+05B0-U+05BC, U+05C1-U+05C2, U+05C4-U+05C5, U+05C7
  const nikudRegex = /[\u05B0-\u05BC\u05C1\u05C2\u05C4\u05C5\u05C7]/g;
  return text.replace(nikudRegex, '');
};

// Implements the classic Kri/Ksiv processing from the legacy logic
// withNikud = false:
//  - replace maqaf '־' with a space (twice to catch chains)
//  - remove any content in <...> (KSIV) and any leftover non-Hebrew chars
//  - compress multiple spaces
// withNikud = true:
//  - remove content in [...] (KRI) and the <> delimiters for KSIV
export const processKriKsiv = (txt: string, withNikud: boolean): string => {
  if (!withNikud) {
    return txt
      .replace(/־/g, ' ') // maqaf to space
      .replace(/<.+?>/g, '') // remove KSIV
      .replace(/\s{2,}/g, ' ') // collapse spaces
  .replace(/[^ \u05D0-\u05EA]/g, '') // keep only Alef–Tav + space
      .trim();
  }
  // with nikud: remove KRI (inside square brackets) and strip <>
  return txt
    .replace(/\[[\s\S]*?\]/g, '') // remove KRI
    .replace(/[<>]/g, ''); // drop KSIV brackets only
};

// Process Hebrew text for display with proper spacing and formatting
export const processHebrewText = (
  fragments: string[],
  withNikud: boolean = true,
  _wordGap: number = 0,
  layout?: string
): string[] => {
  // Special case: single fragment with satum layout should split into individual words
  if (fragments.length === 1 && layout?.includes('satum')) {
    const kriKsiv = processKriKsiv(fragments[0], withNikud);
    const processed = withNikud ? kriKsiv : removeNikud(kriKsiv);
    return processed.split(' ').filter(Boolean);
  }
  
  // Default case: apply kri/ksiv handling and optionally remove nikud
  return fragments.map(fragment => {
    const kriKsiv = processKriKsiv(fragment, withNikud);
    return withNikud ? kriKsiv : removeNikud(kriKsiv);
  });
};

// Optional: number to Hebrew letters (gematria) for verse-like labels
const H_LETTERS = [
  'א','ב','ג','ד','ה','ו','ז','ח','ט','י',
  'כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'
];

export function numberToHebrewLetters(n: number): string {
  if (n <= 0) return '';
  // Basic gematria: handle up to 400+ with combinations; keep simple but general
  const units: Record<number, string> = {
    1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט'
  };
  const tens: Record<number, string> = {
    10:'י',20:'כ',30:'ל',40:'מ',50:'נ',60:'ס',70:'ע',80:'פ',90:'צ'
  };
  const hundreds: Record<number, string> = {
    100:'ק',200:'ר',300:'ש',400:'ת'
  };

  let res = '';
  let remaining = n;
  // Hundreds
  const hundredsKeys = [400,300,200,100];
  for (const h of hundredsKeys) {
    while (remaining >= h) {
      res += hundreds[h];
      remaining -= h;
    }
  }
  // Tens
  const tensKeys = [90,80,70,60,50,40,30,20,10];
  for (const t of tensKeys) {
    while (remaining >= t) {
      res += tens[t];
      remaining -= t;
    }
  }
  // Units
  if (remaining > 0) res += units[remaining] || '';
  return res;
}

// Legacy "lehaderes" stretching glyphs and helpers (used to visually stretch letters)
export const stretchBar = String.fromCharCode(0x05F7);

export const lehaderesLetters: LehaderesLetter[] = [
  { os: 'ל', r1: String.fromCharCode(0x05F5), r2: String.fromCharCode(0x05F6) },
  { os: 'ה', r1: String.fromCharCode(0x05F8), r2: String.fromCharCode(0x05F9) },
  { os: 'ד', r1: String.fromCharCode(0x05FA), r2: String.fromCharCode(0x05FB) },
  { os: 'ר', r1: String.fromCharCode(0x05FC), r2: String.fromCharCode(0x05FD) },
  { os: 'ת', r1: String.fromCharCode(0x05FE), r2: String.fromCharCode(0x05FF) }
];

export const isLehaderesChar = (ch: string) =>
  lehaderesLetters.some(l => l.os === ch);

export const makeStretched = (chr: string, widthUnits: number): string => {
  const mapping = lehaderesLetters.find(l => l.os === chr);
  if (!mapping) return chr;
  const count = Math.max(1, Math.round(widthUnits));
  return mapping.r1 + stretchBar.repeat(count) + mapping.r2;
};

// Legacy arrays for displaying verse and aliyah markers
export const misparim = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
  'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ',
  'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל',
  'לא', 'לב', 'לג', 'לד', 'לה', 'לו', 'לז', 'לח', 'לט', 'מ',
  'מא', 'מב', 'מג', 'מד', 'מה', 'מו', 'מז', 'מח', 'מט', 'נ'
];

export const aliyot = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'
];

