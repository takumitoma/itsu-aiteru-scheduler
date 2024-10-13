interface ColorScaleProps {
  colorScale: string[];
  numParticipants: number;
}

const ColorScale: React.FC<ColorScaleProps> = ({ colorScale, numParticipants }) => {
  return (
    <section className="flex w-full space-x-1">
      <span className="whitespace-nowrap">{`0/${numParticipants} 会える`}</span>
      <div className="flex w-full border border-foreground">
        {colorScale.map((color, index) => (
          <div key={index} className="w-full" style={{ backgroundColor: color }}>
            &nbsp;
          </div>
        ))}
      </div>
      <span className="whitespace-nowrap">{`${numParticipants}/${numParticipants} 会える`}</span>
    </section>
  );
};

export default ColorScale;
