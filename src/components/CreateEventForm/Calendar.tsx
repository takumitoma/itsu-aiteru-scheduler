import { useState, useEffect, useRef } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useWatch, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BsExclamationCircle } from 'react-icons/bs';
import 'dayjs/locale/ja';
import 'dayjs/locale/en';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

import { daysOfWeekKeys } from '@/constants/days';

interface CalendarProps {
  error?: string;
}

export function Calendar({ error }: CalendarProps) {
  const t = useTranslations('CreateEvent.Calendar');
  const dowT = useTranslations('constants.DaysOfWeek');
  const { setValue, watch } = useFormContext();

  const timezone = watch('selectedTimezone');
  const [currentMonth, setCurrentMonth] = useState(dayjs().tz(timezone));
  const [calendarDays, setCalendarDays] = useState<(dayjs.Dayjs | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<dayjs.Dayjs | null>(null);
  const [dragEnd, setDragEnd] = useState<dayjs.Dayjs | null>(null);
  const isTouchScreen = useRef(false);
  const isUnselectingRef = useRef(false);

  const selectedDates = useWatch({
    name: 'selectedDates',
  });

  // used to unfocus buttons on click
  const prevMonthButtonRef = useRef<HTMLButtonElement>(null);
  const nextMonthButtonRef = useRef<HTMLButtonElement>(null);

  const showWarningMax = selectedDates.length === 31;
  const daysOfWeek = daysOfWeekKeys.map((day) => dowT(day));

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, date: dayjs.Dayjs) {
    e.preventDefault();
    if (!(e.key === ' ' || e.key === 'Enter')) {
      return;
    }

    if (date.isBefore(dayjs().tz(timezone), 'day')) {
      return;
    }

    const dateString = date.format('YYYY-MM-DD');
    const updatedDates = selectedDates.includes(dateString)
      ? selectedDates.filter((d: string) => d !== dateString)
      : [...selectedDates, dateString];

    if (updatedDates.length <= 31) {
      setValue('selectedDates', updatedDates, { shouldValidate: true });
    }
  }

  function handleDragStart(date: dayjs.Dayjs) {
    if (isDragging || date.isBefore(dayjs().tz(timezone), 'day')) {
      return;
    }

    setIsDragging(true);
    setDragStart(date);
    setDragEnd(date);
    isUnselectingRef.current = selectedDates.includes(date.format('YYYY-MM-DD'));
  }

  function handleDragEnter(date: dayjs.Dayjs) {
    if (!isDragging || date.isBefore(dayjs().tz(timezone), 'day')) {
      return;
    }
    setDragEnd(date);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    // get elem currently touched
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    // parse the integer of the elem
    if (elem && elem.textContent) {
      const date = currentMonth.date(parseInt(elem.textContent));
      handleDragEnter(date);
    }
  }

  function handleDragEnd() {
    if (!isDragging || !dragStart || !dragEnd) {
      return;
    }

    // get all dates from where drag started to where drag ended
    const start = dragStart.isBefore(dragEnd) ? dragStart : dragEnd;
    const end = dragStart.isBefore(dragEnd) ? dragEnd : dragStart;
    const affectedDates: string[] = [];
    let current = start;
    while (current.isSameOrBefore(end, 'day')) {
      if (!current.isBefore(dayjs().tz(timezone), 'day')) {
        affectedDates.push(current.format('YYYY-MM-DD'));
      }
      current = current.add(1, 'day');
    }

    // select the dates if selecting and unselect otherwise
    let updatedDates: string[];
    if (isUnselectingRef.current) {
      updatedDates = selectedDates.filter((date: string) => !affectedDates.includes(date));
    } else {
      updatedDates = Array.from(new Set([...selectedDates, ...affectedDates]));
    }

    if (updatedDates.length <= 31) {
      setValue('selectedDates', updatedDates, { shouldValidate: true });
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    isUnselectingRef.current = false;
  }

  function isDateInDragRange(date: dayjs.Dayjs) {
    if (!isDragging || !dragStart || !dragEnd) {
      return false;
    }
    return (
      (date.isSameOrAfter(dragStart, 'day') && date.isSameOrBefore(dragEnd, 'day')) ||
      (date.isSameOrAfter(dragEnd, 'day') && date.isSameOrBefore(dragStart, 'day'))
    );
  }

  function navigatePrevMonth() {
    prevMonthButtonRef.current?.blur();
    const prevMonth = currentMonth.subtract(1, 'month');
    if (prevMonth.isSameOrAfter(dayjs().tz(timezone).startOf('month'))) {
      setCurrentMonth(prevMonth);
    }
  }

  function navigateNextMonth() {
    nextMonthButtonRef.current?.blur();
    setCurrentMonth((prevMonth) => prevMonth.add(1, 'month'));
  }

  // restrict calendar to
  // from current month
  // up to current month - 1 month in the next year
  // use Pacific/Midway because it is the latest time in the world
  const isPrevMonthDisabled = currentMonth.isSame(
    dayjs().tz('Pacific/Midway').startOf('month'),
    'month',
  );
  const maxAllowedMonth = dayjs()
    .tz('Pacific/Midway')
    .add(1, 'year')
    .subtract(1, 'month')
    .endOf('month');
  const isNextMonthDisabled = currentMonth.isSame(maxAllowedMonth, 'month');

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          ref={prevMonthButtonRef}
          type="button"
          onClick={navigatePrevMonth}
          className={`three-d !p-2 ${isPrevMonthDisabled ? 'invisible' : ''}`}
          aria-label={t('prevMonth')}
        >
          <MdNavigateBefore size={20} />
        </button>
        <h2 className="text-xl font-semibold">{currentMonth.format(t('monthFormat'))}</h2>
        <button
          ref={nextMonthButtonRef}
          type="button"
          onClick={navigateNextMonth}
          className={`three-d !p-2 ${isNextMonthDisabled ? 'invisible' : ''}`}
          aria-label={t('nextMonth')}
        >
          <MdNavigateNext size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-300">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center border-b border-r border-gray-300 font-semibold py-2"
          >
            {day}
          </div>
        ))}
        {/* calendar dates */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`text-center border-b border-r border-gray-300 select-none ${
              day && !day.isBefore(dayjs().tz(timezone), 'day') ? 'cursor-pointer' : ''
            }`}
          >
            {day && (
              <div
                className={`py-2 focus:outline-none hover:brightness-90 focus:ring-2 focus:ring-primary 
                    ${day.isSame(dayjs().tz(timezone), 'day') ? 'font-bold' : ''} ${
                      selectedDates.includes(day.format('YYYY-MM-DD'))
                        ? isUnselectingRef.current && isDateInDragRange(day)
                          ? 'bg-gray-300'
                          : 'bg-primary text-white'
                        : day.isBefore(dayjs().tz(timezone), 'day')
                          ? 'text-gray-400 cursor-not-allowed'
                          : isDateInDragRange(day) && !isUnselectingRef.current
                            ? 'bg-primaryLight'
                            : 'bg-background'
                    }`}
                onMouseDown={() => {
                  if (isTouchScreen.current) return;
                  handleDragStart(day);
                }}
                onMouseEnter={() => handleDragEnter(day)}
                onMouseUp={handleDragEnd}
                onTouchStart={() => {
                  isTouchScreen.current = true;
                  handleDragStart(day);
                }}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
                onKeyDown={(e) => handleKeyDown(e, day)}
                {...(day && !day.isBefore(dayjs().tz(timezone), 'day') ? { tabIndex: 0 } : {})}
              >
                {day.date()}
              </div>
            )}
          </div>
        ))}
      </div>
      {error ? (
        <div className="flex text-red-500 pt-4 items-center space-x-2">
          <BsExclamationCircle size={20} />
          <p className="text-sm font-semibold">{t('error')}</p>
        </div>
      ) : showWarningMax ? (
        <p className="text-center pt-4 text-red-500">{t('warning')}</p>
      ) : (
        <p className="text-center pt-4">{t('selectedCount', { count: selectedDates.length })}</p>
      )}
    </div>
  );
}
