import React, { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

const SURVEY_TYPE_DISPLAY_TEXT = {
  specific: '特定の日付',
  week: '曜日',
} as const;

interface SurveyTypeSelectorProps {
  value: 'specific' | 'week';
  onChange: (value: 'specific' | 'week') => void;
}

const SurveyTypeSelector: React.FC<SurveyTypeSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full">
      {/* have to use div and buttons instead of select and options due to custom stylings */}
      <label>日付の種類</label>
      <div className="relative mt-4" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full input-like flex justify-between items-center"
          aria-hidden="true"
        >
          {SURVEY_TYPE_DISPLAY_TEXT[value]}
          <MdArrowDropDown
            size={24}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="absolute custom-dropdown" aria-hidden="true">
            <button
              type="button"
              className="w-full px-4 py-2 text-left 
                hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => {
                onChange('specific');
                setIsOpen(false);
              }}
            >
              特定の日付
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 text-left 
                hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => {
                onChange('week');
                setIsOpen(false);
              }}
            >
              曜日
            </button>
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as 'specific' | 'week')}
          className="sr-only"
        >
          <option value="specific">特定の日付</option>
          <option value="week">曜日</option>
        </select>
      </div>
    </div>
  );
};

export default SurveyTypeSelector;
