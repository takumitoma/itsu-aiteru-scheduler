import { useState, useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { HiPlus } from 'react-icons/hi';
import { createParticipant } from '@/app/api/participant/route';

interface EditAvailabilityProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const EditAvailability: React.FC<EditAvailabilityProps> = ({ isEditing, setIsEditing, id }) => {
  const [participantName, setParticipantName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  // used to unfocus buttons on click
  const popupButtonRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggleIsEditing() {
    buttonRef.current?.blur();
    setIsPopupOpen(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function cancelNameChange() {
    setParticipantName('');
    setShowError(false);
    setIsPopupOpen(false);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setParticipantName(e.target.value);
    if (showError && e.target.value) {
      setShowError(false);
    }
  }

  function formIsValid(): boolean {
    return participantName.trim().length > 0;
  }

  async function handleCreateParticipant(e: React.FormEvent) {
    e.preventDefault();
    popupButtonRef.current?.blur();
    if (formIsValid()) {
      try {
        await createParticipant(id, participantName);
        setIsPopupOpen(false);
        setShowError(false);
        setIsEditing(true);
      } catch {}
    } else {
      setShowError(true);
    }
  }

  return (
    <div className="flex flex-col w-full space-y-4 py-4">
      <div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-start sm:items-center 
          w-full justify-between"
      >
        <p className={`text-sm sm:text-xl font-bold truncate ${isEditing ? '' : 'invisible'}`}>
          空き時間を編集中: {participantName}
        </p>
        <div className={`flex items-center ${isEditing ? 'space-x-4' : ''}`}>
          <button
            className={`py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
              border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0 ${
                isEditing ? '' : 'hidden'
              }`}
            type="button"
            onClick={cancelEditing}
          >
            <p className="select-none">キャンセル</p>
          </button>
          <button
            ref={buttonRef}
            className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md 
              border border-primary hover:bg-primaryHover focus:bg-primaryHover 
              shadow-sm flex-shrink-0 flex items-center space-x-2 w-[118px] sm:w-[134px] 
              justify-center"
            type="button"
            onClick={toggleIsEditing}
          >
            {!isEditing && <HiPlus size={20} />}
            <p>{isEditing ? '保存' : '空き時間'}</p>
          </button>
        </div>
        {isPopupOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
              z-50 px-2"
          >
            <form
              onSubmit={handleCreateParticipant}
              className="bg-background p-6 rounded-md max-w-md w-full space-y-4"
            >
              <div className="flex justify-between">
                <label htmlFor="participantName" className="text-xl font-medium">
                  あなたのお名前
                </label>
                <button onClick={cancelNameChange} type="button">
                  <RxCross1 size={24} />
                </button>
              </div>
              <div className="flex">
                <IoInformationCircleOutline className="translate-y-[1px]" />
                <p className="text-xs">
                  再度アクセスする場合、同じ名前を入力して回答を編集してください
                </p>
              </div>
              <div>
                <input
                  type="text"
                  id="participantName"
                  value={participantName}
                  onChange={handleNameChange}
                  placeholder={'例) やまだ'}
                  className={`px-4 py-2 w-full rounded-md shadow-sm bg-primaryVeryLight 
                    text-customBlack focus:outline-none focus:ring-2 focus:ring-primary border ${
                      showError ? 'border-red-500' : 'border-primary'
                    }`}
                />
                {showError && <p className="text-red-500 mt-1">名前を入力してください</p>}
              </div>
              <div className="flex justify-end">
                <button
                  ref={popupButtonRef}
                  type="submit"
                  className="text-white bg-primary px-4 py-2 rounded-md flex-shrink-0 
                    hover:bg-primaryHover focus:bg-primaryHover"
                >
                  確認
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAvailability;
