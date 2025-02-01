import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

export function TimeSlot({
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
}: TimeSlotProps) {
  const t = useTranslations('ViewEditEvent.TimeSlot');
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
          className={
            'space-y-1 rounded-md border border-foreground bg-background px-2 py-1 ' +
            'text-sm text-foreground'
          }
          style={{ width: `${TOOLTIP_WIDTH}px` }}
        >
          <p className="font-xl font-medium">
            {t('availableCount', {
              available: numParticipants,
              total: numTotalParticipants,
            })}
          </p>
          <p>{dateTimeLabel}</p>
          <div className="flex flex-wrap gap-1">
            {availableParticipants.map((participant) => (
              <div
                key={participant}
                className={
                  'min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap ' +
                  'rounded-md border border-primary px-1'
                }
              >
                {participant}
              </div>
            ))}
            {unavailableParticipants.map((participant) => (
              <div
                key={participant}
                className={
                  'min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap ' +
                  'rounded-md border border-foreground px-1 opacity-60'
                }
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
      className={`h-[15px] w-[100px] border-l border-foreground ${isBorderTop ? 'border-t' : ''} ${
        isDottedBorderTop && !isHovered ? 'border-t border-t-gray-500' : ''
      } ${isHovered ? 'hover:border-2 hover:border-solid' : ''} `}
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
}
