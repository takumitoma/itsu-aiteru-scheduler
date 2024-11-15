interface TimeSlotTooltipProps {
  tooltipData: { x: number; y: number; content: React.ReactNode } | null;
}

export default function TimeSlotTooltip({ tooltipData }: TimeSlotTooltipProps) {
  if (!tooltipData) return null;

  return (
    <div
      className="z-20 fixed"
      style={{
        left: tooltipData.x,
        top: tooltipData.y,
        transform: 'translate(-50%, 8px)',
      }}
    >
      {tooltipData.content}
    </div>
  );
}
