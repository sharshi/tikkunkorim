// Parsha calendar logic for current year (placeholder)
// This is a simplified placeholder. Replace with real data or logic as needed.

type ParshaCalendar = Record<string, string>;

const calendars: Record<'israel' | 'chul', ParshaCalendar> = {
  israel: {
    // Format: 'MM/DD/YYYY': 'Parsha Name'
    '06/14/2025': 'בהעלותך',
    '06/21/2025': 'שלח',
    '06/28/2025': 'קרח',
    '07/05/2025': 'חקת',
    '07/12/2025': 'בלק',
    '07/19/2025': 'פנחס',
    '07/26/2025': 'מטות',
    // ...add more dates as needed
  },
  chul: {
    // Format: 'MM/DD/YYYY': 'Parsha Name'
    '06/14/2025': 'בהעלותך',
    '06/21/2025': 'שלח',
    '06/28/2025': 'קרח',
    '07/05/2025': 'חקת',
    '07/12/2025': 'בלק',
    '07/19/2025': 'פנחס',
    '07/26/2025': 'מטות',
    // ...add more dates as needed
  }
};

export function getParshaForDate(date: Date, region: 'israel' | 'chul' = 'israel'): string | null {
  const key = date.toLocaleDateString('en-US');
  return calendars[region][key] || null;
}
