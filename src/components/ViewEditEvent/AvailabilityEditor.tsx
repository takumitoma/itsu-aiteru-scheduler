import { useCallback, useRef, useState } from 'react';

interface AvailabilityEditorProps {
  selectedTimeSlots: Set<number>[];
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<Set<number>[]>>;
  filteredDaysOfWeekLabels: string[];
  hourLabels: number[];
  timeRangeStart: number;
}

const QUARTERS_PER_HOUR = 4;

const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({
  selectedTimeSlots,
  setSelectedTimeSlots,
  filteredDaysOfWeekLabels,
  hourLabels,
  timeRangeStart,
}) => {
  // temporary selection state for visual feedback during drags
  const [temporarySelection, setTemporarySelection] = useState<Set<number>[]>([]);

  // refs for tracking drag state without causing re-renders
  const isMouseDragging = useRef(false);
  const isAddingTimeSlots = useRef(false);
  const selectionStartPosition = useRef<{ dayIndex: number; timeIndex: number } | null>(null);
  const temporarySelectionRef = useRef<Set<number>[]>([]);

  // update temporary selection during drag operations
  const updateTemporarySelection = useCallback(
    (dayIndex: number, timeIndex: number) => {
      if (!isMouseDragging.current || !selectionStartPosition.current) return;

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
    [selectedTimeSlots],
  );

  const handlePointerDown = useCallback(
    (dayIndex: number, timeIndex: number) => (e: React.PointerEvent) => {
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
        setSelectedTimeSlots(temporarySelectionRef.current);
        setTemporarySelection([]);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointerup', handlePointerUp);
    },
    [selectedTimeSlots, updateTemporarySelection, setSelectedTimeSlots],
  );

  const handlePointerEnter = useCallback(
    (dayIndex: number, timeIndex: number) => () => {
      updateTemporarySelection(dayIndex, timeIndex);
    },
    [updateTemporarySelection],
  );

  return (
    <div className="flex border-customBlack border-r border-b min-w-max">
      {filteredDaysOfWeekLabels.map((day, dayIndex) => (
        <div key={`column-${day}`} className="w-[100px] flex flex-col flex-shrink-0">
          {hourLabels.map((timestamp) => (
            <div key={`cell-${day}-${timestamp}`}>
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = (timestamp - timeRangeStart) * QUARTERS_PER_HOUR + quarter;
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
                      hover:brightness-90 cursor-pointer`}
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
  );
};

export default AvailabilityEditor;
