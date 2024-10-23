const MILLISECONDS_IN_MINUTE = 1000 * 60;
const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24;
const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * 30;

export function getDateDuration(startDate: Date, endDate: Date): string {
  if (startDate >= endDate) {
    return '0 分';
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMinutes = Math.floor(diffMs / MILLISECONDS_IN_MINUTE);
  const diffHours = Math.floor(diffMs / MILLISECONDS_IN_HOUR);
  const diffDays = Math.floor(diffMs / MILLISECONDS_IN_DAY);
  const diffMonths = Math.floor(diffMs / MILLISECONDS_IN_MONTH);

  if (diffMonths >= 1) {
    return `${diffMonths} ヶ月`;
  } else if (diffDays >= 1) {
    return `${diffDays} 日`;
  } else if (diffHours >= 1) {
    return `${diffHours} 時間`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes} 分`;
  } else {
    return '0 分';
  }
}

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
