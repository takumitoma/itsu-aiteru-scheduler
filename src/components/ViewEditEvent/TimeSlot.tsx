import { useState } from 'react';
import TimeSlotTooltip from './TimeSlotTooltip';

interface TimeSlotProps {
  backgroundColor: string;
  isBorderTop: boolean;
  isDottedBorderTop: boolean;
  numParticipants: number;
  numTotalParticipants: number;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  backgroundColor,
  isBorderTop,
  isDottedBorderTop,
  numParticipants,
  numTotalParticipants,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-[100px] h-[15px] border-l border-customBlack
        ${isBorderTop ? 'border-t' : ''}
        ${isDottedBorderTop && !isHovered ? 'border-t border-t-gray-500' : ''}
        ${isHovered ? 'hover:border-2 hover:border-solid' : ''}
      `}
      style={{
        backgroundColor,
        borderTopStyle: isDottedBorderTop && !isHovered ? 'dotted' : 'solid',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <TimeSlotTooltip
          numParticipants={numParticipants}
          numTotalParticipants={numTotalParticipants}
        />
      )}
    </div>
  );
};

export default TimeSlot;
