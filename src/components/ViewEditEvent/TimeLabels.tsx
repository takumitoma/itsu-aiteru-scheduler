import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTranslations } from 'next-intl';

interface TimeLabelsProps {
  hourLabels: number[];
  timeRangeEnd: number;
  spaceTop: number;
}

export function TimeLabels({ hourLabels, timeRangeEnd, spaceTop }: TimeLabelsProps) {
  const { timeFormat } = useTimeFormatContext();
  const t = useTranslations('ViewEditEvent.TimeLabels');

  function formatTimeDisplay(hour: number) {
    if (timeFormat === 24) {
      return t('time24h', { hour });
    }

    if (hour === 0 || hour === 24) {
      return t('midnight');
    }
    if (hour === 12) {
      return t('noon');
    }

    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? t('am') : t('pm');

    return t('time12h', {
      hour: displayHour,
      period,
    });
  }

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div style={{ height: `${spaceTop}px` }}></div>
      {hourLabels.map((timestamp) => (
        <div
          key={`time-${timestamp}`}
          className="mr-[5px] flex h-[60px] translate-y-[-12px] justify-end"
        >
          {formatTimeDisplay(timestamp)}
        </div>
      ))}
      <div className="mr-[5px] flex h-[25px] translate-y-[-12px] justify-end">
        {formatTimeDisplay(timeRangeEnd)}
      </div>
    </div>
  );
}
