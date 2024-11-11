import { useState, useEffect } from 'react';

const TOOLTIP_WIDTH = 225; //px

interface TimeSlotProps {
  backgroundColor: string;
  isBorderTop: boolean;
  isDottedBorderTop: boolean;
  numParticipants: number;
  numTotalParticipants: number;
  dateTimeLabel: string;
  availableParticipants: string[];
  unavailableParticipants: string[];
  onHover: (data: { x: number; y: number; content: React.ReactNode }) => void;
  onLeave: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  backgroundColor,
  isBorderTop,
  isDottedBorderTop,
  numParticipants,
  numTotalParticipants,
  dateTimeLabel,
  availableParticipants,
  unavailableParticipants,
  onHover,
  onLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // to fix hydration mismatch with next-themes
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // show tooltip on the bottom and center* of the element that triggered the event
  // * as center as possible
  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    setIsHovered(true);

    const rect = event.currentTarget.getBoundingClientRect();
    let xPosition = rect.left + rect.width / 2;

    // if the content would overflow on the left or right edge, adjust x position accordingly
    if (xPosition + TOOLTIP_WIDTH / 2 > window.innerWidth) {
      xPosition = window.innerWidth - TOOLTIP_WIDTH / 2;
    } else if (xPosition - TOOLTIP_WIDTH / 2 < 0) {
      xPosition = TOOLTIP_WIDTH / 2;
    }
    onHover({
      x: xPosition,
      y: rect.bottom,
      content: (
        <div
          className={`px-2 py-1 bg-background text-foreground text-sm rounded-md shadow-sm border 
            border-foreground space-y-1`}
          style={{ width: `${TOOLTIP_WIDTH}px` }}
        >
          <p className="font-medium font-xl">
            {`${numParticipants}/${numTotalParticipants} 人空いてる`}
          </p>
          <p>{dateTimeLabel}</p>
          <div className="flex flex-wrap gap-1">
            {availableParticipants.map((participant) => (
              <div
                key={participant}
                className="border border-primary px-1 rounded-md whitespace-nowrap 
                  overflow-hidden text-ellipsis max-w-full min-w-0"
              >
                {participant}
              </div>
            ))}
            {unavailableParticipants.map((participant) => (
              <div
                key={participant}
                className="border border-foreground px-1 rounded-md opacity-60 whitespace-nowrap 
                  overflow-hidden text-ellipsis max-w-full min-w-0"
              >
                {participant}
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    onLeave();
  }

  return (
    <div
      className={`w-[100px] h-[15px] border-l border-foreground
        ${isBorderTop ? 'border-t' : ''}
        ${isDottedBorderTop && !isHovered ? 'border-t border-t-gray-500' : ''}
        ${isHovered ? 'hover:border-2 hover:border-solid' : ''}
      `}
      style={
        isMounted
          ? {
              backgroundColor,
              borderTopStyle: isDottedBorderTop && !isHovered ? 'dotted' : 'solid',
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default TimeSlot;
