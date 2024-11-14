import { useTranslations } from 'next-intl';

interface CreateEventButtonProps {
  isSubmitting: boolean;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ isSubmitting }) => {
  const t = useTranslations('CreateEvent.CreateEventButton');

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`three-d w-full mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? t('creating') : t('create')}
    </button>
  );
};

export default CreateEventButton;
