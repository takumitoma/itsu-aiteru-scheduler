interface AvailabilityViewerProps {
  viewBoxes: Set<number>[];
  filteredDaysOfWeekLabels: string[];
  hourLabels: number[];
  timeRangeStart: number;
}

const QUARTERS_PER_HOUR = 4;

const AvailabilityViewer: React.FC<AvailabilityViewerProps> = ({
  viewBoxes,
  filteredDaysOfWeekLabels,
  hourLabels,
  timeRangeStart,
}) => {
  return (
    <div className="flex border-customBlack border-r border-b min-w-max">
      {filteredDaysOfWeekLabels.map((day, dayIndex) => (
        <div key={`column-${day}`} className="w-[100px] flex flex-col flex-shrink-0">
          {hourLabels.map((timestamp) => (
            <div key={`cell-${day}-${timestamp}`}>
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = (timestamp - timeRangeStart) * QUARTERS_PER_HOUR + quarter;
                const isSelected = viewBoxes[dayIndex]?.has(timeIndex);
                return (
                  <div
                    key={`quarter-${day}-${timestamp}-${quarter}`}
                    className={`w-[100px] h-[15px] border-l border-customBlack
                      ${quarter === 0 ? 'border-t' : ''}
                      ${quarter === 2 ? 'border-t border-t-gray-500' : ''}
                      ${isSelected ? 'bg-primary' : 'bg-background'}`}
                    style={{ borderTopStyle: quarter === 2 ? 'dotted' : 'solid' }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityViewer;
