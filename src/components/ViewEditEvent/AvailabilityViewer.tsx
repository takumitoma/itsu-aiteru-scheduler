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
  isParticipantSelected: boolean;
  participantHeatMap: number[];
}

const QUARTERS_PER_HOUR = 4;
const MAX_VISIBLE_COLORS = 20;

const AvailabilityViewer: React.FC<AvailabilityViewerProps> = ({
  heatMap,
  numDays,
  numHours,
  colorScale,
  dateTimeLabels,
  availableParticipantsPerSlot,
  unavailableParticipantsPerSlot,
  isParticipantSelected,
  participantHeatMap,
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  function getDisplayColors() {
    if (colorScale.length <= MAX_VISIBLE_COLORS) {
      return colorScale;
    }
    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    return colorScale.filter((_, index) => index % groupSize === 0);
  }

  const displayColors = getDisplayColors();

  // get color index based on heat map value
  const getColorIndex = (value: number) => {
    if (colorScale.length <= MAX_VISIBLE_COLORS) {
      return value;
    }
    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    return Math.min(Math.floor(value / groupSize), MAX_VISIBLE_COLORS - 1);
  };

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
                  const colorIndex: number = isParticipantSelected
                    ? participantHeatMap[slotIndex] === 1
                      ? displayColors.length - 1
                      : 0
                    : getColorIndex(heatMap[slotIndex]);
                  const numParticipants: number = heatMap[slotIndex];
                  return (
                    <TimeSlot
                      key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
                      backgroundColor={displayColors[colorIndex]}
                      isBorderTop={quarter === 0}
                      isDottedBorderTop={quarter === 2}
                      numParticipants={numParticipants}
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
