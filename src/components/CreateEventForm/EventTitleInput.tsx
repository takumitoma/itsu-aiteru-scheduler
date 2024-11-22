import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { BsExclamationCircle } from 'react-icons/bs';

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
        className="mt-4 border border-primary"
        placeholder={t('placeholder')}
        {...register}
      />
      {error && (
        <div className="flex text-red-500 pt-4 items-center space-x-2">
          <BsExclamationCircle size={20} />
          <p className="text-sm font-semibold">{t('error')}</p>
        </div>
      )}
    </div>
  );
}
