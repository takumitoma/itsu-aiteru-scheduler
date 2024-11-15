const MILLISECONDS_IN_MINUTE = 1000 * 60;
const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24;
const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * 30;

// returns how long ago startDate was from endDate
export function getDateDuration(
  startDate: Date,
  endDate: Date,
): {
  value: number;
  unit: 'month' | 'day' | 'hour' | 'minute' | 'zero';
} {
  if (startDate >= endDate) {
    return { value: 0, unit: 'zero' };
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMinutes = Math.floor(diffMs / MILLISECONDS_IN_MINUTE);
  const diffHours = Math.floor(diffMs / MILLISECONDS_IN_HOUR);
  const diffDays = Math.floor(diffMs / MILLISECONDS_IN_DAY);
  const diffMonths = Math.floor(diffMs / MILLISECONDS_IN_MONTH);

  if (diffMonths >= 1) {
    return { value: diffMonths, unit: 'month' };
  } else if (diffDays >= 1) {
    return { value: diffDays, unit: 'day' };
  } else if (diffHours >= 1) {
    return { value: diffHours, unit: 'hour' };
  } else if (diffMinutes >= 1) {
    return { value: diffMinutes, unit: 'minute' };
  }

  return { value: 0, unit: 'zero' };
}

// date returned from supabase is Date type but actually a string. convert it into Date object.
export function parseDate(date: string | Date): Date {
  if (!date) {
    throw new Error('Date input is required');
  }

  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date');
  }

  return parsedDate;
}
