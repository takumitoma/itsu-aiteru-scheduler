import React, { useReducer, useEffect, useRef, useCallback, useState } from 'react';

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

type Action =
  | { type: 'SET_BOXES'; payload: Set<number>[] }
  | {
      type: 'UPDATE_BOX';
      payload: { dayIndex: number; timeIndex: number; isAddingTimeSlots: boolean };
    }
  | {
      type: 'UPDATE_RANGE';
      payload: {
        minDay: number;
        maxDay: number;
        minTime: number;
        maxTime: number;
        isAddingTimeSlots: boolean;
        originalSelection: Set<number>[];
      };
    };

// Each Set represents a day and each number in a Set represents the time of the day starting at
// timeRangeStart and in 15 minute intervals. for example, if timeRangeStart is 9, timeRangeEnd
// is 11, and daysOfWeek is [1, 0, 0, 0, 0, 0, 0] and selectedDates is
// [Set {3, 4, 5, 7}, Set {}, Set {}, Set {}, Set {}, Set {}, Set {}] the selected dates and
// times are 9:45-10:30 and 10:45-11:00 of Sunday. The main functionality of this component is to
// precisely show which time slots the user has currently selected for their availability and this
// reducer handles the main logic for that.
const selectedTimeSlotReducer = (state: Set<number>[], action: Action): Set<number>[] => {
  switch (action.type) {
    case 'SET_BOXES':
      return action.payload;
    case 'UPDATE_BOX': {
      // update a single time slot by creating a new Set only for the affected day
      const { dayIndex, timeIndex, isAddingTimeSlots } = action.payload;
      const newState = state.map((set, idx) => (idx === dayIndex ? new Set(set) : set));
      if (isAddingTimeSlots) {
        newState[dayIndex].add(timeIndex);
      } else {
        newState[dayIndex].delete(timeIndex);
      }
      return newState;
    }
    case 'UPDATE_RANGE': {
      // handle range updates, considering original selection and update type
      const { minDay, maxDay, minTime, maxTime, isAddingTimeSlots, originalSelection } =
        action.payload;
      return state.map((set, day) => {
        // create new Sets only for affected days
        if (day < minDay || day > maxDay) {
          return originalSelection[day] || new Set();
        }
        const newSet = new Set(set);
        for (let time = 0; time < TOTAL_QUARTERS_PER_DAY; time++) {
          if (time >= minTime && time <= maxTime) {
            isAddingTimeSlots ? newSet.add(time) : newSet.delete(time);
          } else if (originalSelection[day]?.has(time)) {
            newSet.add(time);
          } else {
            newSet.delete(time);
          }
        }
        return newSet;
      });
    }
    default:
      return state;
  }
};

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  isEditing,
  viewBoxes,
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek,
}) => {
  const [selectedTimeSlots, dispatch] = useReducer(selectedTimeSlotReducer, viewBoxes);
  // temporary selection state for visual feedback during drags
  const [temporarySelection, setTemporarySelection] = useState<Set<number>[]>([]);
  const temporarySelectionRef = useRef<Set<number>[]>([]);

  // refs for tracking drag state without causing re-renders
  const isMouseDragging = useRef(false);
  const isAddingTimeSlots = useRef(false);
  const selectionStartPosition = useRef<{ dayIndex: number; timeIndex: number } | null>(null);

  // show viewBoxes in view mode
  useEffect(() => {
    if (!isEditing) {
      dispatch({ type: 'SET_BOXES', payload: viewBoxes });
    }
  }, [isEditing, viewBoxes]);

  // computations for x and y axis labels of the chart
  const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const filteredDaysOfWeekLabels = daysOfWeek
    ? daysOfWeekLabels.filter((_, index) => daysOfWeek[index] === 1)
    : [];
  const hourLabels = Array.from(
    { length: timeRangeEnd - timeRangeStart },
    (_, index) => timeRangeStart + index,
  );

  // update temporary selection during drag operations
  const updateTemporarySelection = useCallback(
    (dayIndex: number, timeIndex: number) => {
      if (!isEditing || !isMouseDragging.current || !selectionStartPosition.current) return;

      // computation to select in a square during drag
      const minDay = Math.min(selectionStartPosition.current.dayIndex, dayIndex);
      const maxDay = Math.max(selectionStartPosition.current.dayIndex, dayIndex);
      const minTime = Math.min(selectionStartPosition.current.timeIndex, timeIndex);
      const maxTime = Math.max(selectionStartPosition.current.timeIndex, timeIndex);

      // create updated selection based on drag range
      const updatedTemporarySelection = selectedTimeSlots.map((daySet, day) => {
        if (day < minDay || day > maxDay) return daySet;
        const newSet = new Set(daySet);
        for (let time = minTime; time <= maxTime; time++) {
          isAddingTimeSlots.current ? newSet.add(time) : newSet.delete(time);
        }
        return newSet;
      });

      setTemporarySelection(updatedTemporarySelection);
      temporarySelectionRef.current = updatedTemporarySelection;
    },
    [isEditing, selectedTimeSlots],
  );

  const handlePointerDown = useCallback(
    (dayIndex: number, timeIndex: number) => (e: React.PointerEvent) => {
      if (!isEditing) return;
      e.preventDefault();
      isMouseDragging.current = true;
      // determine if we're adding or removing time slots based on initial click
      // if initial cell is selected everything dragged becomes unselected vice versa
      isAddingTimeSlots.current = !selectedTimeSlots[dayIndex].has(timeIndex);
      selectionStartPosition.current = { dayIndex, timeIndex };
      e.currentTarget.releasePointerCapture(e.pointerId);

      updateTemporarySelection(dayIndex, timeIndex);

      // set up pointer up listener to finalize selection
      const handlePointerUp = () => {
        isMouseDragging.current = false;
        selectionStartPosition.current = null;
        dispatch({ type: 'SET_BOXES', payload: temporarySelectionRef.current });
        setTemporarySelection([]);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointerup', handlePointerUp);
    },
    [isEditing, selectedTimeSlots, updateTemporarySelection, dispatch],
  );

  const handlePointerEnter = useCallback(
    (dayIndex: number, timeIndex: number) => () => {
      updateTemporarySelection(dayIndex, timeIndex);
    },
    [updateTemporarySelection],
  );

  return (
    <section className="flex justify-center select-none w-full">
      {/* time labels column */}
      <div className="flex flex-col w-[40px] flex-shrink-0">
        <div className="h-[30px]"></div>
        {hourLabels.map((timestamp) => (
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
        {/* day labels row */}
        <div className="flex h-[30px] min-w-max">
          {filteredDaysOfWeekLabels.map((day, index) => (
            <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
              {day}
            </div>
          ))}
        </div>
        {/* time slot grid */}
        <div className="flex border-customBlack border-r border-b min-w-max">
          {filteredDaysOfWeekLabels.map((day, dayIndex) => (
            <div key={`column-${day}`} className="w-[100px] flex flex-col flex-shrink-0">
              {hourLabels.map((timestamp) => (
                <div key={`cell-${day}-${timestamp}`}>
                  {/* time slot cell */}
                  {[0, 1, 2, 3].map((quarter) => {
                    const timeIndex = (timestamp - timeRangeStart) * QUARTERS_PER_HOUR + quarter;
                    // Determine if the time slot is selected, considering temporary selections
                    // during drag
                    const isSelected =
                      temporarySelection.length > 0
                        ? temporarySelection[dayIndex]?.has(timeIndex)
                        : selectedTimeSlots[dayIndex]?.has(timeIndex);
                    return (
                      <div
                        key={`quarter-${day}-${timestamp}-${quarter}`}
                        className={`w-[100px] h-[15px] border-l border-customBlack touch-none 
                          ${quarter === 0 ? 'border-t' : ''}
                          ${quarter === 2 ? 'border-t border-t-gray-500' : ''}
                          ${isSelected ? 'bg-primary' : 'bg-background'}
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
