import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { DAYS_OF_WEEK } from '@/constants/days';

interface WeekCalendarProps {
  selectedDays: number[];
  setSelectedDays: React.Dispatch<React.SetStateAction<number[]>>;
  showError: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDays,
  setSelectedDays,
  showError,
}) => {
  const t = useTranslations('CreateEvent.WeekCalendar');
  const locale = useLocale() as 'ja' | 'en';
  const isInteracted = useRef(false);

  const displayError = (showError || isInteracted.current) && !selectedDays.includes(1);

  function toggleWeekday(index: number) {
    isInteracted.current = true;
    setSelectedDays((prevState) => {
      const newSelectedDays = [...prevState];
      newSelectedDays[index] = newSelectedDays[index] === 0 ? 1 : 0;
      return newSelectedDays;
    });
  }

  return (
    <div className="w-full">
      <label>{t('label')}</label>
      <div
        className={`flex w-full mt-6 rounded ${
          displayError ? 'border-2 border-red-500' : 'border-gray-300 border-t border-b border-l'
        }`}
      >
        {DAYS_OF_WEEK[locale].map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleWeekday(index)}
            className={`py-2 w-full 
              border-gray-300 border-r hover:bg-gray-200 ${
                selectedDays[index] === 1 ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
          >
            {day}
          </button>
        ))}
      </div>
      <p className={`mt-4 text-red-500 text-center ${displayError ? '' : 'invisible'}`}>
        {t('errorMin')}
      </p>
    </div>
  );
};

export default WeekCalendar;
