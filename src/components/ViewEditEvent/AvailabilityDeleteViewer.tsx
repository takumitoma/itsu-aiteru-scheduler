const QUARTERS_PER_HOUR = 4;

interface AvailabilityDeleteViewerProps {
  selectedTimeSlots: number[] | [];
  numDays: number;
  numHours: number;
}

export function AvailabilityDeleteViewer({
  selectedTimeSlots,
  numDays,
  numHours,
}: AvailabilityDeleteViewerProps) {
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  return (
    <div className="flex min-w-max border-b border-r border-foreground">
      {/* day column */}
      {Array.from({ length: numDays }).map((_, dayIndex) => (
        <div key={`column-${dayIndex}`} className="flex w-[100px] flex-shrink-0 flex-col">
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
                    className={`h-[15px] w-[100px] touch-none border-l border-foreground ${
                      quarter === 0 ? 'border-t' : ''
                    } ${quarter === 2 ? 'border-t border-t-gray-500' : ''} ${
                      isSelected ? 'bg-primary' : 'bg-background'
                    } `}
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
}
