interface AvailabilityViewerProps {
  viewBoxes: Set<number>[];
  numDays: number;
  numHours: number;
}

const QUARTERS_PER_HOUR = 4;

const AvailabilityViewer: React.FC<AvailabilityViewerProps> = ({
  viewBoxes,
  numDays,
  numHours,
}) => {
  return (
    <div className="flex border-customBlack border-r border-b min-w-max">
      {Array.from({ length: numDays }).map((_, dayIndex) => (
        <div key={`column-${dayIndex}`} className="w-[100px] flex flex-col flex-shrink-0">
          {Array.from({ length: numHours }).map((_, hourIndex) => (
            <div key={`cell-${dayIndex}-${hourIndex}`}>
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = hourIndex * QUARTERS_PER_HOUR + quarter;
                const isSelected = viewBoxes[dayIndex]?.has(timeIndex);
                return (
                  <div
                    key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
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
