import { useState, useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface NameInputPopupProps {
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

const NameInputPopup: React.FC<NameInputPopupProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // used to unfocus buttons on click
  const popupButtonRef = useRef<HTMLButtonElement>(null);

  function isParticipantNameValid() {
    return name.trim() && name.length >= 2 && name.length <= 20;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    popupButtonRef.current?.blur();
    setIsSubmitting(true);
    if (isParticipantNameValid()) {
      await onSubmit(name.trim());
      onClose();
    } else {
      setShowError(true);
    }
    setIsSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
        z-50 px-2"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-md max-w-md w-full space-y-4"
      >
        <div className="flex justify-between">
          <label htmlFor="participantName" className="text-xl font-medium">
            あなたのお名前
          </label>
          <button onClick={onClose} type="button" disabled={isSubmitting}>
            <RxCross1 size={24} />
          </button>
        </div>
        <div className="flex">
          <IoInformationCircleOutline className="translate-y-[1px]" />
          <p className="text-xs sm:text-base">
            再度アクセスする場合は、同じ名前を入力して空き時間を編集できます
          </p>
        </div>
        <div>
          <input
            type="text"
            id="participantName"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (showError && e.target.value.trim()) {
                setShowError(false);
              }
            }}
            placeholder={'例) やまだ'}
            className={`px-4 py-2 w-full rounded-md shadow-sm bg-primaryVeryLight text-customBlack 
              focus:outline-none focus:ring-2 focus:ring-primary border ${
                showError ? 'border-red-500' : 'border-primary'
              }`}
            disabled={isSubmitting}
          />
          {showError && (
            <p className="text-red-500 mt-1 text-xs sm:text-base">
              名前は2文字から20文字で入力してください
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            ref={popupButtonRef}
            type="submit"
            className="text-white bg-primary px-4 py-2 rounded-md flex-shrink-0 
              hover:bg-primaryHover focus:bg-primaryHover disabled:opacity-50 
              disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            確認
          </button>
        </div>
      </form>
    </div>
  );
};

export default NameInputPopup;
