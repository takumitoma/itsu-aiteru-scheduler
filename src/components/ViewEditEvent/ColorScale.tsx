import { useState, useEffect } from 'react';
import { Participant } from '@/types/Participant';

interface ColorScaleProps {
  displayColors: string[];
  numParticipants: number;
  selectedColorScaleIndex: number | null;
  setSelectedColorScaleIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedParticipant: (participant: Participant | null) => void;
  getColorRangeText: (index: number) => string;
}

export function ColorScale({
  displayColors,
  numParticipants,
  selectedColorScaleIndex,
  setSelectedColorScaleIndex,
  setSelectedParticipant,
  getColorRangeText,
}: ColorScaleProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // to fix hydration mismatch with next-themes
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleClick(e: React.MouseEvent<HTMLElement>, index: number) {
    e.preventDefault();
    setSelectedParticipant(null);
    setSelectedColorScaleIndex((prevIndex) =>
      prevIndex !== null && prevIndex === index ? null : index,
    );
  }

  return (
    <section className="flex w-full items-center space-x-1 sm:px-8">
      <span className="whitespace-nowrap">{`0/${numParticipants}`}</span>
      <div className="flex w-full border border-foreground">
        {displayColors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={`flex h-[30px] w-full cursor-pointer items-center justify-center border-foreground ${
              hoveredIndex === index && selectedColorScaleIndex !== index
                ? 'border-2 opacity-60'
                : ''
            } ${selectedColorScaleIndex === index ? 'border-2 font-bold opacity-100' : ''} `}
            style={isMounted ? { backgroundColor: color } : undefined}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onClick={(e) => handleClick(e, index)}
          >
            {(hoveredIndex === index || selectedColorScaleIndex === index) && (
              <span className="text-sm leading-none text-foreground">
                {getColorRangeText(index)}
              </span>
            )}
          </button>
        ))}
      </div>
      <span className="whitespace-nowrap">{`${numParticipants}/${numParticipants}`}</span>
    </section>
  );
}
