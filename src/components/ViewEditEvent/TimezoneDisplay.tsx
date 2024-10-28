import allTimezones from '@/lib/timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneDisplayProps {
  timezone: string;
}

const TimezoneDisplay: React.FC<TimezoneDisplayProps> = ({ timezone }) => {
  const label = allTimezones[timezone as keyof typeof allTimezones];
  const offset = dayjs().tz(timezone).format('Z');

  return <section className="whitespace-nowrap">{`(GMT${offset}) ${label}`}</section>;
};

export default TimezoneDisplay;