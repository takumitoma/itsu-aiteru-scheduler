const MAX_VISIBLE_COLORS = 20;

interface ColorScaleProps {
  colorScale: string[];
  numParticipants: number;
}

const ColorScale: React.FC<ColorScaleProps> = ({ colorScale, numParticipants }) => {
  function getDisplayColors() {
    if (colorScale.length <= MAX_VISIBLE_COLORS) {
      return colorScale;
    }

    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    return colorScale.filter((_, index) => index % groupSize === 0);
  }

  const displayColors = getDisplayColors();

  return (
    <section className="flex w-full space-x-1">
      <span className="whitespace-nowrap">{`0 人`}</span>
      <div className="flex w-full border border-foreground">
        {displayColors.map((color, index) => (
          <div key={index} className="w-full h-6" style={{ backgroundColor: color }} />
        ))}
      </div>
      <span className="whitespace-nowrap">{`${numParticipants} 人`}</span>
    </section>
  );
};

export default ColorScale;
