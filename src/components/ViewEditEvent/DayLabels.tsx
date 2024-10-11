interface DayLabelsProps {
  dayLabels: string[];
}

const DayLabels: React.FC<DayLabelsProps> = ({ dayLabels }) => (
  <div className="flex h-[30px] min-w-max">
    {dayLabels.map((day, index) => (
      <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
        {day}
      </div>
    ))}
  </div>
);

export default DayLabels;
