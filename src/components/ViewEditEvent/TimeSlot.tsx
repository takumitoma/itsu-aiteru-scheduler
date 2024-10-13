import { useState } from 'react';

interface TimeSlotProps {
  backgroundColor: string;
  isBorderTop: boolean;
  isDottedBorderTop: boolean;
  numParticipants: number;
  numTotalParticipants: number;
  onHover: (data: { x: number; y: number; content: React.ReactNode }) => void;
  onLeave: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  backgroundColor,
  isBorderTop,
  isDottedBorderTop,
  numParticipants,
  numTotalParticipants,
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
          className="px-2 py-1 bg-background text-foreground text-sm rounded-md shadow-sm 
            whitespace-nowrap border border-foreground"
        >
          <p>{`${numParticipants}/${numTotalParticipants} 人`}</p>
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
