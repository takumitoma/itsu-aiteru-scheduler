import { useCallback, useRef, useState } from 'react';

interface AvailabilityEditorProps {
  selectedTimeSlots: number[];
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<number[]>>;
  numDays: number;
  numHours: number;
}

const QUARTERS_PER_HOUR = 4;

export default function AvailabilityEditor({
  selectedTimeSlots,
  setSelectedTimeSlots,
  numDays,
  numHours,
}: AvailabilityEditorProps) {
  const numSlotsPerDay = numHours * QUARTERS_PER_HOUR;

  // temporary selection state for visual feedback during drags
  const [temporarySelection, setTemporarySelection] = useState<number[]>([]);

  // refs for tracking drag state without causing re-renders
  const isMouseDragging = useRef(false);
  const isAddingTimeSlots = useRef(false);
  const selectionStartPosition = useRef<{ dayIndex: number; timeIndex: number } | null>(null);
  const temporarySelectionRef = useRef<number[]>([]);

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
      const updatedTemporarySelection = [...selectedTimeSlots];
      for (let day = minDay; day <= maxDay; day++) {
        for (let time = minTime; time <= maxTime; time++) {
          const index = day * numSlotsPerDay + time;
          updatedTemporarySelection[index] = isAddingTimeSlots.current ? 1 : 0;
        }
      }

      setTemporarySelection(updatedTemporarySelection);
      temporarySelectionRef.current = updatedTemporarySelection;
    },
    [selectedTimeSlots, numSlotsPerDay],
  );

  const handlePointerDown = useCallback(
    (dayIndex: number, timeIndex: number) => (e: React.PointerEvent) => {
      e.preventDefault();
      isMouseDragging.current = true;
      const slotIndex = dayIndex * numSlotsPerDay + timeIndex;
      // determine if we're adding or removing time slots based on initial click
      isAddingTimeSlots.current = selectedTimeSlots[slotIndex] === 0;
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
    [selectedTimeSlots, updateTemporarySelection, setSelectedTimeSlots, numSlotsPerDay],
  );

  const handlePointerEnter = useCallback(
    (dayIndex: number, timeIndex: number) => () => {
      updateTemporarySelection(dayIndex, timeIndex);
    },
    [updateTemporarySelection],
  );

  return (
    <div className="flex border-foreground border-r border-b min-w-max">
      {/* day column */}
      {Array.from({ length: numDays }).map((_, dayIndex) => (
        <div key={`column-${dayIndex}`} className="w-[100px] flex flex-col flex-shrink-0">
          {/* hour cell */}
          {Array.from({ length: numHours }).map((_, hourIndex) => (
            <div key={`cell-${dayIndex}-${hourIndex}`}>
              {/* quarter cells within hour cells */}
              {[0, 1, 2, 3].map((quarter) => {
                const timeIndex = hourIndex * QUARTERS_PER_HOUR + quarter;
                const slotIndex = dayIndex * numSlotsPerDay + timeIndex;
                const isSelected =
                  temporarySelection.length > 0
                    ? temporarySelection[slotIndex] === 1
                    : selectedTimeSlots[slotIndex] === 1;
                return (
                  <div
                    key={`quarter-${dayIndex}-${hourIndex}-${quarter}`}
                    className={`w-[100px] h-[15px] border-l border-foreground touch-none 
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
}
