import TimeLabels from './TimeLabels';
import DayLabels from './DayLabels';

interface AvailabilityChartProps {
  isLoading: boolean;
  hourLabels: number[];
  timeRangeEnd: number;
  dayLabels: string[];
  children: React.ReactNode;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  isLoading,
  hourLabels,
  timeRangeEnd,
  dayLabels,
  children,
}) => {
  return (
    <section
      className={`flex justify-center select-none w-full ${
        isLoading ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <TimeLabels hourLabels={hourLabels} timeRangeEnd={timeRangeEnd} />
      <div id="scrollableContainer" className="flex flex-col overflow-x-auto">
        <DayLabels dayLabels={dayLabels} />
        {children}
      </div>
    </section>
  );
};

export default AvailabilityChart;
