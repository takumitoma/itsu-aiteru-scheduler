import { useTimeFormatContext } from '@/providers/TimeFormatContext';

interface TimeLabelsProps {
  hourLabels: number[];
  timeRangeEnd: number;
  spaceTop: number;
}

const TimeLabels: React.FC<TimeLabelsProps> = ({ hourLabels, timeRangeEnd, spaceTop }) => {
  const { timeFormat } = useTimeFormatContext();

  function formatTimeDisplay(hour: number) {
    if (timeFormat === 24) {
      return `${hour}時`;
    }

    if (hour === 0 || hour === 24) {
      return '午前0時';
    }
    if (hour === 12) {
      return '正午';
    }

    const period = hour < 12 ? '午前' : '午後';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${period}${displayHour}時`;
  }

  return (
    <div className="flex flex-col w-[40px] flex-shrink-0">
      <div style={{ height: `${spaceTop}px` }}></div>
      {hourLabels.map((timestamp) => (
        <div
          key={`time-${timestamp}`}
          className="flex justify-end mr-[5px] translate-y-[-15px] h-[60px] text-[16px]"
        >
          {formatTimeDisplay(timestamp)}
        </div>
      ))}
      <div className="flex justify-end mr-[5px] translate-y-[-15px] h-[25px]">
        {formatTimeDisplay(timeRangeEnd)}
      </div>
    </div>
  );
};

export default TimeLabels;
