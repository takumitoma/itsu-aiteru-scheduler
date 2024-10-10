import TimeLabels from './TimeLabels';
import DayLabels from './DayLabels';
import TimeSlotsEditor from './TimeSlotsEditor';
import TimeSlotsViewer from './TimeSlotsViewer';

interface AvailabilityChartProps {
  isEditing: boolean;
  viewBoxes: Set<number>[];
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  daysOfWeek: number[] | null;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  isEditing,
  viewBoxes,
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek,
}) => {
  // computations for x and y axis labels of the chart
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
          <TimeSlotsEditor
            initialTimeSlots={viewBoxes}
            filteredDaysOfWeekLabels={filteredDaysOfWeekLabels}
            hourLabels={hourLabels}
            timeRangeStart={timeRangeStart}
          />
        ) : (
          <TimeSlotsViewer
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
