import { TimeLabels } from './TimeLabels';
import { DayLabels } from './DayLabels';

interface AvailabilityChartProps {
  isLoading: boolean;
  hourLabels: number[];
  timeRangeEnd: number;
  dateType: 'specific' | 'week';
  dayLabels: string[];
  children: React.ReactNode;
}

export function AvailabilityChart({
  isLoading,
  hourLabels,
  timeRangeEnd,
  dateType,
  dayLabels,
  children,
}: AvailabilityChartProps) {
  return (
    <section
      className={`flex w-full select-none justify-center ${
        isLoading ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <TimeLabels
        hourLabels={hourLabels}
        timeRangeEnd={timeRangeEnd}
        spaceTop={dateType === 'specific' ? 56 : 32}
      />
      <div id="scrollableContainer" className="flex flex-col overflow-x-auto">
        <DayLabels dateType={dateType} dayLabels={dayLabels} />
        {children}
      </div>
    </section>
  );
}
