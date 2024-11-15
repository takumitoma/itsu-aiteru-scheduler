import { useRef } from 'react';
import { useTranslations } from 'next-intl';

interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

export default function EventTitleInput({ value, onChange, showError }: EventTitleInputProps) {
  const t = useTranslations('CreateEvent.EventTitleInput');
  const isInteracted = useRef(false);

  const displayError = (showError || isInteracted.current) && value.trim().length === 0;

  return (
    <div className="w-full">
      <label htmlFor="eventTitle">{t('label')}</label>
      <input
        type="text"
        id="eventTitle"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          isInteracted.current = true;
        }}
        className={`mt-4 ${displayError ? '!border-2 !border-red-500' : 'border border-primary'}`}
        placeholder={t('placeholder')}
      />
      <p className={`mt-2 px-3 text-red-500 ${displayError ? '' : 'hidden'}`}>{t('error')}</p>
    </div>
  );
}
