import { useState, useEffect } from 'react';
import TimeSlot from './TimeSlot';
import TimeSlotTooltip from './TimeSlotTooltip';

interface AvailabilityViewerProps {
  heatMap: number[];
  numDays: number;
  numHours: number;
  colorScale: string[];
  dateTimeLabels: string[];
  availableParticipantsPerSlot: string[][];
  unavailableParticipantsPerSlot: string[][];
}

const QUARTERS_PER_HOUR = 4;

const AvailabilityViewer: React.FC<AvailabilityViewerProps> = ({
  heatMap,
  numDays,
  numHours,
  colorScale,
  dateTimeLabels,
  availableParticipantsPerSlot,
  unavailableParticipantsPerSlot,
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  // if the tooltip is open and the page is hovered, close the tooltip
  useEffect(() => {
    function handleScroll() {
      setTooltipData(null);
    }

    document.addEventListener('scroll', handleScroll);
    const scrollableContainer = document.getElementById('scrollableContainer');
    if (scrollableContainer) {
      scrollableContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('scroll', handleScroll);
      if (scrollableContainer) {
        scrollableContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* the grid */}
      <div className="flex border-customBlack border-r border-b min-w-max">
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
                  const saturation: number = heatMap[slotIndex];
                  return (
                    <TimeSlot
                      key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
                      backgroundColor={colorScale[saturation]}
                      isBorderTop={quarter === 0}
                      isDottedBorderTop={quarter === 2}
                      numParticipants={saturation}
                      numTotalParticipants={colorScale.length - 1}
                      dateTimeLabel={dateTimeLabels[slotIndex]}
                      availableParticipants={availableParticipantsPerSlot[slotIndex]}
                      unavailableParticipants={unavailableParticipantsPerSlot[slotIndex]}
                      onHover={setTooltipData}
                      onLeave={() => setTooltipData(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
      <TimeSlotTooltip tooltipData={tooltipData} />
    </div>
  );
};

export default AvailabilityViewer;
