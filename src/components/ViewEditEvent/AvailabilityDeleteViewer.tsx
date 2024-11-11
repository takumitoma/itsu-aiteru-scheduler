const QUARTERS_PER_HOUR = 4;

interface AvailabilityDeleteViewerProps {
  selectedTimeSlots: number[] | [];
  numDays: number;
  numHours: number;
}

const AvailabilityDeleteViewer: React.FC<AvailabilityDeleteViewerProps> = ({
  selectedTimeSlots,
  numDays,
  numHours,
}) => {
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  return (
    <div className="flex border-foreground border-r border-b min-w-max">
      {/* day column */}
      {Array.from({ length: numDays }).map((_, dayIndex) => (
        <div key={`column-${dayIndex}`} className="w-[100px] flex flex-col flex-shrink-0">
          {/* hour cell */}
          {Array.from({ length: numHours }).map((_, hourIndex) => (
            <div key={`cell-${dayIndex}-${hourIndex}`}>
              {/* quarter cells within hour cells */}
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = hourIndex * QUARTERS_PER_HOUR + quarter;
                const slotIndex = dayIndex * numSlotsPerDay + timeIndex;
                const isSelected: boolean = selectedTimeSlots[slotIndex] === 1;
                return (
                  <div
                    key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
                    className={`w-[100px] h-[15px] border-l border-foreground touch-none 
                      ${quarter === 0 ? 'border-t' : ''}
                      ${quarter === 2 ? 'border-t border-t-gray-500' : ''}
                      ${isSelected ? 'bg-primary' : 'bg-background'}
                    `}
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

export default AvailabilityDeleteViewer;
