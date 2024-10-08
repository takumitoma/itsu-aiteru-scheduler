import { useState, useRef } from 'react';
import { createParticipant } from '@/app/api/participant/route';
import NameInputPopup from './NameInputPopup';
import { HiPlus } from 'react-icons/hi';

interface ParticipantEditorProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const ParticipantEditor: React.FC<ParticipantEditorProps> = ({ isEditing, setIsEditing, id }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleIsEditing = () => {
    buttonRef.current?.blur();
    setIsPopupOpen(true);
  };

  const handleCreateParticipant = async (name: string) => {
    try {
      await createParticipant(id, name);
      setParticipantName(name);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating participant:', error);
    }
  };

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
          {isEditing && (
            <button
              className="py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
                border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              キャンセル
            </button>
          )}
          <button
            ref={buttonRef}
            className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md border 
              border-primary hover:bg-primaryHover focus:bg-primaryHover shadow-sm flex-shrink-0 
              flex items-center space-x-2 w-[118px] sm:w-[134px] justify-center"
            type="button"
            onClick={toggleIsEditing}
          >
            {!isEditing && <HiPlus size={20} />}
            <p>{isEditing ? '保存' : '空き時間'}</p>
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <NameInputPopup onSubmit={handleCreateParticipant} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default ParticipantEditor;
