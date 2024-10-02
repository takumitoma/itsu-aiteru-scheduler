import React from 'react';

const dates = ['日', '月', '火', '水', '木', '金', '土'];

interface WeekCalendarProps {
  selectedDays: number[];
  setSelectedDays: (dates: number[]) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDays, setSelectedDays }) => {
  function toggleWeekday(index: number) {
    const newSelectedDays = selectedDays.includes(index)
      ? selectedDays.filter((day) => day !== index)
      : [...selectedDays, index];
    setSelectedDays(newSelectedDays);
  }

  return (
    <div className="flex mt-1 max-w-md rounded border-gray-300 border-t border-b border-l">
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
  );
};

export default WeekCalendar;
