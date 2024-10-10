interface DayLabelsProps {
  filteredDaysOfWeekLabels: string[];
}

const DayLabels: React.FC<DayLabelsProps> = ({ filteredDaysOfWeekLabels }) => (
  <div className="flex h-[30px] min-w-max">
    {filteredDaysOfWeekLabels.map((day, index) => (
      <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
        {day}
      </div>
    ))}
  </div>
);

export default DayLabels;
