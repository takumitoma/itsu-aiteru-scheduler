interface TimeLabelsProps {
  hourLabels: number[];
  timeRangeEnd: number;
  spaceTop: number;
}

const TimeLabels: React.FC<TimeLabelsProps> = ({ hourLabels, timeRangeEnd, spaceTop }) => (
  <div className="flex flex-col w-[40px] flex-shrink-0">
    <div style={{ height: `${spaceTop}px` }}></div>
    {hourLabels.map((timestamp) => (
      <div
        key={`time-${timestamp}`}
        className="flex justify-end mr-[5px] translate-y-[-15px] h-[60px] text-[16px]"
      >
        {timestamp + '時'}
      </div>
    ))}
    <div className="flex justify-end mr-[5px] translate-y-[-15px] h-[25px]">
      {timeRangeEnd + '時'}
    </div>
  </div>
);

export default TimeLabels;
