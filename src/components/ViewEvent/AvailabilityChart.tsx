import { useState, useEffect, useRef, useCallback } from 'react';

const QUARTERS_PER_HOUR = 4;
const TOTAL_QUARTERS_PER_DAY = 96; // 24 hours * 4

interface AvailabilityChartProps {
  isEditing: boolean;
  viewBoxes: Set<number>[];
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  daysOfWeek: number[] | null;
}

interface DragState {
  startDay: number;
  startTime: number;
  lastDay: number;
  lastTime: number;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  isEditing,
  viewBoxes,
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek,
}) => {
  // Each Set represents a day and each number in a Set represents the time of the day
  // starting at timeRangeStart and in 15 minute intervals. for example, if timeRangeStart
  // is 9, timeRangeEnd is 11, and daysOfWeek is [1, 0, 0, 0, 0, 0, 0] and selectedDates is
  // [Set {3, 4, 5, 7}, Set {}, Set {}, Set {}, Set {}, Set {}, Set {}] the selected dates and
  // times are 9:45-10:30 and 10:45-11:00 of Sunday. The main functionality of this component
  // is to precisely show which time slots the user has currently selected for their availability.
  const [selectedBoxes, setSelectedBoxes] = useState<Set<number>[]>(viewBoxes);

  const isDragging = useRef(false);
  const isSelecting = useRef(false);
  const dragState = useRef<DragState | null>(null);
  const originalSelection = useRef<Set<number>[]>([]);

  useEffect(() => {
    if (!isEditing) {
      setSelectedBoxes(viewBoxes);
    }
  }, [isEditing, viewBoxes]);

  console.log(selectedBoxes);

  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const selectedDays = daysOfWeek ? days.filter((_, index) => daysOfWeek[index] === 1) : [];
  const timestamps: number[] = Array.from(
    { length: timeRangeEnd - timeRangeStart },
    (_, index) => timeRangeStart + index,
  );

  const updateSelection = useCallback((dayIndex: number, timeIndex: number) => {
    setSelectedBoxes((prevState) => {
      // Create a new Set to avoid mutating the previous state
      const newState = prevState.map((set) => new Set(set));
      if (dayIndex >= 0 && dayIndex < newState.length) {
        if (isSelecting.current) {
          newState[dayIndex].add(timeIndex);
        } else {
          newState[dayIndex].delete(timeIndex);
        }
      }
      return newState;
    });
  }, []);

  const handlePointerDown = useCallback(
    (dayIndex: number, timeIndex: number) => (e: React.PointerEvent) => {
      if (!isEditing) return;
      e.preventDefault();
      isDragging.current = true;
      // Determine if we're selecting or deselecting based on the initial box state
      isSelecting.current = !selectedBoxes[dayIndex]?.has(timeIndex);
      dragState.current = {
        startDay: dayIndex,
        startTime: timeIndex,
        lastDay: dayIndex,
        lastTime: timeIndex,
      };
      // Store the original selection to restore unaffected boxes later, this is needed
      // in the case where you start dragging at box 1 then go to box 2 then go to box 3
      // then back to box 2, box 3 should revert to what it was before the drag.
      originalSelection.current = selectedBoxes.map((set) => new Set(set));

      updateSelection(dayIndex, timeIndex);

      const handlePointerUp = () => {
        isDragging.current = false;
        dragState.current = null;
        originalSelection.current = [];
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointerup', handlePointerUp);
    },
    [isEditing, selectedBoxes, updateSelection],
  );

  const handlePointerEnter = useCallback(
    (dayIndex: number, timeIndex: number) => () => {
      if (!isEditing || !isDragging.current || !dragState.current) return;

      const { startDay, startTime } = dragState.current;

      setSelectedBoxes((prevState) => {
        const newState = prevState.map((set) => new Set(set));

        // this part of the code is necessary to select in a square for drag select
        // Calculate the range of days and times to update
        const minDay = Math.min(startDay, dayIndex);
        const maxDay = Math.max(startDay, dayIndex);
        const minTime = Math.min(startTime, timeIndex);
        const maxTime = Math.max(startTime, timeIndex);

        // Update the selection for all boxes within the dragged range
        for (let day = minDay; day <= maxDay; day++) {
          if (day >= 0 && day < newState.length) {
            for (let time = minTime; time <= maxTime; time++) {
              if (isSelecting.current) {
                newState[day].add(time);
              } else {
                newState[day].delete(time);
              }
            }
          }
        }

        // Restore original selection for boxes outside the current range
        for (let day = 0; day < newState.length; day++) {
          if (day < minDay || day > maxDay) {
            newState[day] = new Set(originalSelection.current[day] || []);
          } else {
            for (let time = 0; time < TOTAL_QUARTERS_PER_DAY; time++) {
              if (time < minTime || time > maxTime) {
                if (originalSelection.current[day]?.has(time)) {
                  newState[day].add(time);
                } else {
                  newState[day].delete(time);
                }
              }
            }
          }
        }

        return newState;
      });

      dragState.current = { ...dragState.current, lastDay: dayIndex, lastTime: timeIndex };
    },
    [isEditing],
  );

  return (
    <section className="flex justify-center select-none w-full">
      <div className="flex flex-col w-[40px] flex-shrink-0">
        <div className="h-[30px]"></div>
        {timestamps.map((timestamp) => (
          <div
            key={`time-${timestamp}`}
            className="flex justify-end mr-[5px] translate-y-[-15px] h-[60px] text-[16px]"
          >
            {timestamp + '時'}
          </div>
        ))}
        <div className="flex justify-end mr-[5px] translate-y-[-15px] h-[25px]">
          {timeRangeEnd + '時'}
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <div className="flex h-[30px] min-w-max">
          {selectedDays.map((day, index) => (
            <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="flex border-customBlack border-r border-b min-w-max">
          {selectedDays.map((day, dayIndex) => (
            <div key={`column-${day}`} className="w-[100px] flex flex-col flex-shrink-0">
              {timestamps.map((timestamp) => (
                <div key={`cell-${day}-${timestamp}`}>
                  {[0, 1, 2, 3].map((quarter) => {
                    const timeIndex = (timestamp - timeRangeStart) * QUARTERS_PER_HOUR + quarter;
                    return (
                      <div
                        key={`quarter-${day}-${timestamp}-${quarter}`}
                        className={`w-[100px] h-[15px] border-l border-customBlack  
                          ${quarter === 0 ? 'border-t' : ''}
                          ${quarter === 2 ? 'border-t border-t-gray-500' : ''}
                          ${
                            selectedBoxes[dayIndex]?.has(timeIndex) ? 'bg-primary' : 'bg-background'
                          }
                          ${isEditing ? 'hover:brightness-90 cursor-pointer' : ''}`}
                        style={{ borderTopStyle: quarter === 2 ? 'dotted' : 'solid' }}
                        onPointerDown={handlePointerDown(dayIndex, timeIndex)}
                        onPointerEnter={handlePointerEnter(dayIndex, timeIndex)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailabilityChart;
