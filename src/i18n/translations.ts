export type Language = 'he' | 'en';

export interface Translations {
  // App title
  appTitle: string;

  // Header
  pageOf: string;
  nikud: string;
  on: string;
  off: string;
  maxGap: string;
  keyboardHintPage: string;
  keyboardHintParsha: string;
  keyboardHintNikud: string;
  navigationActive: string;
  aliya: string;

  // ParshaNavigation
  parshaNavigation: string;
  sefarim: string;
  parshios: string;
  aliyos: string;
  parshaCount: string;
  displaySettings: string;

  // Loading
  loading: string;
  loadingPages: string;
  loadingPage: string;

  // Errors
  pageNotFound: string;

  // Toast / navigation feedback
  previousParsha: string;
  nextParsha: string;
  navigatedTo: string;

  // Language toggle
  languageToggle: string;
}

const he: Translations = {
  appTitle: '\u05EA\u05B4\u05BC\u05E7\u05BC\u05D5\u05BC\u05DF \u05E7\u05D5\u05B9\u05E8\u05B0\u05D0\u05B4\u05D9\u05DD',

  pageOf: '\u05E2\u05DE\u05D5\u05D3 {current} \u05DE\u05EA\u05D5\u05DA {total}',
  nikud: '\u05E0\u05D9\u05E7\u05D5\u05D3',
  on: 'ON',
  off: 'OFF',
  maxGap: '\u05DE\u05E8\u05D5\u05D5\u05D7 \u05DE\u05E7\u05E1: {gap}',
  keyboardHintPage: '\u2190 \u2192 \u05E2\u05DE\u05D5\u05D3',
  keyboardHintParsha: '\u2191 \u2193 \u05E4\u05E8\u05E9\u05D4',
  keyboardHintNikud: 'N \u05E0\u05D9\u05E7\u05D5\u05D3',
  navigationActive: '\u05E0\u05D9\u05D5\u05D5\u05D8 \u05E4\u05E2\u05D9\u05DC',
  aliya: '\u05E2\u05DC\u05D9\u05D4 {n}',

  parshaNavigation: '\u05E0\u05D9\u05D5\u05D5\u05D8 \u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',
  sefarim: '\u05E1\u05E4\u05E8\u05D9\u05DD',
  parshios: '\u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',
  aliyos: '\u05E2\u05DC\u05D9\u05D5\u05EA',
  parshaCount: '{count} \u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',
  displaySettings: '\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05EA\u05E6\u05D5\u05D2\u05D4',

  loading: '\u05D8\u05D5\u05E2\u05DF...',
  loadingPages: '\u05D8\u05D5\u05E2\u05DF \u05E2\u05DE\u05D5\u05D3\u05D9\u05DD...',
  loadingPage: '\u05D8\u05D5\u05E2\u05DF \u05E2\u05DE\u05D5\u05D3...',

  pageNotFound: '\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0 \u05E2\u05DE\u05D5\u05D3 \u05D6\u05D4',

  previousParsha: '\u05E4\u05E8\u05E9\u05D4 \u05E7\u05D5\u05D3\u05DE\u05EA',
  nextParsha: '\u05E4\u05E8\u05E9\u05D4 \u05D4\u05D1\u05D0\u05D4',
  navigatedTo: '\u05E0\u05D5\u05D5\u05D8 \u05DC{parsha}',

  languageToggle: 'EN',
};

const en: Translations = {
  appTitle: 'Tikkun Korim',

  pageOf: 'Page {current} of {total}',
  nikud: 'Nikud',
  on: 'ON',
  off: 'OFF',
  maxGap: 'Max gap: {gap}',
  keyboardHintPage: '\u2190 \u2192 Page',
  keyboardHintParsha: '\u2191 \u2193 Parsha',
  keyboardHintNikud: 'N Nikud',
  navigationActive: 'Navigation active',
  aliya: 'Aliya {n}',

  parshaNavigation: 'Parsha Navigation',
  sefarim: 'Sefarim',
  parshios: 'Parshios',
  aliyos: 'Aliyos',
  parshaCount: '{count} parshios',
  displaySettings: 'Display Settings',

  loading: 'Loading...',
  loadingPages: 'Loading pages...',
  loadingPage: 'Loading page...',

  pageNotFound: 'Page not found',

  previousParsha: 'Previous parsha',
  nextParsha: 'Next parsha',
  navigatedTo: 'Navigated to {parsha}',

  languageToggle: '\u05E2\u05D1',
};

export const translations: Record<Language, Translations> = { he, en };

/**
 * Simple string interpolation: replaces {key} tokens with values.
 * Example: interpolate("Page {current} of {total}", { current: 5, total: 248 })
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`
  );
}
