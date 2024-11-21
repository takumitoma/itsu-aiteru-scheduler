import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface EventTitleInputProps {
  register: UseFormRegisterReturn;
  error?: string;
}

export function EventTitleInput({ register, error }: EventTitleInputProps) {
  const t = useTranslations('CreateEvent.EventTitleInput');

  return (
    <div className="w-full">
      <label htmlFor="eventTitle">{t('label')}</label>
      <input
        type="text"
        id="eventTitle"
        className={`mt-4 ${error ? '!border-2 !border-red-500' : 'border border-primary'}`}
        placeholder={t('placeholder')}
        {...register}
      />
      <p className={`mt-2 px-3 text-red-500 ${error ? '' : 'hidden'}`}>{t('error')}</p>
    </div>
  );
}
