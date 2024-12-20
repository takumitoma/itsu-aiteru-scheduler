import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { daysOfWeekKeys } from '@/constants/days';
import { BsExclamationCircle } from 'react-icons/bs';

interface WeekCalendarProps {
  error?: string;
}

export function WeekCalendar({ error }: WeekCalendarProps) {
  const t = useTranslations('CreateEvent.WeekCalendar');
  const dowT = useTranslations('constants.DaysOfWeek');
  const { setValue, watch } = useFormContext();

  const selectedDays = watch('selectedDaysOfWeek');
  const daysOfWeek = daysOfWeekKeys.map((day) => dowT(day));

  function toggleWeekday(index: number) {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = newSelectedDays[index] === 0 ? 1 : 0;
    setValue('selectedDaysOfWeek', newSelectedDays, { shouldValidate: true });
  }

  return (
    <div className="w-full">
      <label>{t('label')}</label>
      <div className="flex w-full mt-6 rounded 'border-gray-300 border-t border-b border-l">
        {daysOfWeek.map((day, index) => (
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
      {error && (
        <div className="flex text-red-500 pt-4 justify-center items-center space-x-2">
          <BsExclamationCircle size={20} />
          <p className="text-sm font-semibold">{t('errorMin')}</p>
        </div>
      )}
    </div>
  );
}
