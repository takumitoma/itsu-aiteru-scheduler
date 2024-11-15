import { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import timezoneKeys from '@/constants/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const t = useTranslations('CreateEvent.TimezoneSelector');
  const tzT = useTranslations('constants.Timezones');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedTimezone = formattedTimezones.find((tz) => tz.value === value);

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
                  onChange(tz.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={tz.value === value}
              >
                {tz.label}
              </li>
            ))}
          </ul>
        )}
        <select value={value} onChange={(e) => onChange(e.target.value)} className="sr-only">
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
