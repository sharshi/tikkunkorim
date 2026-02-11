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

  // Footer
  tikkunForTorah: string;
  help: string;
  keyboardShortcuts: string;
  prevPage: string;
  nextPage: string;
  toggleNikud: string;
  mobileUsage: string;
  mobileTapButtons: string;
  mobileScrollText: string;
  mobileZoom: string;

  // ParshaNavigation
  parshaNavigation: string;
  searchParsha: string;
  currentlySelected: string;
  sefarim: string;
  parshios: string;
  aliyos: string;
  quickActions: string;
  start: string;
  reset: string;
  parshaCount: string;

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

  tikkunForTorah: '\u05EA\u05D9\u05E7\u05D5\u05DF \u05E7\u05D5\u05E8\u05D0\u05D9\u05DD \u05DC\u05EA\u05D5\u05E8\u05D4',
  help: '\u05E2\u05D6\u05E8\u05D4',
  keyboardShortcuts: '\u05E7\u05D9\u05E6\u05D5\u05E8\u05D9 \u05DE\u05E7\u05DC\u05D3\u05EA:',
  prevPage: '\u05E2\u05DE\u05D5\u05D3 \u05E7\u05D5\u05D3\u05DD',
  nextPage: '\u05E2\u05DE\u05D5\u05D3 \u05D4\u05D1\u05D0',
  toggleNikud: '\u05D4\u05E6\u05D2/\u05D4\u05E1\u05EA\u05E8 \u05E0\u05D9\u05E7\u05D5\u05D3',
  mobileUsage: '\u05E9\u05D9\u05DE\u05D5\u05E9 \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05E0\u05D9\u05D9\u05D3:',
  mobileTapButtons: '\u05D4\u05E7\u05E9 \u05E2\u05DC \u05D4\u05DB\u05E4\u05EA\u05D5\u05E8\u05D9\u05DD \u05D1\u05D7\u05DC\u05E7 \u05D4\u05E2\u05DC\u05D9\u05D5\u05DF',
  mobileScrollText: '\u05D2\u05DC\u05D5\u05DC \u05DB\u05D3\u05D9 \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8',
  mobileZoom: '\u05D4\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D6\u05D5\u05DD \u05DC\u05DE\u05E1\u05DA \u05E7\u05D8\u05DF \u05D9\u05D5\u05EA\u05E8',

  parshaNavigation: '\u05E0\u05D9\u05D5\u05D5\u05D8 \u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',
  searchParsha: '\u05D7\u05E4\u05E9 \u05E4\u05E8\u05E9\u05D4...',
  currentlySelected: '\u05E0\u05D1\u05D7\u05E8 \u05DB\u05E2\u05EA:',
  sefarim: '\u05E1\u05E4\u05E8\u05D9\u05DD',
  parshios: '\u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',
  aliyos: '\u05E2\u05DC\u05D9\u05D5\u05EA',
  quickActions: '\u05E4\u05E2\u05D5\u05DC\u05D5\u05EA \u05DE\u05D4\u05D9\u05E8\u05D5\u05EA',
  start: '\u05D4\u05EA\u05D7\u05DC\u05D4',
  reset: '\u05D0\u05D9\u05E4\u05D5\u05E1',
  parshaCount: '{count} \u05E4\u05E8\u05E9\u05D9\u05D5\u05EA',

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

  tikkunForTorah: 'Tikkun Korim for Torah',
  help: 'Help',
  keyboardShortcuts: 'Keyboard shortcuts:',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  toggleNikud: 'Show/hide nikud',
  mobileUsage: 'Mobile usage:',
  mobileTapButtons: 'Tap the buttons at the top',
  mobileScrollText: 'Scroll to read the text',
  mobileZoom: 'Use zoom for smaller screens',

  parshaNavigation: 'Parsha Navigation',
  searchParsha: 'Search parsha...',
  currentlySelected: 'Currently selected:',
  sefarim: 'Sefarim',
  parshios: 'Parshios',
  aliyos: 'Aliyos',
  quickActions: 'Quick Actions',
  start: 'Start',
  reset: 'Reset',
  parshaCount: '{count} parshios',

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
