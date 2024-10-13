import TimeSlot from './TimeSlot';

interface AvailabilityViewerProps {
  heatMap: number[];
  numDays: number;
  numHours: number;
  colorScale: string[];
}

const QUARTERS_PER_HOUR = 4;

const AvailabilityViewer: React.FC<AvailabilityViewerProps> = ({
  heatMap,
  numDays,
  numHours,
  colorScale,
}) => {
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  return (
    <div className="flex border-customBlack border-r border-b min-w-max">
      {Array.from({ length: numDays }).map((_, dayIndex) => (
        <div key={`column-${dayIndex}`} className="w-[100px] flex flex-col flex-shrink-0">
          {Array.from({ length: numHours }).map((_, hourIndex) => (
            <div key={`cell-${dayIndex}-${hourIndex}`}>
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = hourIndex * QUARTERS_PER_HOUR + quarter;
                const slotIndex = dayIndex * numSlotsPerDay + timeIndex;
                const saturation: number = heatMap[slotIndex];
                return (
                  <TimeSlot
                    key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
                    backgroundColor={colorScale[saturation]}
                    isBorderTop={quarter === 0}
                    isDottedBorderTop={quarter === 2}
                    numParticipants={saturation}
                    numTotalParticipants={colorScale.length - 1}
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
