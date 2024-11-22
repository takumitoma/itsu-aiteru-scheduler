import { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { UseFormRegisterReturn, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import { TimezoneKey, timezoneKeys } from '@/constants/timezone';
import { timezoneKeys } from '@/constants/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneSelectorProps {
  register: UseFormRegisterReturn;
}

export function TimezoneSelector({ register }: TimezoneSelectorProps) {
  const t = useTranslations('CreateEvent.TimezoneSelector');
  const tzT = useTranslations('constants.Timezones');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();

  const currentValue = watch('selectedTimezone');

  // detect user's timezone
  // useEffect(() => {
  //   try {
  //     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //     if (timeZone && timezoneKeys.includes(timeZone as TimezoneKey)) {
  //       onChange(timeZone);
  //       return;
  //     }

  //     const dayjsTimezone = dayjs.tz.guess();
  //     if (dayjsTimezone && timezoneKeys.includes(dayjsTimezone as TimezoneKey)) {
  //       onChange(dayjsTimezone);
  //     }
  //   } catch {
  //     // keep default
  //   }
  // }, [onChange]);

  // generate the '(GMTZZ:ZZ) Label' format to display in dropdown
  // 1. get offSet minutes of all timezones
  // 2. sort timezones by offset in ascending order
  // 3. destructure the offset minutes
  const formattedTimezones = timezoneKeys
    .map((zone) => {
      const offset = dayjs().tz(zone).format('Z');
      const offsetMinutes = dayjs().tz(zone).utcOffset();
      return {
        value: zone,
        label: `(GMT${offset}) ${tzT(zone)}`,
        offsetMinutes,
      };
    })
    .sort((a, b) => a.offsetMinutes - b.offsetMinutes)
    .map(({ value, label }) => ({ value, label }));

  // close dropdown if it is open and user clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedTimezone = formattedTimezones.find((tz) => tz.value === currentValue);

  return (
    <div className="w-full">
      {/* have to use div and buttons instead of select and options due to custom stylings */}
      <label>{t('label')}</label>
      <div className="relative mt-4" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full input-like flex justify-between items-center"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedTimezone ? selectedTimezone.label : t('placeholder')}
          <MdArrowDropDown
            size={24}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <ul className="absolute custom-dropdown max-h-60 overflow-auto" role="listbox">
            {formattedTimezones.map((tz) => (
              <li
                key={tz.value}
                className="px-4 py-2 hover:bg-primaryHover focus:bg-primaryHover cursor-pointer"
                onClick={() => {
                  setValue('selectedTimezone', tz.value, { shouldValidate: true });
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={tz.value === currentValue}
              >
                {tz.label}
              </li>
            ))}
          </ul>
        )}
        <select {...register} className="sr-only">
          {formattedTimezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
