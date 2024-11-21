import { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { UseFormRegisterReturn, useFormContext } from 'react-hook-form';

interface SurveyTypeSelectorProps {
  register: UseFormRegisterReturn;
}

export function SurveyTypeSelector({ register }: SurveyTypeSelectorProps) {
  const t = useTranslations('CreateEvent.SurveyTypeSelector');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();

  const currentValue = watch('surveyType') as 'specific' | 'week';

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
      <label>{t('label')}</label>
      <div className="relative mt-4" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full input-like flex justify-between items-center"
          aria-hidden="true"
        >
          {t(currentValue)}
          <MdArrowDropDown
            size={24}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="absolute custom-dropdown" aria-hidden="true">
            <button
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-primaryHover focus:outline-none 
                focus:ring-2 focus:ring-primary"
              onClick={() => {
                setValue('surveyType', 'specific', { shouldValidate: true });
                setIsOpen(false);
              }}
            >
              {t('specific')}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-primaryHover focus:outline-none 
                focus:ring-2 focus:ring-primary"
              onClick={() => {
                setValue('surveyType', 'week', { shouldValidate: true });
                setIsOpen(false);
              }}
            >
              {t('week')}
            </button>
          </div>
        )}
        <select {...register} className="sr-only">
          <option value="specific">{t('specific')}</option>
          <option value="week">{t('week')}</option>
        </select>
      </div>
    </div>
  );
}
