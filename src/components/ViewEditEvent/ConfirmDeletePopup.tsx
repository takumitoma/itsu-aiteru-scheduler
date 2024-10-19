import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';

interface ConfirmDeletePopupProps {
  participantName: string;
  onSubmit: () => void;
  onClose: () => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
  participantName,
  onSubmit,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

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
        <p className="text-xs sm:text-md">{participantName}</p>
        <div className="flex w-full space-x-2 justify-end">
          <button
            type="submit"
            className="text-white bg-red-500 px-4 py-2 rounded-md flex-shrink-0 
              hover:brightness-90 w-[95px] sm:w-[125px] disabled:opacity-50
              disabled:cursor-not-allowed text-xs sm:text-lg"
            disabled={isSubmitting}
          >
            削除
          </button>
          <button
            type="button"
            className="text-foreground bg-background px-4 py-2 rounded-md flex-shrink-0 
              hover:brightness-90 border border-foreground w-[95px] sm:w-[125px] 
              disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-lg"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDeletePopup;
