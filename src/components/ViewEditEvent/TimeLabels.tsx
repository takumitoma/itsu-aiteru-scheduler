import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTranslations } from 'next-intl';

interface TimeLabelsProps {
  hourLabels: number[];
  timeRangeEnd: number;
  spaceTop: number;
}

export default function TimeLabels({ hourLabels, timeRangeEnd, spaceTop }: TimeLabelsProps) {
  const { timeFormat } = useTimeFormatContext();
  const t = useTranslations('ViewEditEvent.TimeLabels');

  function formatTimeDisplay(hour: number) {
    if (timeFormat === 24) {
      return `${hour}${t('hour')}`;
    }

    if (hour === 0 || hour === 24) {
      return t('midnight');
    }
    if (hour === 12) {
      return t('noon');
    }

    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? t('am') : t('pm');

    return t('timeFormat', {
      hour: displayHour,
      period: period,
    });
  }

  return (
    <div className="flex flex-col flex-shrink-0">
      <div style={{ height: `${spaceTop}px` }}></div>
      {hourLabels.map((timestamp) => (
        <div
          key={`time-${timestamp}`}
          className="flex justify-end mr-[5px] translate-y-[-12px] h-[60px]"
        >
          {formatTimeDisplay(timestamp)}
        </div>
      ))}
      <div className="flex justify-end mr-[5px] translate-y-[-12px] h-[25px]">
        {formatTimeDisplay(timeRangeEnd)}
      </div>
    </div>
  );
}
