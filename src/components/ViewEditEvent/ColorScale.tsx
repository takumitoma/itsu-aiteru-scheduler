import { useState } from 'react';
import { Participant } from '@/types/Participant';

interface ColorScaleProps {
  displayColors: string[];
  numParticipants: number;
  selectedColorScaleIndex: number | null;
  setSelectedColorScaleIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedParticipant: (participant: Participant | null) => void;
  getColorRangeText: (index: number) => string;
}

const ColorScale: React.FC<ColorScaleProps> = ({
  displayColors,
  numParticipants,
  selectedColorScaleIndex,
  setSelectedColorScaleIndex,
  setSelectedParticipant,
  getColorRangeText,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function handleClick(e: React.MouseEvent<HTMLElement>, index: number) {
    e.preventDefault();
    setSelectedParticipant(null);
    setSelectedColorScaleIndex((prevIndex) =>
      prevIndex !== null && prevIndex === index ? null : index,
    );
  }

  return (
    <section className="flex w-full space-x-1 sm:px-8 items-center">
      <span className="whitespace-nowrap">{`0 人`}</span>
      <div className="flex w-full border border-foreground">
        {displayColors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={`w-full h-[30px] flex items-center justify-center cursor-pointer 
              border-foreground 
              ${
                hoveredIndex === index && selectedColorScaleIndex !== index
                  ? 'border-2 opacity-60'
                  : ''
              }
              ${selectedColorScaleIndex === index ? 'border-2 opacity-100 font-bold' : ''}
            `}
            style={{ backgroundColor: color }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onClick={(e) => handleClick(e, index)}
          >
            {(hoveredIndex === index || selectedColorScaleIndex === index) && (
              <span className="text-customBlack text-sm leading-none">
                {getColorRangeText(index)}
              </span>
            )}
          </button>
        ))}
      </div>
      <span className="whitespace-nowrap">{`${numParticipants} 人`}</span>
    </section>
  );
};

export default ColorScale;
