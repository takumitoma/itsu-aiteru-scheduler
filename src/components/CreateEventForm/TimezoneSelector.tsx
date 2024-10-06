import { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import allTimezones from '@/lib/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // generate the '(GMTZZ:ZZ) Label' format to display in dropdown
  const formattedTimezones = Object.entries(allTimezones).map(([zone, label]) => {
    const offset = dayjs().tz(zone).format('Z');
    return { value: zone, label: `(GMT${offset}) ${label}` };
  });

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
    <div className="max-w-md w-full">
      <label className="text-xl font-medium">タイムゾーン</label>
      <div className="relative mt-4" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 rounded-md border border-primary shadow-sm 
            bg-primaryVeryLight focus:outline-none focus:ring-2 focus:ring-primary 
            flex justify-between items-center"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedTimezone ? selectedTimezone.label : 'タイムゾーンを選択'}
          <MdArrowDropDown
            size={24}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 bg-primaryVeryLight border border-primary
              rounded-md shadow-sm max-h-60 overflow-auto"
            role="listbox"
          >
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
};

export default TimezoneSelector;
