interface TimeSlotTooltipProps {
  tooltipData: { x: number; y: number; content: React.ReactNode } | null;
}

export function TimeSlotTooltip({ tooltipData }: TimeSlotTooltipProps) {
  if (!tooltipData) return null;

  return (
    <div
      className="fixed z-20"
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
