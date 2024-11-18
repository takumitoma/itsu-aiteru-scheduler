import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { daysOfWeekKeys } from '@/constants/days';

interface DayLabelsProps {
  dateType: 'specific' | 'week';
  dayLabels: string[];
}

export default function DayLabels({ dateType, dayLabels }: DayLabelsProps) {
  const t = useTranslations('ViewEditEvent.DayLabels');
  const dowT = useTranslations('constants.DaysOfWeek');

  const daysOfWeek = daysOfWeekKeys.map(day => dowT(day));

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
    <div className="flex py-1 min-w-max flex-col">
      <div className="flex">
        {dayLabels.map((day, index) => (
          <div key={`day-${index}`} className="w-[100px] flex justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="flex font-bold">
        {daysOfWeekLabels.map((dayOfWeek, index) => (
          <div key={`dayOfWeek-${index}`} className="w-[100px] flex justify-center">
            {dayOfWeek}
          </div>
        ))}
      </div>
    </div>
  );
}
