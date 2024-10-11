import TimeLabels from './TimeLabels';
import DayLabels from './DayLabels';

interface AvailabilityChartProps {
  hourLabels: number[];
  timeRangeEnd: number;
  dayLabels: string[];
  children: React.ReactNode;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  hourLabels,
  timeRangeEnd,
  dayLabels,
  children,
}) => {
  return (
    <section className="flex justify-center select-none w-full">
      <TimeLabels hourLabels={hourLabels} timeRangeEnd={timeRangeEnd} />
      <div className="flex flex-col overflow-x-auto">
        <DayLabels dayLabels={dayLabels} />
        {children}
      </div>
    </section>
  );
};

export default AvailabilityChart;
