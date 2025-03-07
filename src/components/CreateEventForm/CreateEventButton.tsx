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
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? t('creating') : t('create')}
    </button>
  );
}
