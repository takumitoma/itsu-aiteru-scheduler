import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

export function CreateEventButton() {
  const t = useTranslations('CreateEvent.CreateEventButton');
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`three-d w-full mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? t('creating') : t('create')}
    </button>
  );
}
