const dates = ['日', '月', '火', '水', '木', '金', '土'];

interface WeekCalendarProps {
  selectedDays: number[];
  setSelectedDays: (dates: number[]) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDays, setSelectedDays }) => {
  const showError = selectedDays.length === 0;

  function toggleWeekday(index: number) {
    const newSelectedDays = selectedDays.includes(index)
      ? selectedDays.filter((day) => day !== index)
      : [...selectedDays, index];
    setSelectedDays(newSelectedDays);
  }

  return (
    <div className="max-w-md w-full">
      <label className="text-xl font-medium">曜日を選択</label>
      <p className={`mb-4 text-red-500 ${showError ? '' : 'invisible'}`}>
        少なくとも1日を選択してください
      </p>
      <div
        className={`flex w-full mt-4 rounded ${
          showError ? ' border-2 border-red-500' : 'border-gray-300 border-t border-b border-l'
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
    </div>
  );
};

export default WeekCalendar;
