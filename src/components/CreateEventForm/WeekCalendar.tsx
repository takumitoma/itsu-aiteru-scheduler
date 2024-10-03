import { useRef } from 'react';

const dates = ['日', '月', '火', '水', '木', '金', '土'];

interface WeekCalendarProps {
  selectedDays: number[];
  setSelectedDays: (dates: number[]) => void;
  showError: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDays,
  setSelectedDays,
  showError,
}) => {
  const isInteracted = useRef(false);

  const displayError = (showError || isInteracted.current) && selectedDays.length === 0;

  function toggleWeekday(index: number) {
    isInteracted.current = true;
    const newSelectedDays = selectedDays.includes(index)
      ? selectedDays.filter((day) => day !== index)
      : [...selectedDays, index];
    setSelectedDays(newSelectedDays);
  }

  return (
    <div className="max-w-md w-full">
      <label className="text-xl font-medium">曜日を選択</label>
      <div
        className={`flex w-full mt-6 rounded ${
          displayError ? 'border-2 border-red-500' : 'border-gray-300 border-t border-b border-l'
        }`}
      >
        {dates.map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleWeekday(index)}
            className={`py-2 w-full 
              border-gray-300 border-r hover:bg-gray-200 ${
                selectedDays.includes(index) ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
          >
            {day}
          </button>
        ))}
      </div>
      <p className={`mt-4 text-red-500 text-center ${displayError ? '' : 'invisible'}`}>
        少なくとも1日を選択してください
      </p>
    </div>
  );
};

export default WeekCalendar;
