import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneDisplayProps {
  timezone: string;
}

export function TimezoneDisplay({ timezone }: TimezoneDisplayProps) {
  const t = useTranslations('constants.Timezones');
  const offset = dayjs().tz(timezone).format('Z');

  return (
    <section>
      <p className="whitespace-nowrap text-sm sm:text-lg">{`(GMT${offset}) ${t(timezone)}`}</p>
    </section>
  );
}
