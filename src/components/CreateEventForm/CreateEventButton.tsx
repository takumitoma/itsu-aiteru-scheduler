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
      className={`three-d mt-4 w-full ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {isSubmitting ? t('creating') : t('create')}
    </button>
  );
}
