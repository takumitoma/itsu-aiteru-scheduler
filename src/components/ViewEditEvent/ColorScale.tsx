import { useState } from 'react';

interface ColorScaleProps {
  colorScale: string[];
  displayColors: string[];
  numParticipants: number;
}

const ColorScale: React.FC<ColorScaleProps> = ({ colorScale, displayColors, numParticipants }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // get the range of colorScale indices by displayColors index
  function getColorRangeText(index: number) {
    // determine size of each color group, take ceiling to ensure all colors are covered
    const groupSize = Math.ceil(colorScale.length / displayColors.length);
    const start = index * groupSize;
    // get the last colorScake index in this display color's group
    // naively it is the start of the next group minus 1, but with edge case,
    // take the min of naive solution and last color index to avoid going out of bounds
    const end = Math.min((index + 1) * groupSize - 1, colorScale.length - 1);
    return start === end ? `${start}` : `${start}-${end}`;
  }

  function handleClick(e: React.MouseEvent<HTMLElement>, index: number) {
    e.preventDefault();
    setSelectedIndex(selectedIndex === index ? null : index);
  }

  return (
    <section className="flex w-full space-x-1">
      <span className="whitespace-nowrap">{`0 人`}</span>
      <div className="flex w-full border border-foreground">
        {displayColors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={`w-full h-6 flex items-center justify-center cursor-pointer border-foreground
              ${hoveredIndex === index && selectedIndex !== index ? 'border-2 opacity-60' : ''}
              ${selectedIndex === index ? 'border-2 opacity-100' : ''}
            `}
            style={{ backgroundColor: color }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onClick={(e) => handleClick(e, index)}
          >
            {(hoveredIndex === index || selectedIndex === index) && (
              <span className="text-customBlack text-xs font-medium leading-none">
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
