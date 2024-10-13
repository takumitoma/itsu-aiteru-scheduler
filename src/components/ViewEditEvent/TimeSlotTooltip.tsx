interface TimeSlotTooltip {
  numParticipants: number;
  numTotalParticipants: number;
}

const TimeSlotTooltip: React.FC<TimeSlotTooltip> = ({ numParticipants, numTotalParticipants }) => {
  return (
    <div
      className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background 
        text-foreground text-sm rounded-md shadow-sm whitespace-nowrap border border-foreground"
    >
      <p>{`${numParticipants}/${numTotalParticipants} 人`}</p>
    </div>
  );
};

export default TimeSlotTooltip;
