import React, { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

interface SurveyTypeSelectorProps {
  value: 'specific' | 'week';
  onChange: (value: 'specific' | 'week') => void;
}

const SurveyTypeSelector: React.FC<SurveyTypeSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown if it is open amd user clicks outside
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

  const optionValToDisplay = {
    specific: '特定の日付',
    week: '曜日',
  };

  return (
    <div>
      <label className="text-xl font-medium">アンケートの種類</label>
      <div className="relative mt-4 max-w-md" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm
            flex justify-between items-center"
          aria-hidden="true"
        >
          {optionValToDisplay[value]}
          <MdArrowDropDown
            size={24}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div
            className="absolute z-10 w-full mt-1 bg-background border border-gray-300 
              rounded-md shadow-sm"
            aria-hidden="true"
          >
            <button
              className="w-full px-4 py-2 text-left hover:bg-primaryHover focus:bg-primaryHover"
              onClick={() => {
                onChange('specific');
                setIsOpen(false);
              }}
            >
              特定の日付
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-primaryHover focus:bg-primaryHover"
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
