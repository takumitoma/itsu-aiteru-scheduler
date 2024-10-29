import { getDisplayTimeLabel } from '@/utils/timezoneConversions';

interface TimeLabelsProps {
  hourLabels: number[];
  timeRangeEnd: number;
  spaceTop: number;
  eventTimezone: string;
}

const TimeLabels: React.FC<TimeLabelsProps> = ({
  hourLabels,
  timeRangeEnd,
  spaceTop,
  eventTimezone,
}) => (
  <div className="flex flex-col w-[40px] flex-shrink-0">
    <div style={{ height: `${spaceTop}px` }}></div>
    {hourLabels.map((timestamp) => (
      <div
        key={`time-${timestamp}`}
        className="flex justify-end mr-[5px] translate-y-[-15px] h-[60px] text-[16px]"
      >
        {getDisplayTimeLabel(timestamp, eventTimezone)}
      </div>
    ))}
    <div className="flex justify-end mr-[5px] translate-y-[-15px] h-[25px]">
      {getDisplayTimeLabel(timeRangeEnd, eventTimezone)}
    </div>
  </div>
);

export default TimeLabels;
