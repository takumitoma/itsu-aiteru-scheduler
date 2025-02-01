import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { daysOfWeekKeys } from '@/constants/days';

interface DayLabelsProps {
  dateType: 'specific' | 'week';
  dayLabels: string[];
}

export function DayLabels({ dateType, dayLabels }: DayLabelsProps) {
  const t = useTranslations('ViewEditEvent.DayLabels');
  const dowT = useTranslations('constants.DaysOfWeek');

  const daysOfWeek = daysOfWeekKeys.map((day) => dowT(day));

  let daysOfWeekLabels: string[] = [];

  if (dateType === 'specific') {
    daysOfWeekLabels = dayLabels.map((date) => {
      const dayOfWeek = dayjs(date).day();
      return daysOfWeek[dayOfWeek];
    });

    dayLabels = dayLabels.map((d) => {
      const [, month, day] = d.split('-');
      // remove leading zeros
      const monthNum = Number(month);
      const dayNum = Number(day);
      return t('dateFormat', { month: monthNum, day: dayNum });
    });
  }

  return (
    <div className="flex min-w-max flex-col py-1">
      <div className="flex">
        {dayLabels.map((day, index) => (
          <div key={`day-${index}`} className="flex w-[100px] justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="flex font-bold">
        {daysOfWeekLabels.map((dayOfWeek, index) => (
          <div key={`dayOfWeek-${index}`} className="flex w-[100px] justify-center">
            {dayOfWeek}
          </div>
        ))}
      </div>
    </div>
  );
}
