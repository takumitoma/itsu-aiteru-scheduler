import dayjs from 'dayjs';

const DAYS_OF_WEEK_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

interface DayLabelsProps {
  dateType: 'specific' | 'week';
  dayLabels: string[];
}

const DayLabels: React.FC<DayLabelsProps> = ({ dateType, dayLabels }) => {
  let daysOfWeekLabels: string[] = [];

  if (dateType === 'specific') {
    daysOfWeekLabels = dayLabels.map((date) => {
      const dayOfWeek = dayjs(date).day();
      return DAYS_OF_WEEK_LABELS[dayOfWeek];
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
};

export default DayLabels;
