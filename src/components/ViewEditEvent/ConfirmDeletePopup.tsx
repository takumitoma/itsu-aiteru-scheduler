import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { Participant } from '@/types/Participant';
import { useTranslations } from 'next-intl';

interface ConfirmDeletePopupProps {
  participant: Participant | null;
  onSubmit: (participant: Participant | null) => Promise<void>;
  onClose: () => void;
}

export function ConfirmDeletePopup({ participant, onSubmit, onClose }: ConfirmDeletePopupProps) {
  const t = useTranslations('ViewEditEvent.ConfirmDeletePopup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(participant);
    setIsSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-md bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <span className="text-lg font-medium sm:text-xl">{t('title')}</span>
          <button onClick={onClose} type="button" disabled={isSubmitting}>
            <RxCross1 size={24} />
          </button>
        </div>
        <p className="text-xs sm:text-lg">{participant?.name}</p>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className={
              'flex-shrink-0 rounded-md bg-red-500 px-4 py-2 text-xs text-white hover:brightness-90' +
              'disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg'
            }
            disabled={isSubmitting}
          >
            {t('deleteButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
