import TimeLabels from './TimeLabels';
import DayLabels from './DayLabels';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';

interface AvailabilityChartProps {
  isEditing: boolean;
  viewBoxes: Set<number>[];
  selectedTimeSlots: Set<number>[];
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<Set<number>[]>>;
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  daysOfWeek: number[] | null;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  isEditing,
  viewBoxes,
  selectedTimeSlots,
  setSelectedTimeSlots,
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek,
}) => {
  const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const filteredDaysOfWeekLabels = daysOfWeek
    ? daysOfWeekLabels.filter((_, index) => daysOfWeek[index] === 1)
    : [];
  const hourLabels = Array.from(
    { length: timeRangeEnd - timeRangeStart },
    (_, index) => timeRangeStart + index,
  );

  return (
    <section className="flex justify-center select-none w-full">
      <TimeLabels hourLabels={hourLabels} timeRangeEnd={timeRangeEnd} />
      <div className="flex flex-col overflow-x-auto">
        <DayLabels filteredDaysOfWeekLabels={filteredDaysOfWeekLabels} />
        {isEditing ? (
          <AvailabilityEditor
            selectedTimeSlots={selectedTimeSlots}
            setSelectedTimeSlots={setSelectedTimeSlots}
            filteredDaysOfWeekLabels={filteredDaysOfWeekLabels}
            hourLabels={hourLabels}
            timeRangeStart={timeRangeStart}
          />
        ) : (
          <AvailabilityViewer
            viewBoxes={viewBoxes}
            filteredDaysOfWeekLabels={filteredDaysOfWeekLabels}
            hourLabels={hourLabels}
            timeRangeStart={timeRangeStart}
          />
        )}
      </div>
    </section>
  );
};

export default AvailabilityChart;
