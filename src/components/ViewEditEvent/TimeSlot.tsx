import { useState } from 'react';

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

  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    setIsHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    onHover({
      x: rect.left + rect.width / 2,
      y: rect.bottom,
      content: (
        <div
          className="px-2 py-1 bg-background text-foreground text-sm rounded-md shadow-sm border 
            border-foreground w-[200px] space-y-1"
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
                  overflow-hidden text-ellipsis max-w-full"
                style={{ minWidth: '0' }}
              >
                {participant}
              </div>
            ))}
            {unavailableParticipants.map((participant) => (
              <div
                key={participant}
                className="border border-foreground px-1 rounded-md opacity-60 whitespace-nowrap 
                  overflow-hidden text-ellipsis max-w-full"
                style={{ minWidth: '0' }}
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
      className={`w-[100px] h-[15px] border-l border-customBlack
        ${isBorderTop ? 'border-t' : ''}
        ${isDottedBorderTop && !isHovered ? 'border-t border-t-gray-500' : ''}
        ${isHovered ? 'hover:border-2 hover:border-solid' : ''}
      `}
      style={{
        backgroundColor,
        borderTopStyle: isDottedBorderTop && !isHovered ? 'dotted' : 'solid',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default TimeSlot;
