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
      <div className="'border-gray-300 mt-6 flex w-full rounded border-b border-l border-t">
        {daysOfWeek.map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleWeekday(index)}
            className={`w-full border-r border-gray-300 py-2 hover:bg-gray-200 ${
              selectedDays[index] === 1 ? 'bg-primary text-white hover:bg-primary' : ''
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      {error && (
        <div className="flex items-center justify-center space-x-2 pt-4 text-red-500">
          <BsExclamationCircle size={20} />
          <p className="text-sm font-semibold">{t('errorMin')}</p>
        </div>
      )}
    </div>
  );
}
