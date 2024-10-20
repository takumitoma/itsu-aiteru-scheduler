import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { Participant } from '@/types/Participant';

interface ConfirmDeletePopupProps {
  participant: Participant | null;
  onSubmit: (participant: Participant | null) => Promise<void>;
  onClose: () => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
  participant,
  onSubmit,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(participant);
    setIsSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
        z-50 px-2"
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-background rounded-md max-w-md w-full space-y-4"
      >
        <div className="flex justify-between">
          <span className="text-lg sm:text-xl font-medium">この参加者を削除しますか?</span>
          <button onClick={onClose} type="button" disabled={isSubmitting}>
            <RxCross1 size={24} />
          </button>
        </div>
        <p className="text-xs sm:text-lg">{participant?.name}</p>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="text-white bg-red-500 px-4 py-2 rounded-md flex-shrink-0 hover:brightness-90 
              disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-lg"
            disabled={isSubmitting}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDeletePopup;
