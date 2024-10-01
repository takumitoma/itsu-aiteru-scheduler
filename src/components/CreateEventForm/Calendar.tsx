import { useState, useEffect } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface CalendarProps {
  selectedDates: dayjs.Dayjs[];
  setSelectedDates: (dates: dayjs.Dayjs[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDates, setSelectedDates }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarDays, setCalendarDays] = useState<(dayjs.Dayjs | null)[]>([]);

  // set the calendar dates based on the current month
  useEffect(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = endOfMonth.date();

    const days: (dayjs.Dayjs | null)[] = [];

    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(startOfMonth.date(i));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const handleDateClick = (date: dayjs.Dayjs) => {
    if (date.isBefore(dayjs(), 'day')) {
      return;
    }

    const newSelectedDates = selectedDates.some((d) => d.isSame(date, 'day'))
      ? selectedDates.filter((d) => !d.isSame(date, 'day'))
      : [...selectedDates, date];

    if (newSelectedDates.length <= 31) {
      setSelectedDates(newSelectedDates);
    }
  };

  function navigatePrevMonth() {
    const prevMonth = currentMonth.subtract(1, 'month');
    if (prevMonth.isSameOrAfter(dayjs().startOf('month'))) {
      setCurrentMonth(prevMonth);
    }
  }

  function navigateNextMonth() {
    setCurrentMonth((prevMonth) => prevMonth.add(1, 'month'));
  }

  const clearSelection = () => {
    setSelectedDates([]);
  };

  // restrict calendar to
  // from current month
  // up to current month - 1 month in the next year
  const isPrevMonthDisabled = currentMonth.isSame(dayjs().startOf('month'), 'month');
  const maxAllowedMonth = dayjs().add(1, 'year').subtract(1, 'month').endOf('month');
  const isNextMonthDisabled = currentMonth.isSame(maxAllowedMonth, 'month');

  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={navigatePrevMonth}
          className={`p-2 rounded-full hover:bg-gray-200 ${isPrevMonthDisabled ? 'invisible' : ''}`}
          aria-label="navigate to previous month"
        >
          <MdNavigateBefore size={24} />
        </button>
        <h2 className="text-xl font-semibold">{currentMonth.format('YYYY年 M月')}</h2>
        <button
          onClick={navigateNextMonth}
          className={`p-2 rounded-full hover:bg-gray-200 ${isNextMonthDisabled ? 'invisible' : ''}`}
          aria-label="navigate to next month"
        >
          <MdNavigateNext size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-300">
        {/* days of the week row */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div
            key={day}
            className="text-center border-b border-r border-gray-300 font-semibold py-2"
          >
            {day}
          </div>
        ))}
        {/* days in the calendar */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`text-center border-b border-r border-gray-300 select-none ${
              day && !day.isBefore(dayjs(), 'day') ? 'cursor-pointer' : ''
            }`}
          >
            {day && (
              <div
                className={`py-2 ${day.isSame(dayjs(), 'day') ? 'font-bold' : ''} ${
                  selectedDates.some((d) => d.isSame(day, 'day'))
                    ? 'bg-primary text-white'
                    : day.isBefore(dayjs(), 'day')
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-200'
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day.date()}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedDates.length < 31 ? (
        <p className="text-center mt-4">選択数: {selectedDates.length} / 31日</p>
      ) : (
        <p className="text-center mt-4 text-red-500">最大選択数に達しました (31日)</p>
      )}
      <div className="mt-4">
        <button
          onClick={clearSelection}
          className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          選択をクリア
        </button>
      </div>
    </div>
  );
};

export default Calendar;
