import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DISPLAY_TIMEZONE = 'America/Los_Angeles';

export function convertHourToDisplayTimezone(hour: number, eventTimezone: string): number {
  const date = dayjs().tz(eventTimezone).hour(hour).minute(0).second(0);
  const convertedHour = date.tz(DISPLAY_TIMEZONE).hour();
  return convertedHour;
}

export function getDisplayTimeLabel(hour: number, eventTimezone: string): string {
  const convertedHour = convertHourToDisplayTimezone(hour, eventTimezone);
  return `${convertedHour}時`;
}
